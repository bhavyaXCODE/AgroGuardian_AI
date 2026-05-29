# AgroGuardian AI - Machine Learning Folder

This directory contains the dataset, trained models, and classification logic for detecting leaf crop diseases.

## Directory Structure
*   `dataset/`: Put your training images here (e.g., subfolders like `healthy/`, `mildew/`, `blight/`).
*   `models/`: Put your trained model files here (e.g., `leaf_disease_model.h5`, `disease_classifier.onnx`, or PyTorch state dicts).
*   `classifier.py`: Inference wrapper class that loads your trained model and processes upload images.

## Integrating Your Model
1.  **Dependencies**: Install the required ML library for your model. Add it to `backend/requirements.txt`.
    *   *For TensorFlow / Keras:* `pip install tensorflow`
    *   *For PyTorch:* `pip install torch torchvision`
    *   *For ONNX:* `pip install onnxruntime`
2.  **Training**: Train your image classification model (Convolutional Neural Network) on your leaf dataset.
3.  **Deployment**:
    *   Save your trained model file into the `models/` folder (e.g. `backend/ml_model/models/leaf_model.h5`).
    *   Update `classifier.py` to import your framework (e.g., TensorFlow, PyTorch, or ONNX Runtime).
    *   Implement image preprocessing (resize, normalize) in `classifier.py`.
    *   Implement predictions inside the `classify` method.
