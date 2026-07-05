# SkyCampus — Part 7: Super Admin Panel + School Self-Registration Wizard

## What is included

### Super Admin Panel  (web/app/superadmin/)
Accessible at: admin.skycampus.com (or /superadmin on the same domain)
Role guard: only users with school_id = NULL are allowed in.

  layout.tsx              Dark navy shell, red "Super Admin" badge, platform-wide nav, sign-out
  page.tsx                Platform dashboard — KPI cards (schools, users, MRR estimate, active rate),
                           all-schools table with student counts, link to Add School
  schools/page.tsx        Full schools list — search, status filter, Excel export
  schools/new/page.tsx    Quick-add school form with real-time slug availability check +
                           auto-seeds grading scale, default roles, modules on create
  schools/[id]/page.tsx   School detail — 6 tabs:
                             Overview   — all school settings at a glance
                             Modules    — toggle any module on/off (instant save)
                             Users      — all staff for this school
                             Billing    — subscription history
                             Logs       — audit log for this school
                             Backup     — backup history
                           Also: suspend / reactivate school button in header
  billing/page.tsx        Platform-wide billing — MRR, all subscriptions across all schools
  users/page.tsx          All platform users — search, linked school, role, last login
  logs/page.tsx           Platform-wide audit logs — search, paginated (50/page)
  settings/page.tsx       Placeholder for platform config (SMTP, pricing, SMS gateway)

### School Self-Registration Wizard  (web/app/register-school/)
  page.tsx                3-step wizard:
                             Step 1: School info (name, slug with real-time availability check,
                                     country/city, phone/email, level checkboxes)
                             Step 2: Admin account (name, email, password + confirm)
                             Step 3: Choose plan (Starter / Professional / Enterprise)
                           On "Launch": creates school row, creates Supabase auth user,
                           inserts Admin role + user profile, seeds all 5 default roles,
                           8 grading scale entries, 15 subjects (nursery + primary),
                           8 module flags, then redirects to /dashboard

## Depends on Parts 1-6
Place all previous parts first, then add these on top.

## Key notes

SUPER ADMIN IDENTITY: Super admin users are identified by having school_id = NULL in
the users table. The layout.tsx redirects anyone with a school_id back to /dashboard.
When creating a super admin, insert a user row in Supabase with school_id = NULL manually
(or via the Supabase dashboard).

SLUG AVAILABILITY: The register-school wizard checks slug uniqueness with a 500ms
debounce against the schools table. The superadmin/schools/new page does the same.

SEEDING: Both the wizard and the superadmin add-school page run the same seed inserts
(grading scale, roles, subjects, modules) inline. In production, these should be moved
to a Supabase Edge Function (supabase/functions/seed-school/) to keep the client lean
and handle errors atomically.

## Part 8 will cover (FINAL remaining work)
- Supabase Edge Functions: create-backup, seed-school, apply-fee-reset, generate-report-card
- Storage bucket configuration (CORS, policies, public/private rules)
- Final deployment guide (Vercel wildcard domain setup, env vars, Supabase CLI migration commands)
- tsconfig.json, postcss.config.js, and any missing glue files
