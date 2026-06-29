document.addEventListener('DOMContentLoaded', () => {
  const focusTextEl = document.getElementById('blocked-focus-text');
  const btnBack = document.getElementById('btn-back');
  const btnDisable = document.getElementById('btn-disable');

  // Load today's focus
  chrome.storage.local.get(['focus'], (result) => {
    const today = new Date().toISOString().split('T')[0];
    if (result.focus && result.focus.date === today && result.focus.text) {
      focusTextEl.textContent = result.focus.text;
    }
  });

  // Event Listeners
  btnBack.addEventListener('click', () => {
    // Attempt to go back in history. If no history, maybe just close tab.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close(); // might not work depending on how tab was opened, but worth a try
    }
  });

  btnDisable.addEventListener('click', () => {
    chrome.storage.local.set({ focusMode: false }, () => {
      // Go back to the page the user originally requested
      // The background script automatically removes rules, so a reload usually works.
      window.history.back();
      setTimeout(() => {
        // Fallback: If history.back didn't navigate, reload the current url to see if it unblocks
        // But since this IS the blocked.html page, we can't easily get the original URL in V3. 
        // We'll try history back or close tab.
        window.close();
      }, 500);
    });
  });
});
