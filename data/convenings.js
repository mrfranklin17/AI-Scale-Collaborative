/*
 * Convenings and events.
 *
 * To add a convening: copy the template at the bottom of this file, fill it in,
 * and add it to the list. `sessions` drives the session-rating questions in the
 * post-convening survey, so list every session attendees should rate.
 *
 * Content blocks used in `sections[].blocks`:
 *   { p: "text" }                         paragraph
 *   { h: "text" }                         sub-heading
 *   { list: ["a", "b"] }                  bulleted list
 *   { steps: [{ title, text }] }          numbered list
 *   { stats: [{ value, label }] }         stat tiles
 *   { quote: "text" }                     pull quote
 *   { figure: "path", alt, caption }      image
 *   { insight: "text" }                   key-insight line
 *   { source: "text" }                    source line
 *   { analysis: { tag, conditions, blocks: [...] } }
 *        Foundation analysis ("Connection to strategy"). Rendered in a
 *        distinct panel and can be hidden site-wide in assets/js/config.js.
 */
window.ASC = window.ASC || {};

window.ASC.convenings = [
  {
    id: "dream-2026-11",
    host: "dream",
    title: "DREAM Convening",
    number: 1,
    status: "completed",
    start: "2026-11-04",
    end: "2026-11-05",
    dates: "November 4–5, 2026",
    location: "Highbridge & Mott Haven, Bronx, NY",
    summary: "The first Collaborative convening, hosted by DREAM Charter Schools at its Highbridge and Mott Haven campuses in the Bronx.",
    themes: [],
    attendees: null, // number of Collaborative attendees, when known
    // Convening notes are on hold; add takeaways, questions and sections here when ready.
    days: [
      {
        label: "Day 1",
        date: "Wednesday, November 4",
        campus: "Highbridge",
        items: ["Leader Data Day for roughly 100 leaders", "Classroom observations", "AI-native sprint team"]
      },
      {
        label: "Day 2",
        date: "Thursday, November 5",
        campus: "Mott Haven",
        items: ["The tutoring program", "Walkthrough of the DREAM Data Hub", "The AI Task Force", "Coursemojo pilot"]
      }
    ],
    sessions: [
      { id: "leader-data-day", name: "Leader Data Day", day: 1 },
      { id: "classroom-obs", name: "Classroom observations", day: 1 },
      { id: "ai-native", name: "AI-native sprint team meeting", day: 1 },
      { id: "ai-literacy", name: "AI literacy lesson", day: 1 },
      { id: "tutoring", name: "Tutoring program & AI tutoring assistant", day: 2 },
      { id: "data-hub", name: "DREAM Data Hub walkthrough", day: 2 },
      { id: "task-force", name: "AI Task Force", day: 2 },
      { id: "coursemojo", name: "Coursemojo pilot", day: 2 }
    ]
  }

  ,{
    id: "kipp-norcal-2027-03",
    host: "kipp-norcal",
    title: "KIPP NorCal Convening",
    number: 2,
    status: "upcoming",
    statusNote: "Details to come soon!",
    start: "2027-03-23",
    end: "2027-03-25",
    dates: "March 23–25, 2027",
    location: "Bay Area, CA",
    summary: "The second Collaborative convening, hosted by KIPP NorCal. Agenda and site details to come soon.",
    themes: [],
    sessions: []
  }

  /*
  ,{
    id: "kipp-norcal-2027-02",          // unique, used in URLs and survey data
    host: "kipp-norcal",                // a partner id from data/collaborative.js
    title: "KIPP NorCal Convening",
    number: 2,
    status: "upcoming",                 // "upcoming" | "completed"
    start: "2027-02-10", end: "2027-02-12",
    dates: "February 10–12, 2027",
    location: "Bay Area, CA",
    summary: "...",
    themes: [],
    days: [{ label: "Day 1", date: "...", campus: "...", items: ["..."] }],
    sessions: [{ id: "session-id", name: "Session name", day: 1 }],
    highlights: [],
    sections: []
  }
  */
];
