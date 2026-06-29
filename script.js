document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const onboardingEl = document.getElementById('onboarding');
  const dashboardEl = document.getElementById('dashboard');
  const nameInput = document.getElementById('name-input');
  
  const greetingEl = document.getElementById('greeting');
  const clockEl = document.getElementById('clock');
  
  const focusPromptEl = document.getElementById('focus-prompt');
  const focusDisplayEl = document.getElementById('focus-display');
  const focusInput = document.getElementById('focus-input');
  const focusTextEl = document.getElementById('focus-text');
  const clearFocusBtn = document.getElementById('clear-focus');

  const taskInput = document.getElementById('task-input');
  const taskListEl = document.getElementById('task-list');

  const focusModeToggle = document.getElementById('focus-mode-toggle');

  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const settingsNameInput = document.getElementById('settings-name-input');
  const saveNameBtn = document.getElementById('save-name-btn');
  
  const wallpaperUpload = document.getElementById('wallpaper-upload');
  const clearWallpaperBtn = document.getElementById('clear-wallpaper-btn');
  const uploadToast = document.getElementById('upload-toast');
  const bgContainer = document.getElementById('background-container');
  
  const blockDomainInput = document.getElementById('block-domain-input');
  const addDomainBtn = document.getElementById('add-domain-btn');
  const blockListEl = document.getElementById('settings-block-list');
  const restoreDefaultsBtn = document.getElementById('restore-defaults-btn');
  
  const resetAllBtn = document.getElementById('reset-all-btn');

  // State
  let clockInterval;
  let tasks = [];
  let blockedSites = [];
  const DEFAULT_BLOCKED_SITES = [
    "instagram.com", "youtube.com", "facebook.com", 
    "linkedin.com", "reddit.com", "x.com", "twitter.com"
  ];

  // Initialization
  function init() {
    chrome.storage.local.get(['name', 'focus', 'tasks', 'focusMode', 'wallpaper', 'blockedSites'], (result) => {
      if (result.tasks) {
        tasks = result.tasks;
      }
      if (result.focusMode !== undefined) {
        focusModeToggle.checked = result.focusMode;
      }
      if (result.wallpaper) {
        bgContainer.style.backgroundImage = `url(${result.wallpaper})`;
      }
      blockedSites = result.blockedSites || DEFAULT_BLOCKED_SITES;

      if (!result.name) {
        showOnboarding();
      } else {
        showDashboard(result.name, result.focus);
      }
    });
  }

  // --- Onboarding ---
  function showOnboarding() {
    onboardingEl.classList.remove('hidden');
    dashboardEl.classList.add('hidden');
    nameInput.focus();
  }

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = nameInput.value.trim();
      if (name) {
        chrome.storage.local.set({ name: name }, () => {
          onboardingEl.classList.add('hidden');
          init();
        });
      }
    }
  });

  // --- Dashboard ---
  function showDashboard(name, focus) {
    onboardingEl.classList.add('hidden');
    dashboardEl.classList.remove('hidden');
    
    updateClockAndGreeting(name);
    renderTasks();
    
    // Clear existing interval if any
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(() => updateClockAndGreeting(name), 1000);
    
    handleFocus(focus);
  }

  // --- Clock & Greeting ---
  function updateClockAndGreeting(name) {
    const now = new Date();
    
    // Time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
    
    // Greeting
    let timeOfDay = 'Evening';
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'Morning';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'Afternoon';
    }
    
    greetingEl.textContent = `Good ${timeOfDay}, ${name}.`;
  }

  // --- Daily Focus ---
  function handleFocus(focusObj) {
    const today = new Date().toISOString().split('T')[0];
    
    if (focusObj && focusObj.date === today && focusObj.text) {
      // Focus exists for today
      focusPromptEl.classList.add('hidden');
      focusDisplayEl.classList.remove('hidden');
      focusTextEl.textContent = focusObj.text;
    } else {
      // No focus or old focus
      focusPromptEl.classList.remove('hidden');
      focusDisplayEl.classList.add('hidden');
      focusInput.value = '';
      setTimeout(() => focusInput.focus(), 100);
    }
  }

  focusInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = focusInput.value.trim();
      if (text) {
        const today = new Date().toISOString().split('T')[0];
        const focusData = { text: text, date: today };
        
        chrome.storage.local.set({ focus: focusData }, () => {
          handleFocus(focusData);
        });
      }
    }
  });
  
  clearFocusBtn.addEventListener('click', () => {
    chrome.storage.local.remove('focus', () => {
      handleFocus(null);
    });
  });

  // --- Task Manager ---
  function renderTasks() {
    taskListEl.innerHTML = '';
    
    // Sort tasks: uncompleted first, completed last
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(task.id));
      
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;
      
      const delBtn = document.createElement('button');
      delBtn.className = 'task-delete';
      delBtn.innerHTML = '&#10005;'; // '✕'
      delBtn.title = 'Delete Task';
      delBtn.addEventListener('click', () => deleteTask(task.id));
      
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      
      taskListEl.appendChild(li);
    });
  }

  function saveTasks() {
    chrome.storage.local.set({ tasks: tasks }, renderTasks);
  }

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = taskInput.value.trim();
      if (text) {
        const newTask = {
          id: Date.now(),
          text: text,
          completed: false
        };
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
      }
    }
  });

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  }

  // --- Focus Mode Toggle ---
  focusModeToggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ focusMode: e.target.checked });
  });

  // --- Settings ---
  settingsBtn.addEventListener('click', () => {
    chrome.storage.local.get(['name', 'blockedSites'], (result) => {
      settingsNameInput.value = result.name || '';
      blockedSites = result.blockedSites || DEFAULT_BLOCKED_SITES;
      renderBlockList();
      settingsModal.classList.remove('hidden');
    });
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  // Name
  saveNameBtn.addEventListener('click', () => {
    const newName = settingsNameInput.value.trim();
    if (newName) {
      chrome.storage.local.set({ name: newName }, () => {
        updateClockAndGreeting(newName);
        settingsModal.classList.add('hidden');
      });
    }
  });

  // Wallpaper
  wallpaperUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      uploadToast.textContent = 'File too large. Max 5MB.';
      uploadToast.classList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      chrome.storage.local.set({ wallpaper: base64 }, () => {
        bgContainer.style.backgroundImage = `url(${base64})`;
        uploadToast.classList.add('hidden');
      });
    };
    reader.onerror = () => {
      uploadToast.textContent = 'Unable to upload image.';
      uploadToast.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  clearWallpaperBtn.addEventListener('click', () => {
    chrome.storage.local.remove('wallpaper', () => {
      bgContainer.style.backgroundImage = "url('images/default_wallpaper.png')";
      wallpaperUpload.value = '';
    });
  });

  // Blocked Websites
  function renderBlockList() {
    blockListEl.innerHTML = '';
    blockedSites.forEach(domain => {
      const li = document.createElement('li');
      li.textContent = domain;
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-domain-btn';
      delBtn.innerHTML = '&#10005;';
      delBtn.addEventListener('click', () => {
        blockedSites = blockedSites.filter(d => d !== domain);
        chrome.storage.local.set({ blockedSites }, renderBlockList);
      });
      li.appendChild(delBtn);
      blockListEl.appendChild(li);
    });
  }

  addDomainBtn.addEventListener('click', () => {
    let domain = blockDomainInput.value.trim().toLowerCase();
    if (domain) {
      try {
        domain = new URL(domain.startsWith('http') ? domain : `https://${domain}`).hostname;
      } catch (e) {}
      domain = domain.replace(/^www\./, '');
      
      if (!blockedSites.includes(domain)) {
        blockedSites.push(domain);
        chrome.storage.local.set({ blockedSites }, () => {
          renderBlockList();
          blockDomainInput.value = '';
        });
      }
    }
  });

  restoreDefaultsBtn.addEventListener('click', () => {
    blockedSites = [...DEFAULT_BLOCKED_SITES];
    chrome.storage.local.set({ blockedSites }, renderBlockList);
  });

  // Danger Zone
  resetAllBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset everything? This cannot be undone.")) {
      chrome.storage.local.clear(() => {
        window.location.reload();
      });
    }
  });

  // Start app
  init();
});
