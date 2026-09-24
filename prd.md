# PRD: Daily Focus Dashboard Chrome Extension

# Version

v1.0

# Status

Ready for Development

---

# Project Overview

## TL;DR

Build a Chrome Extension that replaces Chrome's default New Tab page with a beautiful personal productivity dashboard.

The extension should help users begin every browsing session with intention instead of distraction.

Core features include:

* Beautiful full-screen wallpaper
* Personalized greeting
* Live clock
* Daily Focus prompt
* Lightweight task manager
* Website blocker (Focus Mode)
* Settings panel
* Persistent local storage
* Zero login required

Everything should work completely offline using Chrome Extension APIs and local storage.

---

# Problem Statement

Every time a user opens a new browser tab they are immediately exposed to distractions.

The browser provides no intentional starting point for productive work.

The goal is to transform every new tab into a calm workspace that reminds users what matters today while helping them avoid distracting websites.

---

# Vision

Imagine opening Chrome every morning and instead of endless recommendations, news, YouTube thumbnails, or social media...

You see:

* A beautiful background
* Your name
* The current time
* One simple question:

> "What is your main focus today?"

You write one thing.

For the rest of the day every new tab quietly reminds you of that commitment.

When Focus Mode is enabled, distracting websites disappear and are replaced with a simple reminder of your goal.

The extension becomes your personal productivity companion.

---

# Goals

## Business Goals

* Build an MVP suitable for publishing on the Chrome Web Store.
* Deliver a polished user experience with minimal configuration.
* Create a strong foundation for future premium features.

---

## User Goals

Users should be able to:

* Feel calm when opening a new tab.
* Stay focused on one primary goal.
* Capture simple tasks.
* Block distracting websites.
* Personalize the experience.

---

## Non Goals

Version 1 will NOT include:

* Cloud sync
* User accounts
* Team collaboration
* Pomodoro timer
* Calendar integrations
* AI assistant
* Notes
* Habit tracker
* Mobile support

---

# Users

Primary users:

* Students
* Developers
* Designers
* Founders
* Remote workers
* Anyone who spends significant time in Chrome

---

# Technical Stack

Chrome Extension Manifest V3

Frontend

* HTML
* CSS
* Vanilla JavaScript

Storage

* chrome.storage.local

Permissions

* storage
* tabs
* declarativeNetRequest
* scripting

Optional later

* alarms
* notifications

---

# Overall User Flow

## First Install

User installs extension.

↓

Opens New Tab.

↓

Extension asks:

"What should I call you?"

↓

User enters name.

↓

Prompt to upload wallpaper.

↓

Dashboard appears.

↓

Prompt:

"What is your main focus today?"

↓

User types focus.

↓

Done.

---

Every new tab shows:

Wallpaper

Greeting

Clock

Daily Focus

Tasks

Settings

---

# PHASE 1

## Personalized Dashboard

---

## Goal

Replace Chrome's New Tab.

---

## Functional Requirements

### Full Screen Wallpaper

Default wallpaper included.

User can upload image.

Requirements

* Cover entire screen
* Responsive
* Stored locally
* Remember after browser restart

---

### Greeting

Display

Good Morning, John

Good Afternoon, John

Good Evening, John

Time ranges

Morning

5 AM–11:59 AM

Afternoon

12 PM–5 PM

Evening

6 PM–4:59 AM

Name editable later.

---

### Live Clock

Display

09:42

24-hour format initially.

Updates every second.

Centered.

Large typography.

---

### Daily Focus

Morning prompt:

"What is your main focus today?"

Only ask once per calendar day.

When entered:

Replace prompt with

Today's Focus

Finish Landing Page

Visible all day.

Automatically resets next calendar day.

Implementation

Store

```json
{
    "focus": "Finish Landing Page",
    "date": "2026-06-29"
}
```

If stored date != today

Prompt again.

---

# Acceptance Criteria

* New Tab replaced
* Wallpaper displayed
* Greeting works
* Clock updates live
* Focus persists
* Focus resets next day

---

# PHASE 2

# Task List

---

## Goal

Simple lightweight task management.

---

## UI

Below focus section.

Input

* Add Task

Task list underneath.

Each row contains

Checkbox

Task text

Delete icon

---

## Functional Requirements

### Add Task

Press Enter

or

Click Add

Task appears instantly.

---

### Complete Task

Checkbox

Completed tasks

* move to bottom
* strike-through text
* reduced opacity

---

### Delete Task

Trash icon.

Immediately removed.

---

### Storage

```json
tasks:[
{
id:1,
text:"Finish PRD",
completed:false
}
]
```

Persist locally.

---

# Acceptance Criteria

Tasks survive browser restart.

---

# PHASE 3

