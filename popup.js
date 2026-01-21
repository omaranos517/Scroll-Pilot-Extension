// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
    // Load settings from storage
    const settings = await chrome.storage.sync.get({
        showTopButton: true,
        showBottomButton: true,
        showProgressRing: true,
        showTooltips: true,
        customScrollEnabled: false,
        topScrollPosition: 0,
        bottomScrollPosition: 100,
        scrollType: 'percentage',
        smoothScrolling: true,
        enableShortcuts: true
    });
    
    // Set checkbox values
    document.getElementById('showTopButton').checked = settings.showTopButton;
    document.getElementById('showBottomButton').checked = settings.showBottomButton;
    document.getElementById('showProgressRing').checked = settings.showProgressRing;
    document.getElementById('showTooltips').checked = settings.showTooltips;
    document.getElementById('customScrollEnabled').checked = settings.customScrollEnabled;
    document.getElementById('topScrollPosition').value = settings.topScrollPosition;
    document.getElementById('bottomScrollPosition').value = settings.bottomScrollPosition;
    document.getElementById('smoothScrolling').checked = settings.smoothScrolling;
    document.getElementById('enableShortcuts').checked = settings.enableShortcuts;
    
    // Show/hide custom scroll settings
    toggleCustomScrollSettings(settings.customScrollEnabled);
    
    // Set active scroll type
    setActiveScrollType(settings.scrollType);
    
    // Add event listeners
    document.getElementById('customScrollEnabled').addEventListener('change', (e) => {
        toggleCustomScrollSettings(e.target.checked);
    });
    
    // Scroll type selection
    document.querySelectorAll('.scroll-option').forEach(option => {
        option.addEventListener('click', () => {
            setActiveScrollType(option.dataset.type);
        });
    });
    
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
});

function toggleCustomScrollSettings(show) {
    const settingsDiv = document.getElementById('customScrollSettings');
    settingsDiv.style.display = show ? 'block' : 'none';
}

function setActiveScrollType(type) {
    document.querySelectorAll('.scroll-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.type === type) {
            option.classList.add('active');
        }
    });
}

async function saveSettings() {
  try {
    const settings = {
      showTopButton: document.getElementById('showTopButton').checked,
      showBottomButton: document.getElementById('showBottomButton').checked,
      showProgressRing: document.getElementById('showProgressRing').checked,
      showTooltips: document.getElementById('showTooltips').checked,
      customScrollEnabled: document.getElementById('customScrollEnabled').checked,
      topScrollPosition: parseInt(document.getElementById('topScrollPosition').value) || 0,
      bottomScrollPosition: parseInt(document.getElementById('bottomScrollPosition').value) || 100,
      scrollType: document.querySelector('.scroll-option.active').dataset.type,
      smoothScrolling: document.getElementById('smoothScrolling').checked,
      enableShortcuts: document.getElementById('enableShortcuts').checked
    };
    
    // Validate inputs
    if (settings.customScrollEnabled) {
      if (settings.scrollType === 'percentage') {
        if (settings.topScrollPosition < 0 || settings.topScrollPosition > 100) {
          showStatus('Top scroll position must be between 0 and 100%', 'error');
          return;
        }
        if (settings.bottomScrollPosition < 0 || settings.bottomScrollPosition > 100) {
          showStatus('Bottom scroll position must be between 0 and 100%', 'error');
          return;
        }
      } else {
        if (settings.topScrollPosition < 0) {
          showStatus('Top scroll position cannot be negative', 'error');
          return;
        }
        if (settings.bottomScrollPosition < 0) {
          showStatus('Bottom scroll position cannot be negative', 'error');
          return;
        }
      }
    }
    
    // Save to storage
    try {
      await chrome.storage.sync.set(settings);
    } catch (storageError) {
      // Fallback to localStorage
      localStorage.setItem('modernScrollButtonsSettings', JSON.stringify(settings));
    }
    
    // Send message to content script to update
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: settings
        }).catch(() => {
          // If message fails, it might be because content script isn't loaded yet
          // This is okay, settings will be loaded on next page load
        });
      }
    } catch (messageError) {
      console.log('Could not send message to content script:', messageError);
    }
    
    showStatus('Settings saved successfully!', 'success');
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      window.close();
    }, 2000);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}