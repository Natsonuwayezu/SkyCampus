# SkyCampus — Full Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase account (supabase.com)
- Vercel account (vercel.com)
- Domain: skycampus.com (or your own)
- Supabase CLI installed: `npm install -g supabase`

---

## STEP 1: Supabase Project Setup

### 1.1 Create Project

1. Go to supabase.com → New Project
2. Name: `skycampus-prod`
3. Region: Choose closest to your users (e.g. `eu-west-1` for Africa)
4. Save your database password

### 1.2 Run Database Migrations

In the Supabase dashboard → SQL Editor, run each file in order:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_indexes.sql
supabase/migrations/003_rls_policies.sql
supabase/migrations/004_functions_triggers.sql
supabase/storage-setup.sql
```

Or via CLI:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 1.3 Get API Keys

Project Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` = your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret)

---

## STEP 2: Deploy Edge Functions

```bash
# From the project root
supabase functions deploy create-backup
supabase functions deploy seed-school
supabase functions deploy apply-fee-reset
supabase functions deploy send-notification
supabase functions deploy promote-students

# Set Edge Function secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set FCM_SERVER_KEY=your_fcm_key   # optional, for push notifications
```

Verify deployment:
```bash
supabase functions list
```

---

## STEP 3: Configure Storage Buckets

The `storage-setup.sql` creates all buckets. Verify in dashboard:
- Storage → Buckets → should see 6 buckets
- Verify public bucket: `school-logos` shows "Public" badge

Set CORS for browser uploads (Supabase dashboard → Storage → each bucket → Settings):
```
Allowed origins: https://skycampus.com, https://*.skycampus.com, http://localhost:3000
```

---

## STEP 4: Create First Super Admin

In Supabase dashboard → Authentication → Users → Add User:
- Email: your-email@example.com
- Password: strong password

Then in SQL Editor:
```sql
-- Replace the UUID with the one from the auth user you just created
INSERT INTO users (id, school_id, full_name, is_active)
VALUES ('auth-user-uuid-here', NULL, 'Super Admin Name', true);
```

`school_id = NULL` is the signal that identifies a super admin.

---

## STEP 5: Vercel Deployment

### 5.1 Push Code to GitHub

```bash
cd skycampus
git init
git add .
git commit -m "Initial SkyCampus commit"
git remote add origin https://github.com/yourusername/skycampus.git
git push -u origin main
```

### 5.2 Import to Vercel

1. vercel.com → New Project → Import from GitHub
2. Select your repository
3. Framework: Next.js
4. Root Directory: `web/`
5. Build Command: `next build`
6. Output Directory: `.next`

### 5.3 Environment Variables in Vercel

Add these in Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY       = eyJhbGci...
NEXT_PUBLIC_APP_URL             = https://skycampus.com
NEXT_PUBLIC_APP_NAME            = SkyCampus
```

### 5.4 Domain Configuration

**Main domain** (`skycampus.com`):
- Vercel → Project → Settings → Domains → Add Domain
- Add: `skycampus.com`
- Add: `www.skycampus.com` → redirect to skycampus.com

**Wildcard subdomain** (`*.skycampus.com`):
- Add: `*.skycampus.com`
- In your DNS provider (e.g. Cloudflare):
  ```
  Type: CNAME
  Name: *
  Target: cname.vercel-dns.com
  ```

**Super Admin** (`admin.skycampus.com`):
- Automatically covered by the wildcard
- Middleware routes /superadmin for school_id=NULL users

### 5.5 Verify Deployment

```
https://skycampus.com                 → Platform landing page
https://skycampus.com/login           → Login page
https://skycampus.com/register-school → School wizard
https://lafontaine.skycampus.com      → School-specific login
https://lafontaine.skycampus.com/dashboard → Admin dashboard
```

---

## STEP 6: First School Setup (Ecole La Fontaine)

### Option A: Self-Register via Wizard

1. Visit `https://skycampus.com/register-school`
2. Fill in school info with slug: `lafontaine`
3. Create admin account
4. Choose plan → Launch

### Option B: Add via Super Admin

1. Login as super admin at `https://skycampus.com/login`
2. Navigate to `/superadmin/schools/new`
3. Fill in school details → Create
4. Then go to `https://skycampus.com/settings/users` to create the admin user

### After Creation

Log in at `https://lafontaine.skycampus.com/login` as Admin and complete:
1. Settings → Academic Calendar: create year 2025-2026 + 3 terms (set Term 3 as current)
2. Settings → Classes: add NURSERY 1-3, PRIMARY 1-5
3. Staff → Subjects: verify nursery + primary subjects seeded
4. Staff → Add Teachers: add each teacher
5. Staff → Assignments: assign teachers to subjects+classes
6. Students → Enroll or Bulk Import students
7. Finance → Fee Structure: add School Fees, Building Fund, etc.
8. Academics → Assessments: create Quiz 1, Assignment 1, Midterm, etc.
9. Academics → Marks Entry: begin entering marks

