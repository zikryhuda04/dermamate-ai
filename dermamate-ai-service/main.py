import io
import json
import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, HTTPException, UploadFile

# Coba import modul face detection mediapipe secara eksplisit
try:
    import mediapipe as mp
    from mediapipe.python.solutions import face_detection as mp_face_detection
    face_detector = mp_face_detection.FaceDetection(
        model_selection=0, min_detection_confidence=0.5
    )
    USE_MEDIAPIPE = True
except Exception:
    face_detector = None
    USE_MEDIAPIPE = False

app = FastAPI(title="DermaMate AI Service")

# 1. Konfigurasi model dan parameter preprocessing
with open("models/class_mapping.json", "r") as f:
    config = json.load(f)

idx_to_class = config.get("idx_to_class", {"0": "dry", "1": "normal", "2": "oily"})
clahe_clip = config["preprocessing"]["clahe_clip_limit"]
clahe_grid = tuple(config["preprocessing"]["clahe_tile_grid_size"])
target_size = tuple(config["preprocessing"]["input_resolution"])
mean = np.array(config["preprocessing"]["imagenet_mean"], dtype=np.float32)
std = np.array(config["preprocessing"]["imagenet_std"], dtype=np.float32)

# 2. Inisialisasi ONNX Runtime
session = ort.InferenceSession("models/best_dermamate_skin_model.onnx")
input_name = session.get_inputs()[0].name


def apply_clahe(bgr_image: np.ndarray) -> np.ndarray:
    lab = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=clahe_clip, tileGridSize=clahe_grid)
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img_bgr is None:
        raise ValueError("Format berkas gambar tidak valid.")

    h, w, _ = img_bgr.shape
    cropped_face = img_bgr
    face_detected = False

    # Deteksi wajah dengan MediaPipe jika tersedia
    if USE_MEDIAPIPE and face_detector:
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        results = face_detector.process(img_rgb)
        if results.detections:
            bboxC = results.detections[0].location_data.relative_bounding_box
            xmin = max(0, int(bboxC.xmin * w))
            ymin = max(0, int(bboxC.ymin * h))
            box_w = int(bboxC.width * w)
            box_h = int(bboxC.height * h)

            xmax = min(w, xmin + box_w)
            ymax = min(h, ymin + box_h)
            if box_w > 20 and box_h > 20:
                cropped_face = img_bgr[ymin:ymax, xmin:xmax]
                face_detected = True

    # Jika wajah tidak terdeteksi oleh MediaPipe, lakukan center-crop proporsional
    if not face_detected:
        min_dim = min(h, w)
        start_x = (w - min_dim) // 2
        start_y = (h - min_dim) // 2
        cropped_face = img_bgr[start_y:start_y + min_dim, start_x:start_x + min_dim]

    # Ekualisasi kontras CLAHE & Resize 224x224
    enhanced = apply_clahe(cropped_face)
    resized = cv2.resize(enhanced, target_size)

    # Normalisasi ImageNet
    rgb_final = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    normalized = (rgb_final - mean) / std

    # Ubah format ke NCHW [1, 3, 224, 224]
    transposed = np.transpose(normalized, (2, 0, 1))
    tensor = np.expand_dims(transposed, axis=0).astype(np.float32)
    return tensor


@app.post("/analyze")
async def analyze_skin(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        tensor = preprocess_image(image_bytes)

        # Inferensi ONNX
        outputs = session.run(None, {input_name: tensor})
        logits = outputs[0][0]

        # Softmax dengan pencegahan overflow
        exp_logits = np.exp(logits - np.max(logits))
        probabilities = exp_logits / np.sum(exp_logits)
        predicted_idx = str(int(np.argmax(probabilities)))

        raw_label = idx_to_class.get(predicted_idx, "normal")

        # Petakan semua nilai probabilitas untuk monitoring
        scores_by_class = {}
        for idx_str, class_name in idx_to_class.items():
            idx_int = int(idx_str)
            if idx_int < len(probabilities):
                scores_by_class[class_name] = round(float(probabilities[idx_int]), 4)

        # Debug print langsung di terminal Uvicorn
        print("================ INFERENCE LOG ================")
        print(f"Logits Mentah       : {logits.tolist()}")
        print(f"Probabilitas Kelas  : {scores_by_class}")
        print(f"Index Terpilih      : {predicted_idx} ({raw_label})")
        print("================================================")

        label_map = {
            "dry": "Kering",
            "normal": "Normal",
            "oily": "Berminyak",
        }
        skin_type_id = label_map.get(raw_label.lower(), "Normal")

        issues_map = {
            "Berminyak": "Produksi sebum berlebih, pori-pori tampak besar, dan rentan komedo.",
            "Kering": "Kelembapan rendah, tekstur kulit terasa kencang atau bersisik.",
            "Normal": "Keseimbangan sebum dan hidrasi terjaga dengan baik.",
        }

        care_tips_map = {
            "Berminyak": "Gunakan pembersih wajah berbahan Salicylic Acid dan pelembap berbasis air (oil-free).",
            "Kering": "Gunakan pembersih non-stripping dan pelembap dengan Ceramide atau Hyaluronic Acid.",
            "Normal": "Pertahankan pembersih lembut, hidrasi harian, dan tabir surya berkala.",
        }

        return {
            "skin_type": skin_type_id,
            "skin_issues": issues_map.get(skin_type_id, "Kondisi kulit normal."),
            "recommendations": care_tips_map.get(
                skin_type_id, "Gunakan tabir surya setiap hari."
            ),
            "confidence": round(float(np.max(probabilities)), 4),
            "all_probabilities": scores_by_class
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))