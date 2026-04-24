# SN Hover User Location Chrome Extension

## Overview
A lightweight Chrome extension. While logged into ServiceNow, hover over a sys_id or user name to display key user details (Name, Email, Location) in a tooltip.

## Fixes in This Version
- `all_frames: true` — works inside ServiceNow iframes (lists, forms, activity feeds)
- `sysparm_display_value=true` — location now returns a readable string instead of a reference object
- Leaf-node text detection — avoids false positives on large container elements
- XSS-safe rendering via `textContent` instead of `innerHTML`
- Viewport-clamped tooltip using `position: fixed` — never clips off screen
- Dedup logic fix — `lastValue` now tracks the raw value, not the query string

## Installation
1. Download files/Clone repository
2. Go to chrome://extensions
3. Enable Developer mode
4. Click Load unpacked
5. Select the `whatever you name it` folder

## Usage
1. Log into your ServiceNow instance
2. Hover over any sys_id or user_name on the page
3. A tooltip appears after ~600ms with Name, Email, and Location
4. Move away to dismiss

## Files
- `manifest.json` – MV3 manifest
- `content.js` – Hover detection and API logic
- `styles.css` – Tooltip styling
- `README.md` – This file
