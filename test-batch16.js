const fs = require('fs');

global.window = {};
global.document = {
  createElement: () => ({ getContext: () => ({ drawImage: () => {} }), toDataURL: () => '' })
};

const sampleCode = fs.readFileSync('./js/sample-data.js', 'utf8').replace('const SAMPLE_ROUTINES', 'global.SAMPLE_ROUTINES');
const calendarCode = fs.readFileSync('./js/calendar.js', 'utf8').replace('const CalendarSync', 'global.CalendarSync');
const parserCode = fs.readFileSync('./js/parser.js', 'utf8').replace('const RoutineParser', 'global.RoutineParser');

eval(sampleCode);
eval(calendarCode);
eval(parserCode);

console.log("=== Testing Batch 16 Section A Routine ===");
const batch16 = SAMPLE_ROUTINES.batch16;
console.log(`Routine Name: ${batch16.name}`);
console.log(`Total classes loaded: ${batch16.classes.length}`);

// Count classes per day
const dayCounts = {};
batch16.classes.forEach(c => {
  dayCounts[c.day] = (dayCounts[c.day] || 0) + 1;
});
console.log("Classes per day count:", dayCounts);

if (dayCounts['Sunday'] === 3 && dayCounts['Wednesday'] === 3 && dayCounts['Tuesday'] === 2) {
  console.log("✅ Multi-class distribution verified: Sunday (3), Wednesday (3), Tuesday (2)!");
} else {
  console.error("❌ Distribution mismatch:", dayCounts);
  process.exit(1);
}

// Generate ICS calendar for 90 days with 10 min alarm
const ics = CalendarSync.generateIcs(batch16.classes, {
  startDate: '2026-11-03',
  totalDays: 90,
  alarmMinutes: 10
});

const veventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
console.log(`Generated ${veventCount} VEVENT calendar blocks.`);

if (veventCount === 10) {
  console.log("✅ All 10 individual classes exported to calendar successfully!");
} else {
  console.error(`❌ Expected 10 VEVENT blocks, got ${veventCount}`);
  process.exit(1);
}

console.log("Batch 16 routine test passed 100%!");
