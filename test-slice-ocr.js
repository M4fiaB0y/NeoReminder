const { createWorker } = require('tesseract.js');
const fs = require('fs');

// Test regex parser for the 4-line cell structure:
// Line 1: Course Code (e.g. CSE 3151)
// Line 2: Course Name (e.g. Digital Logic Design)
// Line 3: Time (e.g. 9:00-10:30)
// Line 4: Teacher | Room (e.g. RBS | 1704)

function parseTemplateCell(text, defaultDay = "Sunday", defaultTime = "09:00-10:30") {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // Filter out lunch/break/defense
  const full = lines.join(' ');
  if (/lunch|break|defense|counselling/i.test(full)) return null;

  let courseCode = '';
  let courseName = '';
  let timeStr = '';
  let teacher = '';
  let room = '';

  // 1. Look for Teacher | Room pipe pattern
  for (const line of lines) {
    const pipeMatch = line.match(/([A-Za-z]{2,4})\s*\|\s*([A-Za-z0-9-]+)/);
    if (pipeMatch) {
      teacher = pipeMatch[1].trim();
      room = pipeMatch[2].trim();
      break;
    }
  }

  // 2. Look for Time pattern
  for (const line of lines) {
    const timeMatch = line.match(/(\d{1,2}[:.]\d{2})\s*(?:-|–|to)\s*(\d{1,2}[:.]\d{2})/);
    if (timeMatch) {
      timeStr = timeMatch[0];
      break;
    }
  }

  // 3. Look for Course Code
  for (const line of lines) {
    const codeMatch = line.match(/\b([A-Za-z]{2,4}\s*\d{3,4}[A-Za-z]?)\b/);
    if (codeMatch && !line.includes('|')) {
      courseCode = codeMatch[1].trim();
      break;
    }
  }

  // 4. Look for Course Name
  const remainingLines = lines.filter(line => {
    if (timeStr && line.includes(timeStr)) return false;
    if (teacher && line.includes(teacher) && line.includes('|')) return false;
    if (courseCode && line.trim() === courseCode) return false;
    return true;
  });

  if (remainingLines.length > 0) {
    courseName = remainingLines.join(' ').replace(courseCode, '').trim();
  }

  if (!courseCode && !courseName) return null;

  return {
    courseCode,
    courseName: courseName || courseCode,
    time: timeStr || defaultTime,
    teacher,
    room
  };
}

// Test with mock cell text from user's image:
const mockSundayCell1 = `
CSE 3151
Digital Logic Design
9:00-10:30
RBS | 1704
`;

const res1 = parseTemplateCell(mockSundayCell1, "Sunday");
console.log("Parsed Sunday Class 1:", res1);

const mockSundayCell2 = `
CSE 1111
Theory of Computing
10:30 - 12:00
MAR | 1704
`;
const res2 = parseTemplateCell(mockSundayCell2, "Sunday");
console.log("Parsed Sunday Class 2:", res2);

const mockWedLab = `
CSE 3254
Microprocessor & Assembly Language Lab
1:00-4:00
MNI | 802
`;
const res3 = parseTemplateCell(mockWedLab, "Wednesday");
console.log("Parsed Wednesday Lab:", res3);
