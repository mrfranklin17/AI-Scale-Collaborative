# AI Scale Collaborative

Website for the Gates Foundation US Charters **AI Scale Collaborative** (CMO & Intermediary Network): collaborative overview, partners, outcome measures, convening notes, and a post-convening survey with a shared feedback dashboard.

It is a static site — plain HTML, CSS and JavaScript, no build step — so it can be hosted on GitHub Pages, SharePoint, Azure Static Web Apps, Netlify or any web server.

## Pages

| Page | File | Content source |
|---|---|---|
| Overview (landing) | `index.html` | `data/collaborative.js`, `data/convenings.js` |
| Purpose & Design | `about.html` | `data/collaborative.js` |
| Partners | `partners.html` | `data/collaborative.js` (`partners`) |
| Measures | `measures.html` | `data/collaborative.js` (`measures`) |
| Convenings | `convenings.html` | `data/convenings.js` |
| Convening detail | `convening.html?id=…` | `data/convenings.js` |
| Feedback dashboard | `feedback.html` | survey responses (see below) |
| Survey | `survey.html` | `data/survey.js` |

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating content

- **New convening:** add an entry to `data/convenings.js` (a commented template is at the bottom). Its `sessions` list drives the session-rating questions in the survey and the session chart on the dashboard. Mark it `status: "completed"` once it has happened so it appears in the survey.
- **Partner profiles, requirements, measures:** edit `data/collaborative.js`.
- **Survey questions:** edit `data/survey.js`. Don't rename an existing question `id` once responses exist — add a new one instead.
- **Images:** put them in `assets/img/` and reference them from a `{ figure: … }` block.

## Survey data

See [`docs/SURVEY_BACKEND.md`](docs/SURVEY_BACKEND.md). Out of the box the site runs in **preview mode**: responses are stored in the visitor's browser only, and the dashboard shows clearly labeled sample data until the first real response is recorded. Connect the shared Supabase table so every school submits to — and sees — the same data.

The dashboard supports:
- Filtering by convening (host school), respondent organization, and respondent role; filters are kept in the URL, so a host can bookmark or share its own view (e.g. `feedback.html?convening=dream-2026-11`).
- Host-vs-network comparison, session usefulness, friction-point resonance, a by-organization table, and an all-host-schools comparison table.
- Searchable open-ended comments.
- CSV export of the filtered responses, and CSV/JSON import in preview mode.
- Small-group suppression: slices with fewer than `minResponsesToShow` responses (default 3) are hidden.

## Configuration

`assets/js/config.js`:

| Setting | Purpose |
|---|---|
| `backend` | `"local"` (preview) or `"supabase"` (shared) |
| `showSampleData` | Show labeled sample responses while no real data exists |
| `showFoundationAnalysis` | Show or hide the "Foundation analysis · Connection to strategy" panels on convening pages |
| `minResponsesToShow` | Anonymity threshold for charts and averages |
