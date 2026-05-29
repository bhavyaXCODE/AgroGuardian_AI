import os
import random
from uuid import uuid4
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
from ml_model.plant_disease_service import PlantDiseaseModel

try:
    import google.generativeai as genai
except ImportError:
    genai = None

# Load environment variables from .env file
load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(
    title="AgroGuardian AI Backend",
    description="Precision Agriculture API for AgroGuardian Platform",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Gemini API if configured
gemini_ready = False
if GEMINI_API_KEY and genai:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_ready = True
        print("Gemini API: Configured successfully.")
    except Exception as e:
        print(f"Gemini API: Failed to configure: {e}")
elif GEMINI_API_KEY and not genai:
    print("Gemini API: google-generativeai is not installed. Using simulated chatbot responses.")
else:
    print("Gemini API: No API key found. Using simulated chatbot responses.")

# Initialize plant disease model once at startup
plant_disease_model = PlantDiseaseModel()
if plant_disease_model.is_ready:
    print(f"Plant disease model: Loaded {plant_disease_model.model_path}")
else:
    print(f"Plant disease model: Not ready. {plant_disease_model.load_error}")

# In-memory storage for simple state variables (e.g. advisor state)
advisor_state = {
    "suspended": False,
    "override": False
}

# --- Request/Response Models ---

class SimulationRequest(BaseModel):
    irrigation: int  # Nitrate Feed Level percentage
    moisture: float  # Base pH level
    temp: int       # Temperature in Celsius

class SimulationResponse(BaseModel):
    stability: int
    sustainability: int
    absorption: int
    risk: int

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

class AdvisorStateResponse(BaseModel):
    suspended: bool
    override: bool
    message: str

# --- Endpoints ---

# The root route is handled by mounting the static frontend folder at the end of the file.

@app.get("/api/metrics")
def get_metrics():
    """
    Get live sensor telemetry metrics.
    Generates slightly dynamic values around normal baseline metrics to show live feeds.
    """
    temp = round(23.0 + random.uniform(0.0, 1.0), 1)
    humidity = round(65.0 + random.uniform(0.0, 4.0), 1)
    soil_nutrition = round(43.0 + random.uniform(0.0, 3.0), 1)
    
    return {
        "temperature": temp,
        "humidity": humidity,
        "soil_nutrition": soil_nutrition
    }

@app.get("/api/weather")
def get_weather(city: str = Query("Hinganghat", description="City to get weather for")):
    """
    Get weather details for specified city or village.
    Uses OpenWeatherMap if API Key is configured, else falls back to mock registry.
    """
    if WEATHER_API_KEY:
        try:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
            resp = requests.get(url, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                temp_val = data["main"]["temp"]
                humidity_val = data["main"]["humidity"]
                wind_speed_ms = data["wind"]["speed"]
                wind_kmh = round(wind_speed_ms * 3.6, 1)
                condition_desc = data["weather"][0]["description"].title()
                condition_main = data["weather"][0]["main"].lower()
                
                # Estimate rain probability based on weather conditions
                if "rain" in condition_main or "drizzle" in condition_main:
                    rain_prob = random.randint(80, 100)
                elif "thunderstorm" in condition_main:
                    rain_prob = random.randint(90, 100)
                elif "cloud" in condition_main:
                    rain_prob = random.randint(30, 75)
                else:
                    rain_prob = random.randint(0, 15)
                    
                return {
                    "city": data.get("name", city.title()),
                    "temp": f"{temp_val}°C",
                    "condition": condition_desc,
                    "humidity": f"{humidity_val}%",
                    "wind": f"{wind_kmh} km/h",
                    "rain_probability": rain_prob
                }
            else:
                print(f"Weather API: Weather service returned {resp.status_code} - {resp.text}. Falling back.")
        except Exception as e:
            print(f"Weather API: Error fetching from weather service: {e}. Falling back.")
            
    # Fallback weather registry database
    city_db = {
        "hinganghat": {
            "city": "Hinganghat",
            "temp": "43.3°C",
            "condition": "Broken Clouds",
            "humidity": "16%",
            "wind": "17.8 km/h",
            "rain_probability": 88
        },
        "hyderabad": {
            "city": "Hyderabad",
            "temp": "36.8°C",
            "condition": "Clear Sky",
            "humidity": "28%",
            "wind": "11.5 km/h",
            "rain_probability": 10
        },
        "sector 4": {
            "city": "Sector 4",
            "temp": "24.0°C",
            "condition": "Sunny Conditions",
            "humidity": "78%",
            "wind": "12.0 km/h",
            "rain_probability": 15
        },
        "mumbai": {
            "city": "Mumbai",
            "temp": "31.2°C",
            "condition": "Scattered Showers",
            "humidity": "82%",
            "wind": "22.4 km/h",
            "rain_probability": 95
        }
    }
    
    norm_city = city.lower().strip()
    if norm_city in city_db:
        return city_db[norm_city]
    
    # Fallback dynamic response for unknown cities
    fallback_conditions = ["Overcast Clouds", "Partly Cloudy", "Clear Sky", "Light Drizzle"]
    temp_val = round(20.0 + random.uniform(0.0, 20.0), 1)
    wind_val = round(5.0 + random.uniform(0.0, 18.0), 1)
    rain_val = random.randint(0, 100)
    
    return {
        "city": city.title(),
        "temp": f"{temp_val}°C",
        "condition": random.choice(fallback_conditions),
        "humidity": f"{random.randint(30, 90)}%",
        "wind": f"{wind_val} km/h",
        "rain_probability": rain_val
    }

@app.post("/api/diagnose")
async def diagnose_leaf(file: UploadFile = File(...)):
    """
    Accepts a leaf image upload and performs real plant disease classification.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Invalid file upload.")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload a JPG, PNG, or other image file.")
    if not plant_disease_model.is_ready:
        raise HTTPException(
            status_code=503,
            detail=f"Plant disease model is not loaded: {plant_disease_model.load_error}"
        )
        
    temp_dir = Path("temp_uploads")
    temp_dir.mkdir(exist_ok=True)
    upload_suffix = Path(file.filename).suffix.lower() or ".jpg"
    temp_file_path = temp_dir / f"{uuid4().hex}{upload_suffix}"
    
    try:
        # Save upload file locally for ML inference ingestion
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        result = plant_disease_model.predict(str(temp_file_path))
        
        return {
            "filename": file.filename,
            "diagnosed_disease": result["disease"],
            "model_label": result["label"],
            "plant": result["plant"],
            "severity": result["severity"],
            "confidence": result["confidence"],
            "description": result["description"],
            "recommendation": result["recommendation"],
            "symptoms": result.get("symptoms", []),
            "causes": result.get("causes", []),
            "treatment": result.get("treatment", ""),
            "top_predictions": result.get("top_predictions", []),
            "model_status": result.get("model_status", "ready")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Leaf Diagnosis Error: {e}")
        raise HTTPException(status_code=500, detail=f"Unable to classify leaf image: {e}")
    finally:
        # Clean up temporary upload
        if temp_file_path.exists():
            try:
                os.remove(temp_file_path)
            except Exception as cleanup_err:
                print(f"Leaf Diagnosis: Failed to delete temp file: {cleanup_err}")

@app.get("/api/diagnose/model-info")
def get_diagnosis_model_info():
    """Return model readiness and supported plant classes for the frontend."""
    return plant_disease_model.info()

@app.post("/api/advisor/suspend", response_model=AdvisorStateResponse)
def suspend_schedule():
    """
    Suspend Smart Advisor Schedule.
    """
    advisor_state["suspended"] = True
    advisor_state["override"] = False
    return {
        "suspended": True,
        "override": False,
        "message": "Smart Nutrient Advisor schedule suspended for next 36h."
    }

@app.post("/api/advisor/override", response_model=AdvisorStateResponse)
def override_schedule():
    """
    Override Smart Advisor Schedule.
    """
    advisor_state["suspended"] = False
    advisor_state["override"] = True
    return {
        "suspended": False,
        "override": True,
        "message": "Ecosystem schedule overridden. Proceeding with standard cycle."
    }

@app.post("/api/simulate", response_model=SimulationResponse)
def simulate_outcome(req: SimulationRequest):
    """
    Calculate Crop Health Metrics based on simulator parameters.
    """
    feed = req.irrigation
    ph = req.moisture
    temp = req.temp
    
    # Calculate stability (default ph=6.0, feed=37, temp=24 gives ~74)
    stability = round(74 + (ph - 6.0) * 12 + (feed - 37) * 0.4 - abs(temp - 24) * 1.5)
    stability = max(10, min(100, stability))

    # Calculate sustainability (default ph=6.0, feed=37, temp=24 gives ~68)
    sustainability = round(68 - (feed - 37) * 0.45 + (ph - 6.0) * 8 - abs(temp - 24) * 0.8)
    sustainability = max(5, min(100, sustainability))

    # Calculate nutrient absorption (default ph=6.0, feed=37, temp=24 gives ~63)
    absorption = round(63 + (feed - 37) * 0.25 - (ph - 6.0) * 14 - (temp - 24) * 0.7)
    absorption = max(0, min(100, absorption))

    # Calculate disease risk (default ph=6.0, feed=37, temp=24 gives ~34)
    risk = round(34 + abs(temp - 24) * 1.8 + (feed - 37) * 0.15 - (ph - 6.0) * 10)
    risk = max(0, min(100, risk))
    
    return {
        "stability": stability,
        "sustainability": sustainability,
        "absorption": absorption,
        "risk": risk
    }

@app.post("/api/chat", response_model=ChatResponse)
def chatbot_reply(req: ChatRequest):
    """
    Chatbot response generator based on query text.
    Uses Gemini API if a key is provided, otherwise falls back to static rule-based replies.
    """
    if gemini_ready:
        try:
            model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=(
                    "You are AgroGuardian Advisor, a precision agriculture consultant. "
                    "You assist farmers with soil telemetry, nitrogen/NPK levels, crop stability, "
                    "diseases (like Downy Mildew, Early Blight), and irrigation/fertilizer schedules. "
                    "Keep your responses concise, action-oriented, and friendly."
                )
            )
            response = model.generate_content(req.message)
            return {"reply": response.text.strip()}
        except Exception as e:
            print(f"Gemini API Error: {e}. Falling back to rule-based replies.")

    # Rule-based fallback chatbot response
    lower_msg = req.message.lower()
    
    if any(word in lower_msg for word in ["disease", "pathology", "mildew"]):
        reply = (
            "Our neural network risk models check leaf humidity & temperatures to forecast spore spikes. "
            "For Downy Mildew, keep fertilizer inputs low and apply copper-based fungicides."
        )
    elif any(word in lower_msg for word in ["soil", "nutrient", "nitrogen", "ph"]):
        reply = (
            "Ecosystem Alpha operates at an optimal pH range of 6.2 - 6.8. If soil stress spikes, "
            "nitrogen levels must be calibrated immediately using automated smart schedules."
        )
    elif any(word in lower_msg for word in ["weather", "forecast", "rain"]):
        reply = (
            "Rainfall can cause nutrient runoff. Our Predictive Analysis tab calculates whether to suspend "
            "or execute scheduled fertilization intervals based on upcoming precipitation."
        )
    elif any(word in lower_msg for word in ["status", "alive"]):
        reply = (
            "All sensor nodes are currently synced and operational in Sector 4 Alpha. "
            "Overall soil quality is stable at 100/100."
        )
    else:
        reply = (
            "I am here to assist with AgroGuardian telemetry. Tell me if you'd like to diagnose a leaf disease, "
            "simulate soil conditions, or check regional climate analysis."
        )
        
    return {"reply": reply}

# Serve frontend static files
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
