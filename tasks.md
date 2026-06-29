# Momentum-Style Personal Productivity Chrome Extension - Task List

This document breaks down the PRD into atomic, phase-based tasks with clear dependencies.

## Phase 1: Foundation & Personalized Dashboard
**Goal:** Replace Chrome's New Tab with a functional, personalized dashboard featuring a clock, greeting, and daily focus.

### 1.1 Project Initialization
- [x] Create `manifest.json` (Manifest V3) with required permissions (`storage`, `tabs`).
- [x] Set up basic file structure: `index.html`, `styles.css`, `script.js`.
- [x] Configure `chrome_url_overrides` in `manifest.json` to replace the New Tab page with `index.html`.
- [x] Load unpacked extension in Chrome for local development.

### 1.2 Core UI Layout & Styling
*Dependency: 1.1 Project Initialization*
- [x] Create HTML structure in `index.html` for centered dashboard elements.
- [x] Add a default full-screen wallpaper image to the project.
- [x] Apply CSS to make the wallpaper cover the screen and be responsive.
- [x] Add a dark overlay (`rgba(0,0,0,0.35)`) over the background.
- [x] Apply minimal, glassmorphism CSS styling and white typography.

### 1.3 First Install & Onboarding Flow
*Dependency: 1.2 Core UI Layout & Styling*
- [x] On `index.html` load, check `chrome.storage.local` for the user's `name`.
- [x] If no `name` exists, render an onboarding prompt ("What should I call you?").
- [x] Handle input submission (Enter key) to save the entered name to `chrome.storage.local`.
- [x] Hide the onboarding prompt and display the main dashboard once the name is saved.

### 1.4 Live Clock & Personalized Greeting
*Dependency: 1.3 First Install & Onboarding Flow*
- [x] Create a JavaScript function to get the current time and display it in 24-hour format.
- [x] Set an interval to update the clock DOM element every second.
- [x] Create a greeting function that determines the time of day (Morning: 5 AM–11:59 AM, Afternoon: 12 PM–5 PM, Evening: 6 PM–4:59 AM).
- [x] Fetch the user's name from storage and combine it with the time of day (e.g., "Good Morning, John").
- [x] Display the personalized greeting above the clock.

### 1.5 Daily Focus Prompt
*Dependency: 1.4 Live Clock & Personalized Greeting*
- [x] On load, check storage for `focus.text` and `focus.date`.
- [x] Compare `focus.date` with today's date (`YYYY-MM-DD`).
- [x] If no focus exists or the date is not today, display the prompt: "What is your main focus today?".
- [x] Handle focus input submission (Enter key) and validate it is not empty.
- [x] Save the entered focus text and today's date to `chrome.storage.local`.
- [x] Update the UI to replace the prompt with "Today's Focus: [Focus text]".

---

## Phase 2: Lightweight Task Manager
**Goal:** Implement a simple to-do list below the focus section that persists locally.

### 2.1 Task Manager UI Construction
*Dependency: 1.5 Daily Focus Prompt*
- [x] Create HTML structure for the task section below the daily focus area.
- [x] Add an input field for "Add Task".
- [x] Create an empty container (`<ul>` or `<div>`) to hold the task list items.

### 2.2 Add & Render Tasks
*Dependency: 2.1 Task Manager UI Construction*
- [x] Listen for the "Enter" key on the "Add Task" input.
- [x] Validate that the task input is not empty.
- [x] Fetch the current `tasks` array from storage (or initialize an empty array).
- [x] Create a new task object (`{ id: Date.now(), text: "...", completed: false }`).
- [x] Append the new task to the array, save to storage, and clear the input field.
- [x] Create a render function that reads `tasks` from storage and generates DOM elements (checkbox, text, delete icon) for each task.
- [x] Ensure the render function runs on initial page load.

### 2.3 Complete Task Functionality
*Dependency: 2.2 Add & Render Tasks*
- [x] Add event listeners to task checkboxes.
- [x] On toggle, find the corresponding task in the storage array by `id` and update its `completed` boolean.
- [x] Save the updated array to storage.
- [x] Update the render function to move completed tasks to the bottom of the list.
- [x] Apply CSS styles (strike-through text, reduced opacity) to completed tasks in the DOM.

### 2.4 Delete Task Functionality
*Dependency: 2.2 Add & Render Tasks*
- [x] Add event listeners to the delete (trash) icons on each task.
- [x] On click, remove the corresponding task from the storage array by `id`.
- [x] Save the updated array to storage.
- [x] Immediately remove the task element from the DOM (or re-render the list).

