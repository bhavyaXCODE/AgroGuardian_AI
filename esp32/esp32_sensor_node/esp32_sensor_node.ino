/**
 * AgroGuardian AI - ESP32 Telemetry Node
 * 
 * This sketch connects an ESP32 microcontroller to a local Wi-Fi network,
 * reads environmental sensors (DHT11/DHT22 for Temperature & Humidity, 
 * and a Capacitive Soil Moisture Sensor), formats the readings as JSON,
 * and transmits them via HTTP POST to the AgroGuardian AI Backend API.
 * 
 * Hardware Fallback:
 * If the physical sensors are not connected or fail to respond, the code
 * will automatically generate realistic simulated values and output a
 * warning to the Serial Monitor. This allows testing the ESP32-to-Backend 
 * integration with just a bare ESP32 board!
 * 
 * Libraries Required (Install via Arduino Library Manager):
 * 1. "DHT sensor library" by Adafruit (for Temperature/Humidity)
 * 2. "Adafruit Unified Sensor" by Adafruit (Dependency for DHT library)
 */

#include <WiFi.h>
#include <HTTPClient.h>

// --- Configuration Section ---

// 1. Wi-Fi Settings
const char* ssid = "vivo Y200 5G";          // Replace with your Wi-Fi SSID
const char* password = "12121212";  // Replace with your Wi-Fi Password

// 2. AgroGuardian Backend Server Settings
// IMPORTANT: Host your backend on '0.0.0.0' and specify your computer's local network IP here
const char* serverIP = "10.249.219.79";         // Replace with your computer's local IP address
const int serverPort = 8000;                  // Default port for FastAPI (uvicorn)

// 3. Sensor Pin Mapping
#define DHTPIN 4                              // GPIO Pin connected to DHT Sensor (Data line)
#define DHTTYPE DHT22                         // Using DHT22. Change to DHT11 if using DHT11 sensor
#define SOIL_MOISTURE_PIN 34                  // Analog Pin connected to Soil Moisture sensor

// 4. Telemetry Settings
const unsigned long postInterval = 5000;      // Telemetry upload interval in milliseconds (5 seconds)

// --- End of Configuration ---

// Instantiate DHT object
// Note: We include DHT.h here, but if the physical sensor is not wired up,
// the code will catch the failure and switch to mock simulation dynamically.
#include <DHT.h>
DHT dht(DHTPIN, DHTTYPE);

// Calibration values for capacitive soil moisture sensor
// Modify these values based on your sensor's raw readings in air (dry) and water (wet)
const int dryValue = 3000;                    // Raw reading in dry air (max resistance)
const int wetValue = 1200;                    // Raw reading in water (min resistance)

unsigned long lastPostTime = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n=========================================");
  Serial.println("AgroGuardian AI Telemetry Node Starting");
  Serial.println("=========================================");

  // Initialize DHT Sensor
  dht.begin();
  pinMode(SOIL_MOISTURE_PIN, INPUT);

  // Connect to Wi-Fi
  connectToWiFi();
}

void loop() {
  // Reconnect Wi-Fi if connection is lost
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }

  // Send telemetry at regular intervals
  if (millis() - lastPostTime >= postInterval) {
    lastPostTime = millis();
    sendTelemetry();
  }
}

/**
 * Establishes connection to the specified Wi-Fi network.
 */
void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi SSID: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected successfully!");
    Serial.print("[Wi-Fi] IP Address assigned: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[Wi-Fi] Failed to connect. Will continue trying in the background...");
  }
}

/**
 * Reads sensor telemetry values and transmits them to the server.
 */
void sendTelemetry() {
  float temperature = 0.0;
  float humidity = 0.0;
  float moisturePercent = 0.0;
  bool useMock = false;

  // 1. Read DHT22 / DHT11 Sensor
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // Check if DHT readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[Warning] DHT sensor not responding or failed to initialize.");
    useMock = true;
  }

  // 2. Read Capacitive Soil Moisture Sensor
  int rawSoil = analogRead(SOIL_MOISTURE_PIN);
  
  // Calculate percentage: dryValue is 0%, wetValue is 100%
  moisturePercent = map(rawSoil, dryValue, wetValue, 0, 100);
  
  // Constrain percentage to 0-100% range
  moisturePercent = constrain(moisturePercent, 0.0, 100.0);

  // If raw analog reading is flat (0 or max 4095), check if it's disconnected
  if (rawSoil == 0 || rawSoil >= 4095) {
    Serial.println("[Warning] Soil Moisture sensor reading out of range (possibly disconnected).");
    useMock = true;
  }

  // 3. Fallback: Generate mock data if hardware is offline
  if (useMock) {
    Serial.println("[System] Running in SIMULATION MODE. Generating mock sensor data...");
    
    // Generate realistic fluctuating data
    // Temp: fluctuates around 24.5 °C
    temperature = 24.5 + ((float)random(-10, 11) / 10.0);
    // Humidity: fluctuates around 65%
    humidity = 65.0 + ((float)random(-30, 31) / 10.0);
    // Soil Moisture: fluctuates around 43%
    moisturePercent = 43.0 + ((float)random(-20, 21) / 10.0);
  }

  Serial.println("-----------------------------------------");
  Serial.print("Telemetry Sampled: ");
  Serial.print("Temp = "); Serial.print(temperature); Serial.print("°C | ");
  Serial.print("Humidity = "); Serial.print(humidity); Serial.print("% | ");
  Serial.print("Soil Moisture = "); Serial.print(moisturePercent); Serial.println("%");

  // 4. Construct JSON Payload
  // Format: {"temperature": 24.5, "humidity": 65.2, "soil_nutrition": 43.1}
  // Note: 'soil_nutrition' is used by the AgroGuardian dashboard overview for Soil Moisture display.
  String jsonPayload = "{\"temperature\":" + String(temperature, 1) + 
                       ",\"humidity\":" + String(humidity, 1) + 
                       ",\"soil_nutrition\":" + String(moisturePercent, 1) + "}";

  // 5. Send POST Request to Backend
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Construct target URL
    String serverPath = "http://" + String(serverIP) + ":" + String(serverPort) + "/api/telemetry";
    
    Serial.print("[HTTP] Sending POST payload to: ");
    Serial.println(serverPath);
    Serial.print("[HTTP] Payload: ");
    Serial.println(jsonPayload);

    http.begin(serverPath);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("[HTTP] Response status code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.print("[HTTP] Response payload: ");
      Serial.println(response);
    } else {
      Serial.print("[HTTP] POST failed. Error Code: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
      Serial.println("[HTTP] Suggestion: Verify your server IP address configuration and check local firewall.");
    }
    
    http.end();
  } else {
    Serial.println("[HTTP] Cannot send telemetry. Wi-Fi disconnected.");
  }
}
