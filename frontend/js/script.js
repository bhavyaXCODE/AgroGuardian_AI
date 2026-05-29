/**
 * AgroGuardian AI - Precision Agriculture Frontend Script
 * Contains: Navigation View Switching, Overview Reloading, Local Weather Lookup,
 * Leaf Image Analysis Simulator, Predictive Advisor actions, What-If Simulator Math,
 * and Interactive Chatbot dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE = 'http://localhost:8000';

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
  // 2. Overview Dashboard Reload Sequence
  // ==========================================================================
  const btnReloadOverview = document.getElementById('btnReloadOverview');
  const overviewTemp = document.getElementById('overviewTemp');
  const overviewHumidity = document.getElementById('overviewHumidity');

  if (btnReloadOverview) {
    btnReloadOverview.addEventListener('click', () => {
      btnReloadOverview.style.transform = 'rotate(180deg)';
      btnReloadOverview.style.transition = 'transform 0.5s ease';
      
      fetch(`${API_BASE}/api/metrics`)
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
          const overviewSoilMoisture = document.getElementById('overviewSoilMoisture');
          if (overviewSoilMoisture) {
            overviewSoilMoisture.textContent = `${data.soil_nutrition}%`;
            const fill = overviewSoilMoisture.parentElement.querySelector('.progress-bar-fill');
            if (fill) fill.style.width = `${data.soil_nutrition}%`;
          }
          showToastNotification('Ecosystem metrics refreshed successfully.');
        })
        .catch(err => {
          console.error('Error fetching metrics:', err);
          showToastNotification('Failed to fetch live ecosystem metrics.', 'warning');
        })
        .finally(() => {
          setTimeout(() => {
            btnReloadOverview.style.transform = 'rotate(0deg)';
            btnReloadOverview.style.transition = 'none';
          }, 500);
        });
    });
  }


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
  // 4. Disease Leaf Image Upload & Diagnosis Simulation
  // ==========================================================================
  const leafDropzone = document.getElementById('leafDropzone');
  const leafFileInput = document.getElementById('leafFileInput');
  const leafPreview = document.getElementById('leafPreview');
  const uploadIcon = document.getElementById('uploadIcon');
  const uploadText = document.getElementById('uploadText');
  const uploadSubText = document.getElementById('uploadSubText');
  
  const btnAnalyzeLeaf = document.getElementById('btnAnalyzeLeaf');
  const diseaseOutputPlaceholder = document.getElementById('diseaseOutputPlaceholder');
  const diseaseResultPanel = document.getElementById('diseaseResultPanel');
  
  const diagnosedDisease = document.getElementById('diagnosedDisease');
  const diseaseSeverity = document.getElementById('diseaseSeverity');
  const diseaseConfidence = document.getElementById('diseaseConfidence');
  const diseaseDescription = document.getElementById('diseaseDescription');
  const diseaseRecommendation = document.getElementById('diseaseRecommendation');

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
          if (!response.ok) throw new Error('Diagnosis failed');
          return response.json();
        })
        .then(data => {
          // Switch panel displays
          if (diseaseOutputPlaceholder) diseaseOutputPlaceholder.style.display = 'none';
          if (diseaseResultPanel) diseaseResultPanel.style.display = 'flex';

          // Render pathology report
          diagnosedDisease.textContent = data.diagnosed_disease;
          diseaseSeverity.textContent = data.severity;
          diseaseSeverity.className = `status-badge ${data.severity === 'High Risk' ? 'red' : (data.severity === 'Moderate Risk' ? 'orange' : 'green')}`;
          diseaseConfidence.textContent = data.confidence;
          diseaseDescription.textContent = data.description;
          
          const recBox = diseaseResultPanel.querySelector('.ai-insights-alert-box');
          if (recBox) {
            recBox.className = `ai-insights-alert-box ${data.severity === 'High Risk' ? 'red' : (data.severity === 'Moderate Risk' ? 'red' : 'green')}`;
          }
          diseaseRecommendation.textContent = data.recommendation;

          showToastNotification(`Leaf scanning complete. Pathology: ${data.diagnosed_disease}`);
        })
        .catch(err => {
          console.error(err);
          showToastNotification('Failed to analyze leaf image.', 'warning');
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
