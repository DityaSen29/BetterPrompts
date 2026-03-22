document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // 1. Load the existing key when the page opens
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // 2. Save the key when the button is clicked
  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    
    if (!key) {
      alert("Please enter a valid API key.");
      return;
    }

    chrome.storage.local.set({ geminiApiKey: key }, () => {
      // Show success message briefly
      status.classList.add('show');
      setTimeout(() => {
        status.classList.remove('show');
      }, 2000);
    });
  });
});