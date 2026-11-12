# DermaMate AI - Model Artifacts & Research

Folder ini merangkum seluruh artefak riset, pelatihan, evaluasi, dan model checkpoint terbaru untuk klasifikasi kondisi kulit wajah (5 Kelas) DermaMate AI.

## Struktur Folder

```text
models-dermamate/
├── checkpoints/
│   ├── best_dermamate_skin_model.onnx   # Model ONNX produksi (EfficientNet-B0)
│   ├── best_dermamate_skin_model.pt     # Model PyTorch checkpoint produksi
│   ├── efficientnet_b0_best.pt          # Bobot terbaik EfficientNet-B0
│   └── class_mapping.json               # Konfigurasi label & normalisasi CLAHE/ImageNet
├── evaluation/
│   ├── backbone_comparison.csv          # Perbandingan metrik EfficientNet-B0 vs ResNet-50
│   ├── confusion_matrices_test.png      # Matriks konfusi pada test set
│   ├── eda_class_distribution.png       # Grafik distribusi kelas dataset
│   ├── eda_sample_crops.png             # Visualisasi sampel crop wajah
│   ├── evaluation_summary.json          # Ringkasan akurasi, F1, latency, parameter
│   └── training_validation_curves.png   # Kurva training & validation loss/accuracy
├── notebooks/
│   ├── 01_data_curation_and_preprocessing.ipynb # Kurasi data, CLAHE, split manifest
│   └── 02_train_and_evaluate_models.ipynb       # Training, validasi, dan export ONNX
└── WORKFLOW_DAN_ARSITEKTUR_SISTEM_DERMAMATE_AI.md # Panduan alur & arsitektur sistem
```

## Spesifikasi Model Terbaik (Production)

- **Backbone**: EfficientNet-B0 (Transfer Learning dari ImageNet1k)
- **Kelas Output (5 Kelas)**: `acne`, `combination`, `dry`, `normal`, `oily`
- **Akurasi Validasi / Test**: 95.8% / 95.5%
- **Macro F1-Score**: 0.954
- **Ukuran Model**: ~17.3 MB (ONNX), ~17.6 MB (PyTorch)
- **Inference Service**: Digunakan langsung pada folder `dermamate-ai-service/` via ONNX Runtime & FastAPI.
