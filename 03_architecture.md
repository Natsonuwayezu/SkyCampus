# SKYCAMPUS — Architecture Blueprint
## Tech Stack · Folder Structure · Flows · Deployment · Connectors
**Version:** 1.0

---

# TABLE OF CONTENTS

1. [Full Tech Stack](#1-tech-stack)
2. [System Architecture Diagram](#2-system-architecture)
3. [Project Folder Structure](#3-folder-structure)
4. [Auth Flow](#4-auth-flow)
5. [Multi-Tenant Request Flow](#5-tenant-flow)
6. [Key User Flows](#6-user-flows)
7. [Deployment](#7-deployment)
8. [Connectors & Integrations](#8-connectors)
9. [Environment Variables](#9-env-vars)
10. [Development Phases](#10-phases)

---

# 1. TECH STACK

```
LAYER              TECHNOLOGY                  PURPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend Web       Next.js 14 (App Router)     Web application
Styling            Tailwind CSS                Utility-first CSS
UI Components      shadcn/ui                   Pre-built components
Icons              Lucide React                Icon library
Charts             Recharts                    Graphs/analytics
PDF Generation     @react-pdf/renderer         Report cards, receipts
Excel Export       xlsx (SheetJS)              Export registers
State Mgmt         Zustand                     Global app state
Forms              React Hook Form + Zod       Forms + validation
HTTP Client        Supabase JS Client          All data operations
Internationalization next-intl                 EN/FR/RW translations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mobile App         React Native + Expo         iOS & Android app
Navigation         Expo Router                 File-based routing
Mobile UI          NativeWind (Tailwind RN)    Mobile styling
Storage (offline)  expo-sqlite                 Local marks cache
Push Notifs        Expo Notifications + FCM    Push notifications
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend            Supabase                    BaaS (all-in-one)
Database           PostgreSQL (via Supabase)   Primary database
Auth               Supabase Auth               JWT-based auth
Storage            Supabase Storage            Files, photos, PDFs
Realtime           Supabase Realtime           Live updates
Edge Functions     Supabase Edge Functions     Custom business logic
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hosting            Vercel                      Next.js deployment
CDN                Vercel Edge Network         Static assets, speed
Domain             skycampus.com               Main domain
Subdomains         *.skycampus.com             Per-school routing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SMS (future)       Africa's Talking / Twilio   SMS notifications
Email (future)     Resend / SendGrid           Email delivery
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 2. SYSTEM ARCHITECTURE

```
                        INTERNET
                           │
              ┌────────────▼─────────────┐
              │      Vercel CDN Edge      │
              │  (Global, low latency)    │
              └────────────┬─────────────┘
                           │
              ┌────────────▼─────────────┐
              │     Next.js App on        │
              │     Vercel Serverless     │
              │                          │
              │  Middleware:             │
              │  ┌────────────────────┐  │
              │  │ subdomain router   │  │
              │  │ reads slug from    │  │
              │  │ hostname → injects │  │
              │  │ school_id context  │  │
              │  └────────────────────┘  │
              │                          │
              │  Pages/Components:       │
              │  ┌────────────────────┐  │
              │  │ App Router         │  │
              │  │ /app/[school]      │  │
              │  │ /superadmin        │  │
              │  └────────────────────┘  │
              └─────────┬────────────────┘
                        │ Supabase JS Client
                        │ (RLS enforced)
              ┌─────────▼────────────────┐
              │        SUPABASE           │
              │                          │
              │  ┌──────────────────┐    │
              │  │  PostgreSQL DB   │    │
              │  │  (with RLS)      │    │
              │  └──────────────────┘    │
              │  ┌──────────────────┐    │
              │  │  Supabase Auth   │    │
              │  │  (JWT tokens)    │    │
              │  └──────────────────┘    │
              │  ┌──────────────────┐    │
              │  │  Storage Buckets │    │
              │  │  (photos, PDFs)  │    │
              │  └──────────────────┘    │
              │  ┌──────────────────┐    │
              │  │  Realtime        │    │
              │  │  (WebSockets)    │    │
              │  └──────────────────┘    │
              │  ┌──────────────────┐    │
              │  │  Edge Functions  │    │
              │  │  (Deno runtime)  │    │
              │  └──────────────────┘    │
              └──────────────────────────┘
                        │
              ┌─────────▼────────────────┐
              │   MOBILE APP (Expo)       │
              │   iOS & Android           │
              │                          │
              │  Same Supabase client    │
              │  + expo-sqlite for       │
              │    offline marks cache   │
              │  + Expo Push for FCM     │
              └──────────────────────────┘
```

---

# 3. FOLDER STRUCTURE

## 3.1 Next.js Web App (`/web`)

```
web/
├── app/
│   ├── layout.tsx                    Root layout (fonts, providers)
│   ├── page.tsx                      Platform landing (skycampus.com)
│   ├── login/
│   │   └── page.tsx                  Login page
│   ├── register-school/
│   │   └── page.tsx                  School onboarding wizard
│   │
│   ├── superadmin/                   Super admin panel
│   │   ├── layout.tsx
│   │   ├── page.tsx                  SA dashboard
│   │   ├── schools/
│   │   │   ├── page.tsx              All schools list
│   │   │   ├── new/page.tsx          Add school
│   │   │   └── [id]/
│   │   │       ├── page.tsx          School detail
│   │   │       ├── modules/page.tsx
│   │   │       └── billing/page.tsx
│   │   ├── billing/page.tsx
│   │   ├── users/page.tsx
│   │   ├── logs/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── [school]/                     Per-school routes
│   │   ├── layout.tsx                App shell (sidebar + topbar)
│   │   ├── page.tsx                  School public home
│   │   ├── about/page.tsx
│   │   ├── admissions/page.tsx
│   │   ├── news/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── contact/page.tsx
│   │   │
│   │   ├── (app)/                    Authenticated area
│   │   │   ├── layout.tsx            Sidebar + auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── announcements/page.tsx
│   │   │   │
│   │   │   ├── academics/
│   │   │   │   ├── marks-entry/page.tsx
│   │   │   │   ├── marks-database/page.tsx
│   │   │   │   ├── assessments/page.tsx
│   │   │   │   ├── class-register/page.tsx
│   │   │   │   ├── statistics/page.tsx
│   │   │   │   ├── timetable/page.tsx
│   │   │   │   ├── report-cards/page.tsx
│   │   │   │   └── promotion/page.tsx
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── page.tsx          Student list
│   │   │   │   ├── enroll/page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx      Student details
│   │   │   │   │   ├── fees/page.tsx
│   │   │   │   │   └── edit/page.tsx
│   │   │   │   ├── bulk-import/page.tsx
│   │   │   │   ├── bulk-export/page.tsx
│   │   │   │   ├── archive/page.tsx
│   │   │   │   └── siblings/page.tsx
│   │   │   │
│   │   │   ├── finance/
│   │   │   │   ├── fee-structure/page.tsx
│   │   │   │   ├── record-payment/page.tsx
│   │   │   │   ├── payment-history/page.tsx
│   │   │   │   ├── overdue/page.tsx
│   │   │   │   ├── waivers/page.tsx
│   │   │   │   ├── receipts/page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx          Teachers list
│   │   │   │   ├── [id]/page.tsx     Teacher profile
│   │   │   │   ├── subjects/page.tsx
│   │   │   │   └── assignments/page.tsx
│   │   │   │
│   │   │   └── settings/
│   │   │       ├── page.tsx          School settings
│   │   │       ├── academic-calendar/page.tsx
│   │   │       ├── classes/page.tsx
│   │   │       ├── grading/page.tsx
│   │   │       ├── users/page.tsx
│   │   │       ├── roles/page.tsx
│   │   │       ├── backup/page.tsx
│   │   │       ├── logs/page.tsx
│   │   │       └── analytics/page.tsx
│   │   │
│   │   ├── parent/                   Parent portal
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              Parent dashboard
│   │   │   ├── children/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── results/page.tsx
│   │   │   │       ├── fees/page.tsx
│   │   │   │       ├── attendance/page.tsx
│   │   │   │       └── timetable/page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   └── notices/page.tsx
│   │   │
│   │   └── student/                  Student portal
│   │       ├── layout.tsx
│   │       ├── page.tsx              Student dashboard
│   │       ├── results/page.tsx
│   │       ├── timetable/page.tsx
│   │       ├── attendance/page.tsx
│   │       └── materials/page.tsx
│   │
├── components/
│   ├── ui/                           shadcn/ui base components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── TermProgressBar.tsx
│   │   └── NotificationBell.tsx
│   ├── academics/
│   │   ├── MarksTable.tsx
│   │   ├── ClassRegisterTable.tsx
│   │   ├── ReportCard.tsx            (6 format variants)
│   │   ├── TimetableGrid.tsx
│   │   └── StatisticsCharts.tsx
│   ├── finance/
│   │   ├── FeeBreakdownTable.tsx
│   │   ├── PaymentForm.tsx
│   │   ├── ReceiptDocument.tsx       (PDF component)
│   │   └── FinanceCharts.tsx
│   ├── students/
│   │   ├── StudentForm.tsx           (5-tab wizard)
│   │   ├── StudentCard.tsx
│   │   └── SiblingLinker.tsx
│   └── shared/
│       ├── LanguageSwitcher.tsx
│       ├── DarkModeToggle.tsx
│       ├── ExportButton.tsx
│       ├── PermissionGate.tsx        (wraps components by permission)
│       └── OfflineBanner.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 Browser Supabase client
│   │   ├── server.ts                 Server Supabase client
│   │   └── middleware.ts             Auth + school_id middleware
│   ├── hooks/
│   │   ├── useSchool.ts              Current school context
│   │   ├── usePermissions.ts         Role permission checks
│   │   ├── useRealtime.ts            Realtime subscriptions
│   │   └── useOfflineSync.ts         Offline marks sync
│   ├── utils/
│   │   ├── grades.ts                 Grade calculation
│   │   ├── register.ts               Register computation
│   │   ├── payments.ts               Payment allocation logic
│   │   ├── pdf.ts                    PDF generation helpers
│   │   ├── excel.ts                  Excel export helpers
│   │   └── formatters.ts             Currency, date, number format
│   └── store/
│       ├── authStore.ts              Zustand: user + school
│       ├── uiStore.ts                Sidebar state, dark mode
│       └── offlineStore.ts           Offline pending items
│
├── messages/                         i18n translation files
│   ├── en.json
│   ├── fr.json
│   └── rw.json
│
├── middleware.ts                     Subdomain routing + auth guard
├── next.config.js
├── tailwind.config.js
└── package.json
```

## 3.2 Mobile App (`/mobile`)

```
mobile/
├── app/
│   ├── _layout.tsx                   Root layout + auth provider
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                       Bottom tab navigator
│   │   ├── _layout.tsx               Tab bar definition
│   │   ├── index.tsx                 Dashboard
│   │   ├── marks.tsx                 Marks entry
│   │   ├── students.tsx              Student list
│   │   ├── finance.tsx               Finance summary
│   │   └── settings.tsx
│   └── [module]/                     Deep pages
│       ├── mark-entry.tsx
│       ├── student-detail.tsx
│       └── record-payment.tsx
│
├── components/
│   ├── MarksTableMobile.tsx
│   ├── StudentCard.tsx
│   └── ReceiptPreview.tsx
│
├── lib/
│   ├── supabase.ts                   Supabase client (Expo)
│   ├── offline/
│   │   ├── db.ts                     SQLite setup
│   │   ├── marks.ts                  Cache marks locally
│   │   └── sync.ts                   Sync when online
│   └── notifications.ts              Expo push registration
│
└── package.json
```

## 3.3 Supabase Edge Functions (`/supabase/functions`)

```
supabase/
├── functions/
│   ├── create-backup/index.ts        Export school data as JSON
│   ├── restore-backup/index.ts       Restore from backup file
│   ├── generate-report-card/index.ts Server-side PDF generation
│   ├── bulk-import-students/index.ts Validate + import students
│   ├── send-notification/index.ts    Push notification sender
│   ├── apply-fee-reset/index.ts      Monthly/termly fee cron
│   └── promote-students/index.ts     Run promotion logic
│
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_rls_policies.sql
    ├── 003_seed_defaults.sql
    └── 004_indexes.sql
```

---

# 4. AUTH FLOW

```
LOGIN FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User visits lafontaine.skycampus.com/login

1. Middleware reads subdomain → school_id = "lafontaine"
2. User selects role + enters credentials
3. POST to Supabase Auth:
   - Admin/Parent → email + password
   - Teacher/Accountant → username resolved to email first
   - Student → student_id resolved to email first
4. Supabase returns JWT token
5. Server reads user record from users table
6. Loads role + permissions → stored in Zustand
7. Redirect to /(app)/dashboard

TOKEN FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JWT stored in httpOnly cookie (Next.js middleware)
Supabase client auto-refreshes every 55 minutes
Middleware validates token on every request

PERMISSION CHECK FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. User navigates to /finance/record-payment
2. Middleware checks: can(user, 'finance', 'create') ?
3. If no → redirect to /unauthorized
4. Component uses <PermissionGate module="finance" action="create">
5. Sidebar auto-hides items user has no view permission for

TEACHER USERNAME → EMAIL RESOLUTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT email FROM users WHERE username = input AND school_id = current_school
Use that email to call supabase.auth.signInWithPassword({email, password})
```

---

# 5. MULTI-TENANT REQUEST FLOW

```
REQUEST: GET lafontaine.skycampus.com/academics/marks-entry

Step 1: DNS
  *.skycampus.com → Vercel wildcard domain → Next.js app

Step 2: middleware.ts
  const hostname = request.headers.get('host')
  // → 'lafontaine.skycampus.com'
  const slug = hostname.split('.')[0]
  // → 'lafontaine'

  const { data: school } = await supabase
    .from('schools')
    .select('id, name, status')
    .eq('slug', slug)
    .single()

  if (!school) return redirect('/404')
  if (school.status === 'suspended') return redirect('/suspended')

  // Inject school into request headers
  request.headers.set('x-school-id', school.id)
  request.headers.set('x-school-name', school.name)

Step 3: Layout reads school context
  const schoolId = headers().get('x-school-id')
  → All Supabase queries automatically filtered by this school_id via RLS

Step 4: RLS enforces data isolation
  Even if a query doesn't include school_id in WHERE clause,
  Supabase RLS policy ensures only rows with matching school_id
  are returned. Double protection.

Step 5: Response
  Page renders with school-specific data, branding, language
```

---

# 6. KEY USER FLOWS

## 6.1 Teacher Enters Marks Flow

```
Teacher Dashboard
  → Sees "Pending: P4A Math Quiz 3" in overdue list
  → Clicks [✏️ Enter Marks]

Marks Entry Page loads:
  1. Class, Subject, Assessment pre-selected
  2. 28 students loaded from student_class_history JOIN students
  3. Existing marks pre-filled (if any saved before)

Teacher enters scores:
  4. Score field validates on blur:
     - > max_marks → highlight red, cap suggestion
     - Negative → highlight red
     - Empty → skip (can save partial)
  5. Grade auto-computed next to score

Save:
  6. [💾 Save to DB] clicked
  7. Validation modal if issues found
  8. POST /rpc/bulk_save_marks with array of {student_id, score}
  9. audit_log entry created
  10. Notification sent to Admin: "Jean MUKESA entered P4A Math Quiz 3"
  11. Realtime channel fires → Admin dashboard recent actions updates
  12. Toast: "✅ 28 marks saved successfully"

Offline flow:
  - If no internet → marks saved to SQLite via expo-sqlite (mobile)
    or IndexedDB (web via offline store)
  - Banner shows "📴 3 marks pending sync"
  - When online → auto-sync via useOfflineSync hook
```

## 6.2 Record Payment Flow

```
Accountant → Record Payment page

1. Search student by name/ID (debounced search)
2. Student selected → loads fee account:
   - Outstanding: 220,000 RWF
   - Fee breakdown table loads
3. Amount entered: 200,000 RWF
4. Method selected: Cash
5. [Preview Allocation] auto-runs:
   - Calls payment allocation algorithm
   - Shows which fees will be covered
6. [💾 Record & Print Receipt] clicked
7. Server:
   a. INSERT INTO payments
   b. Run allocation loop → INSERT payment_allocations
   c. UPDATE student_fees (amount_paid, status)
   d. Check overpayment → UPDATE credit_balances if needed
   e. INSERT audit_log
   f. INSERT notification for Admin
   g. Generate receipt PDF via Edge Function
   h. Store PDF in Supabase Storage
8. Receipt modal opens with PDF preview
9. Options: [🖨️ Print] [📧 Email] [📱 WhatsApp] [❌ Close]
10. Toast: "✅ Payment of 200,000 RWF recorded — RCP-2026-0152"
```

## 6.3 Generate Report Card Flow

```
Admin → Report Cards page
  Select: Class = PRIMARY 4, Term = 3, Phase = Post-Midterm

1. Page loads student list for class
2. [📄 Print All] clicked
3. POST /rpc/get_class_register → computes all marks
4. For each student:
   a. Fetch all marks grouped by subject
   b. Compute MG totals, EX totals, G_TOT, %, grade, rank
5. @react-pdf/renderer renders report card PDFs
6. 6 format auto-selected:
   - PRIMARY + Post-Midterm → Format 5 (English, MG+EX columns)
   - NURSERY + Pre-Midterm → Format 1 (French, score+cote)
7. PDFs merged → download link shown
8. Stored in Supabase Storage for parent portal access

Single student report:
  - Parent portal: [📄 Download Report Card]
  - Fetches PDF from Storage if exists
  - If not yet generated → generates on demand
```

## 6.4 New School Onboarding Flow

```
Visit: skycampus.com/register-school

Step 1: School info
  → Validate slug uniqueness (realtime check as user types)
  → INSERT INTO schools

Step 2: Admin account
  → supabase.auth.signUp({email, password})
  → INSERT INTO users (role = Admin, school_id)

Step 3: Choose plan
  → INSERT INTO subscriptions
  → Trigger seed function:
     - Default grading scale
     - Default roles (Admin, Teacher, Accountant)
     - Default subjects (Nursery + Primary)
     - Default module statuses

Step 4: Redirect to school admin panel
  → lafontaine.skycampus.com/(app)/dashboard
  → Onboarding checklist shown:
     ☐ Add your classes
     ☐ Add teachers
     ☐ Add students
     ☐ Set up fee structure
     ☐ Configure academic calendar
```

---

# 7. DEPLOYMENT

## 7.1 Vercel Setup

```
Project: skycampus-web
Framework: Next.js
Root Directory: /web

Environment Variables (set in Vercel dashboard):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  NEXT_PUBLIC_APP_URL=https://skycampus.com

Domains:
  skycampus.com           → main landing
  *.skycampus.com         → wildcard (all schools)
  admin.skycampus.com     → super admin panel

Build Command: next build
Output: .next (serverless)
```

## 7.2 Supabase Setup

```
Project: skycampus-prod

Database: PostgreSQL 15
Region: Choose closest to target users (e.g. eu-west for Africa)

Run migrations in order:
  001_initial_schema.sql      → all tables
  002_indexes.sql             → performance indexes
  003_rls_policies.sql        → all RLS policies
  004_seed_defaults.sql       → no-op (seeded per school on onboarding)

Edge Functions deployed:
  supabase functions deploy create-backup
  supabase functions deploy generate-report-card
  supabase functions deploy bulk-import-students
  supabase functions deploy apply-fee-reset
  supabase functions deploy promote-students

Storage Buckets created:
  school-logos        (public)
  student-photos      (authenticated)
  student-documents   (authenticated)
  report-cards        (authenticated)
  backups             (authenticated)
  imports             (authenticated, auto-delete 7 days)
```

## 7.3 Wildcard Subdomain (Vercel)

```
In Vercel project settings → Domains:
  Add: *.skycampus.com

In DNS provider (e.g. Cloudflare):
  Type: CNAME
  Name: *
  Value: cname.vercel-dns.com

This routes all school subdomains to the same Next.js app.
middleware.ts handles the routing logic per subdomain.
```

## 7.4 Mobile App (Expo)

```
Build:
  eas build --platform android --profile production
  eas build --platform ios --profile production

Submit:
  eas submit --platform android   → Google Play Store
  eas submit --platform ios       → Apple App Store

App name: SkyCampus
Bundle ID: com.skycampus.app
OTA Updates: expo-updates (push JS updates without store resubmit)
```

---

# 8. CONNECTORS & INTEGRATIONS

## 8.1 Current (Built-in via Supabase)

```
✅ Authentication    Supabase Auth (email, custom username)
✅ Database          PostgreSQL with RLS
✅ File Storage      Supabase Storage (photos, PDFs, backups)
✅ Realtime          Supabase Realtime (WebSockets)
✅ Edge Functions    Deno runtime (custom logic)
```

## 8.2 PDF Generation

```
Library: @react-pdf/renderer (client + server)

Report Card PDFs:
  - Rendered as React components
  - 6 formats (see frontend blueprint)
  - Generated client-side for preview
  - Generated server-side (Edge Function) for bulk/storage

Receipt PDFs:
  - Auto-generated after every payment
  - Stored in Supabase Storage
  - Downloadable / printable / shareable
```

## 8.3 Excel Import/Export

```
Library: xlsx (SheetJS)

EXPORT:
  - Class Register → Excel (all 6 formats)
  - Student List → Excel
  - Payment History → Excel
  - Financial Reports → Excel

IMPORT:
  - Student bulk import template
  - Marks import (optional)
  Client-side parsing → validate → send to server
```

## 8.4 Offline (Mobile)

```
Library: expo-sqlite

When offline (mobile app):
  - Marks entered → saved to local SQLite table: pending_marks
  - Badge shows count of unsynced items
  - On reconnect → sync.ts runs:
      SELECT * FROM pending_marks WHERE synced = false
      POST to Supabase → mark synced = true

IndexedDB (web fallback):
  - Same concept for web via localforage or Zustand persist
```

## 8.5 Push Notifications (Mobile)

```
Library: Expo Notifications + Firebase Cloud Messaging

Setup:
  1. Register device token on login
  2. Store token in users.push_token
  3. Edge Function: send-notification
     → Reads push_token from users table
     → Calls FCM API with message

Notification Types:
  - New marks entered (Admin)
  - Payment received (Admin + Accountant)
  - Overdue fee alert (Accountant)
  - New announcement (all staff)
  - System backup complete (Admin)
```

## 8.6 SMS / Email (Reserved — Future)

```
SLOT RESERVED in architecture:
  - school_settings table has: sms_provider, sms_api_key, sms_sender_id
  - Edge Function: send-sms (stub, not implemented)
  - Edge Function: send-email (stub, not implemented)

Recommended providers for Rwanda:
  SMS:   Africa's Talking (supports Rwanda, MTN/Airtel)
  Email: Resend (simple, developer-friendly)

When implemented:
  → Parent SMS on payment confirmation
  → Parent SMS on student absence
  → Email for newsletters/announcements
  → Email for report card distribution
```

## 8.7 Language / i18n

```
Library: next-intl

Translation files: /messages/en.json, fr.json, rw.json

Language switcher in topbar:
  [EN | FR | RW] → stored in localStorage
  → next-intl reads from cookie on server
  → All UI labels translated
  → Report card format also switches language
     (French for Nursery, English for Primary by default)
     (configurable per school)

Key namespaces:
  common: buttons, labels, status words
  nav: sidebar menu items
  academics: marks, grades, subjects
  finance: fees, payments, receipts
  students: enrollment, profile fields
  reports: report card labels
```

---

# 9. ENVIRONMENT VARIABLES

```bash
# .env.local (web)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5...

# App
NEXT_PUBLIC_APP_URL=https://skycampus.com
NEXT_PUBLIC_APP_NAME=SkyCampus

# Storage
NEXT_PUBLIC_STORAGE_URL=https://xxxx.supabase.co/storage/v1

# Future: SMS (Africa's Talking)
# AT_API_KEY=
# AT_USERNAME=
# AT_SENDER_ID=

# Future: Email (Resend)
# RESEND_API_KEY=
```

```bash
# Supabase Edge Functions secrets (set via CLI)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set FCM_SERVER_KEY=...     # push notifications
```

---

# 10. DEVELOPMENT PHASES

```
PHASE 1 — CORE (Ecole La Fontaine as first school)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Database schema + RLS policies
  ✦ Auth (Admin, Teacher, Accountant roles)
  ✦ School settings
  ✦ Classes + Subjects management
  ✦ Student enrollment + list
  ✦ Marks entry + database
  ✦ Class register (6 formats)
  ✦ Report cards (6 formats) + PDF
  ✦ Fee structure + payments + receipts
  ✦ Admin dashboard
  ✦ Accountant dashboard
  ✦ Teacher dashboard
  Estimated: 8–12 weeks

PHASE 2 — EXTENDED MODULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Timetable builder
  ✦ Attendance management
  ✦ Statistics & analytics
  ✦ Student promotion
  ✦ Sibling linking + family fees
  ✦ Fee waivers + credit balance
  ✦ Bulk import/export students
  ✦ Notifications center
  ✦ Announcements
  ✦ System logs + audit
  ✦ Backup & restore
  Estimated: 6–8 weeks

PHASE 3 — PORTALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Parent portal
  ✦ Student portal
  ✦ Role & permission builder
  ✦ User management (multi-role)
  ✦ School public website pages
  Estimated: 4–6 weeks

PHASE 4 — SAAS LAYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Super Admin panel
  ✦ School onboarding wizard
  ✦ Subscription & billing
  ✦ Module toggle per school
  ✦ Multi-school isolation testing
  ✦ Platform landing page
  Estimated: 4–6 weeks

PHASE 5 — MOBILE + ADVANCED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ React Native + Expo mobile app
  ✦ Offline marks sync
  ✦ Push notifications (FCM)
  ✦ SMS integration (Africa's Talking)
  ✦ Email integration (Resend)
  ✦ AI report card comments
  ✦ Advanced analytics
  Estimated: 8–10 weeks

TOTAL ESTIMATED: ~30–42 weeks (7–10 months)
Start with Phase 1 only for Ecole La Fontaine → expand to SaaS.
```

---

# SUMMARY: 3-FILE BLUEPRINT

```
01_frontend.md  (2,044 lines, 208KB)
  → All ~86 pages with ASCII wireframes
  → 6 report card formats
  → 6 register formats
  → All modals, tables, flows
  → Mobile responsive layouts
  → Business rules (frontend enforcement)

02_backend.md   (this + schema)
  → 25+ database tables with full SQL
  → All relationships mapped
  → Complete business logic & formulas
  → RLS security policies
  → Storage bucket structure
  → Full API endpoint map (120+ endpoints)
  → Realtime channels
  → Default seed data

03_architecture.md   (this file)
  → Full tech stack table
  → System architecture diagram
  → Web + Mobile folder structure
  → Auth flow
  → Multi-tenant request flow
  → 5 key user flows (marks, payment, report card, onboarding)
  → Deployment (Vercel + Supabase + Expo)
  → Connectors (PDF, Excel, Offline, Push, SMS slot)
  → Environment variables
  → 5 development phases with estimates
```

---

*SkyCampus Architecture Blueprint v1.0 — Complete*
*All 3 blueprint files ready. Begin development with Phase 1.*
