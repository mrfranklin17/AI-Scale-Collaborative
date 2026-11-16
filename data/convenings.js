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
    title: "DREAM Charter Schools Site Visit",
    number: 1,
    status: "completed",
    start: "2026-11-04",
    end: "2026-11-05",
    dates: "November 4–5, 2026",
    location: "Highbridge & Mott Haven, Bronx, NY",
    summary:
      "The first collaborative convening. Two days inside DREAM's data infrastructure, AI program and tutoring model — from Leader Data Day with roughly 100 leaders to an AI-native sixth-grade sprint and a Coursemojo pilot.",
    themes: ["Data infrastructure", "Innovative mindsets", "Rapid data cycles", "Human-led AI tutoring", "AI literacy"],
    notesBy: "Foundation team site-visit notes",
    attendees: null, // number of collaborative attendees, when known
    takeaways: [
      "Data infrastructure comes first: a five-year Data Hub build with in-house engineers sits under every routine we saw.",
      "AI sits behind the adult. The redesigned tutoring assistant prepares materials and analyzes student work; a person teaches.",
      "Build to the workflow people already use — the Observation Agent lives inside Google Chat, where leaders already write.",
      "Time savings are measured (50 hours per teacher a year, 99.3% AI–teacher scoring agreement); effects on instruction are not yet.",
      "Where tutoring sits in the day decides dosage. The first AI-tutoring comparison ran on about four hours per student."
    ],
    questions: [
      "Does time freed by AI scoring change what happens in Monday’s lesson — and how would a network observe it?",
      "What dosage does AI-assisted tutoring need before its effect can fairly be tested?",
      "How should networks track proficiency for Black, Latino, and low-income students in grades where no state assessment is given?",
      "When a tool won’t share its data (as with Zearn here), how should the vendor-transparency requirement apply?",
      "How do we know whether a flagged intervention was any good, not only that it was recorded?"
    ],
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
    ],
    highlights: [
      { value: "5 yrs", label: "building the DREAM Data Hub" },
      { value: "35 → 5–8", label: "external AI tools piloted → retained" },
      { value: "50 hrs", label: "saved per teacher per year (DREAM-reported)" },
      { value: "99.3%", label: "AI–teacher scoring agreement, 400+ samples" }
    ],
    sections: [
      {
        id: "conditions",
        nav: "Enabling conditions",
        title: "Core enabling conditions",
        lede: "Two themes ran across both days and sit beneath everything else: data infrastructure and innovative mindsets.",
        blocks: [
          {
            figure: "assets/img/dream-enabling-conditions.webp",
            alt: "Diagram: data infrastructure and innovative mindsets feed intentional AI implementation, which supports rapid data cycles, an AI tutoring assistant, an AI literacy curriculum and AI-native sprints. A bottom row summarizes the evidence so far: measured, no effect yet, split by subject, not measurable.",
            caption: "Our framing of what we observed across both days, not a model DREAM presented. Arrows show order of dependence, not a tested causal path."
          }
        ]
      },
      {
        id: "data-infrastructure",
        nav: "Data infrastructure",
        title: "Data infrastructure",
        lede: "DREAM spent five years building the data hub where student data lives. Almost everything else we saw runs on top of it.",
        blocks: [
          { p: "Before that work, data sat in separate systems. It now sits in a warehouse and a staff-facing tool DREAM calls the Data Hub, with a single view of a student spanning academics, screeners, i-Ready, quiz and unit results, the pacing calendar down to which lessons a student missed and which skills, behavior, IEP status, demographics, and athletics and clubs. DREAM employs its own engineers." },
          { h: "What it is built on" },
          {
            list: [
              "BigQuery as the warehouse, with a transformation layer and SQL on top, and Looker Studio for business intelligence",
              "Seven databases feeding in, including PowerSchool and PowerSchool Gradebook",
              "A third-party sync tool where connectors exist, as with Salesforce; hand-built pipelines where they don't",
              "A data team of a director, high school data manager and a data coordinator, who also maintain the Data Hub site — they describe the site as their primary product",
              "Claude was used to carry out the migration from Looker into the Data Hub",
              "Tiered access, so sensitive data such as HR records is visible only to those who should see it. Data governance and data quality were both named as critical"
            ]
          },
          { h: "What the Data Hub is built to do" },
          { p: "Navigation is organized by domain rather than by source system — impact, enrollment and attendance, academics, student supports (mental health, response to intervention, social and emotional learning, fellowship, special education), culture, external learning and enrichment, community impact — with a glossary and legend built in." },
          { p: "The heading on the main panel of the response-to-intervention board reads: where to intervene. Each category shows the students carrying a red flag and, beside it, the share already receiving an intervention against a target." },
          { h: "What it pulls together" },
          {
            list: [
              "Attendance, including ADA, total absences and unexcused absences",
              "Behavior, including incident counts, suspensions, incidents per student and weekly trend",
              "Coursework",
              "Community referrals, housing, and social and emotional learning or mental health",
              "IEP status and special education",
              "Participation and dosage in enrichment and tutoring, logged by session against a goal",
              "Walkthrough and observation data",
              "Intervention records drawn from several systems outside the Hub — Salesforce, DeansList, UniteUs, SESIS and the counseling system"
            ]
          },
          { h: "How it is built to be acted on" },
          {
            list: [
              "Flags come from written business rules, versioned, with the definition available on screen — how the attendance flag works, and what counts as an attendance intervention",
              "Boards can be filtered by role, including academic deans, the data team, community social workers, mental health providers and RACE managers",
              "Numbers are shown with the target beside them, and screens carry a refresh date",
              "Drill-down goes to the individual student, with the date of the last intervention shown"
            ]
          },
          { h: "Building to the workflow that already exists" },
          { p: "Leaders were supposed to log classroom observations in the system built for it. They resisted, and sent emails instead. Rather than push harder, DREAM built an agent inside Google Chat — the DREAM Observation Agent — that takes what a leader writes, interprets the evidence against rubrics held in the back end, tags it, and drafts the follow-up email. The record is captured as a by-product. The agent sits inside the tool principals and deans were already using." },
          { p: "The same pattern shows up on the operations side. A monthly budget report that used to be assembled by hand from the accounting system now runs off a pipeline into the warehouse and updates live." },
          { h: "How the flags get worked" },
          { p: "The data director walks leaders through the flags for each student and each school. Leaders then take them to their deans and case managers, which is how resources get mobilized from the center. Intervention records still arrive from many systems, and DREAM described a lot of variability in how interventions are entered." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Using data in daily routines; staffing and scheduling; leadership across the system",
              blocks: [
                { p: "Two kinds of view sit side by side on the screens we saw. One is current-state: who is flagged now, whether an intervention is recorded, and the date of the last one. The other is directional: incidents by week, participation hours by week, and dosage against a stated target. The second kind shows movement before an outcome exists. Whether DREAM describes the design this way, and how often the data refreshes, we did not ask." },
                { p: "This is the layer our site readiness factors assume. Shared data infrastructure appears in our criteria as a condition a partner can assert. Here it is a five-year build with in-house engineers behind it, and every routine depends on it." },
                { p: "What is not established: whether any of it changes what happens in a classroom. The Hub makes a flag and an intervention visible. It does not record whether the intervention was any good, and DREAM itself names the variability in how interventions are entered as an ongoing problem." }
              ]
            }
          }
        ]
      },
      {
        id: "mindsets",
        nav: "Innovative mindsets",
        title: "Innovative mindsets",
        lede: "DREAM invests in how adults approach new tools rather than in the tools themselves.",
        blocks: [
          { p: "The stated reasoning: the technology moves too fast to make any particular tool the thing. The investment is in sequential thinking and an innovative disposition, starting from what problem you are trying to solve rather than from what a product does." },
          { h: "What that looks like in practice" },
          {
            list: [
              "Seven data-driven mindsets posted as norms, including that results are not a reflection of worth as a person and that failures and successes are both opportunities",
              "A top-and-bottom approach to building: everyone uses the same foundational agents, with freedom to build their own on top and an expectation of sharing them",
              "Culture and adaptive change work treated as constant rather than as a phase, with psychological safety named as a design principle because staff are effectively doing two jobs at once",
              "A framing leaders used repeatedly: agility = stability",
              "Enterprise AI access for every staff member since 2023",
              "An AI Task Force with representation from every level, central office and schools",
              "35 external tools piloted and five to eight retained",
              "Co-design treated as a condition of consideration, with a two-day change-turnaround benchmark and a one-month teacher abandonment threshold",
              "Negative results about their own builds reported openly and acted on in the same cycle",
              "An AI program running since SY23–24 — task force, staff and student usage policies, data cycles, enterprise tooling, AI literacy standards, staff surveys, targeted training, then the tutoring assistant, the literacy curriculum and the AI-native pilots"
            ]
          },
          { quote: "It's not that we're running fast, it's that we're building toward our mission." },
          { h: "The AI Task Force, and how staff capability is built" },
          { p: "DREAM began tinkering in 2023 and made two decisions that set the course: give every staff member enterprise access to AI — which DREAM believes made it among the first school systems in the country to do so — and convene a task force with representation from every level and every corner of the organization, central office and schools alike." },
          { p: "The stated logic is that the choice of where to apply AI should sit with the people doing the work rather than with outsiders telling them where it fits. Three beliefs were named:" },
          {
            list: [
              "Solutions will be better if they come from the people doing the work",
              "DREAM's network team members should lead in the charter space on their own functions — finance on finance, the people team on talent, and so on",
              "A culture of innovation never goes out of style: can you think critically about your work, and can you see opportunities to improve it"
            ]
          },
          { h: "The training sequence" },
          {
            list: [
              "AI Foundations Training for every new hire. It began as a presentation and is now a self-paced site of nine tiles, before meeting as a group. The session is spent on concerns and on building — new hires build in the room",
              "Two team-based trainings a year, set in each team's own context — not really about AI, but about thinking critically and innovatively about the work and then asking where AI would help",
              "A cohort of 15 leaders across the network office who turnkey the training, so capability does not depend on two moments a year",
              "AI competency is looked for in hiring, and training is designed to bring people in at different levels of comfort and close the gap"
            ]
          },
          { p: "What comes out of it is not confined to instruction. The fundraising team is building an agent that prepares for a funder meeting, connected to the data warehouse. DREAM's own framing is that the limiting factor has been staff curiosity rather than tooling." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Leadership across the system; teacher collaboration and coaching",
              blocks: [
                { p: "Even though our conditions are well specified, this visit shows that a site can meet one of them at very different depths. Take data use in instructional routines. At DREAM it exists in three different places:" },
                {
                  steps: [
                    { title: "The technology", text: "A warehouse, seven source databases, built pipelines, a data team that treats the Hub as its product. Five years and its own engineers." },
                    { title: "The routines", text: "Leader Data Day, the two-week cycle, flags walked through with the people who own them, small-group tutor training against a playbook. This is the actual work — and the hardest to see from outside. It took five years and a change in culture." },
                    { title: "The way the organization is set up", text: "Enterprise AI access for every staff member, a cross-level task force, Foundations Training for every new hire, two team deep dives a year, 15 leaders who run that training, AI competency in hiring, bad results reported openly. Staffing and governance decisions, not technical ones." }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: "observed",
        nav: "What we observed",
        title: "What we observed",
        lede: "Seven sessions across Highbridge and Mott Haven.",
        blocks: [
          { h: "Leader Data Day (twice a year)" },
          { p: "Adam's team spends a week on data integration and analysis in support of the routine, and the day itself gives roughly 100 leaders, including the network support team, time to internalize what it says. Crystal formalized it in 2021; before that it was informal. Analysis is comparative by campus, and this year covers a new early childhood program (ages 0–4) alongside K–12." },
          { p: "Seven data-driven mindsets are posted as norms — among them that results are not a reflection of worth as a person, that failures and successes are both opportunities, and that the commitment to student achievement is in support of equity. The shift leaders described: a network visit used to create anxiety; now every school has something working, and it reads as partnership." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Using data in daily routines; leadership across the system",
              blocks: [
                { p: "Two of the conditions we invest in are present here as standing routines. Data use: a twice-yearly leader cycle and more rapid school cycles every two weeks, both with named owners and scheduled time. System leadership: the routine is where leaders, including the network support team, read campus-by-campus variation together." },
                { p: "What is not established: any link between the routine and student outcomes. DREAM presented the routine and the results in the same session but did not claim one produced the other." }
              ]
            }
          },
          { h: "Rapid data, every other week" },
          { p: "Two assessments a week from a quiz or unit, analyzed and converted into a whole-group or small-group response. Agents score student work against DREAM's rubrics, surface the one or two misconceptions worth reteaching, and draft the reteach lesson, grades 3–12, trained on five work samples per assessment and co-designed with Enlighten. Academic Deans are trained on the tools." },
          { p: "Before: teachers spent Friday reading student work and might understand the gap by the end of the day. Now the scoring and gap analysis arrive done, and Friday is spent grappling with what to reteach and preparing it. Leaders named data weeks as a prior source of burnout, especially for new Academic Deans and Coaches." },
          { stats: [{ value: "50 hrs", label: "saved annually per teacher, 200+ teachers" }, { value: "99.3%", label: "AI–teacher scoring agreement, 400+ samples" }] },
          { source: "Both figures DREAM-reported, SY25–26." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Using data in daily routines; teacher collaboration and coaching",
              blocks: [
                { p: "What is not measured: whether the freed time changes instruction. There is no observation data on Friday planning or Monday teaching, and no outcome data connected to the time saved. The condition — data use in instructional routines — is evidenced at the point of analysis and not at the point of instruction." }
              ]
            }
          },
          { h: "Intervention with the AI tutoring assistant — 3rd grade and middle school" },
          { p: "DREAM's stated position, unprompted: student-facing AI is not that great, it fails worst for low-motivation low-skill students, and the population furthest behind extracts the least value from it. So the weekly loop runs — AI generates the lesson materials and assessment, a tutor delivers the lesson, the student completes the assessment, AI analyzes it. The student's digital interface exists only to let the tutor respond faster. In the SY25–26 math pilot students did not interact with the platform at all. This year the model extends to K–8 ELA intervention and adds automatic grading." },
          { p: "Delivery is by teachers paid extra to tutor, plus six high school seniors tutoring younger students. Grouping is by common need, generated by algorithm or built by hand. Every student gets a differentiated worksheet. Tutors are trained in groups of two to four against a playbook of look-fors, with continuous retraining." },
          { quote: "Not remediation wherever the student sits. Look ahead to what they will learn in Tier 1 next week, identify the prior-grade skill critical to doing well on that content, and teach that." },
          { p: "Operationalized by mapping DREAM's curriculum and pacing calendar against Learning Commons' knowledge graph. The tutor pulls from actual IM tasks." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Instructional coherence; staffing and scheduling; coaching",
              blocks: [
                { p: "Coherence: the tutor pulls its tasks from IM and follows DREAM's own pacing calendar, with prerequisite links from the Learning Commons knowledge graph — so Tier 1 and intervention run on the same curriculum in the same order." },
                { p: "What the first version taught them: the diagnosis worked — it found the right missing prerequisites. The delivery did not. Students could move on from a correct answer without ever explaining it, and the more they used it the worse they did." },
                { p: "What we don't know about the current version: whether tutors are observed against the playbook, what dosage students actually get, and what the model produces." }
              ]
            }
          },
          { h: "AI literacy lesson" },
          { p: "DREAM teaches students to question AI inside history class, because history already teaches them to question a source. AI literacy comes first — terminology, critical thinking, protocols — then the history overlay. Units run 12–13 lessons with a formative assessment every two weeks." },
          {
            steps: [
              { title: "Accept, revise or reject", text: "Is it relevant and precise?" },
              { title: "Verify and repair", text: "Does a source support it?" },
              { title: "Spot the bias", text: "Whose account is it telling?" },
              { title: "Equity and analysis", text: "Who benefits, who is harmed?" }
            ]
          },
          { p: "Example questions across grades — grade 6: how do new tools change who holds power; grade 7: what makes a rule strong enough to limit a power it was never written for; grade 8: when machines do the work, who is responsible for the results; grade 9: who gains power when knowledge is controlled." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Instructional coherence",
              blocks: [
                { p: "DREAM's own stated implications from the pilot: focused units produced clearer gains than skills spread thinly across the year; strong PD and teacher buy-in were central to adoption; turnkey materials and common routines made strong instruction more consistent." },
                { p: "The pilot evidence: gains are in writing, on open-response scores — grade 6 from 68.5 to 76.9, grade 7 from 74.3 to 88.6. Pre and post samples differ in size (105 to 141, and 221 to 181), so they are not the same students, and no comparison group is reported. Writing is the subject where DREAM's AI results have been strongest." }
              ]
            }
          },
          { h: "AI-native teacher meeting" },
          { p: "The team meets about the design principles, not about the tool. Three three-week sprints in three sixth-grade classrooms at Highbridge MS; the first began October 5. In Sprint 1 the schedule and routines are deliberately held constant while AI is embedded in ELA and math to support mastery-based learning. Highbridge is the network's hardest site: lowest rates year over year, a K–4 program still growing, and a sixth grade entirely new to DREAM that arrived below grade level." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Staffing and scheduling",
              blocks: [
                { p: "Sprint 1 holds schedule and routines constant and varies the use of AI within existing ELA and math blocks. Staffing and scheduling is deliberately not a variable in this sprint. DREAM states the longer-term direction as testing whether core academics can be compressed to free time for experiential learning, which would make it one." },
                { p: "Grade 6 is the network's lowest-performing grade at IA1 in both subjects. The comparison homerooms share the setting's characteristics; whether the groups started out the same has not been published." }
              ]
            }
          },
          { h: "The tutoring program" },
          { p: "Math tutoring is centrally designed and sits outside the school day. ELA intervention is in the schedule and run by the schools. The asymmetry is deliberate. Each site's tutoring is run by a site lead, usually an academic dean. A Saturday runs roughly 8:00 to 12:00 with breakfast and lunch and lessons back to back. Weekday math tutoring runs an hour, Monday to Thursday, 7:30 to 8:30. DREAM does not run afternoon tutoring, because afternoons are held for enrichment and sports." },
          { p: "On math the center sets group size, a minimum weekly dosage, and tutor placement; timing is left to each school. ELA is not centralized at all. ELA intervention is 30 minutes Monday to Thursday inside the schedule. Asked why, DREAM's answer was results — ELA has been the weaker subject, math the stronger, and math has produced results even at lower participation. 30% of DREAM's students are English learners." },
          { p: "An incentive system aimed at families as well as students supports attendance. Participation in September was running below the historical 70–80%, and attendance was described as still unresolved after COVID. The mixed review packets used in tutoring are built by schools rather than centrally — flagged in the room as the kind of material where quality tends to be lowest." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Staffing and scheduling; instructional coherence",
              blocks: [
                { p: "This is the clearest example in the portfolio of scheduling as the binding constraint rather than content. The subject with stronger results is held outside the school day, and the one with weaker results holds the protected minutes. The reasoning is defensible, but math gains depend on students showing up an hour before school or on a Saturday." },
                { p: "The mixed review packets are a coherence gap inside an otherwise coherent block." }
              ]
            }
          },
          { h: "Coursemojo pilot" },
          { p: "Coursemojo is being piloted at Mott Haven as a teacher assistant tool, to support in-the-moment instructional shifts — surfacing, for example, that 47% of a class is struggling with a particular thing while the lesson is still running." },
          {
            analysis: {
              tag: "Charter Scale",
              conditions: "Using data in daily routines",
              blocks: [
                { p: "The same design principle as the rest of DREAM's AI work, applied to a bought product rather than a built one: the AI informs the adult in the moment, and the adult decides. Coursemojo is one of the two products DREAM named as having an API into its data stack. Not established: whether teachers act on what it surfaces, or what it changes. The pilot is new." }
              ]
            }
          }
        ]
      },
      {
        id: "frictions",
        nav: "Implementation frictions",
        title: "Where does implementation break down?",
        lede: "Notes organized against the Implementation R&D friction framework: product, configuration, coherence and practice.",
        frictions: true,
        blocks: [
          {
            figure: "assets/img/dream-friction-map.webp",
            alt: "Map of what was observed at DREAM against each friction point: product, configuration, coherence and practice, with items marked measured, observed or potential friction.",
            caption: "The framework assumes results to diagnose; at DREAM implementation is not yet strong, so this is a map of where to look, not a diagnosis. Which item sits where is our reading, not DREAM's."
          }
        ],
        frictionNotes: {
          product: {
            points: [
              { label: "Features that support or hinder", text: "The first version of the tutoring assistant diagnosed well: the knowledge graph identified the right missing prerequisites. It failed on delivery — students could advance on a correct answer without explaining how they got it, and heavier use correlated with worse outcomes." },
              { label: "Usability and workflow", text: "Coursemojo flags mid-lesson that 47% of a class is stuck. It fits the moment a teacher can act in, which is the thing most dashboards miss. Too new to judge." },
              { label: "Design improvements", text: "Version two puts the AI behind the adult: it generates the materials and analyzes the assessment, and the student screen exists only to let the tutor respond faster." }
            ],
            insight: "Make students explain a correct answer before they advance.",
            source: "AI tools demo and intervention observations, Highbridge Nov 4; Coursemojo pilot, Mott Haven Nov 5."
          },
          configuration: {
            points: [
              { label: "Implementation guidance", text: "DREAM's interpretation on tutoring is that the program needs a longer runway before implementation is settled enough to test at all." },
              { label: "Setup recommendations", text: "Flags come from written, versioned business rules with the definition on screen. The Hub carries flags by student and school, with the share already receiving an intervention shown against a target. Whether tutoring assignment runs off them was not established." },
              { label: "Data integration", text: "Two gaps. Zearn data is not accessible to DREAM, so one stack component cannot feed the warehouse. And intervention records arrive from five outside systems with a lot of variability in how they are entered." }
            ],
            insight: "One tool that won't share data breaks the single view of a student.",
            source: "Data Hub walkthrough and tutoring conversation, Mott Haven Nov 5."
          },
          coherence: {
            points: [
              { label: "A strong full-stack example", text: "The tutoring assistant runs on the warehouse and the Learning Commons knowledge graph, pulling from actual IM tasks and sequenced against DREAM's pacing calendar. DREAM had to build that alignment itself." },
              { label: "Alignment across curriculum, tools and supports", text: "Tier 1 and the intervention teach the same curriculum in the same order." },
              { label: "School-level patterns", text: "The mixed review packets used in tutoring are school-built, with no central quality check described. The center sets group size, minimum weekly dosage and tutor placement — but not this." }
            ],
            insight: "The AI is sequenced to the curriculum. The paper beside it is not.",
            source: "Tutoring intervention observations, Highbridge Nov 4; tutoring program conversation, Mott Haven Nov 5."
          },
          practice: {
            points: [
              { label: "Coaching and professional learning", text: "AI tutors are trained in groups of two to four against a playbook of look-fors, with continuous retraining. Non-AI tutors are trained by site leads with no central curriculum. Whether tutors are observed against the playbook was not established — and the redesign made adult practice the active ingredient." },
              { label: "Dosage", text: "At the first interim, three groups across four weeks — AI-assisted tutoring, tutoring without AI, and no tutoring — showed no difference between the two tutored groups; untutored students were behind. Behind it: about four hours of tutoring and four platform logins, below what these products are designed around." },
              { label: "Monitoring", text: "The Hub logs participation and dosage by session against a goal, so the capability exists. Whether it sits in anyone's weekly routine for tutoring is unestablished." },
              { label: "Leadership routines", text: "Math tutoring runs before school and Saturdays; participation was below its historical 70–80%, so how much tutoring a student gets is decided by who shows up." }
            ],
            insight: "Where tutoring sits in the day decides how much students get.",
            source: "Tutoring program conversation, Mott Haven Nov 5; tutor training and Leader Data Day, Highbridge Nov 4."
          }
        }
      }
    ]
  }

  ,{
    // Placeholder until the next host and dates are confirmed. Update host,
    // dates and status ("upcoming" once scheduled) when they are set.
    id: "convening-2",
    host: null,
    title: "Convening 2",
    number: 2,
    status: "planning",
    start: "2027-02-01",
    dates: "Early 2027",
    location: "To be confirmed",
    summary: "Next quarterly convening. Host, dates and agenda to be confirmed.",
    themes: [],
    sessions: []
  }

  /*
  ,{
    id: "kipp-norcal-2027-02",          // unique, used in URLs and survey data
    host: "kipp-norcal",                // a partner id from data/collaborative.js
    title: "KIPP NorCal Site Visit",
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
