/**
 * NeoReminder — Calendar (.ics) Generator & Reminder Sync Engine
 * Generates RFC 5545 compliant iCalendar files with alarms (VALARM) and recurrence (RRULE)
 * Supports custom date ranges (how many days reminders) and Google Calendar web links.
 */

const CalendarSync = (() => {
  const DAY_NUMBERS = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };

  const DAY_ICS_ABBR = {
    'Sunday': 'SU',
    'Monday': 'MO',
    'Tuesday': 'TU',
    'Wednesday': 'WE',
    'Thursday': 'TH',
    'Friday': 'FR',
    'Saturday': 'SA'
  };

  /**
   * Format date into iCalendar UTC/Local string: YYYYMMDDTHHMMSS
   */
  function formatIcsDateTime(date) {
    const pad = n => String(n).padStart(2, '0');
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());
    return `${y}${m}${d}T${h}${min}${s}`;
  }

  /**
   * Escape special characters in iCalendar text fields
   */
  function escapeIcsText(str) {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  /**
   * Calculate the first occurrence date for a specific day of week, starting on or after startDate
   */
  function getFirstOccurrence(startDate, targetDayName, timeStr) {
    const targetDayIndex = DAY_NUMBERS[targetDayName];
    if (targetDayIndex === undefined) return null;

    let validTime = timeStr;
    if (!validTime || typeof validTime !== 'string' || !validTime.includes(':')) {
      validTime = '09:00';
    }
    let [hours, minutes] = validTime.split(':').map(Number);
    if (isNaN(hours) || hours < 0 || hours > 23) hours = 9;
    if (isNaN(minutes) || minutes < 0 || minutes > 59) minutes = 0;

    const occurrence = new Date(startDate);
    occurrence.setHours(hours, minutes, 0, 0);

    const currentDayIndex = occurrence.getDay();
    let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;

    occurrence.setDate(occurrence.getDate() + daysToAdd);
    return occurrence;
  }

  /**
   * Generate RFC 5545 .ics calendar content
   * @param {Array} classes - List of class objects
   * @param {Object} options - { startDate, totalDays, alarmMinutes }
   */
  function generateIcs(classes, options = {}) {
    const startDate = options.startDate ? new Date(options.startDate) : new Date();
    const totalDays = parseInt(options.totalDays, 10) || 30;
    const alarmMinutes = options.alarmMinutes !== undefined ? parseInt(options.alarmMinutes, 10) : 10;

    // Calculate end date based on requested duration
    const untilDate = new Date(startDate);
    untilDate.setDate(untilDate.getDate() + totalDays);
    untilDate.setHours(23, 59, 59, 999);

    const untilStr = formatIcsDateTime(untilDate);
    const dtstamp = formatIcsDateTime(new Date());

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NeoReminder//Class Routine Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Class Routine Schedule',
      'X-WR-TIMEZONE:' + (Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
    ];

    classes.forEach((cls, idx) => {
      const firstStart = getFirstOccurrence(startDate, cls.day, cls.startTime);
      if (!firstStart) return;

      let [endH, endM] = (cls.endTime || '').split(':').map(Number);
      if (isNaN(endH) || endH < 0 || endH > 23) endH = (firstStart.getHours() + 1) % 24;
      if (isNaN(endM) || endM < 0 || endM > 59) endM = 30;
      const firstEnd = new Date(firstStart);
      firstEnd.setHours(endH, endM, 0, 0);

      const dtstartStr = formatIcsDateTime(firstStart);
      const dtendStr = formatIcsDateTime(firstEnd);
      const dayAbbr = DAY_ICS_ABBR[cls.day] || 'MO';
      const uid = `neoreminder_${Date.now()}_${idx}_${cls.id}@neoreminder.app`;

      let description = `Course: ${cls.subject}`;
      if (cls.room) description += `\\nRoom: ${cls.room}`;
      if (cls.teacher) description += `\\nInstructor: ${cls.teacher}`;
      description += `\\nGenerated with NeoReminder`;

      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${uid}`);
      ics.push(`DTSTAMP:${dtstamp}`);
      ics.push(`DTSTART:${dtstartStr}`);
      ics.push(`DTEND:${dtendStr}`);
      ics.push(`RRULE:FREQ=WEEKLY;BYDAY=${dayAbbr};UNTIL=${untilStr}`);
      ics.push(`SUMMARY:${escapeIcsText(cls.subject)}`);
      if (cls.room) {
        ics.push(`LOCATION:${escapeIcsText(cls.room)}`);
      }
      ics.push(`DESCRIPTION:${description}`);
      ics.push('STATUS:CONFIRMED');
      ics.push('TRANSP:OPAQUE');

      // Add Device Reminder Alarm (VALARM)
      if (alarmMinutes >= 0) {
        ics.push('BEGIN:VALARM');
        ics.push(`TRIGGER:-PT${alarmMinutes}M`);
        ics.push('ACTION:DISPLAY');
        ics.push(`DESCRIPTION:Upcoming Class: ${escapeIcsText(cls.subject)} in ${cls.room || 'Classroom'}`);
        ics.push('END:VALARM');
      }

      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  }

  /**
   * Triggers device download of the .ics file
   */
  function downloadIcsFile(icsContent, filename = 'class_routine.ics') {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 15000);
  }

  /**
   * 1-Tap Auto-Save to Phone Calendar:
   * Optimized for mobile devices (iOS Safari & Android Chrome).
   * Uses Web Share API (native Calendar intent) or direct text/calendar URI.
   */
  async function autoSaveToPhoneCalendar(icsContent, filename = 'class_routine.ics') {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

    // Method 1: Mobile Web Share API (Opens system calendar on iOS and Android)
    if (navigator.canShare) {
      try {
        const file = new File([blob], filename, { type: 'text/calendar' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Class Routine Schedule',
            text: 'Save class schedule and reminders to your phone calendar'
          });
          return { success: true, method: 'share', message: 'Calendar import opened!' };
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, falling back to direct open:', err);
        } else {
          return { success: true, method: 'cancelled', message: 'Action cancelled by user' };
        }
      }
    }

    // Method 2: iOS Safari direct open (triggers "Add all events to Calendar" sheet)
    if (isIOS) {
      const reader = new FileReader();
      reader.onload = function() {
        // Data URL with text/calendar forces iOS Safari to launch Apple Calendar
        window.location.href = reader.result;
      };
      reader.readAsDataURL(blob);
      return { success: true, method: 'ios_direct', message: 'Tap "Add All" on the calendar popup!' };
    }

    // Method 3: Standard download with immediate user trigger (Android / Desktop)
    downloadIcsFile(icsContent, filename);
    return {
      success: true,
      method: 'download',
      message: isAndroid ? 'File downloaded! Tap to open directly in Google/Samsung Calendar.' : 'Calendar file downloaded! Click to import all classes.'
    };
  }

  /**
   * Generates a Google Calendar Web URL for the first upcoming class
   */
  function createGoogleCalendarUrl(cls, startDate) {
    const firstStart = getFirstOccurrence(startDate, cls.day, cls.startTime);
    if (!firstStart) return '';

    const [endH, endM] = cls.endTime.split(':').map(Number);
    const firstEnd = new Date(firstStart);
    firstEnd.setHours(endH, endM, 0, 0);

    const pad = n => String(n).padStart(2, '0');
    const fmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const dates = `${fmt(firstStart)}/${fmt(firstEnd)}`;
    const details = encodeURIComponent(`Subject: ${cls.subject}\nRoom: ${cls.room || 'N/A'}\nTeacher: ${cls.teacher || 'N/A'}`);
    const location = encodeURIComponent(cls.room || '');
    const title = encodeURIComponent(cls.subject);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&recur=RRULE:FREQ=WEEKLY`;
  }

  return {
    generateIcs,
    downloadIcsFile,
    autoSaveToPhoneCalendar,
    createGoogleCalendarUrl
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalendarSync;
  module.exports.CalendarSync = CalendarSync;
}
