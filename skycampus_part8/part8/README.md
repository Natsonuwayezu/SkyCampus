# SkyCampus — Part 8: Edge Functions + Storage + Deployment Guide

## What is included

### Supabase Edge Functions (Deno runtime)
supabase/functions/
  create-backup/index.ts      Exports all school data (25+ tables) to compressed JSON in Storage,
                               logs backup to backup_logs table. POST { school_id }
  seed-school/index.ts        Atomically seeds all defaults for a new school: grading scale (8 grades),
                               5 roles with Admin getting full permissions on 17 modules, 8 module flags,
                               8 nursery subjects, 9 primary subjects. POST { school_id }
  apply-fee-reset/index.ts    Creates new student_fee rows for all active students for a given reset
                               cycle (monthly/termly/annual). Skips students already charged.
                               POST { school_id, trigger }
  send-notification/index.ts  Inserts notification rows + optionally sends FCM push notifications
                               to users with push_token set. POST { school_id, user_ids, title, ... }
  promote-students/index.ts   Atomically writes new student_class_history rows for the next academic
                               year based on promotion decisions. Handles promote/repeat/graduate.
                               POST { school_id, decisions[], new_year_id }

### Storage Configuration
supabase/storage-setup.sql    Creates all 6 storage buckets with correct:
                               - File size limits
                               - Allowed MIME types
                               - RLS policies (public read for logos, school-scoped for others)
                               Buckets: school-logos, student-photos, student-documents,
                                        report-cards, backups, imports

### Deployment Guide
docs/DEPLOYMENT.md            Step-by-step guide covering:
                               1. Supabase project setup + migration commands
                               2. Edge Function deployment (supabase CLI commands)
                               3. Storage bucket configuration + CORS
                               4. First super admin creation (SQL snippet)
                               5. Vercel deployment (repo, env vars, wildcard domain DNS)
                               6. First school setup walkthrough (Ecole La Fontaine)
                               7. Fee reset cron jobs (pg_cron + GitHub Actions examples)
                               8. Nightly auto-backup setup
                               9. Mobile app (Expo) build steps
                               10. Environment variables reference table
                               11. Common issues & fixes (15 issues with solutions)

## How to deploy Edge Functions

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF

supabase functions deploy create-backup
supabase functions deploy seed-school
supabase functions deploy apply-fee-reset
supabase functions deploy send-notification
supabase functions deploy promote-students

supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key
supabase secrets set FCM_SERVER_KEY=your_fcm_key
```

## THIS IS THE FINAL PART

All 8 parts together constitute the complete SkyCampus platform:
- ~86 pages and views
- 56+ source files
- 4 database migration files
- 5 Edge Functions
- 6 storage buckets
- Full deployment guide

Remaining work not covered (future phases):
- React Native mobile app (/mobile folder)
- SMS integration (Africa's Talking)
- Email integration (Resend)
- AI-generated report card comments
