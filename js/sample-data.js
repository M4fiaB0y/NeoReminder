/**
 * NeoReminder — Sample Routine Data
 * Modeled after the University Routine Template (Course Code, Course Name, Time, Teacher | Room)
 */

const SAMPLE_ROUTINES = {
  ideal100: {
    name: "100% Accurate Routine Format (CSE Dept)",
    template: "standard_university",
    classes: [
      {
        id: "ideal_sun_1",
        courseCode: "CSE 3151",
        courseName: "Digital Logic Design",
        subject: "CSE 3151 - Digital Logic Design",
        day: "Sunday",
        startTime: "08:30",
        endTime: "09:50",
        teacher: "RBS",
        room: "1704"
      },
      {
        id: "ideal_sun_2",
        courseCode: "CSE 3153",
        courseName: "Database Systems",
        subject: "CSE 3153 - Database Systems",
        day: "Sunday",
        startTime: "11:20",
        endTime: "12:40",
        teacher: "SS",
        room: "903"
      },
      {
        id: "ideal_sun_3",
        courseCode: "MAT 2101",
        courseName: "Linear Algebra",
        subject: "MAT 2101 - Linear Algebra",
        day: "Sunday",
        startTime: "12:45",
        endTime: "14:05",
        teacher: "MSR",
        room: "801"
      },
      {
        id: "ideal_sun_4",
        courseCode: "CSE 3154",
        courseName: "Database Lab",
        subject: "CSE 3154 - Database Lab",
        day: "Sunday",
        startTime: "14:10",
        endTime: "15:30",
        teacher: "SS",
        room: "Lab 4"
      },
      {
        id: "ideal_mon_1",
        courseCode: "CSE 3151",
        courseName: "Digital Logic Design",
        subject: "CSE 3151 - Digital Logic Design",
        day: "Monday",
        startTime: "09:55",
        endTime: "11:15",
        teacher: "RBS",
        room: "1704"
      },
      {
        id: "ideal_mon_2",
        courseCode: "CSE 3155",
        courseName: "Software Engineering",
        subject: "CSE 3155 - Software Engineering",
        day: "Monday",
        startTime: "11:20",
        endTime: "12:40",
        teacher: "MAR",
        room: "602"
      },
      {
        id: "ideal_mon_3",
        courseCode: "GED 1102",
        courseName: "Bangladesh Studies",
        subject: "GED 1102 - Bangladesh Studies",
        day: "Monday",
        startTime: "14:10",
        endTime: "15:30",
        teacher: "FK",
        room: "1002"
      },
      {
        id: "ideal_tue_1",
        courseCode: "MAT 2101",
        courseName: "Linear Algebra",
        subject: "MAT 2101 - Linear Algebra",
        day: "Tuesday",
        startTime: "08:30",
        endTime: "09:50",
        teacher: "MSR",
        room: "801"
      },
      {
        id: "ideal_tue_2",
        courseCode: "CSE 3153",
        courseName: "Database Systems",
        subject: "CSE 3153 - Database Systems",
        day: "Tuesday",
        startTime: "09:55",
        endTime: "11:15",
        teacher: "SS",
        room: "903"
      },
      {
        id: "ideal_tue_3",
        courseCode: "CSE 3152",
        courseName: "Digital Logic Design Lab",
        subject: "CSE 3152 - Digital Logic Design Lab",
        day: "Tuesday",
        startTime: "12:45",
        endTime: "15:30",
        teacher: "RBS & AH",
        room: "Hardware Lab 3"
      },
      {
        id: "ideal_wed_1",
        courseCode: "CSE 3155",
        courseName: "Software Engineering",
        subject: "CSE 3155 - Software Engineering",
        day: "Wednesday",
        startTime: "08:30",
        endTime: "09:50",
        teacher: "MAR",
        room: "602"
      },
      {
        id: "ideal_wed_2",
        courseCode: "GED 1102",
        courseName: "Bangladesh Studies",
        subject: "GED 1102 - Bangladesh Studies",
        day: "Wednesday",
        startTime: "09:55",
        endTime: "11:15",
        teacher: "FK",
        room: "1002"
      },
      {
        id: "ideal_wed_3",
        courseCode: "CSE 3151",
        courseName: "Digital Logic Design",
        subject: "CSE 3151 - Digital Logic Design",
        day: "Wednesday",
        startTime: "12:45",
        endTime: "14:05",
        teacher: "RBS",
        room: "1704"
      },
      {
        id: "ideal_thu_1",
        courseCode: "MAT 2101",
        courseName: "Linear Algebra",
        subject: "MAT 2101 - Linear Algebra",
        day: "Thursday",
        startTime: "08:30",
        endTime: "09:50",
        teacher: "MSR",
        room: "801"
      },
      {
        id: "ideal_thu_2",
        courseCode: "CSE 3153",
        courseName: "Database Systems",
        subject: "CSE 3153 - Database Systems",
        day: "Thursday",
        startTime: "09:55",
        endTime: "11:15",
        teacher: "SS",
        room: "903"
      },
      {
        id: "ideal_thu_3",
        courseCode: "CSE 3155",
        courseName: "Software Engineering",
        subject: "CSE 3155 - Software Engineering",
        day: "Thursday",
        startTime: "11:20",
        endTime: "12:40",
        teacher: "MAR",
        room: "602"
      }
    ]
  },

  batch16: {
    name: "Batch 16, Section A Routine",
    template: "standard_university",
    classes: [
      {
        id: "b16_sun_1",
        courseCode: "CSE 3151",
        courseName: "Digital Logic Design",
        subject: "CSE 3151 - Digital Logic Design",
        day: "Sunday",
        startTime: "09:00",
        endTime: "10:30",
        teacher: "RBS",
        room: "1704"
      },
      {
        id: "b16_sun_2",
        courseCode: "CSE 1111",
        courseName: "Theory of Computing",
        subject: "CSE 1111 - Theory of Computing",
        day: "Sunday",
        startTime: "10:30",
        endTime: "12:00",
        teacher: "MAR",
        room: "1704"
      },
      {
        id: "b16_sun_3",
        courseCode: "HUM 3103",
        courseName: "Principles of Management",
        subject: "HUM 3103 - Principles of Management",
        day: "Sunday",
        startTime: "13:00",
        endTime: "14:30",
        teacher: "SS",
        room: "1702"
      },
      {
        id: "b16_mon_1",
        courseCode: "CSE 3152",
        courseName: "Digital Logic Design Lab",
        subject: "CSE 3152 - Digital Logic Design Lab",
        day: "Monday",
        startTime: "09:00",
        endTime: "12:00",
        teacher: "RBS",
        room: "903"
      },
      {
        id: "b16_tue_1",
        courseCode: "CSE 1111",
        courseName: "Theory of Computing",
        subject: "CSE 1111 - Theory of Computing",
        day: "Tuesday",
        startTime: "13:00",
        endTime: "14:30",
        teacher: "MAR",
        room: "1401"
      },
      {
        id: "b16_tue_2",
        courseCode: "CSE 3253",
        courseName: "Microprocessor & Assembly Language",
        subject: "CSE 3253 - Microprocessor & Assembly Language",
        day: "Tuesday",
        startTime: "14:30",
        endTime: "16:00",
        teacher: "MNI",
        room: "1103"
      },
      {
        id: "b16_wed_1",
        courseCode: "HUM 3103",
        courseName: "Principles of Management",
        subject: "HUM 3103 - Principles of Management",
        day: "Wednesday",
        startTime: "09:00",
        endTime: "10:30",
        teacher: "SS",
        room: "801"
      },
      {
        id: "b16_wed_2",
        courseCode: "CSE 3253",
        courseName: "Microprocessor & Assembly Language",
        subject: "CSE 3253 - Microprocessor & Assembly Language",
        day: "Wednesday",
        startTime: "10:30",
        endTime: "12:00",
        teacher: "MNI",
        room: "801"
      },
      {
        id: "b16_wed_3",
        courseCode: "CSE 3254",
        courseName: "Microprocessor & Assembly Language Lab",
        subject: "CSE 3254 - Microprocessor & Assembly Language Lab",
        day: "Wednesday",
        startTime: "13:00",
        endTime: "16:00",
        teacher: "MNI",
        room: "802"
      },
      {
        id: "b16_fri_1",
        courseCode: "EEE 1212",
        courseName: "Electrical Circuit Analysis + Lab",
        subject: "EEE 1212 - Electrical Circuit Analysis + Lab",
        day: "Friday",
        startTime: "09:00",
        endTime: "12:00",
        teacher: "MES",
        room: "1703"
      }
    ]
  },

  university: {
    name: "University Routine Sample",
    template: "standard_university",
    classes: [
      {
        id: "uni_1",
        courseCode: "CSE 221",
        courseName: "Algorithms",
        subject: "CSE 221 - Algorithms",
        day: "Monday",
        startTime: "09:30",
        endTime: "11:00",
        teacher: "Dr. Ahmed",
        room: "Room 402"
      },
      {
        id: "uni_2",
        courseCode: "CSE 222",
        courseName: "Algorithms Lab",
        subject: "CSE 222 - Algorithms Lab",
        day: "Monday",
        startTime: "11:30",
        endTime: "14:30",
        teacher: "Dr. Ahmed",
        room: "Lab 3"
      },
      {
        id: "uni_3",
        courseCode: "MAT 201",
        courseName: "Discrete Mathematics",
        subject: "MAT 201 - Discrete Mathematics",
        day: "Wednesday",
        startTime: "10:00",
        endTime: "11:30",
        teacher: "Prof. Hasan",
        room: "Room 501"
      },
      {
        id: "uni_4",
        courseCode: "CSE 231",
        courseName: "Data Structures",
        subject: "CSE 231 - Data Structures",
        day: "Wednesday",
        startTime: "13:00",
        endTime: "14:30",
        teacher: "Dr. Khan",
        room: "Room 305"
      },
      {
        id: "uni_5",
        courseCode: "CSE 221",
        courseName: "Algorithms",
        subject: "CSE 221 - Algorithms",
        day: "Thursday",
        startTime: "09:30",
        endTime: "11:00",
        teacher: "Dr. Ahmed",
        room: "Room 402"
      }
    ]
  },

  college: {
    name: "College Schedule",
    template: "standard_college",
    classes: [
      {
        id: "col_1",
        courseCode: "PHY 101",
        courseName: "General Physics",
        subject: "PHY 101 - General Physics",
        day: "Monday",
        startTime: "08:00",
        endTime: "09:30",
        teacher: "Mr. Alam",
        room: "Hall A"
      },
      {
        id: "col_2",
        courseCode: "CHM 101",
        courseName: "Organic Chemistry",
        subject: "CHM 101 - Organic Chemistry",
        day: "Monday",
        startTime: "10:00",
        endTime: "11:30",
        teacher: "Mrs. Begum",
        room: "Science Lab"
      },
      {
        id: "col_3",
        courseCode: "MTH 101",
        courseName: "Calculus I",
        subject: "MTH 101 - Calculus I",
        day: "Tuesday",
        startTime: "09:00",
        endTime: "10:30",
        teacher: "Mr. Roy",
        room: "Room 201"
      },
      {
        id: "col_4",
        courseCode: "ENG 101",
        courseName: "English Literature",
        subject: "ENG 101 - English Literature",
        day: "Wednesday",
        startTime: "11:00",
        endTime: "12:30",
        teacher: "Ms. Sarah",
        room: "Room 102"
      }
    ]
  }
};
