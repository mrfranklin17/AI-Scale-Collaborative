# Connecting the shared survey database (Supabase)

Preview mode stores responses in each visitor's browser, so nobody else sees them. For a shared dashboard, the site writes to and reads from one Supabase table through Supabase's REST API. No server code is needed.

## 1. Create the table

In your Supabase project, open **SQL Editor → New query**, paste this and click **Run**:

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

-- Make sure the public role can use the table through the API.
grant select, insert on public.survey_responses to anon;
```

No update or delete policy is created, so responses cannot be edited or removed from the site. Clean up data in the Supabase **Table Editor**.

## 2. Copy two values

In **Project Settings → API** (or **API Keys** in newer dashboards):

- **Project URL**, e.g. `https://abcd1234.supabase.co`
- **Publishable key** (`sb_publishable_…`). Older projects call it the **anon / public** key (starts with `eyJ…`). Either works.

Never use the **secret** or **service_role** key on the site.

## 3. Point the site at it

In `assets/js/config.js`:

```js
backend: {
  type: "supabase",
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-PUBLISHABLE-KEY",
  table: "survey_responses"
}
```

The publishable key is designed to be public; the row-level security policies above decide what it can do. When the site is connected, the "Preview mode" notice disappears from the survey and sample data disappears from the dashboard once the first real response arrives.

## What gets stored

Each response is one row. `organization` and `role` are stored as ids (e.g. `kipp-norcal`, `foundation`); `answers` holds:

```json
{
  "likert":   { "objectives": 4, "relevance": 5, "host_view": 4, "actionable": 5,
                "focus_students": 3, "agenda": 4, "connections": 4, "logistics": 3 },
  "nps":      9,
  "sessions": { "data-hub": 5, "tutoring": 4 },
  "friction": "practice",
  "open":     { "valuable": "…", "try": "…", "improve": "…" }
}
```

Question ids come from `data/survey.js`. Don't rename an id once responses exist — add a new one, so old and new wording are never mixed.

## Foundation responses

A response counts as a Foundation response when the role is **Foundation employee** or the organization is **Gates Foundation**. The dashboard's **Exclude Foundation responses** switch removes them from every chart, table and comparison, and the choice is kept in the link (`&foundation=exclude`).

## Access considerations

With the policies above, anyone who has the site URL can read all responses (organization, role, ratings and comments — never names). That fits a site shared only with collaborative members. If the site will be public, put it behind sign-in (for example Vercel password protection) or replace the `select` policy with one that requires an authenticated Supabase user.