---

## Phase 3: Focus Mode (Website Blocker)
**Goal:** Reduce distractions by redirecting predefined websites to a custom "blocked" page when Focus Mode is active.

### 3.1 Extension Configuration for Blocking
*Dependency: Phase 2*
- [x] Add `declarativeNetRequest` and `declarativeNetRequestWithHostAccess` permissions to `manifest.json`.
- [x] Set up a background script (`background.js`) to handle dynamic rule updates.

### 3.2 Focus Mode UI Toggle
*Dependency: 3.1 Extension Configuration for Blocking*
- [x] Add a toggle switch UI element near the top-right of the dashboard.
- [x] On load, read `focusMode` boolean state from storage and set the toggle UI accordingly.
- [x] Add an event listener to the toggle to update `chrome.storage.local` (`focusMode: true/false`).

### 3.3 Dynamic Website Redirection Logic
*Dependency: 3.2 Focus Mode UI Toggle*
- [x] Define the default array of blocked websites (instagram.com, youtube.com, etc.) in storage on initial install.
- [x] In the background script, listen for changes to `focusMode` and `blockedSites` in storage.
- [x] When `focusMode` is ON, generate and apply dynamic `declarativeNetRequest` rules to redirect the domains in `blockedSites` to a local `blocked.html` file.
- [x] When `focusMode` is OFF, clear the dynamic `declarativeNetRequest` rules.

### 3.4 Custom Blocked Page
*Dependency: 3.3 Dynamic Website Redirection Logic*
- [x] Create `blocked.html` and `blocked.js` in the extension directory.
- [x] Build the UI for `blocked.html` (Centered, large typography: "Stay Focused").
- [x] In `blocked.js`, read `focus.text` from storage and display "Today's Focus: [Focus text]".
- [x] Implement a "Go Back" button that calls `window.history.back()`.
- [x] Implement a "Disable Focus Mode" button that updates `focusMode: false` in storage and either redirects to the dashboard or closes the tab.

---

## Phase 4: Settings & Customization
**Goal:** Allow users to personalize their name, wallpaper, blocked sites, and reset data.

### 4.1 Settings Modal UI
*Dependency: Phase 3*
- [x] Add a Settings gear icon (`⚙`) to the bottom-right or top-right of the dashboard.
- [x] Create a modal overlay HTML structure for the settings panel.
- [x] Implement open/close logic for the modal.

### 4.2 Section 1: Name Editing
*Dependency: 4.1 Settings Modal UI*
- [x] Create an editable text input in the settings modal, populated with the user's current name from storage.
- [x] Add a "Save" button to update the `name` in storage.
- [x] Ensure the dashboard greeting updates immediately upon saving.

### 4.3 Section 2: Custom Wallpaper Upload
*Dependency: 4.1 Settings Modal UI*
- [x] Add a file input element (`<input type="file" accept="image/*">`) in the settings modal.
- [x] Handle the file upload event, read the file using `FileReader`, and convert it to a Base64 string.
- [x] Handle potential upload errors (e.g., file too large) by showing a toast notification.
- [x] Save the Base64 string to `chrome.storage.local` under the `wallpaper` key.
- [x] Update the dashboard background image dynamically when a new wallpaper is saved.
- [x] Update dashboard initialization logic to load the custom wallpaper if it exists, falling back to the default.

### 4.4 Section 3: Block List Editor
*Dependency: 4.1 Settings Modal UI*
- [x] Fetch the current `blockedSites` array from storage and render it as a list in the settings modal.
- [x] Add an input field and "Add domain" button to append new sites to the list (prevent duplicates).
- [x] Add a delete icon next to each domain to remove it from the list.
- [x] Add a "Restore defaults" button that resets the list to the default array.
- [x] Ensure any changes to the list immediately update `chrome.storage.local`, triggering the background script to update the active blocking rules if Focus Mode is ON.

### 4.5 Section 4: Danger Zone (Reset)
*Dependency: 4.1 Settings Modal UI*
- [x] Add a "Reset everything" button in a "Danger Zone" section of the settings modal.
- [x] Implement a confirmation dialog (e.g., `window.confirm`) when clicked.
- [x] If confirmed, execute `chrome.storage.local.clear()`.
- [x] Reload the dashboard (`window.location.reload()`) to trigger the First Install flow again.
