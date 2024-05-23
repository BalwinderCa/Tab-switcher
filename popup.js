document.addEventListener('DOMContentLoaded', function() {
  var runButton = document.getElementById('runBtn');
  var stopButton = document.getElementById('stopBtn');
  var reloadCheckbox = document.getElementById('reloadCheckbox');

  // Function to update button text based on rotation status
  function updateButtonText(running) {
    if (running) {
      runButton.innerText = 'Running';
      stopButton.innerText = 'Stop';
    } else {
      runButton.innerText = 'Run';
      stopButton.innerText = 'Stopped';
    }
  }

  // Retrieve rotation status from local storage
  chrome.storage.local.get('rotationStatus', function(data) {
    var rotationStatus = data.rotationStatus;
    console.log("Retrieved rotation status:", rotationStatus);
    updateButtonText(rotationStatus === 'running');
  });

  runButton.addEventListener('click', function() {
    var interval = document.getElementById('interval').value;
    var reloadPage = reloadCheckbox.checked; // Get the checked state of the reload checkbox
    chrome.storage.local.set({ 'rotationInterval': interval, 'reloadPage': reloadPage, 'rotationStatus': 'running' }, function() {
      console.log('Interval saved: ' + interval);
      console.log('Reload page option saved: ' + reloadPage);
      // Send a message to background.js to start the rotation timer
      chrome.runtime.sendMessage({ action: "startRotation", interval: interval });
    });
    // Update button text to indicate running
    updateButtonText(true);
  });

  stopButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "stopRotation" });
    // Update button text to indicate stopped
    updateButtonText(false);
    // Save rotation status to local storage
    chrome.storage.local.set({ 'rotationStatus': 'stopped' });
  });

  // Listen for checkbox state changes and update the stored value
  reloadCheckbox.addEventListener('change', function() {
    var reloadPage = reloadCheckbox.checked;
    chrome.storage.local.set({ 'reloadPage': reloadPage }, function() {
      console.log('Reload page option saved: ' + reloadPage);
    });
  });
});