# Focus Mode

---

## Goal

Reduce distractions.

---

## Toggle

Located near top-right.

States

OFF

ON

Persist state.

---

## Blocked Websites

Default

instagram.com

youtube.com

facebook.com

linkedin.com

reddit.com

x.com

twitter.com

User editable.

---

## Behavior

When Focus Mode ON

Visiting blocked websites should NOT show browser error.

Instead show custom page.

---

Custom Page

Centered.

Large typography.

Example

Stay Focused

Today's Focus

Finish Landing Page

Buttons

Go Back

Disable Focus Mode

---

Implementation

Chrome Declarative Net Request

Redirect matching URLs

↓

blocked.html

blocked.html loads today's focus from storage.

---

# Acceptance Criteria

Blocked websites redirect correctly.

Disable button updates storage.

---

# PHASE 4

# Settings

---

Settings icon

Top right.

Opens modal.

---

## Section 1

Name

Editable text input.

Save.

---

## Section 2

Wallpaper

Upload new image.

Preview.

Replace old.

---

## Section 3

Blocked Websites

Editable list.

Features

Add domain

Delete domain

Restore defaults

---

## Section 4

Danger Zone

Reset everything.

Confirmation dialog.

---

# Acceptance Criteria

Changes immediately reflected.

---

# Data Model

```javascript
{
name:"John",

wallpaper:"base64-image",

focus:{
text:"Finish Landing Page",
date:"2026-06-29"
},

tasks:[
{
id:123,
text:"Design homepage",
completed:false
}
],

focusMode:true,

blockedSites:[
"instagram.com",
"youtube.com",
"linkedin.com"
]
}
```

---

# UI Layout

```
-------------------------------------------------

              Greeting

              Live Clock

      What is your focus today?

         Finish Landing Page

--------------------------------------

Tasks

[ ] Finish wireframes

[x] Deploy website

[ ] Email client

--------------------------------------

                 ⚙

-------------------------------------------------
```

Wallpaper fills background.

Overlay

rgba(0,0,0,.35)

White typography.

Centered content.

Glassmorphism cards.

---

# UX Principles

Minimal.

Fast.

No clutter.

Animations under 250ms.

No unnecessary clicks.

Everything keyboard friendly.

---

# Error Handling

If wallpaper upload fails

Show toast

"Unable to upload image."

If storage unavailable

Fallback to defaults.

Prevent duplicate blocked domains.

Prevent empty task creation.

Prevent empty focus submission.

---

# Accessibility

Keyboard navigation.

ARIA labels.

High contrast text.

Responsive layout.

Visible focus indicators.

---

# Performance Requirements

Dashboard loads in under 200ms.

No external API calls.

No analytics.

No login.

Everything local.

Memory usage minimal.

---

# Future Enhancements

Version 2

* Pomodoro timer
* Weather widget
* Calendar integration
* Google Tasks sync
* Daily quote
* Multiple wallpapers
* Wallpaper rotation
* AI daily planning
* Habit tracker
* Keyboard shortcuts
* Dark/light themes
* Statistics dashboard
* Weekly review

---

# Milestones

## Milestone 1 (1 week)

* Chrome extension scaffold
* Manifest V3
* New Tab override
* Dashboard layout

Deliverable

Working personalized homepage.

---

## Milestone 2 (1 week)

* Greeting
* Clock
* Daily Focus
* Local persistence

Deliverable

Daily productivity dashboard.

---

## Milestone 3 (1 week)

* Task manager
* Storage
* Polish UI

Deliverable

Complete personal dashboard.

---

## Milestone 4 (1–2 weeks)

* Focus Mode
* Website blocking
* Custom blocked page

Deliverable

Distraction-free browsing.

---

## Milestone 5 (1 week)

* Settings modal
* Wallpaper upload
* Block list editor
* Reset functionality

Deliverable

Feature-complete MVP.

---

# Success Metrics

Functional

* New Tab replacement works reliably
* Daily Focus resets correctly
* Task persistence across browser restarts
* Focus Mode redirects blocked sites
* Settings persist immediately

User Experience

* Dashboard renders in under 200ms
* First-time setup completed in under 2 minutes
* Zero required network requests after installation
* Clean, distraction-free interface that encourages intentional browsing

---

# Definition of Done

The extension is complete when:

* Users can install it from the Chrome Web Store (Manifest V3 compliant).
* Every new tab opens the personalized dashboard.
* Greeting, live clock, wallpaper, daily focus, tasks, and settings work as specified.
* Focus Mode redirects blocked websites to a motivational page displaying the user's current daily focus.
* All data persists locally across browser sessions.
* The UI is responsive, keyboard-accessible, polished, and performs smoothly without external dependencies.
