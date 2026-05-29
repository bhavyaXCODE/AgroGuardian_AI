"""
Disease label definitions and metadata for crop disease detection.
Based on PlantVillage dataset (39 classes) as trained in Plant Disease Classification.ipynb
Contains disease classes, severity levels, treatment recommendations, and risk factors.
"""

from typing import Dict, List, Optional
from enum import Enum


class DiseaseSeverity(str, Enum):
    """Disease severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ── PlantVillage 39 classes ──────────────────────────────────────────────────
# Order is alphabetical (LabelBinarizer sorts by name) — same order the model
# outputs its 39 probability values in.
CLASS_INDEX_TO_LABEL: Dict[int, str] = {
    0:  "Apple___Apple_scab",
    1:  "Apple___Black_rot",
    2:  "Apple___Cedar_apple_rust",
    3:  "Apple___healthy",
    4:  "Blueberry___healthy",
    5:  "Cherry_(including_sour)___Powdery_mildew",
    6:  "Cherry_(including_sour)___healthy",
    7:  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    8:  "Corn_(maize)___Common_rust_",
    9:  "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy",
    11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)",
    13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy",
    15: "Orange___Haunglongbing_(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot",
    19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight",
    21: "Potato___Late_blight",
    22: "Potato___healthy",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch",
    27: "Strawberry___healthy",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___Late_blight",
    31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot",
    33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot",
    35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___healthy",
    38: "background",
}

# Reverse mapping
LABEL_TO_CLASS_INDEX: Dict[str, int] = {v: k for k, v in CLASS_INDEX_TO_LABEL.items()}

# ── Rich disease metadata ────────────────────────────────────────────────────
DISEASE_METADATA: Dict[str, Dict] = {
    "Apple___Apple_scab": {
        "display_name": "Apple Scab",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Venturia inaequalis) causing olive-green to black lesions on leaves and fruit.",
        "treatment": (
            "Apply fungicides (captan, mancozeb, or myclobutanil) at bud break and repeat every 7–10 days "
            "during wet weather. Remove and destroy infected leaves and fruit. Use scab-resistant apple varieties."
        ),
        "risk_factors": ["wet spring weather", "high humidity", "dense canopy", "susceptible varieties"],
        "affected_crops": ["apple"],
        "symptoms": ["olive-green to black velvety lesions on leaves", "scabby lesions on fruit", "premature leaf drop"],
    },
    "Apple___Black_rot": {
        "display_name": "Apple Black Rot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Fungal disease (Botryosphaeria obtusa) causing fruit rot, leaf spots, and limb cankers.",
        "treatment": (
            "Prune out dead or cankered wood. Apply copper-based or captan fungicides during the growing season. "
            "Remove mummified fruit from the tree and ground. Avoid wounding trees."
        ),
        "risk_factors": ["warm wet weather", "wounds or stress", "dead wood in canopy"],
        "affected_crops": ["apple"],
        "symptoms": ["brown to black rotting fruit", "frog-eye leaf spots", "bark cankers"],
    },
    "Apple___Cedar_apple_rust": {
        "display_name": "Cedar Apple Rust",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Gymnosporangium juniperi-virginianae) requiring both apple and cedar/juniper hosts.",
        "treatment": (
            "Apply fungicides (myclobutanil, propiconazole) at pink bud stage through petal fall. "
            "Remove nearby cedar/juniper trees if feasible. Plant rust-resistant apple varieties."
        ),
        "risk_factors": ["proximity to cedars or junipers", "wet spring weather"],
        "affected_crops": ["apple"],
        "symptoms": ["bright orange-yellow spots on leaves", "tube-like structures on leaf undersides"],
    },
    "Apple___healthy": {
        "display_name": "Apple – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring. Maintain balanced fertilisation and good air circulation.",
        "risk_factors": [],
        "affected_crops": ["apple"],
        "symptoms": ["healthy green leaves", "normal fruit development"],
    },
    "Blueberry___healthy": {
        "display_name": "Blueberry – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and maintain soil pH between 4.5–5.5 for optimal growth.",
        "risk_factors": [],
        "affected_crops": ["blueberry"],
        "symptoms": ["healthy green leaves", "normal berry development"],
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "display_name": "Cherry Powdery Mildew",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Podosphaera clandestina) producing white powdery coating on leaves and shoots.",
        "treatment": (
            "Apply sulfur-based fungicides or potassium bicarbonate. Remove and destroy infected plant tissue. "
            "Improve air circulation through pruning. Avoid excessive nitrogen fertilisation."
        ),
        "risk_factors": ["high humidity", "moderate temperatures (20–27°C)", "dense canopy", "excess nitrogen"],
        "affected_crops": ["cherry (sweet and sour)"],
        "symptoms": ["white powdery coating on leaves and young shoots", "distorted growth", "premature leaf drop"],
    },
    "Cherry_(including_sour)___healthy": {
        "display_name": "Cherry – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and standard orchard management practices.",
        "risk_factors": [],
        "affected_crops": ["cherry"],
        "symptoms": ["healthy green leaves", "normal fruit set"],
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "display_name": "Corn Gray Leaf Spot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Fungal disease (Cercospora zeae-maydis) causing rectangular gray to tan lesions parallel to leaf veins.",
        "treatment": (
            "Apply strobilurin or triazole fungicides at VT/R1 growth stage. Use resistant hybrids. "
            "Practice crop rotation and residue management."
        ),
        "risk_factors": ["warm humid conditions", "minimum tillage", "continuous maize cropping", "dense planting"],
        "affected_crops": ["corn / maize"],
        "symptoms": ["rectangular gray-tan lesions parallel to veins", "lesion with yellow halo", "premature senescence"],
    },
    "Corn_(maize)___Common_rust_": {
        "display_name": "Corn Common Rust",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Puccinia sorghi) causing cinnamon-brown pustules on both leaf surfaces.",
        "treatment": (
            "Apply fungicides (triazole or strobilurin) if infection is heavy before tasselling. "
            "Plant resistant hybrids. Monitor from early vegetative stages."
        ),
        "risk_factors": ["cool temperatures (15–25°C)", "high relative humidity", "extended leaf wetness"],
        "affected_crops": ["corn / maize"],
        "symptoms": ["cinnamon-brown pustules on both leaf surfaces", "yellow halos around pustules"],
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "display_name": "Corn Northern Leaf Blight",
        "severity": DiseaseSeverity.HIGH,
        "description": "Fungal disease (Setosphaeria turcica) causing long cigar-shaped gray-green lesions.",
        "treatment": (
            "Apply fungicides (strobilurin, triazole) at early disease onset. Use resistant hybrids. "
            "Rotate crops and manage debris."
        ),
        "risk_factors": ["moderate temperatures (18–27°C)", "extended leaf wetness", "susceptible hybrids"],
        "affected_crops": ["corn / maize"],
        "symptoms": ["long elliptical gray-green to tan lesions (5–15 cm)", "dark sporulation in lesion centers"],
    },
    "Corn_(maize)___healthy": {
        "display_name": "Corn – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue monitoring and maintain balanced soil nutrition.",
        "risk_factors": [],
        "affected_crops": ["corn / maize"],
        "symptoms": ["healthy green leaves", "normal ear development"],
    },
    "Grape___Black_rot": {
        "display_name": "Grape Black Rot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Fungal disease (Guignardia bidwellii) causing brown leaf lesions and shrivelled black fruit (mummies).",
        "treatment": (
            "Apply fungicides (mancozeb, captan, or myclobutanil) from bud break through veraison. "
            "Remove mummified berries and infected canes. Practice good canopy management."
        ),
        "risk_factors": ["warm wet weather during bloom", "infected mummies from previous season", "poor air circulation"],
        "affected_crops": ["grape"],
        "symptoms": ["reddish-brown leaf spots with dark borders", "shrivelled black mummified berries"],
    },
    "Grape___Esca_(Black_Measles)": {
        "display_name": "Grape Esca (Black Measles)",
        "severity": DiseaseSeverity.CRITICAL,
        "description": "Complex wood disease caused by several fungi causing internal wood decay and leaf scorch.",
        "treatment": (
            "No curative treatment exists. Remove and destroy severely infected vines. "
            "Protect pruning wounds with fungicidal paste. Delay pruning to avoid wet conditions."
        ),
        "risk_factors": ["pruning wounds", "old vines", "water stress", "fungal spores in soil"],
        "affected_crops": ["grape"],
        "symptoms": ["inter-veinal leaf scorch (tiger stripe)", "internal wood browning", "sudden vine death"],
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "display_name": "Grape Leaf Blight (Isariopsis Leaf Spot)",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease causing dark brown necrotic spots on older leaves.",
        "treatment": (
            "Apply copper-based or mancozeb fungicides. Remove infected leaves. "
            "Improve canopy air circulation through canopy management."
        ),
        "risk_factors": ["high humidity", "warm temperatures", "dense canopy"],
        "affected_crops": ["grape"],
        "symptoms": ["dark brown spots on older leaves", "premature defoliation"],
    },
    "Grape___healthy": {
        "display_name": "Grape – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and standard vineyard management.",
        "risk_factors": [],
        "affected_crops": ["grape"],
        "symptoms": ["healthy green leaves", "normal berry development"],
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "display_name": "Citrus Greening (HLB)",
        "severity": DiseaseSeverity.CRITICAL,
        "description": "Bacterial disease (Candidatus Liberibacter) transmitted by Asian citrus psyllid — no cure.",
        "treatment": (
            "No cure available. Remove and destroy infected trees to prevent spread. "
            "Control Asian citrus psyllid with insecticides. Use certified disease-free planting material."
        ),
        "risk_factors": ["Asian citrus psyllid (Diaphorina citri)", "presence of infected trees nearby"],
        "affected_crops": ["orange", "citrus"],
        "symptoms": ["yellow shoot (huanglongbing)", "blotchy mottle on leaves", "small lopsided bitter fruit"],
    },
    "Peach___Bacterial_spot": {
        "display_name": "Peach Bacterial Spot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Bacterial disease (Xanthomonas arboricola pv. pruni) causing water-soaked lesions on leaves and fruit.",
        "treatment": (
            "Apply copper-based bactericides at dormant and green tip stages. "
            "Plant resistant varieties. Avoid overhead irrigation. Remove infected plant material."
        ),
        "risk_factors": ["warm temperatures (25–32°C)", "rain and wind", "wounds", "susceptible varieties"],
        "affected_crops": ["peach", "nectarine"],
        "symptoms": ["water-soaked angular leaf spots turning brown", "fruit lesions with sunken centers", "leaf shot-hole"],
    },
    "Peach___healthy": {
        "display_name": "Peach – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and standard orchard management practices.",
        "risk_factors": [],
        "affected_crops": ["peach"],
        "symptoms": ["healthy green leaves", "normal fruit development"],
    },
    "Pepper,_bell___Bacterial_spot": {
        "display_name": "Bell Pepper Bacterial Spot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Bacterial disease (Xanthomonas campestris pv. vesicatoria) causing leaf and fruit lesions.",
        "treatment": (
            "Apply copper-based bactericides preventatively. Remove and destroy infected plants. "
            "Use certified disease-free seed. Avoid overhead irrigation."
        ),
        "risk_factors": ["warm wet weather", "contaminated seed or transplants", "overhead irrigation", "wind-driven rain"],
        "affected_crops": ["bell pepper"],
        "symptoms": ["water-soaked spots on leaves becoming brown", "scabby fruit lesions", "defoliation"],
    },
    "Pepper,_bell___healthy": {
        "display_name": "Bell Pepper – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and balanced fertilisation.",
        "risk_factors": [],
        "affected_crops": ["bell pepper"],
        "symptoms": ["healthy green leaves", "normal fruit set"],
    },
    "Potato___Early_blight": {
        "display_name": "Potato Early Blight",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Alternaria solani) causing dark brown concentric ring spots on lower leaves.",
        "treatment": (
            "Apply chlorothalonil, mancozeb, or copper fungicides. Remove lower infected leaves. "
            "Mulch soil to prevent splash. Ensure adequate potassium nutrition."
        ),
        "risk_factors": ["warm humid weather", "plant stress (nutrient deficiency)", "overhead irrigation", "poor air flow"],
        "affected_crops": ["potato"],
        "symptoms": ["dark brown spots with concentric rings (target board)", "yellowing lower leaves", "defoliation"],
    },
    "Potato___Late_blight": {
        "display_name": "Potato Late Blight",
        "severity": DiseaseSeverity.CRITICAL,
        "description": "Oomycete disease (Phytophthora infestans) causing rapid plant death and tuber rot.",
        "treatment": (
            "Apply systemic fungicides (metalaxyl, mefenoxam) immediately at first sign. "
            "Destroy infected plants and tubers. Avoid overhead irrigation. Use certified seed potatoes."
        ),
        "risk_factors": ["cool wet conditions (10–21°C)", "high humidity", "extended leaf wetness"],
        "affected_crops": ["potato", "tomato"],
        "symptoms": ["water-soaked lesions turning brown-black", "white fuzzy growth on leaf undersides", "rapid collapse"],
    },
    "Potato___healthy": {
        "display_name": "Potato – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and ensure certified disease-free seed potatoes.",
        "risk_factors": [],
        "affected_crops": ["potato"],
        "symptoms": ["healthy green leaves", "normal tuber development"],
    },
    "Raspberry___healthy": {
        "display_name": "Raspberry – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring. Prune old canes after harvest to maintain plant vigour.",
        "risk_factors": [],
        "affected_crops": ["raspberry"],
        "symptoms": ["healthy green leaves", "normal fruit production"],
    },
    "Soybean___healthy": {
        "display_name": "Soybean – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and maintain balanced soil nutrition.",
        "risk_factors": [],
        "affected_crops": ["soybean"],
        "symptoms": ["healthy green leaves", "normal pod development"],
    },
    "Squash___Powdery_mildew": {
        "display_name": "Squash Powdery Mildew",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Podosphaera xanthii / Erysiphe cichoracearum) producing white powdery patches.",
        "treatment": (
            "Apply sulfur-based or potassium bicarbonate fungicides. Remove heavily infected leaves. "
            "Improve air circulation. Avoid excessive nitrogen. Use resistant varieties."
        ),
        "risk_factors": ["high humidity", "warm days / cool nights", "crowded planting"],
        "affected_crops": ["squash", "pumpkin", "cucurbits"],
        "symptoms": ["white powdery coating on leaves and stems", "yellowing and premature senescence"],
    },
    "Strawberry___Leaf_scorch": {
        "display_name": "Strawberry Leaf Scorch",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Diplocarpon earlianum) causing dark purple spots with reddish-purple borders.",
        "treatment": (
            "Apply myclobutanil or captan fungicides. Remove old infected leaves after harvest. "
            "Avoid overhead irrigation. Use disease-free transplants."
        ),
        "risk_factors": ["warm wet conditions", "infected transplants", "overhead irrigation"],
        "affected_crops": ["strawberry"],
        "symptoms": ["dark purple irregular spots on leaves", "scorched appearance", "reduced yield"],
    },
    "Strawberry___healthy": {
        "display_name": "Strawberry – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and use certified disease-free transplants.",
        "risk_factors": [],
        "affected_crops": ["strawberry"],
        "symptoms": ["healthy green leaves", "normal fruit set"],
    },
    "Tomato___Bacterial_spot": {
        "display_name": "Tomato Bacterial Spot",
        "severity": DiseaseSeverity.HIGH,
        "description": "Bacterial disease (Xanthomonas spp.) causing water-soaked lesions on leaves, stems, and fruit.",
        "treatment": (
            "Apply copper-based bactericides preventatively. Remove infected plant parts. "
            "Use certified disease-free seed. Avoid overhead irrigation and working with wet plants."
        ),
        "risk_factors": ["warm wet weather", "contaminated seed", "overhead irrigation", "wind-driven rain"],
        "affected_crops": ["tomato"],
        "symptoms": ["small water-soaked spots turning dark brown", "yellow halo around spots", "defoliation", "fruit lesions"],
    },
    "Tomato___Early_blight": {
        "display_name": "Tomato Early Blight",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Alternaria solani) causing dark brown concentric ring spots on older leaves.",
        "treatment": (
            "Apply chlorothalonil, mancozeb, or copper fungicide. Remove infected leaves at base. "
            "Mulch to prevent soil splash. Stake plants for better air circulation."
        ),
        "risk_factors": ["warm humid conditions", "plant stress", "overhead watering", "poor air circulation"],
        "affected_crops": ["tomato"],
        "symptoms": ["dark concentric ring spots on lower leaves", "yellowing leaves", "defoliation", "stem lesions"],
    },
    "Tomato___Late_blight": {
        "display_name": "Tomato Late Blight",
        "severity": DiseaseSeverity.CRITICAL,
        "description": "Oomycete disease (Phytophthora infestans) causing rapid plant death.",
        "treatment": (
            "Apply metalaxyl or mefenoxam-based fungicides immediately. Remove and destroy all infected material. "
            "Avoid overhead irrigation. Do not compost infected plants."
        ),
        "risk_factors": ["cool wet conditions (10–21°C)", "high humidity", "late season", "dense planting"],
        "affected_crops": ["tomato", "potato"],
        "symptoms": ["greasy water-soaked lesions", "white fuzzy sporulation", "blackened stems", "rapid collapse"],
    },
    "Tomato___Leaf_Mold": {
        "display_name": "Tomato Leaf Mold",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Passalora fulva) causing pale green to yellow patches with olive-green mold on leaf undersides.",
        "treatment": (
            "Improve greenhouse ventilation and reduce humidity. Apply copper or chlorothalonil fungicides. "
            "Remove infected leaves. Use resistant varieties."
        ),
        "risk_factors": ["high humidity (>85%)", "poor ventilation", "greenhouse conditions", "warm temperatures"],
        "affected_crops": ["tomato"],
        "symptoms": ["pale green/yellow spots on upper leaf surface", "olive-green/brown mold on undersides"],
    },
    "Tomato___Septoria_leaf_spot": {
        "display_name": "Tomato Septoria Leaf Spot",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Septoria lycopersici) causing numerous small spots with dark borders on lower leaves.",
        "treatment": (
            "Apply copper or chlorothalonil fungicides. Remove lower infected leaves. "
            "Mulch to prevent soil splash. Avoid overhead irrigation."
        ),
        "risk_factors": ["warm wet conditions", "overhead watering", "plant debris", "dense planting"],
        "affected_crops": ["tomato"],
        "symptoms": ["numerous circular spots (3–6 mm) with dark borders and grey centers", "premature defoliation"],
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "display_name": "Tomato Spider Mites",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Pest infestation (Tetranychus urticae) causing stippling and bronzing of leaves.",
        "treatment": (
            "Apply miticides (abamectin, bifenazate) or insecticidal soap/neem oil. "
            "Introduce predatory mites (Phytoseiulus persimilis). Maintain adequate plant moisture."
        ),
        "risk_factors": ["hot dry conditions", "drought stress", "dusty conditions", "use of broad-spectrum insecticides"],
        "affected_crops": ["tomato"],
        "symptoms": ["fine stippling/bronzing of leaf surface", "fine webbing on undersides", "yellowing and leaf drop"],
    },
    "Tomato___Target_Spot": {
        "display_name": "Tomato Target Spot",
        "severity": DiseaseSeverity.MEDIUM,
        "description": "Fungal disease (Corynespora cassiicola) causing concentric ring lesions on leaves and fruit.",
        "treatment": (
            "Apply chlorothalonil, mancozeb, or copper fungicides. Remove infected plant material. "
            "Improve air circulation. Avoid leaf wetness."
        ),
        "risk_factors": ["warm humid conditions", "dense planting", "overhead irrigation"],
        "affected_crops": ["tomato"],
        "symptoms": ["brown spots with concentric rings and yellow halo", "lesions on fruit and stems"],
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "display_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "severity": DiseaseSeverity.CRITICAL,
        "description": "Viral disease transmitted by whiteflies causing severe stunting and yield loss.",
        "treatment": (
            "No cure available. Control whitefly vector with insecticides (imidacloprid, thiamethoxam) or reflective mulches. "
            "Remove infected plants immediately. Use TYLCV-resistant varieties."
        ),
        "risk_factors": ["whitefly (Bemisia tabaci) infestation", "warm conditions", "proximity to infected plants"],
        "affected_crops": ["tomato"],
        "symptoms": ["upward leaf curling and yellowing", "severe stunting", "flower abortion", "reduced fruit set"],
    },
    "Tomato___Tomato_mosaic_virus": {
        "display_name": "Tomato Mosaic Virus (ToMV)",
        "severity": DiseaseSeverity.HIGH,
        "description": "Viral disease (ToMV) causing mosaic discolouration and malformation of leaves.",
        "treatment": (
            "No cure available. Remove and destroy infected plants. Disinfect tools and hands. "
            "Use virus-free seed and resistant varieties. Control aphid vectors."
        ),
        "risk_factors": ["contaminated tools", "infected seed", "aphid vectors", "contact between plants"],
        "affected_crops": ["tomato"],
        "symptoms": ["mosaic light and dark green pattern on leaves", "leaf malformation", "stunted growth", "reduced yield"],
    },
    "Tomato___healthy": {
        "display_name": "Tomato – Healthy",
        "severity": DiseaseSeverity.LOW,
        "description": "Plant appears healthy with no disease symptoms detected.",
        "treatment": "Continue regular monitoring and standard crop management practices.",
        "risk_factors": [],
        "affected_crops": ["tomato"],
        "symptoms": ["healthy green leaves", "normal fruit development"],
    },
    "background": {
        "display_name": "Background / No Plant",
        "severity": DiseaseSeverity.LOW,
        "description": "Image does not appear to contain a recognisable plant leaf.",
        "treatment": "Please upload a clear image of a plant leaf for accurate disease detection.",
        "risk_factors": [],
        "affected_crops": [],
        "symptoms": [],
    },
}


# ── Helper functions ──────────────────────────────────────────────────────────

def get_disease_metadata(disease_class: str) -> Optional[Dict]:
    """Get metadata for a specific disease class."""
    return DISEASE_METADATA.get(disease_class)


def get_display_name(disease_class: str) -> str:
    """Return human-readable display name."""
    meta = get_disease_metadata(disease_class)
    return meta["display_name"] if meta else disease_class


def get_treatment_recommendation(disease_class: str) -> str:
    """Get treatment recommendation for a disease class."""
    metadata = get_disease_metadata(disease_class)
    return metadata.get("treatment", "Consult with an agricultural expert for proper diagnosis.") if metadata else "Consult with an agricultural expert for proper diagnosis."


def get_severity_from_confidence(confidence: float, disease_class: str) -> DiseaseSeverity:
    """Determine severity based on confidence score and disease class."""
    metadata = get_disease_metadata(disease_class)
    base_severity = metadata.get("severity", DiseaseSeverity.MEDIUM) if metadata else DiseaseSeverity.MEDIUM

    if confidence > 0.9:
        return base_severity
    elif confidence > 0.7:
        if base_severity == DiseaseSeverity.CRITICAL:
            return DiseaseSeverity.HIGH
        elif base_severity == DiseaseSeverity.HIGH:
            return DiseaseSeverity.MEDIUM
        return base_severity
    elif confidence > 0.5:
        if base_severity in [DiseaseSeverity.CRITICAL, DiseaseSeverity.HIGH]:
            return DiseaseSeverity.MEDIUM
        return base_severity
    else:
        return base_severity


def get_all_disease_classes() -> List[str]:
    """Get all available disease class labels (sorted, matching LabelBinarizer order)."""
    return [CLASS_INDEX_TO_LABEL[i] for i in sorted(CLASS_INDEX_TO_LABEL.keys())]


def get_num_classes() -> int:
    """Get total number of disease classes."""
    return len(CLASS_INDEX_TO_LABEL)
