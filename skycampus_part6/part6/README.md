# SkyCampus — Part 6: Parent Portal + Student Portal

## What is included

### Parent Portal (web/app/parent/)
  layout.tsx              Portal shell — own topbar/nav (not the admin sidebar), role guard (redirects
                           non-Parent users back to /dashboard), mobile bottom nav
  page.tsx                Dashboard — children cards with balance due, recent school notices
  children/page.tsx       Full list of linked children with photo, class, balance
  children/[id]/page.tsx  Child detail — 4 tabs: Results (uses computeClassRegister from Part 5),
                           Fees (balance bar + breakdown), Attendance (rate + log), Timetable (weekly grid)
  messages/page.tsx       Compose + view messages to/from school staff
  notices/page.tsx        Full announcements feed filtered to "all" + "parents" audience

### Student Portal (web/app/student/)
  layout.tsx              Portal shell — cyan-themed nav, role guard (redirects non-Student users)
  page.tsx                Dashboard — today's schedule, term average/rank stat cards, recent marks
  results/page.tsx        Full results view (Pre-Mid/Post-Mid toggle), rank/average/grade summary
  timetable/page.tsx      Read-only weekly timetable grid
  attendance/page.tsx     Attendance stats (rate/present/absent/late) + full log
  materials/page.tsx      Placeholder for homework/materials + notices feed filtered to "students"

## Depends on Parts 1-5
Place all previous parts first. These portals specifically reuse:
- lib/academics/computeRegister.ts (Part 5) for Results tabs
- lib/utils/formatters.ts (Part 1) for currency/date formatting
- lib/store/authStore.ts (Part 1) for the logged-in user context

## Important implementation note: student-user linking
The Student Portal currently matches the logged-in auth user to a `students` row via
`ilike('admission_number', user.username)`. This assumes the student's portal username
is set to their admission number at account creation (handled in Settings > User
Management from Part 2). If a school wants a different linking strategy (e.g. a
dedicated `user_id` column on `students`), the query at the top of each student page
would need to be swapped — it's isolated to one query per page so this is a quick change.

The Parent Portal links via the existing `parents.user_id` → `student_parents` →
`students` chain, which was already part of the Part 1 schema.

## Part 7 will cover
- Super Admin panel: platform dashboard, schools list, school detail (modules/billing/users/logs tabs), school onboarding wizard
