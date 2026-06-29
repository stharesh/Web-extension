const DEFAULT_BLOCKED_SITES = [
  "instagram.com",
  "youtube.com",
  "facebook.com",
  "linkedin.com",
  "reddit.com",
  "x.com",
  "twitter.com"
];

// Initialize storage defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['focusMode', 'blockedSites'], (result) => {
    const dataToSet = {};
    if (result.focusMode === undefined) {
      dataToSet.focusMode = false;
    }
    if (!result.blockedSites) {
      dataToSet.blockedSites = DEFAULT_BLOCKED_SITES;
    }
    
    if (Object.keys(dataToSet).length > 0) {
      chrome.storage.local.set(dataToSet, () => {
        updateBlockingRules(dataToSet.focusMode !== undefined ? dataToSet.focusMode : result.focusMode, 
                           dataToSet.blockedSites || result.blockedSites);
      });
    } else {
      updateBlockingRules(result.focusMode, result.blockedSites);
    }
  });
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && (changes.focusMode || changes.blockedSites)) {
    chrome.storage.local.get(['focusMode', 'blockedSites'], (result) => {
      updateBlockingRules(result.focusMode, result.blockedSites);
    });
  }
});

function updateBlockingRules(isFocusModeOn, blockedSites) {
  if (!isFocusModeOn || !blockedSites || blockedSites.length === 0) {
    // Clear all rules
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      const ruleIds = rules.map(rule => rule.id);
      if (ruleIds.length > 0) {
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: ruleIds
        });
      }
    });
    return;
  }

  // Generate rules
  const rules = blockedSites.map((domain, index) => {
    return {
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          extensionPath: "/blocked.html"
        }
      },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: ["main_frame"]
      }
    };
  });

  // Remove existing and add new
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    const ruleIds = existingRules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds,
      addRules: rules
    });
  });
}