---

## STEP 7: Fee Reset Cron Jobs

Set up cron jobs to trigger fee resets. Options:

**Option A: Supabase cron (pg_cron)**
```sql
-- Run in SQL Editor to enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Monthly fee reset (1st of each month at 01:00 UTC)
SELECT cron.schedule(
  'monthly-fee-reset',
  '0 1 1 * *',
  $$
    SELECT net.http_post(
      url := 'https://your-project.supabase.co/functions/v1/apply-fee-reset',
      body := '{"trigger":"monthly"}',
      headers := '{"Authorization":"Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) FROM schools WHERE status = 'active';
  $$
);
```

**Option B: External cron (GitHub Actions, Vercel Cron)**
```yaml
# .github/workflows/fee-reset.yml
name: Monthly Fee Reset
on:
  schedule:
    - cron: '0 1 1 * *'  # 1st of month at 01:00 UTC
jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger fee reset for all schools
        run: |
          curl -X POST https://your-project.supabase.co/functions/v1/apply-fee-reset \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"trigger":"monthly"}'
```

---

## STEP 8: Auto-Backups (Nightly)

Set up nightly backup via cron. Call `create-backup` Edge Function per school:

```bash
# Example: nightly at 02:00 UTC for lafontaine school
# Get school_id from: SELECT id FROM schools WHERE slug = 'lafontaine';
curl -X POST https://your-project.supabase.co/functions/v1/create-backup \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"school_id":"your-school-uuid"}'
```

---

## STEP 9: Mobile App (React Native + Expo)

> The mobile app is a separate project in `/mobile/` — not yet built.
> When ready, follow these steps:

```bash
cd mobile
npm install
npx expo start

# Build for production
npx eas build --platform android --profile production
npx eas build --platform ios --profile production

# Submit to stores
npx eas submit --platform android
npx eas submit --platform ios
```

---

## Environment Variables Reference

| Variable | Where Used | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + Middleware | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server components + Edge Functions | ✅ |
| `NEXT_PUBLIC_APP_URL` | OG tags, redirects | ✅ |
| `NEXT_PUBLIC_APP_NAME` | UI branding | Optional |
| `FCM_SERVER_KEY` | Push notifications (Edge Function secret) | Optional |
| `AT_API_KEY` | SMS via Africa's Talking | Future |
| `AT_USERNAME` | SMS via Africa's Talking | Future |
| `RESEND_API_KEY` | Email via Resend | Future |

---

## Common Issues & Fixes

### "School not found" on subdomain
- Check DNS wildcard CNAME is pointing to `cname.vercel-dns.com`
- Verify the school slug in the `schools` table matches the subdomain exactly
- Allow 24-48h for DNS propagation

### RLS blocking queries
- Check that the user has a matching row in the `users` table
- Verify `school_id` on the user matches the school being queried
- Check `role_permissions` rows exist for the user's role
- Use Supabase dashboard → Table Editor with RLS disabled to debug

### Login "User profile not found"
- The auth user exists in `auth.users` but there is no matching row in `public.users`
- Insert manually: `INSERT INTO users (id, school_id, ...) VALUES (...)`

### Edge Functions not responding
- Check deployment: `supabase functions list`
- Check secrets: `supabase secrets list`
- View logs: `supabase functions logs create-backup`

### Marks not computing in Register
- Ensure `student_class_history.is_current = true` for students
- Ensure `terms.is_current = true` for the current term
- Ensure subjects exist for the correct level (nursery/primary) with `is_active = true`
- Check assessments exist for the class+subject+term combination

---

## Architecture Summary (What Was Built)

```
PARTS 1-8 COMPLETE — Full SkyCampus SaaS Platform

Part 1:  Supabase schema (25+ tables), migrations, RLS, functions/triggers,
         Next.js project setup, middleware, login, globals.css

Part 2:  App shell (sidebar+topbar+term bar), role-aware dashboards,
         school settings, academic calendar, grading, classes, users,
         roles & permissions builder, backup, system logs, shared components

Part 3:  Students module (list, enroll wizard, detail, bulk import, archive, siblings)
         Staff module (list, detail, subjects, teacher assignment matrix)

Part 4:  Finance module (fee structure, record payment with allocation engine,
         payment history, overdue, waivers, financial reports)
         Academics Part 1 (marks entry, assessments, marks database)

Part 5:  Academics Part 2 — core register computation engine,
         class register (6 formats), report cards (6 formats),
         statistics (recharts), timetable builder, student promotion

Part 6:  Parent portal (6 pages) + Student portal (5 pages)

Part 7:  Super admin panel (dashboard, schools, billing, users, logs)
         School self-registration wizard (3-step, full seed on create)

Part 8:  5 Edge Functions (backup, seed, fee-reset, notifications, promotion)
         Storage bucket setup + RLS policies
         This deployment guide
```

**Total: ~86 pages, 56+ source files, 4 migrations, 5 edge functions**

