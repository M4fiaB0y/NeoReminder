# 📅 NeoReminder — Smart Routine to Device Calendar

> Upload any single-page **PDF**, **PNG**, or **JPG** class routine, automatically detect days and time slots, and sync reminders directly into your phone or PC calendar!

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Hostable on: GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-success.svg)
![Zero Backend Required](https://img.shields.io/badge/Backend-Zero%20Config%20(Client--Side)-indigo.svg)

---

## 🌟 Highlights & Features

- **📂 Universal Upload (PDF & PNG/JPG):**
  - Upload single-page university, college, or school class routines in PDF, PNG, JPG, or WEBP.
  - Built-in sample routines ("University CS Routine" and "College Weekly Schedule") for instant 1-click testing.
- **🧠 Automatic Column & Row Table Engine:**
  - Automatically identifies days of the week (`Mon`, `Tuesday`, etc.) and time intervals (`09:00 - 10:30`, `1:00 PM`, etc.).
  - Clusters intersecting table grid cells to extract **Course Title**, **Room/Lab**, and **Teacher/Professor**.
  - Works 100% offline in your browser via Mozilla `PDF.js` and `Tesseract.js` OCR.
  - Optional AI Vision integration (Google Gemini API) for hand-drawn or skewed routines.
- **📊 Interactive Timetable Reviewer:**
  - Color-coded **Weekly Timetable Grid** view + **All Classes List** view.
  - Click any class to edit course details, start/end time, day, or room number.
  - Add new classes or delete unwanted slots with 1 click.
- **⏰ Custom Reminders & Duration ("How Many Days Reminders I Want"):**
  - Choose reminder duration: **7 Days (1 Week)**, **30 Days (1 Month)**, **90 Days (1 Semester)**, **180 Days (Full Year)**, or any custom count.
  - Choose reminder alarm time: 5m, 10m, 15m, 30m, or 1 hour before each class.
- **📲 1-Click Save to Device Calendar (.ics):**
  - Generates RFC 5545 standard `.ics` with `RRULE:FREQ=WEEKLY` and `VALARM` native notification alarms.
  - Instantly opens on:
    - 🍎 **iPhone / iPad / Mac** (Apple Calendar — "Add All Events")
    - 🤖 **Android Phones** (Google Calendar / Samsung Calendar)
    - 💻 **Windows PC** (Outlook / Windows Calendar)
  - Also includes a direct **Add to Google Calendar** web button.

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

Because NeoReminder is built as a pure, zero-backend Single-Page Application (SPA), hosting it on GitHub Pages is 100% free and takes less than 2 minutes!

### Option 1: 1-Click Automated GitHub Actions (Recommended)

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `neoreminder`).
2. Upload all files from this directory to your new repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: NeoReminder Routine to Calendar"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will automatically deploy your live app! Your site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

### Option 2: Deploy directly from Branch

1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` and folder `/(root)`, then click **Save**.
4. Within 1 minute, your website is online!

---

## 💻 Running Locally

You can also run NeoReminder locally on your computer:

```bash
# Start the local server
npm start

# Or using node directly
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in any web browser.

---

## 🛠️ Project Structure

```
NeoReminder/
├── index.html                  # Main responsive UI & components
├── css/
│   └── style.css               # Glassmorphic dark/light design system
├── js/
│   ├── app.js                  # Application state, UI wiring & modals
│   ├── parser.js               # Column/Row table clustering & OCR engine
│   ├── calendar.js             # RFC 5545 .ics generator with alarms (VALARM)
│   └── sample-data.js          # Demo datasets (University & College)
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages deployment
├── server.js                   # Zero-dependency local development server
├── test-logic.js               # Automated tests for calendar & parsing
└── README.md                   # Documentation & setup guide
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to fork, customize, and share!
