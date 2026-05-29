# ESP32 Telemetry Node - Setup and Wiring Guide

This guide details how to configure, wire, and deploy the ESP32 node to stream real-time environmental metrics (temperature, humidity, soil moisture) to the AgroGuardian AI Precision Agriculture platform.

---

## 🛠️ Required Hardware

1. **ESP32 Development Board** (e.g., ESP32 NodeMCU, ESP32 WROOM-32)
2. **DHT22 (AM2302) or DHT11 Sensor** (DHT22 is recommended for accuracy)
3. **Capacitive Soil Moisture Sensor v1.2 / v2.0** (resists corrosion better than resistive sensors)
4. **Breadboard and Jumper Wires**
5. **USB Cable (Micro-USB or Type-C depending on ESP32 board)**

---

## 🔌 Hardware Wiring Schematic

### 1. DHT22 / DHT11 Wiring
- **VCC Pin** ➡️ Connect to **3.3V** or **5V** Pin on ESP32
- **Data (Out) Pin** ➡️ Connect to **GPIO 4** on ESP32 (Include a 10kΩ pull-up resistor between VCC and Data if using a bare DHT sensor; most module boards have this integrated)
- **GND Pin** ➡️ Connect to **GND** Pin on ESP32

### 2. Capacitive Soil Moisture Sensor Wiring
- **VCC Pin** ➡️ Connect to **3.3V** Pin on ESP32
- **Analog Output (AOUT) Pin** ➡️ Connect to **GPIO 34** (Analog Input pin ADC1_CH6) on ESP32
- **GND Pin** ➡️ Connect to **GND** Pin on ESP32

---

## 💻 Arduino IDE Software Configuration

1. **Download and Install Arduino IDE**: Get the latest version from [arduino.cc](https://www.arduino.cc/en/software).
2. **Configure ESP32 Board Support**:
   - Go to **File > Preferences**.
   - In "Additional Boards Manager URLs", add the Espressif Board registry URL:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Go to **Tools > Board > Boards Manager...**, search for `esp32` by *Espressif Systems*, and click **Install**.
3. **Install Sensor Libraries**:
   - Go to **Sketch > Include Library > Manage Libraries...**
   - Search for **"DHT sensor library"** by Adafruit and install it (select "Install all" to automatically grab the required dependency, **"Adafruit Unified Sensor"**).
4. **Open the Sketch**:
   - Open [esp32_sensor_node.ino](file:///c:/Users/DELL/OneDrive/Desktop/AgroGuardian_AI/esp32/esp32_sensor_node/esp32_sensor_node.ino) in the Arduino IDE.

---

## ⚙️ Configuration Adjustments

Before uploading, modify the following configurations at the top of the `esp32_sensor_node.ino` file:

```cpp
// 1. Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";          // Input your home/work Wi-Fi name
const char* password = "YOUR_WIFI_PASSWORD";  // Input your Wi-Fi password

// 2. Server Local Network IP (FastAPI Backend Host)
const char* serverIP = "192.168.1.15";         // Input the local IP of the computer running main.py
const int serverPort = 8000;                  // Default port for FastAPI (uvicorn)
```

> [!TIP]
> **How to find your local Computer IP Address:**
> - **Windows (PowerShell/CMD)**: Run `ipconfig` and look for the **IPv4 Address** under your active Wi-Fi adapter (e.g. `192.168.1.XX` or `10.0.0.XX`).
> - **macOS/Linux**: Run `ifconfig` or `ip a` and check the `inet` address under the primary interface (e.g. `en0` or `wlan0`).

---

## 🚀 Deployment & Uploading

1. Connect the ESP32 to your computer using the USB cable.
2. Select your board model: **Tools > Board > ESP32 Arduino > [Your Board Model, e.g. ESP32 Dev Module]**.
3. Select your port: **Tools > Port > [Select COM port assigned to ESP32]**.
4. Click the **Upload** arrow icon.
5. Once uploaded, open the Serial Monitor (**Tools > Serial Monitor**) and set the baud rate to **115200**.
6. The ESP32 will print Wi-Fi connection progress, followed by regular sensor measurements and HTTP upload response status codes.

---

## 🔍 Troubleshooting Connection Issues

*   **ESP32 prints connection fail or `POST failed`**:
    1. Ensure your computer and the ESP32 are connected to the exact same Wi-Fi network.
    2. Confirm that you started the FastAPI backend binding to `0.0.0.0` (not `127.0.0.1` or `localhost`), which enables access across local devices:
       ```bash
       uvicorn main:app --host 0.0.0.0 --port 8000
       ```
    3. Disable temporary local firewalls or add a rule allowing incoming connections on port 8000.
*   **Status Badge shows Offline on the website**:
    - The website polls `/api/metrics` every 5 seconds. The ESP32 must transmit successfully within a 45-second window to register the node as Online. Check the ESP32 Serial Monitor to ensure updates are uploading with response code `200` or `201`.
