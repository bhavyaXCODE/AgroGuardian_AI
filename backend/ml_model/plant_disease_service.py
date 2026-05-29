from pathlib import Path
from typing import Dict, List, Optional

from disease_labels import (
    CLASS_INDEX_TO_LABEL,
    get_disease_metadata,
    get_num_classes,
    get_severity_from_confidence,
)


ML_DIR = Path(__file__).parent.resolve()
MODELS_DIR = ML_DIR / "models"
DEFAULT_MODEL_NAME = "Mob-Res_(A+B)Bf_config.h5"
LOW_CONFIDENCE_THRESHOLD = 0.45


class PlantDiseaseModel:
    """Keras/TensorFlow inference service for PlantVillage leaf disease classes."""

    def __init__(self) -> None:
        self.model = None
        self.model_path = self._find_model_path()
        self.target_size = (224, 224)
        self.class_count = get_num_classes()
        self.load_error = ""
        self.np = None
        self._load_model()

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    def predict(self, image_path: str) -> Dict:
        if not self.is_ready:
            raise RuntimeError(
                "Plant disease model is not loaded. "
                f"Expected a Keras model in {MODELS_DIR}. {self.load_error}".strip()
            )

        if self.np is None:
            raise RuntimeError("NumPy is not installed, so image predictions cannot run.")

        image_batch = self._preprocess_image(image_path)
        probabilities = self.np.asarray(self.model.predict(image_batch, verbose=0)[0], dtype=self.np.float32)

        if probabilities.ndim != 1:
            raise RuntimeError("Model returned an unsupported prediction shape.")

        class_index = int(self.np.argmax(probabilities))
        confidence = float(probabilities[class_index])
        class_label = CLASS_INDEX_TO_LABEL.get(class_index, "background")

        top_predictions = self._top_predictions(probabilities)

        if confidence < LOW_CONFIDENCE_THRESHOLD:
            return {
                "label": class_label,
                "disease": "Low confidence leaf scan",
                "plant": self._plant_name(class_label),
                "severity": "Low Confidence",
                "confidence": self._format_percent(confidence),
                "description": (
                    "The model could not identify the leaf disease with enough certainty. "
                    "Use a close, well-lit photo of one leaf against a plain background."
                ),
                "recommendation": "Retake the image and scan again before deciding treatment.",
                "symptoms": ["Prediction confidence below model threshold"],
                "causes": ["Blur, shadows, multiple leaves, or an unsupported crop/disease class"],
                "treatment": "Upload a clearer single-leaf image for reliable classification.",
                "top_predictions": top_predictions,
                "model_status": "ready",
            }

        metadata = get_disease_metadata(class_label) or get_disease_metadata("background")
        severity = get_severity_from_confidence(confidence, class_label)

        return {
            "label": class_label,
            "disease": metadata.get("display_name", class_label),
            "plant": self._plant_name(class_label),
            "severity": self._display_severity(severity, class_label),
            "confidence": self._format_percent(confidence),
            "description": metadata.get("description", "No disease description is available."),
            "recommendation": metadata.get("treatment", "Consult a local agricultural expert."),
            "symptoms": metadata.get("symptoms", []),
            "causes": metadata.get("risk_factors", []),
            "treatment": metadata.get("treatment", "Consult a local agricultural expert."),
            "top_predictions": top_predictions,
            "model_status": "ready",
        }

    def info(self) -> Dict:
        return {
            "ready": self.is_ready,
            "model_path": str(self.model_path) if self.model_path else "",
            "input_size": list(self.target_size),
            "classes": self.class_count,
            "supported_plants": self.supported_plants(),
            "load_error": self.load_error,
        }

    def supported_plants(self) -> List[str]:
        plants = {
            self._plant_name(label)
            for label in CLASS_INDEX_TO_LABEL.values()
            if label != "background"
        }
        return sorted(plants)

    def _find_model_path(self) -> Optional[Path]:
        preferred = MODELS_DIR / DEFAULT_MODEL_NAME
        if preferred.exists():
            return preferred

        for suffix in ("*.keras", "*.h5"):
            matches = sorted(MODELS_DIR.glob(suffix))
            if matches:
                return matches[0]
        return None

    def _load_model(self) -> None:
        if not self.model_path:
            self.load_error = "No .h5 or .keras model file was found."
            return

        try:
            import numpy as np
            import tensorflow as tf

            self.np = np
            self.model = tf.keras.models.load_model(str(self.model_path), compile=False)
            input_shape = getattr(self.model, "input_shape", None)
            if isinstance(input_shape, list):
                input_shape = input_shape[0]

            if input_shape and len(input_shape) >= 3 and input_shape[1] and input_shape[2]:
                self.target_size = (int(input_shape[1]), int(input_shape[2]))

            output_shape = getattr(self.model, "output_shape", None)
            if isinstance(output_shape, list):
                output_shape = output_shape[0]
            if output_shape and output_shape[-1] and int(output_shape[-1]) != self.class_count:
                raise RuntimeError(
                    f"Model outputs {output_shape[-1]} classes, but disease_labels.py defines {self.class_count}."
                )
        except Exception as exc:
            self.model = None
            self.load_error = str(exc)

    def _preprocess_image(self, image_path: str):
        from PIL import Image, UnidentifiedImageError

        try:
            image = Image.open(image_path).convert("RGB")
        except UnidentifiedImageError as exc:
            raise ValueError("Uploaded file is not a valid image.") from exc

        image = image.resize(self.target_size)
        image_array = self.np.asarray(image, dtype=self.np.float32)
        image_array = image_array / 255.0
        return self.np.expand_dims(image_array, axis=0)

    def _top_predictions(self, probabilities, limit: int = 3) -> List[Dict[str, str]]:
        top_indices = probabilities.argsort()[-limit:][::-1]
        predictions = []

        for index in top_indices:
            label = CLASS_INDEX_TO_LABEL.get(int(index), "background")
            metadata = get_disease_metadata(label)
            predictions.append(
                {
                    "label": label,
                    "name": metadata.get("display_name", label) if metadata else label,
                    "plant": self._plant_name(label),
                    "confidence": self._format_percent(float(probabilities[index])),
                }
            )

        return predictions

    @staticmethod
    def _format_percent(value: float) -> str:
        return f"{value * 100:.1f}%"

    @staticmethod
    def _plant_name(class_label: str) -> str:
        if class_label == "background":
            return "No plant detected"
        plant = class_label.split("___", 1)[0]
        return plant.replace("_", " ").replace(",", "").replace("(maize)", "maize").strip().title()

    @staticmethod
    def _display_severity(severity, class_label: str) -> str:
        if class_label.endswith("___healthy"):
            return "Healthy"

        value = getattr(severity, "value", str(severity)).lower()
        if value in {"critical", "high"}:
            return "High Risk"
        if value == "medium":
            return "Moderate Risk"
        return "Low Risk"
