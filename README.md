# AI Scale Collaborative

Website for the Gates Foundation US Charters **AI Scale Collaborative** (CMO Network): collaborative overview, partners, outcome measures, convening notes, and a post-convening survey with a shared feedback dashboard.

It is a static site — plain HTML, CSS and JavaScript, no build step — so it can be hosted on GitHub Pages, SharePoint, Azure Static Web Apps, Netlify or any web server.

## Pages

| Page | File | Content source |
|---|---|---|
| Overview (landing) | `index.html` | `data/collaborative.js` (incl. `milestones`), `data/convenings.js` |
| Purpose & Design | `about.html` | `data/collaborative.js` |
| Partners + map | `partners.html` | `data/collaborative.js` (`partners`), `assets/js/usmap.js` |
| Partner profile | `partner.html?id=…` | `data/collaborative.js` (`partners[].stack`) |
| Measures | `measures.html` | `data/collaborative.js` (`measures`) |
| Convenings | `convenings.html` | `data/convenings.js` |
| Convening detail | `convening.html?id=…` | `data/convenings.js` |
| Feedback dashboard | `feedback.html` | survey responses (see below) |
| Survey | `survey.html?convening=…` | `data/survey.js` |
| Foundation analysis | `foundation.html` | analysis blocks in `data/convenings.js` (currently none) — **unlinked, not access-controlled** |

## Design system

- `assets/css/tokens.css` — every color, type size, spacing step, radius and shadow, with light and dark values. Change the look here.
- `assets/css/site.css` — components built only from tokens: one card (`.card`, `--link`, `--outline`, `--tint`), one button system (`.btn-primary`, `.btn-secondary`, `.btn-ghost`), one chip (`.chip` and variants), plus page sections.
- The Likert scale (`--lk-*`) uses fixed tokens so every chart reads the same. Friction-point colors (`--fr-*`) are kept for when the Collaborative adopts its own implementation framework.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating content

- **New convening:** replace the `convening-2` placeholder in `data/convenings.js` (a full commented template is at the bottom). Fill `host`, dates, `takeaways`, `questions`, `days` (agenda) and `sections`; `sessions` drives the survey's session questions and the dashboard's session chart. Set `status: "completed"` once it has happened so it appears in the survey, then add the next placeholder.
- **Dates:** update `lastUpdated` in `assets/js/config.js` when you change content; measure progress goes in `measures[].current`.
- **Partner profiles, requirements, measures:** edit `data/collaborative.js`.
- **Survey questions:** edit `data/survey.js`. Don't rename an existing question `id` once responses exist — add a new one instead.
- **Images:** put them in `assets/img/` and reference them from a `{ figure: … }` block.

## Survey data

See [`docs/SURVEY_BACKEND.md`](docs/SURVEY_BACKEND.md). Out of the box the site runs in **preview mode**: responses are stored in the visitor's browser only, and the dashboard shows clearly labeled sample data until the first real response is recorded. Connect the shared Supabase table so every school submits to — and sees — the same data.

The dashboard supports:
- Filters for convening (host CMO), respondent organization, role and comment theme, all kept in the URL — send a host a link such as `feedback.html?convening=dream-2026-11&org=kipp-norcal` and Back/Forward work.
- Auto-generated headline findings; whenever a convening or organization is selected, every metric shows its difference from the network, and each Likert bar carries a network marker.
- Session usefulness, by-organization and all-host-CMO tables, and trend small multiples once two convenings have data. (The friction-point question and chart are paused; set `paused: false` on `friction` in `data/survey.js` to bring them back.)
- Comments with theme tags, search and "Show more"; the organization is hidden on comments when it has fewer than 3 respondents.
- CSV export, CSV/JSON import in preview mode, and a Print / Save as PDF layout for host reports.
- Small-group suppression below `minResponsesToShow` (default 3) and a small-sample note below 5.

The survey is a four-step, phone-first form. Answers are saved on the device as people go, and `survey.html?convening=<id>` pre-selects the convening — each convening page has a projectable QR code for that link.

## Configuration

`assets/js/config.js`:

| Setting | Purpose |
|---|---|
| `backend` | `"local"` (preview) or `"supabase"` (shared) |
| `showSampleData` | Show labeled sample responses while no real data exists |
| `contact` | Name (and optional email) shown in the footer |
| `lastUpdated` | "Last updated" dates on Purpose, Partners, Measures and Convenings |
| `minResponsesToShow` | Anonymity threshold for charts and averages |
