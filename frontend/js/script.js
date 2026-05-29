/**
 * AgroGuardian AI - Precision Agriculture Frontend Script
 * Contains: Navigation View Switching, Overview Reloading, Local Weather Lookup,
 * Leaf Image Analysis Simulator, Predictive Advisor actions, What-If Simulator Math,
 * and Interactive Chatbot dialogs.
 */

document.addEventListener('DOMContentLoaded', () => {

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
      // Simulate sync refresh
      btnReloadOverview.style.transform = 'rotate(180deg)';
      btnReloadOverview.style.transition = 'transform 0.5s ease';
      
      // Randomize values slightly to show active changes
      setTimeout(() => {
        const randTemp = (23 + Math.random() * 1).toFixed(1);
        const randHum = (65 + Math.random() * 4).toFixed(1);
        
        if (overviewTemp) overviewTemp.textContent = `${randTemp}°C`;
        if (overviewHumidity) {
          overviewHumidity.textContent = `${randHum}%`;
          const fill = overviewHumidity.parentElement.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = `${randHum}%`;
        }
        
        btnReloadOverview.style.transform = 'rotate(0deg)';
        btnReloadOverview.style.transition = 'none';
        showToastNotification('Ecosystem metrics refreshed successfully.');
      }, 500);
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

  const cityWeatherDb = {
    'hinganghat': { temp: '43.3°C', cond: 'Broken Clouds', hum: '16%', wind: '17.8 km/h', rain: 88 },
    'hyderabad': { temp: '36.8°C', cond: 'Clear Sky', hum: '28%', wind: '11.5 km/h', rain: 10 },
    'sector 4': { temp: '24.0°C', cond: 'Sunny Conditions', hum: '78%', wind: '12.0 km/h', rain: 15 },
    'mumbai': { temp: '31.2°C', cond: 'Scattered Showers', hum: '82%', wind: '22.4 km/h', rain: 95 }
  };

  function updateLocalWeather(query) {
    const normQuery = query.toLowerCase().trim();
    let data = cityWeatherDb[normQuery];
    
    // Fallback if not in registry
    if (!data) {
      data = {
        temp: `${Math.round(20 + Math.random() * 20)}°C`,
        cond: ['Overcast Clouds', 'Partly Cloudy', 'Clear Sky', 'Light Drizzle'][Math.floor(Math.random() * 4)],
        hum: `${Math.round(30 + Math.random() * 60)}%`,
        wind: `${(5 + Math.random() * 18).toFixed(1)} km/h`,
        rain: Math.round(Math.random() * 100)
      };
    }

    // Render results
    if (localWeatherTemp) localWeatherTemp.textContent = data.temp;
    if (localWeatherCondition) localWeatherCondition.textContent = data.cond;
    if (localWeatherHumidity) localWeatherHumidity.textContent = data.hum;
    if (localWeatherWind) localWeatherWind.textContent = data.wind;
    
    const rainBar = document.querySelector('#overview-view .weather-details-row .progress-bar-fill');
    const rainLabel = document.querySelector('#overview-view .weather-details-row p');
    if (rainBar) rainBar.style.width = `${data.rain}%`;
    if (rainLabel) rainLabel.textContent = `${data.rain}% Probability`;

    // Dynamic alert banner update
    const overviewAlertBanner = document.getElementById('overviewAlertBanner');
    if (overviewAlertBanner) {
      if (data.rain > 70) {
        overviewAlertBanner.className = 'ai-insights-alert-box red';
        overviewAlertBanner.querySelector('p').textContent = 'High rain probability nearby. Reduce fertilizer inputs and monitor for fungal pressure after leaf wetness.';
      } else {
        overviewAlertBanner.className = 'ai-insights-alert-box';
        overviewAlertBanner.querySelector('p').textContent = 'Stable climate indicators. Maintain default N-P-K nutrient schedules.';
      }
    }
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
      if (!leafPreview.src || leafPreview.style.display === 'none') {
        showToastNotification('Please browse or upload a leaf image first.', 'warning');
        return;
      }

      btnAnalyzeLeaf.disabled = true;
      btnAnalyzeLeaf.innerHTML = `
        <span class="material-symbols-outlined" style="animation: rotate 1s linear infinite;">sync</span>
        Analyzing leaf...
      `;

      setTimeout(() => {
        // Reset button
        btnAnalyzeLeaf.disabled = false;
        btnAnalyzeLeaf.innerHTML = `
          <span class="material-symbols-outlined">auto_awesome</span>
          Analyze Image
        `;

        // Switch panel displays
        if (diseaseOutputPlaceholder) diseaseOutputPlaceholder.style.display = 'none';
        if (diseaseResultPanel) diseaseResultPanel.style.display = 'flex';

        // Select pseudo random crop pathology output
        const pathologies = [
          {
            name: 'Downy Mildew',
            sev: 'High Risk',
            conf: '92.4%',
            desc: 'Yellowish-green leaf spots forming fuzzy white spores on leaf undersides, common in high relative humidity.',
            rec: 'Action required: Suspend fertilization schedule and apply copper-based fungicide patches immediately.'
          },
          {
            name: 'Healthy Crop Leaf',
            sev: 'No Risk',
            conf: '98.1%',
            desc: 'Leaf cells show robust chlorophyll content and optimal stomatal conductance. No symptoms of biotic stress.',
            rec: 'No action required. Maintain current automated biological cycles.'
          },
          {
            name: 'Early Blight',
            sev: 'Moderate Risk',
            conf: '84.6%',
            desc: 'Concentric brown target-like leaf lesions on older vegetation. May indicate local nitrogen/calcium deficiency.',
            rec: 'Action recommended: Increase soil bio-organic additives and prune affected lower canopy leaves.'
          }
        ];

        const selection = pathologies[Math.floor(Math.random() * pathologies.length)];

        // Render pathology report
        diagnosedDisease.textContent = selection.name;
        diseaseSeverity.textContent = selection.sev;
        diseaseSeverity.className = `status-badge ${selection.sev === 'High Risk' ? 'red' : (selection.sev === 'Moderate Risk' ? 'orange' : 'green')}`;
        diseaseConfidence.textContent = selection.conf;
        diseaseDescription.textContent = selection.desc;
        
        const recBox = diseaseResultPanel.querySelector('.ai-insights-alert-box');
        recBox.className = `ai-insights-alert-box ${selection.sev === 'High Risk' ? 'red' : (selection.sev === 'Moderate Risk' ? 'red' : 'green')}`;
        diseaseRecommendation.textContent = selection.rec;

        showToastNotification(`Leaf scanning complete. Pathology: ${selection.name}`);
      }, 1500);
    });
  }


  // ==========================================================================
  // 5. Smart Nutrient Advisor actions (Weather Forecast View)
  // ==========================================================================
  const btnSuspendSchedule = document.getElementById('btnSuspendSchedule');
  const btnOverrideSchedule = document.getElementById('btnOverrideSchedule');

  if (btnSuspendSchedule) {
    btnSuspendSchedule.addEventListener('click', () => {
      btnSuspendSchedule.disabled = true;
      btnSuspendSchedule.textContent = 'Suspended';
      btnSuspendSchedule.style.backgroundColor = '#e5e7eb';
      btnSuspendSchedule.style.color = 'var(--muted-text)';
      showToastNotification('Smart Nutrient Advisor schedule suspended for next 36h.');
    });
  }

  if (btnOverrideSchedule) {
    btnOverrideSchedule.addEventListener('click', () => {
      showToastNotification('Ecosystem schedule overridden. Proceeding with standard cycle.');
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

    // Calculate crop health stability (circumference 264)
    // Dynamic offsets matching user images (default should equal exactly 74%)
    let stability = Math.round(74 + (ph - 6.0) * 12 + (feed - 37) * 0.4 - Math.abs(temp - 24) * 1.5);
    stability = Math.max(10, Math.min(100, stability));

    const arcCircumference = 264;
    const arcOffset = arcCircumference - (arcCircumference * stability) / 100;
    simStabilityFill.style.strokeDashoffset = arcOffset;
    simStabilityText.textContent = `${stability}%`;

    // Sustainability score (default: 68/100)
    let sustainability = Math.round(68 - (feed - 37) * 0.45 + (ph - 6.0) * 8 - Math.abs(temp - 24) * 0.8);
    sustainability = Math.max(5, Math.min(100, sustainability));
    simSustainabilityVal.textContent = sustainability;
    simSustainabilityBar.style.width = `${sustainability}%`;

    // Nutrient Absorption / Water Efficiency (default: 63%)
    let absorption = Math.round(63 + (feed - 37) * 0.25 - (ph - 6.0) * 14 - (temp - 24) * 0.7);
    absorption = Math.max(0, Math.min(100, absorption));
    simWaterEfficiencyText.textContent = `${absorption}%`;
    simWaterEfficiencyBar.style.width = `${absorption}%`;

    // Disease Risk (default: 34%)
    let risk = Math.round(34 + Math.abs(temp - 24) * 1.8 + (feed - 37) * 0.15 - (ph - 6.0) * 10);
    risk = Math.max(0, Math.min(100, risk));
    simDiseaseRiskText.textContent = `${risk}%`;
    simDiseaseRiskBar.style.width = `${risk}%`;
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

  // Automated chatbot response generation
  function getBotReply(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('disease') || lowerMsg.includes('pathology') || lowerMsg.includes('mildew')) {
      return 'Our neural network risk models check leaf humidity & temperatures to forecast spore spikes. For Downy Mildew, keep fertilizer inputs low and apply copper-based fungicides.';
    }
    if (lowerMsg.includes('soil') || lowerMsg.includes('nutrient') || lowerMsg.includes('nitrogen') || lowerMsg.includes('ph')) {
      return 'Ecosystem Alpha operates at an optimal pH range of 6.2 - 6.8. If soil stress spikes, nitrogen levels must be calibrated immediately using automated smart schedules.';
    }
    if (lowerMsg.includes('weather') || lowerMsg.includes('forecast') || lowerMsg.includes('rain')) {
      return 'Rainfall can cause nutrient runoff. Our Predictive Analysis tab calculates whether to suspend or execute scheduled fertilization intervals based on upcoming precipitation.';
    }
    if (lowerMsg.includes('status') || lowerMsg.includes('alive')) {
      return 'All sensor nodes are currently synced and operational in Sector 4 Alpha. Overall soil quality is stable at 100/100.';
    }
    
    return "I am here to assist with AgroGuardian telemetry. Tell me if you'd like to diagnose a leaf disease, simulate soil conditions, or check regional climate analysis.";
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

    // 2. Add typing delay response
    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-message-bubble bot';
      botBubble.textContent = getBotReply(text);
      containerEl.appendChild(botBubble);
      containerEl.scrollTop = containerEl.scrollHeight;
    }, 800);
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
      toast.style.border = '1px solid rgba(245, 158, 11, 0.2)';
    } else {
      toast.style.backgroundColor = '#ffffff';
      toast.style.color = 'var(--primary-text)';
      toast.style.border = '1px solid var(--outline)';
      toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
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
