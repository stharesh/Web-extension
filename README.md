# Daily Focus Dashboard

**Daily Focus Dashboard** is a simple AI-assisted Chrome extension that replaces the default New Tab page with a calm, personalized productivity dashboard.

The project was created to make each new browser tab a small reminder of what matters today, while providing a few lightweight tools for staying organized and reducing distractions.

## What it does

- Displays a personalized greeting and live clock
- Lets the user choose one main focus for the day
- Provides a simple task list
- Supports a custom background image
- Includes a Focus Mode for blocking selected distracting websites
- Shows the daily focus again when a blocked website is opened
- Stores preferences locally without requiring an account

## User flow

```text
Install the extension
        ↓
Open a new tab and enter your name
        ↓
Choose the main focus for the day
        ↓
Add and complete lightweight tasks
        ↓
Optionally enable Focus Mode
        ↓
Blocked websites show a reminder of the daily focus
```

## Privacy

Names, tasks, daily focus, wallpaper choices, and blocked-site preferences are stored locally through Chrome's extension storage. The extension does not require a user account or implement its own analytics service.

Focus Mode requires website access so Chrome can redirect user-selected blocked domains to the extension's reminder page. The project does not use that permission to collect browsing history.

## AI-assisted development

This project was built through an AI-assisted development workflow. The focus was on defining the product idea, shaping the user experience, validating the main interactions, and producing a working browser extension.

## Technology

Chrome Extension Manifest V3 · HTML · CSS · JavaScript · Chrome Storage · Declarative Net Request

## Try it locally

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose this project folder.
6. Open a new browser tab.

## Current status

This repository contains a functional personal project and has not been presented as a published Chrome Web Store product. The product requirements and development checklist are available in [`prd.md`](./prd.md) and [`tasks.md`](./tasks.md).

