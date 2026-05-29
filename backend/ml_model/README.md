# AgroGuardian AI - Machine Learning Folder

This directory contains the trained model and inference logic for detecting crop leaf diseases.

## Directory Structure
*   `dataset/`: Put your training images here (e.g., subfolders like `healthy/`, `mildew/`, `blight/`).
*   `models/`: Put the trained Keras model here. The backend currently prefers `Mob-Res_(A+B)Bf_config.h5`.
*   `plant_disease_service.py`: TensorFlow/Keras inference service that loads the model, preprocesses uploads, maps predictions to PlantVillage labels, and returns disease metadata.

## Integrating Your Model
1.  **Dependencies**: Install the required ML library for your model. Add it to `backend/requirements.txt`.
    *   Real TensorFlow inference should be run with Python 3.10, 3.11, or 3.12. Newer beta Python builds may not have TensorFlow/NumPy wheels yet.
    *   *For TensorFlow / Keras:* `pip install tensorflow`
    *   *For PyTorch:* `pip install torch torchvision`
    *   *For ONNX:* `pip install onnxruntime`
2.  **Training**: Train your image classification model (Convolutional Neural Network) on your leaf dataset.
3.  **Deployment**:
    *   Save your trained model file into the `models/` folder.
    *   Keep `disease_labels.py` class order aligned with the model output order.
    *   The service resizes uploads to the model input size and normalizes pixel values to `0..1`.
