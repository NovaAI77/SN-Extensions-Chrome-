# SN Hover User Location

A lightweight Chrome extension for ServiceNow. Hover over a **sys_id** or **user_name** anywhere in the UI and instantly see that user's **Name**, **Email**, and **Location** in a tooltip — no configuration required.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![ServiceNow](https://img.shields.io/badge/ServiceNow-Compatible-81B5A1)

---

## Features

- Hover over any `sys_id` (32-char hex) or `user_name` to trigger a lookup
- Works inside ServiceNow iframes (lists, forms, activity feeds)
- Uses your existing ServiceNow session — no API keys or config needed
- Respects ACLs: only shows fields your account can read
- Tooltip is viewport-clamped — never clips off screen
- Silent failure — no popups or errors if a user isn't found

---

## Installation

> No Chrome Web Store listing — load it manually as an unpacked extension.

1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked**
5. Select the repo folder

The extension activates automatically on any `*.service-now.com` page.

---

## Usage

1. Log into your ServiceNow instance
2. Navigate anywhere — lists, forms, activity logs, etc.
3. Hover over a visible `sys_id` or `user_name`
4. After ~600ms, a tooltip appears showing:
   - **Name**
   - **Email**
   - **Location**
5. Move your mouse away to dismiss

---

## How It Works

The content script injects into all frames on ServiceNow pages (`all_frames: true`). On `mousemove`, it inspects the direct text content of leaf-level elements and checks whether it matches a sys_id or username pattern. If it does, it fires a request to the OOB Table API:

```
GET /api/now/table/sys_user?sysparm_query=<field>=<value>&sysparm_fields=name,email,location.name&sysparm_limit=1
```

The `location.name` dot-walk returns the location display name as a plain string. All requests use `credentials: 'include'` so they piggyback on your active session.

---

## Files

| File | Description |
|------|-------------|
| `manifest.json` | Chrome MV3 manifest |
| `content.js` | Hover detection and Table API logic |
| `styles.css` | Tooltip styling |

---

## Limitations

- You must be logged into ServiceNow for lookups to work
- Only detects text in visible DOM elements (not masked fields or images)
- CDN or iframe sandbox restrictions on some instances may block requests
- Tested on Ui16 / Ui18 — Next Experience (Polaris) may behave differently

---

## Contributing

Pull requests welcome. If you find a ServiceNow UI context where hover detection doesn't work, open an issue with the page URL pattern and element type.

---

## Disclaimer

Not affiliated with or endorsed by ServiceNow. Built for personal productivity and internal tooling use.
