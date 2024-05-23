var rotationIntervalId;

// Listen for messages from the popup.js script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "startRotation") {
    // Start rotating tabs after the specified interval
    startTabRotation(request.interval);
  } else if (request.action === "stopRotation") {
    // Stop rotating tabs
    stopTabRotation();
  }
});

// Function to rotate tabs after a specified interval
function startTabRotation(interval) {
  rotationIntervalId = setInterval(function() {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      // Find the index of the currently active tab and switch to the next one
      chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
        if (activeTabs && activeTabs.length > 0 && activeTabs[0].id) {
          var currentTabId = activeTabs[0].id;
          for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].id === currentTabId) {
              var nextTabIndex = (i + 1) % tabs.length;
              chrome.tabs.update(tabs[nextTabIndex].id, { active: true });
              break;
            }
          }
        } else {
          console.log("No active tabs found.");
        }
      });
    });
  }, interval * 1000); // Convert seconds to milliseconds
}

// Function to stop rotating tabs
function stopTabRotation() {
  clearInterval(rotationIntervalId);
}


// Listen for tab switching events
chrome.tabs.onActivated.addListener(function(activeInfo) {
    if (reloadPage) {
      chrome.tabs.reload(activeInfo.tabId);
      console.log("Page reloaded");
    }
  });
  
  // Listen for changes in the reload checkbox state from the popup
  var reloadPage = false;
  
  chrome.storage.sync.get('reloadPage', function(data) {
    reloadPage = data.reloadPage || false;
  
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (changes.reloadPage) {
        reloadPage = changes.reloadPage.newValue;
      }
    });
  });
  