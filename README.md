# 📅 NeoReminder — University Class Routine & Device Calendar Sync

> Tailored for the **CSE Department University Routine**! Select your **Batch & Section** to immediately view your complete weekly timetable with accurate course codes, rooms, and teachers, and auto-sync alarms directly into your iPhone or Android calendar with 1 tap.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Hostable on: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-success.svg)
![19 Batches Included](https://img.shields.io/badge/Batches-19%20Sections-indigo.svg)
![1-Tap Phone Sync](https://img.shields.io/badge/Mobile-1--Tap%20Sync-purple.svg)

---

## 🌟 Features

- **🎓 19 Pre-Loaded University Batches & Sections:**
  - Ingested directly from the official Department Class Routine Google Spreadsheet.
  - Covers **Batch 13 through Batch 20** (including all sections: A, B, C, D, E).
  - Instant 1-click batch selection via top dropdown or quick pills.
- **⚡ Immediate Routine Loading:**
  - Selecting any batch immediately populates the weekly grid with verified course codes (e.g. `CSE 4135`, `CSE 4201`), course names, exact time intervals, teachers (e.g. `ST`, `MES`, `SI`, `RBS`), and room numbers (e.g. `1903`, `1503`, `902`).
- **📱 1-Tap Auto-Save to Phone Calendar:**
  - **iPhone (iOS Safari)**: Prompts native Apple Calendar *"Add All"* sheet to instantly add all recurring classes to iOS and Apple Watch.
  - **Android (Chrome)**: Directly triggers Google Calendar / Samsung Calendar event import.
  - **PC / Mac**: Downloads standard RFC 5545 `.ics` file.
- **⏰ Custom Reminders & Duration:**
  - Choose reminder duration: **7 Days**, **30 Days**, **90 Days (1 Semester)**, **180 Days**, or custom days.
  - Set pre-class alarm notifications: 5m, 10m, 15m, 30m, or 1 hour before each class starts.
- **⚡ Live "Happening Now & Next Class" Widget:**
  - Real-time clock widget displays what class is currently ongoing or countdown to your next upcoming class.
- **🔍 Real-Time Search & Highlight:**
  - Instantly search by teacher initials (e.g. `MES`, `RBS`), room number (`1903`, `1704`), course code (`CSE 4135`), or subject name.
- **📊 Schedule Analytics Dashboard:**
  - Calculates Total Weekly Classes, Total Class/Lab Hours, Active Days, and Free Days (e.g. Defense & Counselling days).
- **📂 Custom Routine Upload Option:**
  - Need to parse a custom routine image or single-page PDF? Click *"Or upload custom routine file"* to use the built-in OCR engine with optional Gemini AI vision.

---

## 🚀 Running Locally

```bash
# Start local Node server (includes /api/batches and /api/routine/:key)
npm start

# Run automated tests
npm test
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to GitHub Pages (Zero Backend Required)

NeoReminder is designed to run seamlessly as a client-side Single-Page Application on **GitHub Pages**:

1. Push this repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically build and publish).
4. Your website is live at:
   `https://<your-username>.github.io/NeoReminder/`

---

## 📂 Project Structure

```
NeoReminder/
├── index.html                  # Main UI with Batch Selector & Weekly Timetable
├── css/
│   └── style.css               # Glassmorphism design system & print styles
├── js/
│   ├── app.js                  # Application state, batch selector, search & sync
│   ├── calendar.js             # RFC 5545 .ics generator & mobile Web Share sync
│   ├── parser.js               # OCR engine & custom image/PDF parsing
│   └── sample-data.js          # Full University database (19 batches & sections)
├── tests/
│   └── test-routine.js         # Automated test suite (npm test)
├── server.js                   # Node.js static server with REST API
├── package.json
└── README.md
```

---

## 👨‍💻 Author

Created by [**@M4fiaB0y**](https://github.com/M4fiaB0y).
Licensed under [MIT](LICENSE).
