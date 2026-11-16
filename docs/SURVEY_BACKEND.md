# Connecting the shared survey database

Preview mode stores responses in each visitor's browser, so nobody else sees them. For a shared dashboard, connect a free [Supabase](https://supabase.com) project (hosted Postgres with a REST API). No server code is needed.

## 1. Create the table

In the Supabase SQL editor, run:

```sql
create table public.survey_responses (
  id            text primary key,
  submitted_at  timestamptz not null default now(),
  convening_id  text not null,
  organization  text not null,
  role          text not null,
  answers       jsonb not null
);

alter table public.survey_responses enable row level security;

-- Anyone with the site can submit a response.
create policy "submit responses" on public.survey_responses
  for insert to anon with check (true);

-- Anyone with the site can read responses (needed for the shared dashboard).
create policy "read responses" on public.survey_responses
  for select to anon using (true);
```

No update or delete policy is created, so responses cannot be edited or removed from the site. Clean up data from the Supabase dashboard.

## 2. Point the site at it

In `assets/js/config.js`:

```js
backend: {
  type: "supabase",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-ANON-PUBLIC-KEY",
  table: "survey_responses"
}
```

The anon key is designed to be public; the row-level security policies above decide what it can do.

## Access considerations

With the policies above, anyone who has the site URL can read all responses (organization, role, ratings and comments — never names). That fits a site shared only with collaborative members. If the site will be public, either host it behind sign-in (e.g. Azure Static Web Apps with Entra ID, or SharePoint) or replace the `select` policy with one that requires an authenticated Supabase user.

## Moving existing data

If responses were collected in preview mode or another tool, use **CSV** on the Feedback page to export, and import into Supabase via its table editor (`answers` holds the `likert`, `nps`, `sessions`, `friction` and `open` fields as JSON — see `assets/js/store.js` for the exact shape).
