/*
  AgroGuardian AI - ESP32 Telemetry Node

  Pin mapping:
  - Relay module: GPIO 25
  - DHT11/DHT22 humidity + temperature sensor: GPIO 4
  - Soil moisture analog sensor: GPIO 32
  - LDR analog sensor: GPIO 34

  Backend endpoint:
  POST http://<serverIP>:8000/api/telemetry
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// Change these if your hotspot or laptop IP changes.
const char* ssid = "vivo Y200 5G";
const char* password = "12121212";
const char* serverIP = "10.249.219.79";
const int serverPort = 8000;

// Sensor and relay pins.
#define RELAY_PIN 25
#define DHT_PIN 4
#define DHT_TYPE DHT11
#define SOIL_MOISTURE_PIN 32
#define LDR_PIN 34

// Set this to false if your relay turns ON when GPIO is LOW.
const bool relayActiveHigh = true;

// Automatic relay rule.
const float soilPumpOnBelow = 35.0;

// Upload every 5 seconds.
const unsigned long postInterval = 5000;
const unsigned long wifiRetryInterval = 10000;

// Calibrate these using Serial Monitor raw readings.
const int soilDryValue = 3000;
const int soilWetValue = 1200;
const int ldrDarkValue = 3500;
const int ldrBrightValue = 500;

DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastPostTime = 0;
unsigned long lastWiFiRetry = 0;
bool relayState = false;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("=========================================");
  Serial.println("AgroGuardian AI ESP32 Telemetry Starting");
  Serial.println("=========================================");

  dht.begin();
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);

  setRelay(false);

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  connectToWiFi();
}

void loop() {
  unsigned long now = millis();

  if (WiFi.status() != WL_CONNECTED && now - lastWiFiRetry >= wifiRetryInterval) {
    lastWiFiRetry = now;
    connectToWiFi();
  }

  if (now - lastPostTime >= postInterval) {
    lastPostTime = now;
    sendTelemetry();
  }
}

void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  Serial.print("[Wi-Fi] Connecting to ");
  Serial.println(ssid);

  WiFi.disconnect();
  delay(200);
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("[Wi-Fi] Connected");
    Serial.print("[Wi-Fi] ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("[Wi-Fi] Failed. Will retry later.");
  }
}

void setRelay(bool on) {
  relayState = on;
  int pinLevel = relayActiveHigh ? (on ? HIGH : LOW) : (on ? LOW : HIGH);
  digitalWrite(RELAY_PIN, pinLevel);
}

float readSoilMoisturePercent(int rawSoil) {
  float percent = map(rawSoil, soilDryValue, soilWetValue, 0, 100);
  return constrain(percent, 0, 100);
}

float readLightPercent(int rawLdr) {
  float percent = map(rawLdr, ldrDarkValue, ldrBrightValue, 0, 100);
  return constrain(percent, 0, 100);
}

void sendTelemetry() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int rawSoil = analogRead(SOIL_MOISTURE_PIN);
  int rawLdr = analogRead(LDR_PIN);

  float soilMoisture = readSoilMoisturePercent(rawSoil);
  float lightLevel = readLightPercent(rawLdr);
  bool useMockDht = false;

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[Warning] DHT sensor not responding. Using mock temperature/humidity.");
    useMockDht = true;
  }

  if (useMockDht) {
    temperature = 24.5 + ((float)random(-10, 11) / 10.0);
    humidity = 65.0 + ((float)random(-30, 31) / 10.0);
  }

  // Relay ON when soil moisture is low. Change this rule if relay controls another device.
  setRelay(soilMoisture < soilPumpOnBelow);

  Serial.println("-----------------------------------------");
  Serial.print("Temp: ");
  Serial.print(temperature, 1);
  Serial.print(" C | Humidity: ");
  Serial.print(humidity, 1);
  Serial.print("% | Soil raw: ");
  Serial.print(rawSoil);
  Serial.print(" | Soil: ");
  Serial.print(soilMoisture, 1);
  Serial.print("% | LDR raw: ");
  Serial.print(rawLdr);
  Serial.print(" | Light: ");
  Serial.print(lightLevel, 1);
  Serial.print("% | Relay: ");
  Serial.println(relayState ? "ON" : "OFF");

  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 1) + ",";
  jsonPayload += "\"soil_moisture\":" + String(soilMoisture, 1) + ",";
  jsonPayload += "\"light_level\":" + String(lightLevel, 1) + ",";
  jsonPayload += "\"relay_state\":" + String(relayState ? "true" : "false");
  jsonPayload += "}";

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Skipped. Wi-Fi disconnected.");
    return;
  }

  HTTPClient http;
  http.setTimeout(5000);

  String serverPath = "http://" + String(serverIP) + ":" + String(serverPort) + "/api/telemetry";

  Serial.print("[HTTP] POST ");
  Serial.println(serverPath);
  Serial.print("[HTTP] Payload: ");
  Serial.println(jsonPayload);

  http.begin(serverPath);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("[HTTP] Status: ");
    Serial.println(httpResponseCode);
    Serial.print("[HTTP] Response: ");
    Serial.println(http.getString());
  } else {
    Serial.print("[HTTP] Failed: ");
    Serial.println(http.errorToString(httpResponseCode));
    Serial.println("[HTTP] Check laptop IP, backend server, firewall, and same Wi-Fi network.");
  }

  http.end();
}
