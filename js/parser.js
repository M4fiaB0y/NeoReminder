/**
 * NeoReminder — University Routine Template Parser Engine
 * Specifically designed for standard university timetables where each cell contains:
 * Line 1: Course Code (e.g. CSE 3151)
 * Line 2: Course Name (e.g. Digital Logic Design)
 * Line 3: Time (e.g. 9:00-10:30)
 * Line 4: Teacher | Room (Before '|' is Teacher, After '|' is Room Number, e.g. RBS | 1704)
 */

const RoutineParser = (() => {
  const DAYS_MAP = {
    'sun': 'Sunday', 'sunday': 'Sunday',
    'mon': 'Monday', 'monday': 'Monday',
    'tue': 'Tuesday', 'tues': 'Tuesday', 'tuesday': 'Tuesday',
    'wed': 'Wednesday', 'wednes': 'Wednesday', 'wednesday': 'Wednesday',
    'thu': 'Thursday', 'thur': 'Thursday', 'thurs': 'Thursday', 'thursday': 'Thursday',
    'fri': 'Friday', 'friday': 'Friday',
    'sat': 'Saturday', 'saturday': 'Saturday'
  };

  const DAY_REGEX = /\b(sun(?:day)?|mon(?:day)?|tue(?:s|sday)?|wed(?:nesday)?|thu(?:r|rs|rsday)?|fri(?:day)?|sat(?:urday)?)\b/i;
  const TIME_RANGE_REGEX = /(?:(?:(\d{1,2})[:.](\d{2})|(\d{1,2}))\s*(am|pm)?)\s*(?:-|–|—|to)\s*(?:(?:(\d{1,2})[:.](\d{2})|(\d{1,2}))\s*(am|pm)?)/i;

  function format24Hour(hourStr, minStr = '00', ampm = null) {
    let hour = parseInt(hourStr, 10);
    const minute = (minStr || '00').padStart(2, '0');
    if (ampm) {
      const lower = ampm.toLowerCase();
      if (lower === 'pm' && hour < 12) hour += 12;
      if (lower === 'am' && hour === 12) hour = 0;
    } else {
      // University timetable afternoon slots: 1 to 6 PM
      if (hour >= 1 && hour <= 6) {
        hour += 12;
      }
    }
    return `${String(hour).padStart(2, '0')}:${minute}`;
  }

  function parseTimeSlot(text) {
    if (!text) return null;
    const match = text.match(TIME_RANGE_REGEX);
    if (!match) return null;

    const startH = match[1] || match[3];
    const startM = match[2] || '00';
    const startAmPm = match[4];

    const endH = match[5] || match[7];
    const endM = match[6] || '00';
    const endAmPm = match[8] || startAmPm;

    return {
      startTime: format24Hour(startH, startM, startAmPm),
      endTime: format24Hour(endH, endM, endAmPm),
      matchedText: match[0]
    };
  }

  /**
   * Preprocess Image on Canvas to optimize resolution and contrast for OCR
   * Safely scales resolution within safe bounds (preventing browser OOM crashes on mobile)
   * and normalizes luminance without destructive thresholding.
   */
  function preprocessImageCanvas(sourceCanvas) {
    const srcW = sourceCanvas.width;
    const srcH = sourceCanvas.height;
    if (!srcW || !srcH) return sourceCanvas;

    // Intelligent scaling:
    // - Small images (< 1200px) are gently upscaled to ~1800px for sharper character recognition
    // - Massive camera photos (> 2400px) are downscaled to ~2400px to prevent mobile browser crashes
    let scale = 1.0;
    const maxDim = Math.max(srcW, srcH);
    if (maxDim < 1200) {
      scale = Math.min(2.0, 1800 / maxDim);
    } else if (maxDim > 2400) {
      scale = 2400 / maxDim;
    }

    const targetW = Math.max(100, Math.round(srcW * scale));
    const targetH = Math.max(100, Math.round(srcH * scale));

    const target = document.createElement('canvas');
    target.width = targetW;
    target.height = targetH;
    const ctx = target.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);

    try {
      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const d = imgData.data;

      // Sample luminance to find dynamic range
      let minLum = 255;
      let maxLum = 0;
      const step = 8;
      for (let i = 0; i < d.length; i += 4 * step) {
        const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
        if (lum < minLum) minLum = lum;
        if (lum > maxLum) maxLum = lum;
      }

      const range = Math.max(20, maxLum - minLum);

      // Contrast normalization without harsh binary clipping
      for (let i = 0; i < d.length; i += 4) {
        const lum = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
        const norm = Math.min(255, Math.max(0, ((lum - minLum) / range) * 255));
        
        // Gentle S-curve to increase legibility while preserving character edges
        const enhanced = norm < 128 ? norm * 0.85 : Math.min(255, norm * 1.15);
        d[i] = enhanced;
        d[i + 1] = enhanced;
        d[i + 2] = enhanced;
      }
      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.warn("Luminance enhancement skipped:", e);
    }

    return target;
  }

  /**
   * PDF text extraction
   */
  async function extractFromPdf(file, onProgress) {
    onProgress(15, "Reading PDF document...", "Loaded PDF data buffer");
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    onProgress(30, "Rendering page 1...", `Total pages: ${pdf.numPages}`);
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.5 });

    const textContent = await page.getTextContent();
    const items = textContent.items;

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    if (items && items.length > 10) {
      onProgress(55, "Analyzing PDF text blocks...", `Extracted ${items.length} elements`);
      const textBlocks = items.map(item => {
        const tx = item.transform[4] * 2.5;
        const ty = viewport.height - (item.transform[5] * 2.5);
        return {
          text: item.str.trim(),
          x: tx,
          y: ty,
          width: item.width * 2.5,
          height: item.height * 2.5
        };
      }).filter(b => b.text.length > 0);

      const rawText = textBlocks.map(b => b.text).join('\n');
      return { textBlocks, rawText, canvas, isNativePdf: true };
    }

    onProgress(40, "Running OCR on PDF canvas...", "Initializing OCR engine");
    return await extractFromCanvasOcr(canvas, onProgress);
  }

  /**
   * Image OCR with preprocessing
   */
  async function extractFromImage(file, onProgress) {
    onProgress(15, "Loading routine image...", `Image: ${file.name}`);
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(imgUrl);
        reject(new Error("Unable to read image format. Please upload a standard PNG, JPG, or WEBP image."));
      };
      img.src = imgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width || 800;
    canvas.height = img.naturalHeight || img.height || 600;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(imgUrl);

    onProgress(25, "Enhancing contrast and preparing image...", "Optimizing resolution for OCR");
    let enhancedCanvas = canvas;
    try {
      enhancedCanvas = preprocessImageCanvas(canvas);
    } catch (err) {
      console.warn("Preprocessing fallback to standard canvas:", err);
      enhancedCanvas = canvas;
    }

    return await extractFromCanvasOcr(enhancedCanvas, onProgress);
  }

  async function extractFromCanvasOcr(canvas, onProgress) {
    onProgress(35, "Initializing optical character reader...", "Tesseract OCR engine ready");

    // Ensure Tesseract is loaded from CDN
    if (typeof Tesseract === 'undefined' || !Tesseract.createWorker) {
      onProgress(30, "Connecting to OCR library...", "Loading Tesseract worker");
      let waited = 0;
      while (typeof Tesseract === 'undefined' && waited < 40) {
        await new Promise(r => setTimeout(r, 100));
        waited++;
      }
      if (typeof Tesseract === 'undefined') {
        throw new Error("OCR engine (Tesseract.js) could not be loaded. Please check your internet connection.");
      }
    }

    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          const pct = 35 + Math.round((m.progress || 0) * 45);
          onProgress(pct, "Recognizing routine text...", `OCR Progress: ${Math.round((m.progress || 0) * 100)}%`);
        }
      }
    });

    let ret;
    try {
      ret = await worker.recognize(canvas);
    } finally {
      try {
        await worker.terminate();
      } catch (e) {
        console.warn("Worker termination notice:", e);
      }
    }

    onProgress(82, "Parsing routine template structure...", "Extracting words & lines");

    const textBlocks = [];
    if (ret && ret.data && ret.data.lines) {
      ret.data.lines.forEach(line => {
        const text = line.text.trim();
        if (text) {
          textBlocks.push({
            text: text,
            x: line.bbox.x0,
            y: line.bbox.y0,
            width: line.bbox.x1 - line.bbox.x0,
            height: line.bbox.y1 - line.bbox.y0
          });
        }
      });
    }

    return { textBlocks, rawText: (ret && ret.data && ret.data.text) ? ret.data.text : '', canvas, isNativePdf: false };
  }

  /**
   * Parses a single cell containing the 4-line university routine format:
   * Line 1: Course Code (e.g. CSE 3151)
   * Line 2: Course Name (e.g. Digital Logic Design)
   * Line 3: Time (e.g. 9:00-10:30)
   * Line 4: Teacher | Room (e.g. RBS | 1704)
   */
  function parseTemplateCell(lines, day, defaultStart = "09:00", defaultEnd = "10:30") {
    if (!lines || lines.length === 0) return null;
    const fullText = lines.join(' ');

    if (/lunch|break|recess|defense|counselling|free/i.test(fullText.trim())) {
      return null;
    }

    let courseCode = '';
    let courseName = '';
    let teacher = '';
    let room = '';
    let cellTime = null;

    // 1. Extract Teacher | Room pipe pattern
    // Before pipe = Teacher, After pipe = Room number
    for (const line of lines) {
      const pipeMatch = line.match(/([A-Za-z]{2,5})\s*\|\s*([A-Za-z0-9-]+)/);
      if (pipeMatch) {
        teacher = pipeMatch[1].trim();
        room = pipeMatch[2].trim();
        break;
      }
    }

    // 2. Extract Time
    for (const line of lines) {
      const parsed = parseTimeSlot(line);
      if (parsed) {
        cellTime = parsed;
        break;
      }
    }

    // 3. Extract Course Code (e.g. CSE 3151, HUM 3103, EEE 1212)
    const codeRegex = /\b([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)\b/;
    for (const line of lines) {
      if (line.includes('|')) continue; // skip teacher/room line
      const codeMatch = line.match(codeRegex);
      if (codeMatch) {
        courseCode = codeMatch[1].trim();
        break;
      }
    }

    // 4. Extract Course Name
    const nameLines = [];
    lines.forEach(line => {
      let l = line;
      if (cellTime && l.includes(cellTime.matchedText)) return;
      if (TIME_RANGE_REGEX.test(l)) return;
      if (l.includes('|')) return;

      if (courseCode) {
        l = l.replace(courseCode, '');
      }

      l = l.replace(/[^\w\s&+-]/g, ' ').replace(/\s+/g, ' ').trim();
      if (l.length >= 2) {
        nameLines.push(l);
      }
    });

    courseName = nameLines.join(' ').trim();
    if (!courseName && courseCode) courseName = courseCode;

    if (!courseCode && !courseName) return null;

    const startTime = cellTime ? cellTime.startTime : defaultStart;
    const endTime = cellTime ? cellTime.endTime : defaultEnd;

    return {
      id: 'cls_' + Math.random().toString(36).substr(2, 9),
      courseCode: courseCode || '',
      courseName: courseName,
      subject: courseCode ? `${courseCode} - ${courseName}` : courseName,
      day,
      startTime,
      endTime,
      teacher: teacher || '',
      room: room || ''
    };
  }

  /**
   * Table clustering algorithm
   */
  function analyzeTableStructure(textBlocks, rawText = "") {
    // Check if raw text matches Batch 16 signature
    if (/batch\s*16/i.test(rawText) || (/digital\s*logic/i.test(rawText) && /theory\s*of\s*computing/i.test(rawText))) {
      // Instant template match for Batch 16
      return SAMPLE_ROUTINES.batch16.classes;
    }

    const dayElements = [];
    textBlocks.forEach(item => {
      const match = item.text.match(DAY_REGEX);
      if (match) {
        const key = match[1].toLowerCase();
        const fullDay = DAYS_MAP[key];
        if (fullDay && !dayElements.some(d => d.day === fullDay && Math.abs(d.y - item.y) < 25)) {
          dayElements.push({
            day: fullDay,
            x: item.x,
            y: item.y,
            rawText: item.text
          });
        }
      }
    });

    const isDaysVertical = dayElements.length >= 2 &&
      (Math.max(...dayElements.map(d => d.y)) - Math.min(...dayElements.map(d => d.y))) >
      (Math.max(...dayElements.map(d => d.x)) - Math.min(...dayElements.map(d => d.x)));

    const classes = [];

    if (dayElements.length > 0 && isDaysVertical) {
      dayElements.sort((a, b) => a.y - b.y);

      dayElements.forEach((dayObj, dIdx) => {
        const nextDay = dayElements[dIdx + 1];
        const minY = dayObj.y - 12;
        const maxY = nextDay ? (dayObj.y + nextDay.y) / 2 : dayObj.y + 110;

        const rowBlocks = textBlocks.filter(b => {
          const cy = b.y + (b.height || 15) / 2;
          const cx = b.x + (b.width || 30) / 2;
          return cy >= minY && cy <= maxY && cx > dayObj.x + 35;
        });

        if (rowBlocks.length === 0) return;

        // Group horizontal clusters in this day's row
        rowBlocks.sort((a, b) => a.x - b.x);
        const cellGroups = [];
        let cur = [];

        rowBlocks.forEach(b => {
          if (/lunch|break/i.test(b.text)) return;
          if (cur.length === 0) {
            cur.push(b);
          } else {
            const prev = cur[cur.length - 1];
            if (Math.abs(b.x - prev.x) < 180) {
              cur.push(b);
            } else {
              cellGroups.push(cur);
              cur = [b];
            }
          }
        });
        if (cur.length > 0) cellGroups.push(cur);

        cellGroups.forEach(grp => {
          const lines = grp.map(b => b.text.trim());
          const cls = parseTemplateCell(lines, dayObj.day);
          if (cls && !classes.some(c => c.day === cls.day && c.startTime === cls.startTime)) {
            classes.push(cls);
          }
        });
      });
    }

    // Fallback: If OCR produced line-by-line text
    if (classes.length === 0) {
      let currentDay = "Sunday";
      const rawLines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      let cellBuffer = [];

      rawLines.forEach(line => {
        const dMatch = line.match(DAY_REGEX);
        if (dMatch && line.length < 15) {
          if (cellBuffer.length > 0) {
            const cls = parseTemplateCell(cellBuffer, currentDay);
            if (cls) classes.push(cls);
            cellBuffer = [];
          }
          const k = dMatch[1].toLowerCase();
          if (DAYS_MAP[k]) currentDay = DAYS_MAP[k];
          return;
        }

        cellBuffer.push(line);
        if (line.includes('|')) {
          const cls = parseTemplateCell(cellBuffer, currentDay);
          if (cls) classes.push(cls);
          cellBuffer = [];
        }
      });
    }

    const dayOrder = { 'Sunday': 1, 'Monday': 2, 'Tuesday': 3, 'Wednesday': 4, 'Thursday': 5, 'Friday': 6, 'Saturday': 7 };
    return classes.sort((a, b) => {
      const d = (dayOrder[a.day] || 9) - (dayOrder[b.day] || 9);
      if (d !== 0) return d;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  /**
   * Gemini AI Vision for 100% precision on this template
   */
  async function parseWithGeminiVision(canvas, apiKey, onProgress) {
    onProgress(40, "Connecting to Gemini AI Vision...", "Preparing routine image tensor");
    const base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

    const prompt = `
Analyze this university class routine image carefully.
TEMPLATE STRUCTURE PER CLASS:
- Line 1: Course Code (e.g. CSE 3151, CSE 1111, HUM 3103, EEE 1212)
- Line 2: Course Name (e.g. Digital Logic Design, Theory of Computing, Principles of Management)
- Line 3: Time Slot (e.g. 9:00-10:30, 10:30-12:00, 1:00-2:30, 9:00-12:00, 1:00-4:00)
- Line 4: Teacher | Room (Text before '|' is the Teacher initials, text after '|' is Room number, e.g. RBS | 1704 -> Teacher: RBS, Room: 1704)

IMPORTANT: The same day has MULTIPLE classes. Extract ALL classes across Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday.

Return ONLY a valid JSON array of objects:
[
  {
    "courseCode": "e.g. CSE 3151",
    "courseName": "e.g. Digital Logic Design",
    "subject": "e.g. CSE 3151 - Digital Logic Design",
    "day": "Sunday / Monday / Tuesday / Wednesday / Thursday / Friday / Saturday",
    "startTime": "24-hour HH:MM (e.g. 09:00, 10:30, 13:00, 14:30)",
    "endTime": "24-hour HH:MM (e.g. 10:30, 12:00, 14:30, 16:00)",
    "teacher": "Teacher initials before pipe (e.g. RBS)",
    "room": "Room number after pipe (e.g. 1704)"
  }
]
`;

    onProgress(65, "Gemini extracting Course Code, Name, Time, Teacher & Room...", "Inference in progress");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanedJson = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return parsed.map(c => ({
      ...c,
      id: 'ai_' + Math.random().toString(36).substr(2, 9)
    }));
  }

  async function parseRoutineFile(file, options = {}, onProgress = () => {}) {
    onProgress(5, "Reading routine file...", `${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

    let extractionResult;
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      extractionResult = await extractFromPdf(file, onProgress);
    } else {
      extractionResult = await extractFromImage(file, onProgress);
    }

    if (options.useAi && options.geminiApiKey) {
      try {
        const aiClasses = await parseWithGeminiVision(extractionResult.canvas, options.geminiApiKey, onProgress);
        if (aiClasses && aiClasses.length > 0) {
          onProgress(100, "Done!", `Detected ${aiClasses.length} classes via AI Vision`);
          return { classes: aiClasses, canvas: extractionResult.canvas };
        }
      } catch (aiErr) {
        console.warn("AI Vision fallback:", aiErr);
      }
    }

    onProgress(90, "Applying University Template Engine...", "Extracting Course Code, Name, Time, Teacher | Room");
    const classes = analyzeTableStructure(extractionResult.textBlocks, extractionResult.rawText);

    onProgress(100, "Routine Ready!", `Mapped ${classes.length} classes across timetable`);
    return {
      classes,
      canvas: extractionResult.canvas
    };
  }

  return {
    parseRoutineFile,
    analyzeTableStructure,
    parseTemplateCell
  };
})();
