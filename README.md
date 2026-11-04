# 📅 NeoReminder — Smart Routine to Device Calendar

> Upload any single-page **PDF**, **PNG**, or **JPG** class routine, automatically detect days and time slots, and sync reminders directly into your phone or PC calendar with 1 tap!

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Hostable on: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-success.svg)
![Zero Backend Required](https://img.shields.io/badge/Backend-Zero%20Config%20(Client--Side)-indigo.svg)
![1-Tap Phone Sync](https://img.shields.io/badge/Mobile-1--Tap%20Sync-purple.svg)

---

## 🌟 Advanced Features

- **📂 Universal Upload (PDF & PNG/JPG):**
  - Upload single-page university, college, or school routines in PDF, PNG, JPG, or WEBP.
  - Pre-loaded with **Batch 16 Section A Routine (10 Multi-Class Demo)** for instantaneous testing.
- **🧠 4-Line University Template Engine:**
  - Accurately parses standard university routines where each cell has:
    - `Line 1`: Course Code (e.g. `CSE 3151`)
    - `Line 2`: Course Name (e.g. `Digital Logic Design`)
    - `Line 3`: Time Interval (e.g. `9:00 - 10:30 AM` or `9:00 - 12:00` spanning labs)
    - `Line 4`: Teacher & Room (`RBS | 1704` — Teacher initials before `|`, Room number after `|`)
  - Handles **multiple classes per day** (Sunday, Monday, Tuesday, Wednesday, Friday).
  - Canvas image binarization & contrast enhancement for low-res screenshots.
- **⚡ Live "Happening Now & Next Class" Widget:**
  - Automatically checks your phone/PC real-time clock and tells you:
    - What class you have **right now** (with Room & Teacher).
    - What class is **next up** (with countdown e.g. *in 25 mins*).
- **🔍 Real-Time Search & Highlight:**
  - Instantly filter by teacher initials (e.g. `RBS`, `MNI`), room number (`1704`, `801`), or course code (`CSE`, `HUM`).
- **📊 Schedule Analytics Dashboard:**
  - Total Weekly Classes, Total Class/Lab Hours, Active Days, and Free Days calculation.
- **📱 1-Tap Auto-Save to Phone Calendar:**
  - Optimized for mobile:
    - **iPhone (iOS Safari)**: Prompts native Apple Calendar *"Add All"* sheet.
    - **Android (Chrome)**: Uses Web Share API to directly launch Google Calendar or Samsung Calendar.
- **⏰ Custom Reminders & Duration ("How Many Days Reminders I Want"):**
  - Choose reminder duration: **7 Days**, **30 Days**, **90 Days (1 Semester)**, **180 Days**, or custom days.
  - Set device reminder alerts: 5m, 10m, 15m, 30m, or 1 hour before each class.
- **🖨️ Clean Print & PDF Export:**
  - Print-optimized CSS stylesheet to print a clean physical copy for your study wall.

---

## 🚀 How to Host on GitHub Pages (Free & Instant)

Because NeoReminder is built as a pure client-side Single-Page Application, it requires **zero backend server setup** and can be hosted on GitHub Pages for free!

### Step 1: Push code to your GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: NeoReminder Routine to Calendar"
git branch -M main
git remote add origin https://github.com/M4fiaB0y/NeoReminder.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. In your GitHub repository, click **Settings** > **Pages** (in the left sidebar).
2. Under **Build and deployment** > **Source**:
   - Choose **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically build and publish), **OR**
   - Choose **Deploy from a branch**, select branch `main` with folder `/(root)`, and click **Save**.
3. Your website is now live at:
   `https://m4fiab0y.github.io/NeoReminder/`

---

## 💻 Running Locally

```bash
# Start local server
npm start

# Run verification tests
npm test
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
NeoReminder/
├── index.html                  # Semantic UI with Live Banner, Timetable & Modals
├── css/
│   └── style.css               # Glassmorphism design system & print styles
├── js/
│   ├── app.js                  # App state, live class countdown, search & filters
│   ├── parser.js               # 4-line university template engine & OCR
│   ├── calendar.js             # RFC 5545 .ics generator & mobile Web Share sync
│   └── sample-data.js          # Preloaded Batch 16 multi-class dataset
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Actions Pages deployment
├── tests/
│   └── test-routine.js         # Automated test suite
├── .gitignore                  # Production gitignore
├── server.js                   # Zero-dependency local dev server
├── package.json                # Project scripts & metadata
└── README.md                   # Full documentation & setup guide
```

---

## 📄 License

MIT License — Feel free to use, fork, and customize!
