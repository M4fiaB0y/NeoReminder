// Test suite for NeoReminder logic
const fs = require('fs');

// Mock browser globals for testing parser & calendar in node
global.window = {};
global.document = {
  createElement: () => ({
    getContext: () => ({ drawImage: () => {} }),
    toDataURL: () => ''
  })
};

// Read files
const sampleCode = fs.readFileSync('./js/sample-data.js', 'utf8').replace('const SAMPLE_ROUTINES', 'global.SAMPLE_ROUTINES');
const calendarCode = fs.readFileSync('./js/calendar.js', 'utf8').replace('const CalendarSync', 'global.CalendarSync');
const parserCode = fs.readFileSync('./js/parser.js', 'utf8').replace('const RoutineParser', 'global.RoutineParser');

eval(sampleCode);
eval(calendarCode);
eval(parserCode);

console.log("=== Testing Calendar Generation ===");
const sampleClasses = SAMPLE_ROUTINES.university.classes;
console.log(`Loaded ${sampleClasses.length} sample university classes.`);

const icsResult = CalendarSync.generateIcs(sampleClasses, {
  startDate: '2026-11-03',
  totalDays: 30,
  alarmMinutes: 10
});

if (icsResult.includes('BEGIN:VCALENDAR') &&
    icsResult.includes('RRULE:FREQ=WEEKLY') &&
    icsResult.includes('BEGIN:VALARM') &&
    icsResult.includes('TRIGGER:-PT10M')) {
  console.log("✅ ICS Calendar generation test PASSED! Formatted properly with alarms & recurrence.");
} else {
  console.error("❌ ICS Generation failed checks.");
  process.exit(1);
}

console.log("=== Testing Table Clustering Algorithm ===");
// Mock text blocks representing a table with Days across columns and times across rows
const mockBlocks = [
  { text: "Monday", x: 100, y: 50, width: 80, height: 20 },
  { text: "Tuesday", x: 300, y: 50, width: 80, height: 20 },
  { text: "09:00 - 10:30", x: 20, y: 100, width: 90, height: 20 },
  { text: "11:00 - 12:30", x: 20, y: 200, width: 90, height: 20 },
  { text: "Calculus Room 101 Dr. Smith", x: 110, y: 105, width: 120, height: 20 },
  { text: "Chemistry Lab 3 Prof. Davis", x: 310, y: 205, width: 120, height: 20 }
];

const parsed = RoutineParser.analyzeTableStructure(mockBlocks);
console.log(`Parsed ${parsed.length} classes from mock matrix.`);
parsed.forEach(c => console.log(` - [${c.day}] ${c.startTime}-${c.endTime}: ${c.subject} (${c.room}, ${c.teacher})`));

if (parsed.length >= 2) {
  console.log("✅ Column & Row clustering test PASSED!");
} else {
  console.error("❌ Column & Row clustering failed.");
  process.exit(1);
}

console.log("All unit tests passed successfully!");
