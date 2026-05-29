/**
 * AgroGuardian AI - Precision Agriculture Frontend Script
 * Contains: Navigation View Switching, Overview Reloading, Local Weather Lookup,
 * Leaf Image Analysis, Predictive Advisor actions, What-If Simulator Math,
 * and Interactive Chatbot dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = window.location.protocol.startsWith('http')
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://localhost:8000';

  // ==========================================================================
  // 1. Navigation View Switching
  // ==========================================================================
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const viewPanels = document.querySelectorAll('.view-panel');

  function switchView(viewId) {
    // Remove active state from sidebar
    sidebarLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle corresponding view content
    viewPanels.forEach(panel => {
      if (panel.id === `${viewId}-view`) {
        panel.classList.add('active');
        panel.style.opacity = '0';
        setTimeout(() => {
          panel.style.opacity = '1';
        }, 50);
      } else {
        panel.classList.remove('active');
        panel.style.opacity = '';
      }
    });

    // Special trigger: If tab is Chatbot, open/activate the floating chat box
    if (viewId === 'chatbot') {
      const chatWindow = document.getElementById('chatWindow');
      if (chatWindow) {
        chatWindow.classList.add('active');
      }
    }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const viewId = link.getAttribute('data-view');
      switchView(viewId);
    });
  });


  // ==========================================================================
  // 2. Overview Dashboard Reload Sequence & ESP32 Live Telemetry
  // ==========================================================================
  const btnReloadOverview = document.getElementById('btnReloadOverview');
  const overviewTemp = document.getElementById('overviewTemp');
  const overviewHumidity = document.getElementById('overviewHumidity');
  const overviewSoilMoisture = document.getElementById('overviewSoilMoisture');
  const overviewLightLevel = document.getElementById('overviewLightLevel');
  const overviewRelayState = document.getElementById('overviewRelayState');
  const overviewRelayDesc = document.getElementById('overviewRelayDesc');

  function fetchOverviewMetrics(isManual = false) {
    const reloadIcon = btnReloadOverview ? btnReloadOverview.querySelector('.material-symbols-outlined') : null;
    if (isManual && reloadIcon) {
      reloadIcon.style.transform = 'rotate(360deg)';
      reloadIcon.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    return fetch(`${API_BASE}/api/metrics?t=${Date.now()}`, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (overviewTemp) overviewTemp.textContent = `${data.temperature}°C`;
        if (overviewHumidity) {
          overviewHumidity.textContent = `${data.humidity}%`;
          const fill = overviewHumidity.parentElement.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = `${data.humidity}%`;
        }
        if (overviewSoilMoisture) {
          const soilValue = data.soil_moisture ?? data.soil_nutrition;
          overviewSoilMoisture.textContent = `${soilValue}%`;
          const fill = overviewSoilMoisture.parentElement.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = `${soilValue}%`;
        }
        if (overviewLightLevel && data.light_level !== null && data.light_level !== undefined) {
          overviewLightLevel.textContent = `${data.light_level}%`;
          const fill = overviewLightLevel.parentElement.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = `${data.light_level}%`;
        }
        if (overviewRelayState) {
          overviewRelayState.textContent = data.relay_state ? 'ON' : 'OFF';
          overviewRelayState.style.color = data.relay_state ? 'var(--green-accent)' : 'var(--red-accent)';
        }
        if (overviewRelayDesc) {
          overviewRelayDesc.textContent = data.relay_state
            ? 'Pump / actuator circuit is active'
            : 'Relay connected on GPIO 25';
        }

        // Update ESP32 Status Badge
        const esp32StatusBadge = document.getElementById('esp32StatusBadge');
        const esp32StatusDot = document.getElementById('esp32StatusDot');
        const esp32StatusText = document.getElementById('esp32StatusText');

        if (data.esp32_status === 'online') {
          if (esp32StatusBadge) {
            esp32StatusBadge.style.backgroundColor = 'var(--green-bg)';
            esp32StatusBadge.style.color = 'var(--green-text)';
            esp32StatusBadge.style.borderColor = 'rgba(34, 197, 94, 0.2)';
          }
          if (esp32StatusDot) {
            esp32StatusDot.style.backgroundColor = 'var(--green-accent)';
            esp32StatusDot.style.animation = 'pulseSync 2s infinite';
          }
          if (esp32StatusText) {
            esp32StatusText.textContent = `ESP32 ONLINE (${data.last_seen}s ago)`;
          }

          // Update card descriptions
          const tempCard = overviewTemp ? overviewTemp.closest('.info-card') : null;
          const humCard = overviewHumidity ? overviewHumidity.closest('.info-card') : null;
          const moistureCard = overviewSoilMoisture ? overviewSoilMoisture.closest('.info-card') : null;
          const lightCard = overviewLightLevel ? overviewLightLevel.closest('.info-card') : null;

          if (tempCard) {
            const desc = tempCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'ESP32 Real-Time Feed';
          }
          if (humCard) {
            const desc = humCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'ESP32 Real-Time Feed';
          }
          if (moistureCard) {
            const desc = moistureCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'ESP32 Real-Time Feed';
          }
          if (lightCard) {
            const desc = lightCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'ESP32 Real-Time Feed';
          }
        } else {
          if (esp32StatusBadge) {
            esp32StatusBadge.style.backgroundColor = 'rgba(11, 40, 26, 0.06)';
            esp32StatusBadge.style.color = 'var(--secondary-text)';
            esp32StatusBadge.style.borderColor = 'var(--outline)';
          }
          if (esp32StatusDot) {
            esp32StatusDot.style.backgroundColor = 'var(--muted-text)';
            esp32StatusDot.style.animation = 'none';
          }
          if (esp32StatusText) {
            esp32StatusText.textContent = data.esp32_status === 'waiting'
              ? 'WAITING FOR ESP32'
              : 'ESP32 OFFLINE';
          }

          // Revert descriptions to default
          const tempCard = overviewTemp ? overviewTemp.closest('.info-card') : null;
          const humCard = overviewHumidity ? overviewHumidity.closest('.info-card') : null;
          const moistureCard = overviewSoilMoisture ? overviewSoilMoisture.closest('.info-card') : null;
          const lightCard = overviewLightLevel ? overviewLightLevel.closest('.info-card') : null;

          if (tempCard) {
            const desc = tempCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'Live sensor feed';
          }
          if (humCard) {
            const desc = humCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'Live sensor feed';
          }
          if (moistureCard) {
            const desc = moistureCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'Live sensor feed';
          }
          if (lightCard) {
            const desc = lightCard.querySelector('.card-desc');
            if (desc) desc.textContent = 'LDR sensor on GPIO 34';
          }
        }

        if (isManual) {
          showToastNotification('Ecosystem metrics refreshed successfully.');
        }
      })
      .catch(err => {
        console.error('Error fetching metrics:', err);
        if (isManual) {
          showToastNotification('Failed to fetch live ecosystem metrics.', 'warning');
        }
      })
      .finally(() => {
        if (isManual && reloadIcon) {
          setTimeout(() => {
            reloadIcon.style.transition = 'none';
            reloadIcon.style.transform = 'rotate(0deg)';
          }, 600);
        }
      });
  }

  if (btnReloadOverview) {
    btnReloadOverview.addEventListener('click', () => {
      fetchOverviewMetrics(true);
    });
  }

  // Load metrics on startup and poll every 2 seconds
  fetchOverviewMetrics(false);
  setInterval(() => {
    fetchOverviewMetrics(false);
  }, 2000);


  // ==========================================================================
  // 3. Local Weather City Lookup Widget
  // ==========================================================================
  const localWeatherInput = document.getElementById('localWeatherInput');
  const btnSearchCity = document.getElementById('btnSearchCity');
  const btnUseLocation = document.getElementById('btnUseLocation');
  const localWeatherTemp = document.getElementById('localWeatherTemp');
  const localWeatherCondition = document.getElementById('localWeatherCondition');
  const localWeatherHumidity = document.getElementById('localWeatherHumidity');
  const localWeatherWind = document.getElementById('localWeatherWind');

  function updateLocalWeather(query) {
    fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(query)}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (localWeatherTemp) localWeatherTemp.textContent = data.temp;
        if (localWeatherCondition) localWeatherCondition.textContent = data.condition;
        if (localWeatherHumidity) localWeatherHumidity.textContent = data.humidity;
        if (localWeatherWind) localWeatherWind.textContent = data.wind;
        
        const rainBar = document.querySelector('#overview-view .weather-details-row .progress-bar-fill');
        const rainLabel = document.querySelector('#overview-view .weather-details-row p');
        if (rainBar) rainBar.style.width = `${data.rain_probability}%`;
        if (rainLabel) rainLabel.textContent = `${data.rain_probability}% Probability`;

        // Dynamic alert banner update
        const overviewAlertBanner = document.getElementById('overviewAlertBanner');
        if (overviewAlertBanner) {
          if (data.rain_probability > 70) {
            overviewAlertBanner.className = 'ai-insights-alert-box red';
            overviewAlertBanner.querySelector('p').textContent = 'High rain probability nearby. Reduce fertilizer inputs and monitor for fungal pressure after leaf wetness.';
          } else {
            overviewAlertBanner.className = 'ai-insights-alert-box';
            overviewAlertBanner.querySelector('p').textContent = 'Stable climate indicators. Maintain default N-P-K nutrient schedules.';
          }
        }
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
        showToastNotification('Failed to fetch weather data.', 'warning');
      });
  }

  if (btnSearchCity) {
    btnSearchCity.addEventListener('click', () => {
      const query = localWeatherInput.value;
      if (query) {
        updateLocalWeather(query);
        showToastNotification(`Fetched local weather metrics for ${query}`);
      }
    });
  }

  if (btnUseLocation) {
    btnUseLocation.addEventListener('click', () => {
      if (localWeatherInput) localWeatherInput.value = 'Hinganghat';
      updateLocalWeather('Hinganghat');
      showToastNotification('Synced with device location diagnostics.');
    });
  }


  // ==========================================================================
  // 4. Disease Leaf Image Upload & Diagnosis
  // ==========================================================================
  const leafDropzone = document.getElementById('leafDropzone');
  const leafFileInput = document.getElementById('leafFileInput');
  const leafPreview = document.getElementById('leafPreview');
  const uploadIcon = document.getElementById('uploadIcon');
  const uploadText = document.getElementById('uploadText');
  const uploadSubText = document.getElementById('uploadSubText');
  const diseaseModelInfo = document.getElementById('diseaseModelInfo');
  
  const btnAnalyzeLeaf = document.getElementById('btnAnalyzeLeaf');
  const diseaseOutputPlaceholder = document.getElementById('diseaseOutputPlaceholder');
  const diseaseResultPanel = document.getElementById('diseaseResultPanel');
  
  const diagnosedDisease = document.getElementById('diagnosedDisease');
  const diseasePlant = document.getElementById('diseasePlant');
  const diseaseSeverity = document.getElementById('diseaseSeverity');
  const diseaseConfidence = document.getElementById('diseaseConfidence');
  const diseaseDescription = document.getElementById('diseaseDescription');
  const diseaseRecommendation = document.getElementById('diseaseRecommendation');

  // New element selectors
  const diseaseSymptoms = document.getElementById('diseaseSymptoms');
  const diseaseCauses = document.getElementById('diseaseCauses');
  const diseaseAlternatives = document.getElementById('diseaseAlternatives');
  const diseaseTreatmentContainer = document.getElementById('diseaseTreatmentContainer');
  const btnResetScan = document.getElementById('btnResetScan');

  function setListItems(listElement, items, fallback) {
    if (!listElement) return;

    listElement.innerHTML = "";
    if (items && items.length > 0) {
      items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        listElement.appendChild(li);
      });
      return;
    }

    const li = document.createElement("li");
    li.textContent = fallback;
    listElement.appendChild(li);
  }

  function renderDiagnosisError(message) {
    if (diseaseOutputPlaceholder) diseaseOutputPlaceholder.style.display = 'none';
    if (diseaseResultPanel) diseaseResultPanel.style.display = 'flex';
    if (diagnosedDisease) diagnosedDisease.textContent = "Model unavailable";
    if (diseasePlant) diseasePlant.textContent = "No prediction";
    if (diseaseConfidence) diseaseConfidence.textContent = "0.0%";
    if (diseaseDescription) diseaseDescription.textContent = message;
    if (diseaseRecommendation) {
      diseaseRecommendation.textContent = "Install backend ML dependencies and restart the API, then upload the leaf image again.";
    }
    if (diseaseSeverity) {
      diseaseSeverity.textContent = "Setup Needed";
      diseaseSeverity.className = "status-badge orange";
    }
    if (diseaseTreatmentContainer) {
      diseaseTreatmentContainer.className = "ai-insights-alert-box red";
    }
    setListItems(diseaseSymptoms, ["No model prediction was returned."], "No prediction details.");
    setListItems(diseaseCauses, ["Backend model dependency or model load failure."], "No failure details.");
    setListItems(diseaseAlternatives, [], "No alternative matches returned.");
  }

  fetch(`${API_BASE}/api/diagnose/model-info`)
    .then(response => response.json())
    .then(data => {
      if (!diseaseModelInfo) return;

      if (data.ready) {
        const plants = (data.supported_plants || []).slice(0, 8).join(", ");
        diseaseModelInfo.textContent = `Model ready: ${data.classes} disease/healthy classes. Supported crops include ${plants}.`;
      } else {
        diseaseModelInfo.textContent = `Model setup needed: ${data.load_error || "backend model is not loaded"}`;
      }
    })
    .catch(() => {
      if (diseaseModelInfo) {
        diseaseModelInfo.textContent = "Backend model status unavailable. Start the API on localhost:8000.";
      }
    });

  if (leafDropzone && leafFileInput) {
    leafDropzone.addEventListener('click', () => {
      leafFileInput.click();
    });

    leafFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          leafPreview.src = event.target.result;
          leafPreview.style.display = 'block';
          uploadIcon.style.display = 'none';
          uploadText.style.display = 'none';
          uploadSubText.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnAnalyzeLeaf) {
    btnAnalyzeLeaf.addEventListener('click', () => {
      // Check if image is loaded
      if (!leafPreview.src || leafPreview.style.display === 'none' || !leafFileInput.files[0]) {
        showToastNotification('Please browse or upload a leaf image first.', 'warning');
        return;
      }

      btnAnalyzeLeaf.disabled = true;
      btnAnalyzeLeaf.innerHTML = `
        <span class="material-symbols-outlined" style="animation: rotate 1s linear infinite;">sync</span>
        Analyzing leaf...
      `;

      const formData = new FormData();
      formData.append('file', leafFileInput.files[0]);

      fetch(`${API_BASE}/api/diagnose`, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            return response.json()
              .catch(() => ({ detail: 'Diagnosis failed' }))
              .then(errorData => {
                throw new Error(errorData.detail || 'Diagnosis failed');
              });
          }
          return response.json();
        })
        .then(data => {
          // Switch panel displays
          if (diseaseOutputPlaceholder) diseaseOutputPlaceholder.style.display = 'none';
          if (diseaseResultPanel) diseaseResultPanel.style.display = 'flex';

          // Render pathology report
          diagnosedDisease.textContent = data.diagnosed_disease;
          if (diseasePlant) diseasePlant.textContent = data.plant || "Unknown plant";
          diseaseConfidence.textContent = data.confidence;
          diseaseDescription.textContent = data.description;
          diseaseRecommendation.textContent = data.recommendation;

          // Severity status badge and alert box styling
          const severityText = data.severity || "Low Risk";
          diseaseSeverity.textContent = severityText;
          
          let severityClass = "green";
          let alertClass = "green";
          if (severityText.toLowerCase().includes("high") || severityText.toLowerCase().includes("critical")) {
            severityClass = "red";
            alertClass = "red";
          } else if (severityText.toLowerCase().includes("moderate") || severityText.toLowerCase().includes("medium")) {
            severityClass = "orange";
            alertClass = "red"; // Accent color red/orange
          }
          
          diseaseSeverity.className = `status-badge ${severityClass}`;
          if (diseaseTreatmentContainer) {
            diseaseTreatmentContainer.className = `ai-insights-alert-box ${alertClass}`;
          }

          setListItems(diseaseSymptoms, data.symptoms, "No standard symptoms documented.");
          setListItems(diseaseCauses, data.causes, "No specific environmental risk factors documented.");

          if (diseaseAlternatives) {
            diseaseAlternatives.innerHTML = "";
            if (data.top_predictions && data.top_predictions.length > 0) {
              data.top_predictions.forEach(prediction => {
                const li = document.createElement("li");
                li.textContent = `${prediction.name} (${prediction.confidence})`;
                diseaseAlternatives.appendChild(li);
              });
            } else {
              const li = document.createElement("li");
              li.textContent = "No alternative matches returned by the model.";
              diseaseAlternatives.appendChild(li);
            }
          }

          showToastNotification(`Leaf scanning complete. Pathology: ${data.diagnosed_disease}`);
        })
        .catch(err => {
          console.error(err);
          renderDiagnosisError(err.message || 'Failed to analyze leaf image.');
          showToastNotification('Failed to analyze leaf image. Check backend model setup.', 'warning');
        })
        .finally(() => {
          btnAnalyzeLeaf.disabled = false;
          btnAnalyzeLeaf.innerHTML = `
            <span class="material-symbols-outlined">auto_awesome</span>
            Analyze Image
          `;
        });
    });
  }

  // Bind Scan Another Leaf Reset Option
  if (btnResetScan) {
    btnResetScan.addEventListener('click', () => {
      // Clear file inputs
      if (leafFileInput) leafFileInput.value = "";
      
      // Reset image preview element
      if (leafPreview) {
        leafPreview.src = "";
        leafPreview.style.display = 'none';
      }
      
      // Restore upload prompts in the dropzone
      if (uploadIcon) uploadIcon.style.display = 'block';
      if (uploadText) uploadText.style.display = 'block';
      if (uploadSubText) uploadSubText.style.display = 'block';
      
      // Toggle result card and placeholder views
      if (diseaseResultPanel) diseaseResultPanel.style.display = 'none';
      if (diseaseOutputPlaceholder) diseaseOutputPlaceholder.style.display = 'flex';
      
      showToastNotification("Ready for a new leaf scan.");
    });
  }


  // ==========================================================================
  // 5. Smart Nutrient Advisor actions (Weather Forecast View)
  // ==========================================================================
  const btnSuspendSchedule = document.getElementById('btnSuspendSchedule');
  const btnOverrideSchedule = document.getElementById('btnOverrideSchedule');

  if (btnSuspendSchedule) {
    btnSuspendSchedule.addEventListener('click', () => {
      fetch(`${API_BASE}/api/advisor/suspend`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          btnSuspendSchedule.disabled = true;
          btnSuspendSchedule.textContent = 'Suspended';
          btnSuspendSchedule.style.backgroundColor = '#e5e7eb';
          btnSuspendSchedule.style.color = 'var(--muted-text)';
          showToastNotification(data.message);
          
          if (btnOverrideSchedule) {
            btnOverrideSchedule.disabled = false;
            btnOverrideSchedule.textContent = 'Override';
            btnOverrideSchedule.style.backgroundColor = '';
            btnOverrideSchedule.style.color = '';
          }
        })
        .catch(err => {
          console.error(err);
          showToastNotification('Failed to suspend schedule.', 'warning');
        });
    });
  }

  if (btnOverrideSchedule) {
    btnOverrideSchedule.addEventListener('click', () => {
      fetch(`${API_BASE}/api/advisor/override`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          showToastNotification(data.message);
          
          if (btnSuspendSchedule) {
            btnSuspendSchedule.disabled = false;
            btnSuspendSchedule.textContent = 'Suspend Schedule';
            btnSuspendSchedule.style.backgroundColor = '';
            btnSuspendSchedule.style.color = '';
          }
        })
        .catch(err => {
          console.error(err);
          showToastNotification('Failed to override schedule.', 'warning');
        });
    });
  }


  // ==========================================================================
  // 6. What-If Simulator Slider Math Engine
  // ==========================================================================
  const simSliderIrrigation = document.getElementById('simSliderIrrigation');
  const simSliderMoisture = document.getElementById('simSliderMoisture');
  const simSliderTemp = document.getElementById('simSliderTemp');

  const simValIrrigation = document.getElementById('simValIrrigation');
  const simValMoisture = document.getElementById('simValMoisture');
  const simValTemp = document.getElementById('simValTemp');

  const simStabilityFill = document.getElementById('simStabilityFill');
  const simStabilityText = document.getElementById('simStabilityText');
  const simSustainabilityVal = document.getElementById('simSustainabilityVal');
  const simSustainabilityBar = document.getElementById('simSustainabilityBar');
  const simWaterEfficiencyText = document.getElementById('simWaterEfficiencyText');
  const simWaterEfficiencyBar = document.getElementById('simWaterEfficiencyBar');
  const simDiseaseRiskText = document.getElementById('simDiseaseRiskText');
  const simDiseaseRiskBar = document.getElementById('simDiseaseRiskBar');

  function calculateSimulatorMetrics() {
    if (!simSliderIrrigation) return;

    // Fetch variables
    const feed = parseInt(simSliderIrrigation.value); // default 37
    const ph = parseFloat(simSliderMoisture.value); // default 6.0
    const temp = parseInt(simSliderTemp.value); // default 24

    // Update variable display text
    simValIrrigation.textContent = `${feed}%`;
    simValMoisture.textContent = ph.toFixed(1);
    simValTemp.textContent = `${temp}°C`;

    fetch(`${API_BASE}/api/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        irrigation: feed,
        moisture: ph,
        temp: temp
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Simulation failed');
        return response.json();
      })
      .then(data => {
        // Crop health stability (circumference 264)
        const arcCircumference = 264;
        const arcOffset = arcCircumference - (arcCircumference * data.stability) / 100;
        if (simStabilityFill) simStabilityFill.style.strokeDashoffset = arcOffset;
        if (simStabilityText) simStabilityText.textContent = `${data.stability}%`;

        // Sustainability score
        if (simSustainabilityVal) simSustainabilityVal.textContent = data.sustainability;
        if (simSustainabilityBar) simSustainabilityBar.style.width = `${data.sustainability}%`;

        // Nutrient Absorption
        if (simWaterEfficiencyText) simWaterEfficiencyText.textContent = `${data.absorption}%`;
        if (simWaterEfficiencyBar) simWaterEfficiencyBar.style.width = `${data.absorption}%`;

        // Disease Risk
        if (simDiseaseRiskText) simDiseaseRiskText.textContent = `${data.risk}%`;
        if (simDiseaseRiskBar) simDiseaseRiskBar.style.width = `${data.risk}%`;
      })
      .catch(err => {
        console.error('Error simulating metrics:', err);
      });
  }

  // Bind range input changes
  if (simSliderIrrigation) {
    simSliderIrrigation.addEventListener('input', calculateSimulatorMetrics);
    simSliderMoisture.addEventListener('input', calculateSimulatorMetrics);
    simSliderTemp.addEventListener('input', calculateSimulatorMetrics);
  }


  // ==========================================================================
  // 7. Chatbot Interactivity (Floating & Standalone View)
  // ==========================================================================
  const chatFloatingBtn = document.getElementById('chatFloatingBtn');
  const chatWindow = document.getElementById('chatWindow');
  const btnMinimizeChat = document.getElementById('btnMinimizeChat');
  
  const floatingChatInput = document.getElementById('floatingChatInput');
  const btnSendFloatingChat = document.getElementById('btnSendFloatingChat');
  const floatingChatMessages = document.getElementById('floatingChatMessages');

  const standaloneChatInput = document.getElementById('standaloneChatInput');
  const btnSendStandaloneChat = document.getElementById('btnSendStandaloneChat');
  const standaloneChatMessages = document.getElementById('standaloneChatMessages');

  // Toggle floating chat window
  if (chatFloatingBtn && chatWindow) {
    chatFloatingBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });
  }

  if (btnMinimizeChat && chatWindow) {
    btnMinimizeChat.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  function handleSendMessage(inputEl, containerEl) {
    const text = inputEl.value.trim();
    if (!text) return;

    // 1. Add user message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-message-bubble user';
    userBubble.textContent = text;
    containerEl.appendChild(userBubble);
    
    // Clear input
    inputEl.value = '';
    
    // Scroll to bottom
    containerEl.scrollTop = containerEl.scrollHeight;

    // 2. Add typing delay response placeholder
    const typingBubble = document.createElement('div');
    typingBubble.className = 'chat-message-bubble bot';
    typingBubble.style.opacity = '0.6';
    typingBubble.textContent = '...';
    containerEl.appendChild(typingBubble);
    containerEl.scrollTop = containerEl.scrollHeight;

    fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    })
      .then(response => {
        if (!response.ok) throw new Error('Chat failed');
        return response.json();
      })
      .then(data => {
        typingBubble.remove();
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-message-bubble bot';
        botBubble.textContent = data.reply;
        containerEl.appendChild(botBubble);
        containerEl.scrollTop = containerEl.scrollHeight;
      })
      .catch(err => {
        console.error(err);
        typingBubble.remove();
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-message-bubble bot';
        botBubble.textContent = 'Sorry, I am having trouble connecting to the AgroGuardian intelligence services right now.';
        containerEl.appendChild(botBubble);
        containerEl.scrollTop = containerEl.scrollHeight;
      });
  }

  // Bind floating chat triggers
  if (btnSendFloatingChat && floatingChatInput) {
    btnSendFloatingChat.addEventListener('click', () => {
      handleSendMessage(floatingChatInput, floatingChatMessages);
    });

    floatingChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage(floatingChatInput, floatingChatMessages);
      }
    });
  }

  // Bind standalone view chat triggers
  if (btnSendStandaloneChat && standaloneChatInput) {
    btnSendStandaloneChat.addEventListener('click', () => {
      handleSendMessage(standaloneChatInput, standaloneChatMessages);
    });

    standaloneChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage(standaloneChatInput, standaloneChatMessages);
      }
    });
  }


  // ==========================================================================
  // 8. Global Toast Notification Helper
  // ==========================================================================
  function showToastNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-box text-mono';
    
    // Custom inline styles for premium look
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '24px';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '99999';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    if (type === 'warning') {
      toast.style.backgroundColor = 'var(--orange-bg)';
      toast.style.color = 'var(--orange-text)';
      toast.style.border = '1px solid rgba(251, 191, 36, 0.25)';
      toast.style.backdropFilter = 'blur(12px)';
      toast.style.webkitBackdropFilter = 'blur(12px)';
    } else {
      toast.style.backgroundColor = 'rgba(13, 27, 20, 0.9)';
      toast.style.color = '#ffffff';
      toast.style.border = '1px solid var(--outline)';
      toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      toast.style.backdropFilter = 'blur(12px)';
      toast.style.webkitBackdropFilter = 'blur(12px)';
    }

    document.body.appendChild(toast);
    toast.textContent = message;

    // Trigger show
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    // Auto remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Sidebar Collapse Interactivity
  const btnSidebarCollapse = document.querySelector('.btn-sidebar-collapse');
  const appSidebar = document.querySelector('.app-sidebar');

  if (btnSidebarCollapse && appSidebar) {
    btnSidebarCollapse.addEventListener('click', () => {
      appSidebar.classList.toggle('collapsed');
    });

    // Auto-collapse if query param is set (for verification / testing)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('collapsed') === 'true') {
      appSidebar.classList.add('collapsed');
    }
  }

  // Inject rotate animation style rule for loading icon
  const animStyle = document.createElement('style');
  animStyle.innerHTML = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(animStyle);

});
