# SKYCAMPUS — Frontend Blueprint
## Premium Academic Management SaaS
**Version:** 1.0 | **Colors:** Blue `#1A8FE3` · Gold `#F5A623` · Navy `#0D1B2A`
**Languages:** English · Français · Kinyarwanda (switcher in topbar)
**URL Pattern:** `https://schoolname.skycampus.com`

---

# 1. DESIGN SYSTEM

## 1.1 Color Palette

```
PRIMARY COLORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sky Blue     #1A8FE3   — Brand, buttons, active sidebar
  Gold         #F5A623   — Accents, badges, tagline
  Navy Dark    #0D1B2A   — Sidebar, dark headers
  White        #FFFFFF   — Card backgrounds
  Off-White    #F4F7FA   — Page background (light mode)

ROLE COLORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Admin        #1A8FE3   (Sky Blue)
  Accountant   #10B981   (Emerald)
  Teacher      #8B5CF6   (Purple)
  Parent       #F59E0B   (Amber)
  Student      #06B6D4   (Cyan)
  Super Admin  #EF4444   (Red)

SEMANTIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Success  #10B981  |  Warning  #F59E0B
  Danger   #EF4444  |  Info     #3B82F6
  Muted    #94A3B8

DARK MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Page bg  #0F172A  |  Card bg  #1E293B
  Border   #334155  |  Text     #F1F5F9
```

## 1.2 Typography

```
  Headings:  Syne (700, 800)
  Body:      DM Sans (400, 500, 600)
  Mono:      JetBrains Mono (IDs, codes, logs)

SCALE: xs=11px  sm=13px  base=15px  md=17px
       lg=20px  xl=24px  2xl=30px  3xl=36px
```

## 1.3 Layout

```
  Sidebar Expanded:  260px  |  Collapsed: 64px  |  Mobile: drawer
  Topbar Height:     64px
  Content Padding:   24px
  Card Radius:       12px
  Input Radius:      8px
  Breakpoints:  Mobile <768px | Tablet 768-1024px | Desktop >1024px
```

## 1.4 Reusable Components

```
BUTTONS:   [Primary] [Secondary] [Danger] [Ghost] [Icon]
BADGES:    ✅ Paid | 🔴 Due | 🟡 Partial | 🔒 Locked | ⚠️ Pending
INPUTS:    Text, Select, Date, Search, Textarea (label + error state)
MODALS:    Small 400px | Medium 600px | Large 900px | Full screen
TOASTS:    Top-right, 4s auto-dismiss: ✅ Success ⚠️ Warning ❌ Error
TABLES:    Sortable, hover, sticky col1, pagination 10/25/50/100
           Always: [📥 Export Excel] [📄 Export PDF]
```

---

# 2. PUBLIC PAGES

## 2.1 Platform Landing (`skycampus.com`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [🏫 SKYCAMPUS]                          [EN|FR|RW]  [Login] [Register] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│         ╔══════════════════════════════════════════════════╗            │
│         ║  🎓 SKYCAMPUS                                    ║            │
│         ║  Premium Academic Management                     ║            │
│         ║                                                  ║            │
│         ║  Manage your school smarter.                     ║            │
│         ║  All-in-one platform for modern African schools. ║            │
│         ║                                                  ║            │
│         ║  [Get Started Free]       [View Demo]            ║            │
│         ╚══════════════════════════════════════════════════╝            │
│                                                                          │
│  FEATURES                                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 📚 Academics│ │ 💰 Finance  │ │ 👥 Students │ │ 📱 Mobile   │      │
│  │ Marks,Reg.  │ │ Fees,Recpts │ │ SIS,Portal  │ │ iOS/Android │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                          │
│  PRICING                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐           │
│  │ Starter         │ │ ⭐ Professional  │ │ Enterprise      │           │
│  │ Up to 200 stdnts│ │ Up to 500 stdnts│ │ Unlimited       │           │
│  │ [Choose Plan]   │ │ [Choose Plan]   │ │ [Contact Sales] │           │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘           │
│                                                                          │
│  Footer: © 2026 SkyCampus | Privacy | Terms | Contact                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.2 School Public Page (`schoolname.skycampus.com`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [SCHOOL LOGO]  ECOLE LA FONTAINE           [EN|FR|RW]  [Staff Login]   │
├─────────────────────────────────────────────────────────────────────────┤
│  [Home] [About] [Academics] [Admissions] [News] [Gallery] [Contact]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ╔═══════════════════════════════════════════════════════════════════╗   │
│  ║  [School Hero Banner / Photo]                                     ║   │
│  ║  ECOLE LA FONTAINE — Rubavu, Rwanda                               ║   │
│  ║  Excellence in Nursery & Primary Education                        ║   │
│  ║  [Apply Now]      [Contact Us]      [View Gallery]                ║   │
│  ╚═══════════════════════════════════════════════════════════════════╝   │
│                                                                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐               │
│  │ 👥 450+   │ │ 👩‍🏫 32   │ │ 🏆 Est.98 │ │ 📍 Rubavu │               │
│  │ Students  │ │ Staff     │ │ Founded   │ │ Rwanda    │               │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘               │
│                                                                          │
│  LATEST NEWS                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ End of Term Results     │  │ School Trip to Akagera  │              │
│  │ Jun 15, 2026 [Read →]   │  │ May 20, 2026 [Read →]   │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
│  Footer: Powered by SkyCampus                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Register New School (3-Step Wizard)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🏫 REGISTER YOUR SCHOOL ON SKYCAMPUS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  STEP 1 OF 3 — School Information                                        │
│  ●────────○────────○                                                     │
│                                                                          │
│  School Name:   [Ecole La Fontaine              ]                        │
│  Slug:          [lafontaine  ].skycampus.com  ✅ Available               │
│  Country:       [Rwanda                        ▼]                        │
│  City:          [Rubavu                         ]                        │
│  Level:         [☑] Nursery   [☑] Primary   [ ] Secondary               │
│  Phone:         [+250788123456                  ]                        │
│  Email:         [info@lafontaine.rw             ]                        │
│                                     [Next: Admin Account →]              │
├─────────────────────────────────────────────────────────────────────────┤
│  STEP 2 OF 3 — Admin Account                                             │
│  ○────────●────────○                                                     │
│                                                                          │
│  Full Name:  [UWAYO GANZA Eugene              ]                          │
│  Email:      [admin@lafontaine.rw             ]                          │
│  Password:   [••••••••••       ] [👁️]                                    │
│  Confirm:    [••••••••••       ] [👁️]                                    │
│                         [← Back]  [Next: Choose Plan →]                  │
├─────────────────────────────────────────────────────────────────────────┤
│  STEP 3 OF 3 — Choose Plan                                               │
│  ○────────○────────●                                                     │
│                                                                          │
│  ┌───────────────┐ ┌─────────────────┐ ┌───────────────┐               │
│  │ Starter       │ │ ⭐ Professional  │ │ Enterprise    │               │
│  │ [Select]      │ │ [Select]        │ │ [Contact]     │               │
│  └───────────────┘ └─────────────────┘ └───────────────┘               │
│                         [← Back]  [🎉 Launch My School]                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 3. AUTHENTICATION

## 3.1 Login Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                   [EN | FR | RW]        │
│                                                                          │
│           ┌─────────────────────────────────────────────────┐           │
│           │  [🏫 SCHOOL LOGO]                               │           │
│           │  ECOLE LA FONTAINE                              │           │
│           │  Powered by SkyCampus                           │           │
│           │  ───────────────────────────────────────────    │           │
│           │  🔐 SIGN IN                                     │           │
│           │  ───────────────────────────────────────────    │           │
│           │                                                 │           │
│           │  Role:  [👨‍💼 Administrator              ▼]      │           │
│           │                                                 │           │
│           │  Email / Username:                              │           │
│           │  [_________________________________]            │           │
│           │                                                 │           │
│           │  Password:                                      │           │
│           │  [_________________________________] [👁️]        │           │
│           │                                                 │           │
│           │  [ ] Remember me                                │           │
│           │                                                 │           │
│           │  ┌───────────────────────────────────────────┐  │           │
│           │  │           SIGN IN  →                      │  │           │
│           │  └───────────────────────────────────────────┘  │           │
│           │                                                 │           │
│           │  Forgot password?                               │           │
│           │                                                 │           │
│           │  ⚠️ Invalid credentials. (error state)          │           │
│           └─────────────────────────────────────────────────┘           │
│                                                                          │
│  Role login rules:                                                       │
│  Admin/Parent → email + password                                         │
│  Accountant/Teacher → username + password                                │
│  Student → student ID + password                                         │
│  Super Admin → admin.skycampus.com/login (separate URL)                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Forgot Password

```
┌─────────────────────────────────────────────────────────────────────────┐
│           ┌─────────────────────────────────────────────────┐           │
│           │  🔑 RESET YOUR PASSWORD                         │           │
│           │                                                 │           │
│           │  Email: [your@email.com                ]        │           │
│           │                                                 │           │
│           │  [Send Reset Link]                              │           │
│           │  ← Back to Login                                │           │
│           └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 4. APP SHELL

## 4.1 Full Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOPBAR (64px)                                                                 │
│ ☰  [Page Title]                        [EN|FR|RW]  🌙  🔔3  [👤 Admin ▼]    │
├──────────────────┬───────────────────────────────────────────────────────────┤
│                  │  TERM PROGRESS BAR                                         │
│  SIDEBAR (260px) │  📅 Term 3 — 2025-2026   Post-Midterm                     │
│                  │  ████████████████████████░░░░░░░  78%  · 22 days left      │
│  [🏫 LOGO]       ├───────────────────────────────────────────────────────────┤
│  School Name     │                                                             │
│                  │   MAIN CONTENT AREA                                        │
│  ── DASHBOARD ── │   (scrollable, 24px padding)                               │
│  📊 Dashboard    │                                                             │
│  🔔 Notifications│                                                             │
│  📢 Announcements│                                                             │
│                  │                                                             │
│  ── ACADEMICS ── │                                                             │
│  ✏️  Marks Entry  │                                                             │
│  🗄️  Marks DB    │                                                             │
│  📋 Class Reg.   │                                                             │
│  📈 Statistics   │                                                             │
│  🕐 Timetable    │                                                             │
│  📄 Report Cards │                                                             │
│  📝 Assessments  │                                                             │
│                  │                                                             │
│  ── STUDENTS ──  │                                                             │
│  📋 Student List │                                                             │
│  ➕ Enroll       │                                                             │
│  💰 Student Fees │                                                             │
│  👨‍👩‍👧 Siblings  │                                                             │
│  📦 Archive      │                                                             │
│  📤 Bulk Import  │                                                             │
│  🎓 Promotion    │                                                             │
│                  │                                                             │
│  ── FINANCE ──   │                                                             │
│  🏷️  Fee Struct. │                                                             │
│  📜 Pay. History │                                                             │
│  💸 Record Pay.  │                                                             │
│  📊 Fin. Reports │                                                             │
│  ⚠️  Overdue     │                                                             │
│  🎁 Waivers      │                                                             │
│  🧾 Receipts     │                                                             │
│                  │                                                             │
│  ── STAFF ──     │                                                             │
│  📋 Teachers     │                                                             │
│  📖 Subjects     │                                                             │
│  📌 Assignments  │                                                             │
│                  │                                                             │
│  ── SETTINGS ──  │                                                             │
│  🏫 School Set.  │                                                             │
│  📅 Calendar     │                                                             │
│  🏛️  Classes     │                                                             │
│  📊 Grading      │                                                             │
│  👥 Users        │                                                             │
│  🔐 Roles & Perm │                                                             │
│  💾 Backup       │                                                             │
│  📋 System Logs  │                                                             │
│  📊 Analytics    │                                                             │
│  ────────────    │                                                             │
│  👤 My Profile   │                                                             │
│  🚪 Sign Out     │                                                             │
└──────────────────┴───────────────────────────────────────────────────────────┘

NOTE: Sidebar collapses to 64px icon-only on toggle or mobile.
      Each role sees only sections permitted by their role config.
```

## 4.2 Topbar Notification Dropdown

```
┌─────────────────────────────────────────────────────┐
│  🔔 NOTIFICATIONS (3 unread)         [Mark all read] │
├─────────────────────────────────────────────────────┤
│  🔵 ✏️  Teacher Jean entered marks — P4 Math Quiz 3  │
│       2 minutes ago                                  │
├─────────────────────────────────────────────────────┤
│  🔵 💰 Payment: 200,000 RWF — GANZA KING             │
│       15 minutes ago                                 │
├─────────────────────────────────────────────────────┤
│  ⚪ ⚠️  Marks overdue: P5 English Exam               │
│       2 hours ago                                    │
├─────────────────────────────────────────────────────┤
│  [View All Notifications →]                          │
└─────────────────────────────────────────────────────┘
```

---

# 5. SUPER ADMIN PANEL

> URL: `admin.skycampus.com` — Platform owner only.

## 5.1 Super Admin Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🔴 SKYCAMPUS SUPER ADMIN                              👤 Super Admin ▼      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 🏫 Schools   │ │ 👥 Users     │ │ 💰 MRR       │ │ 📊 Active    │        │
│  │     24       │ │    3,842     │ │    $4,200    │ │  18 / 24     │        │
│  │ +3 this month│ │ +156 this mo │ │ +12% MoM     │ │  75% online  │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                                               │
│  ALL SCHOOLS                               [➕ Add School]  [📥 Export]      │
│  ┌───┬───────────────────────┬──────────┬───────────┬──────────┬──────────┐  │
│  │ # │ School                │ Students │ Plan      │ Status   │ Actions  │  │
│  ├───┼───────────────────────┼──────────┼───────────┼──────────┼──────────┤  │
│  │ 1 │ Ecole La Fontaine     │   245    │ Pro       │ 🟢 Active│👁️✏️⚙️🗑️ │  │
│  │ 2 │ Green Hill Academy    │   412    │ Enterprise│ 🟢 Active│👁️✏️⚙️🗑️ │  │
│  │ 3 │ St Joseph Primary     │   180    │ Starter   │ 🟡 Trial │👁️✏️⚙️🗑️ │  │
│  └───┴───────────────────────┴──────────┴───────────┴──────────┴──────────┘  │
│                                                                               │
│  RECENT PLATFORM ACTIVITY                                                     │
│  🏫 Green Hill — 14 students enrolled              today 09:32               │
│  💰 St Joseph — subscription renewed               today 08:15               │
│  🏫 Nouvelle école — registered                    yesterday 16:44           │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 5.2 School Detail — Super Admin

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back   🏫 ECOLE LA FONTAINE — School Management                           │
├──────────────────────────────────────────────────────────────────────────────┤
│  [📋 Overview] [⚙️ Modules] [👥 Users] [💰 Billing] [📋 Logs] [💾 Backup]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  OVERVIEW TAB                                                                 │
│  Slug: lafontaine.skycampus.com | Country: Rwanda | City: Rubavu             │
│  Plan: Professional | Renewal: 2026-12-01 | Status: 🟢 Active               │
│  Students: 245 active | Admin: admin@lafontaine.rw                           │
│                                                                               │
│  MODULES TAB                                                                  │
│  ┌─────────────────────────┬────────────────┐                                │
│  │ Module                  │ Status         │                                │
│  ├─────────────────────────┼────────────────┤                                │
│  │ 📚 Academics            │ ✅ Enabled     │                                │
│  │ 💰 Finance              │ ✅ Enabled     │                                │
│  │ 👥 Students             │ ✅ Enabled     │                                │
│  │ 👩‍🏫 Staff              │ ✅ Enabled     │                                │
│  │ 🚌 Transport            │ ❌ Disabled    │  [Enable]                      │
│  │ 🏨 Hostel               │ ❌ Disabled    │  [Enable]                      │
│  │ 📚 Library              │ ❌ Disabled    │  [Enable]                      │
│  │ 🤖 AI Comments          │ ✅ Enabled     │  [Disable]                     │
│  └─────────────────────────┴────────────────┘                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. DASHBOARDS

## 6.1 Admin Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  📊 ADMIN DASHBOARD — ECOLE LA FONTAINE                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ 👥 245      │ │ ✅ 238      │ │ 📝 34       │ │ ✏️ 1,234    │            │
│  │ Students    │ │ Active      │ │ Assessments │ │ Marks in DB │            │
│  │ +12 this yr │ │ 97% active  │ │ this term   │ │ +156 this wk│            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                                               │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │  💰 FEE COLLECTION BY CLASS        │ │  🔄 RECENT ACTIONS               │ │
│  │                                    │ │                                  │ │
│  │  PRIMARY 5   ████████████ 92%      │ │  ✏️ J.MUKESA entered marks       │ │
│  │  PRIMARY 4   ██████████░░ 78%      │ │     P4 Math Quiz 3 — 2m ago      │ │
│  │  PRIMARY 3   ████████░░░░ 68%      │ │  💰 Payment: 200k — GANZA KING   │ │
│  │  PRIMARY 2   █████████░░░ 74%      │ │     15m ago                      │ │
│  │  PRIMARY 1   ████████░░░░ 69%      │ │  👥 Student enrolled             │ │
│  │  NURSERY 3   ████████████ 95%      │ │     MUCYO PATRICK — 1h ago       │ │
│  │  NURSERY 2   ██████████░░ 82%      │ │  ⚠️ Marks overdue: P5 Eng Exam   │ │
│  │  NURSERY 1   ███████████░ 88%      │ │     2 hours ago                  │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                               │
│  CLASS PERFORMANCE SUMMARY                                                    │
│  ┌──────────┬────────┬───────┬───────┐                                       │
│  │ Class    │ Stdnts │  Avg  │ Grade │                                       │
│  ├──────────┼────────┼───────┼───────┤                                       │
│  │ NURSERY1 │   42   │  89%  │  A+   │                                       │
│  │ NURSERY2 │   38   │  87%  │  A    │                                       │
│  │ PRIMARY1 │   45   │  76%  │  B+   │                                       │
│  │ PRIMARY4 │   39   │  78%  │  B+   │                                       │
│  │ PRIMARY5 │   37   │  82%  │  A-   │                                       │
│  └──────────┴────────┴───────┴───────┘                                       │
│                                                                               │
│  ⚡ QUICK ACTIONS                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ ➕ Enroll│ │ 🏷️ Fees  │ │ 📊 Rpts  │ │ 🎓 Promo │ │ 💾 Backup│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Accountant Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  💰 ACCOUNTANT DASHBOARD                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ 💵 98.5M    │ │ ✅ 71.2M    │ │ ⏳ 27.3M    │ │ 🔴 3.2M     │            │
│  │ Total Fees  │ │ Collected   │ │ Pending     │ │ Overdue 7d+ │            │
│  │  (RWF)      │ │ 72% ████    │ │ 28% ██░░    │ │ Urgent ⚠️   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  COLLECTION BY CLASS            │ │  MONTHLY TREND                    │   │
│  │  PRIMARY 5  ████████████ 92%    │ │  Jan ████  2.5M                   │   │
│  │  PRIMARY 4  ██████████░░ 78%    │ │  Feb ██████ 3.2M                  │   │
│  │  NURSERY 3  ████████████ 95%    │ │  Mar ████████ 4.1M                │   │
│  └─────────────────────────────────┘ │  Apr ██████░░ 3.8M                │   │
│                                       └───────────────────────────────────┘   │
│                                                                               │
│  ⚠️ OVERDUE — ACTION REQUIRED                                                 │
│  ┌──────────────┬─────────┬────────────┬──────────┬──────────┬────────────┐  │
│  │ Student      │ Class   │ Due Date   │ Days     │ Amount   │ Action     │  │
│  ├──────────────┼─────────┼────────────┼──────────┼──────────┼────────────┤  │
│  │ NSABIMANA A. │ PRIMARY3│ 01/04/2026 │ 44d 🔴   │ 250,000  │[💸 Pay Now]│  │
│  │ MUGISHA B.   │ PRIMARY2│ 15/04/2026 │ 30d 🟠   │ 180,000  │[💸 Pay Now]│  │
│  └──────────────┴─────────┴────────────┴──────────┴──────────┴────────────┘  │
│                                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│  │💰 Record   │ │🧾 Generate │ │👥 Fee      │ │📊 Export   │                 │
│  │ Payment    │ │ Receipt    │ │ Status List│ │ Report     │                 │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Teacher Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ✏️  TEACHER DASHBOARD — Jean MUKESA                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  📅 TODAY — Monday, June 16, 2026                                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  08:20–09:00 │ PRIMARY 4A │ Mathematics │ 📝 Quiz 3   [✏️ Enter Marks]   │ │
│  │  09:00–09:40 │ PRIMARY 4B │ Mathematics │ ✏️ Assign.  [✏️ Enter Marks]   │ │
│  │  10:40–11:20 │ PRIMARY 5A │ Mathematics │ 📖 Revision [✏️ Enter Marks]   │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                    │
│  │ 🏛️ 4     │ │ 📖 1      │ │ 📝 12     │ │ ✏️ 672    │                    │
│  │ My Classes│ │ My Subject│ │ Assessmts │ │ Marks Done│                    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘                    │
│                                                                               │
│  ⚠️ PENDING MARKS ENTRY                                                       │
│  ┌──────────┬──────────────┬────────────────┬────────────┬─────────────────┐ │
│  │ Class    │ Subject      │ Assessment     │ Due Date   │ Status          │ │
│  ├──────────┼──────────────┼────────────────┼────────────┼─────────────────┤ │
│  │ PRIMARY4A│ Mathematics  │ Quiz 3         │ Tomorrow   │ ⚠️ Pending      │ │
│  │ PRIMARY4B│ Mathematics  │ Assignment 2   │ Today      │ 🔴 Overdue      │ │
│  │ PRIMARY5A│ Mathematics  │ Midterm Exam   │ +5 days    │ 🟡 In Progress  │ │
│  └──────────┴──────────────┴────────────────┴────────────┴─────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

# 7. ACADEMICS MODULE

## 7.1 Marks Entry

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      ✏️  MARKS ENTRY                    📅 Term 3    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ASSESSMENT DETAILS                                        [📋 Load Existing] │
│  ┌────────────┬────────────┬────────────┬─────────────────┬────────────────┐ │
│  │ Class      │ Subject    │ Type       │ Assessment Name │ Max Marks      │ │
│  ├────────────┼────────────┼────────────┼─────────────────┼────────────────┤ │
│  │ [PRIMARY4▼]│ [Math    ▼]│ [Quiz    ▼]│ [Quiz 3       ] │ [50          ] │ │
│  └────────────┴────────────┴────────────┴─────────────────┴────────────────┘ │
│  [ ] Lock after saving                   [📋 Load Students]                  │
│                                                                               │
│  28 students loaded                                                           │
│  ┌───┬──────────────────────┬──────────┬──────┬───────┬────────┬──────────┐  │
│  │ # │ Student Name         │ Score    │ /Max │  %    │ Grade  │ Status   │  │
│  ├───┼──────────────────────┼──────────┼──────┼───────┼────────┼──────────┤  │
│  │ 1 │ GANZA KING           │ [45    ] │  50  │  90%  │ A+ ✅  │ Saved    │  │
│  │ 2 │ UWERA PHIONA         │ [42    ] │  50  │  84%  │ A  ✅  │ Saved    │  │
│  │ 3 │ ISHIMWE BRUNO        │ [38    ] │  50  │  76%  │ B  ✅  │ Saved    │  │
│  │ 4 │ NSABIMANA ALINE      │ [35    ] │  50  │  70%  │ B  ✅  │ Saved    │  │
│  │ 5 │ MUGISHA BOSCO        │ [28    ] │  50  │  56%  │ D  ⚠️  │ Low Score│  │
│  │ 6 │ MUCYO PATRICK        │ [      ] │  50  │  —    │ —  ❌  │ Empty    │  │
│  └───┴──────────────────────┴──────────┴──────┴───────┴────────┴──────────┘  │
│                                                                               │
│  📊 5/6 entered (83.3%) | Average: 75.2% | Pass Rate: 80%                    │
│                                                                               │
│  [💾 Save to DB]  [🗑️ Clear]  [📤 Import Excel]  [📥 Export Excel]           │
│                                                                               │
│  📴 Offline Mode — 3 marks pending sync                     [🔄 Sync Now]    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Validation Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠️ VALIDATION ISSUES                                            [✕]    │
├─────────────────────────────────────────────────────────────────────────┤
│  ✅ Valid: 4   ❌ Invalid: 2   📭 Empty: 1   📈 Exceeded: 0              │
│                                                                          │
│  ❌ Errors:                                                              │
│  • MUGISHA BOSCO — 28 is below 50% threshold                            │
│  • NSABIMANA ALINE — 35 is below 50% threshold                          │
│                                                                          │
│  📝 Auto-corrections applied:                                            │
│  • Negative scores → set to 0                                           │
│  • Scores > max → capped at max                                         │
│  • Decimals → rounded to 1 decimal                                      │
│                                                                          │
│  [Cancel]                          [Save Valid Marks Only]               │
└─────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Marks Database

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      🗄️  MARKS DATABASE                  📅 Term 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Class: [PRIMARY 4 ▼]  Subject: [Math ▼]  Term: [3 ▼]  [🔍 Search]         │
│  25 records found                                   [📥 Export All Excel]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📅 Term 3 — PRIMARY 4 — Mathematics — Quiz 3                  🔒 Locked     │
│  ┌──────────────────────┬────────────┬───────┬───────┬──────────────────┐   │
│  │ Student Name         │ Score / 50 │   %   │ Grade │ Date Recorded    │   │
│  ├──────────────────────┼────────────┼───────┼───────┼──────────────────┤   │
│  │ GANZA KING           │    45      │  90%  │  A+   │ 2026-05-15       │   │
│  │ UWERA PHIONA         │    42      │  84%  │  A    │ 2026-05-15       │   │
│  └──────────────────────┴────────────┴───────┴───────┴──────────────────┘   │
│  [✏️ Edit] [🔓 Unlock] [🗑️ Delete] [📤 Export]                              │
│                                                                               │
│  📅 Term 3 — PRIMARY 4 — Mathematics — Assignment 2            ✏️ Editable   │
│  ┌──────────────────────┬────────────┬───────┬───────┬──────────────────┐   │
│  │ Student Name         │ Score / 30 │   %   │ Grade │ Date Recorded    │   │
│  ├──────────────────────┼────────────┼───────┼───────┼──────────────────┤   │
│  │ GANZA KING           │    28      │  93%  │  A+   │ 2026-05-10       │   │
│  └──────────────────────┴────────────┴───────┴───────┴──────────────────┘   │
│  [✏️ Edit] [🔒 Lock] [🗑️ Delete] [📤 Export]                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Class Register — 6 Formats

### Format A: Nursery Pre-Midterm (French) — scrollable horizontally

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back   📋 REGISTRE — MATERNELLE 1 — TERME 3 — PRÉ-INTERMÉDIAIRE   [📤 Exporter] [🖨️ Imprimer]     │
│  Classes: [M1][M2][M3][P1][P2][P3][P4][P5]   Terme: [T1][T2][T3][Annuel]                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                         │
│  ┌────┬──────────────────┬──────────────┬──────────────────┬───────────────┬──────┬──────────────────┐ │
│  │    │                  │ PRE-CALCULÉ  │  ED.SANTÉ.ENV    │  FRANÇ-ÉCRIT  │ ...  │     TOTAL        │ │
│  │ #  │ Élève            ├──────┬───────┼──────────┬───────┼──────────┬────┤      ├──────┬───────────┤ │
│  │    │                  │ NOTE │ COTE  │  NOTE    │ COTE  │ NOTE     │COTE│      │ NOTE │ COTE      │ │
│  ├────┼──────────────────┼──────┼───────┼──────────┼───────┼──────────┼────┼──────┼──────┼───────────┤ │
│  │ 1  │ GANZA KING       │  48  │  A+   │    49    │  A+   │    48    │ A+ │ ...  │  382 │  A+       │ │
│  │ 2  │ UWERA PHIONA     │  46  │  A    │    47    │  A+   │    46    │ A  │ ...  │  369 │  A        │ │
│  │ 3  │ ISHIMWE BRUNO    │  43  │  B+   │    44    │  B+   │    43    │ B+ │ ...  │  352 │  B+       │ │
│  ├────┼──────────────────┼──────┼───────┼──────────┼───────┼──────────┼────┼──────┼──────┼───────────┤ │
│  │    │ MOYENNE CLASSE   │ 45.7 │  A    │   46.7   │  A+   │   45.7   │ A  │ ...  │  368 │  A        │ │
│  └────┴──────────────────┴──────┴───────┴──────────┴───────┴──────────┴────┴──────┴──────┴───────────┘ │
│  (← → scroll horizontally for all 6 Nursery subjects)                                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Format B: Nursery Post-Midterm (French) — MG + EX columns

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  MATERNELLE 1 — TERME 3 — FIN DE TRIMESTRE                                                             │
│  ┌────┬──────────────────┬───────────────────────────┬──────────────────────────┬──────┬──────┬──────┐ │
│  │    │                  │      PRE-CALCULÉ          │     ED.SANTÉ.ENV         │  ..  │G_TOT │ RANG │ │
│  │ #  │ Élève            ├────────┬────────┬─────────┼────────┬────────┬────────┤      │      │      │ │
│  │    │                  │   MG   │   EX   │  TOT    │   MG   │   EX   │  TOT   │      │      │      │ │
│  ├────┼──────────────────┼────────┼────────┼─────────┼────────┼────────┼────────┼──────┼──────┼──────┤ │
│  │ 1  │ GANZA KING       │   45   │   48   │   93    │   46   │   48   │   94   │  ..  │  728 │  1er │ │
│  │ 2  │ UWERA PHIONA     │   44   │   47   │   91    │   45   │   47   │   92   │  ..  │  712 │  2e  │ │
│  └────┴──────────────────┴────────┴────────┴─────────┴────────┴────────┴────────┴──────┴──────┴──────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Format C: Nursery Annual (French)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  MATERNELLE 1 — RAPPORT ANNUEL 2025-2026                                                               │
│  ┌────┬──────────────────┬──────────┬──────────┬──────────┬──────────┬────────┬──────┬──────┬───────┐  │
│  │ #  │ Élève            │ TOT-T1   │ TOT-T2   │ TOT-T3   │  G-TOT   │  MAX   │  %   │ COTE │  RANG │  │
│  ├────┼──────────────────┼──────────┼──────────┼──────────┼──────────┼────────┼──────┼──────┼───────┤  │
│  │ 1  │ GANZA KING       │   382    │   375    │   378    │  1,135   │ 1,200  │ 94.6%│  A+  │  1er  │  │
│  └────┴──────────────────┴──────────┴──────────┴──────────┴──────────┴────────┴──────┴──────┴───────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Format D: Primary Pre-Midterm (English)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  PRIMARY 4 — TERM 3 — MID-TERM                                                                         │
│  ┌────┬──────────────────┬──────────────────┬──────────────┬─────────────────┬──────┬──────┬────────┐  │
│  │ #  │ Student Name     │   MATHEMATICS    │   ENGLISH    │   KINYARWANDA   │  ..  │TOTAL │  RANK  │  │
│  │    │                  │  SCORE  │  %  │Grd│SCORE│%  │Grd│ SCORE │  % │Grd │      │      │        │  │
│  ├────┼──────────────────┼─────────┼─────┼───┼─────┼───┼───┼───────┼────┼────┼──────┼──────┼────────┤  │
│  │ 1  │ GANZA KING       │  78.5   │78.5%│ B+│ 82  │82%│A- │  75   │75% │ B  │  ..  │455.5 │  3rd   │  │
│  └────┴──────────────────┴─────────┴─────┴───┴─────┴───┴───┴───────┴────┴────┴──────┴──────┴────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Format E: Primary Post-Midterm (English) — MG + EX

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  PRIMARY 4 — TERM 3 — END OF TERM                                                                                               │
│  ┌────┬──────────────────┬─────────────────────────┬────────────────────────┬───────────────────┬────────────┬──────┬────────┐  │
│  │    │                  │      MATHEMATICS        │        ENGLISH         │    KINYARWANDA    │   (more →) │G-TOT │  RANK  │  │
│  │ #  │ Student Name     ├──────┬──────┬───────────┼──────┬──────┬──────────┼──────┬──────┬─────┤            │      │        │  │
│  │    │                  │  MG  │  EX  │    TOT    │  MG  │  EX  │   TOT    │  MG  │  EX  │ TOT │            │      │        │  │
│  ├────┼──────────────────┼──────┼──────┼───────────┼──────┼──────┼──────────┼──────┼──────┼─────┼────────────┼──────┼────────┤  │
│  │ 1  │ GANZA KING       │  45  │  48  │    93     │  42  │  46  │    88    │  40  │  44  │  84 │    ...     │  573 │  2nd   │  │
│  │ 2  │ UWERA PHIONA     │  48  │  50  │    98     │  44  │  48  │    92    │  43  │  47  │  90 │    ...     │  601 │  1st   │  │
│  ├────┼──────────────────┼──────┼──────┼───────────┼──────┼──────┼──────────┼──────┼──────┼─────┼────────────┼──────┼────────┤  │
│  │    │ CLASS AVERAGE    │ 43.5 │ 46.2 │   89.7    │ 41.2 │ 45.1 │   86.3   │ 39.8 │ 43.4 │ 83.2│    ...     │  556 │        │  │
│  └────┴──────────────────┴──────┴──────┴───────────┴──────┴──────┴──────────┴──────┴──────┴─────┴────────────┴──────┴────────┘  │
│                                                                                                                                  │
│  ⚠️ Post-Mid Only subjects (Reading, Creative Arts, Sports): MG auto-copied from EX at entry time.                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Format F: Primary Annual (English)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  PRIMARY 4 — ANNUAL REGISTER 2025-2026                                                             │
│  ┌────┬──────────────────┬──────────┬──────────┬──────────┬──────────┬────────┬──────┬────┬──────┐ │
│  │ #  │ Student Name     │ TOT-MG   │ TOT-EX   │  G-TOT   │   MAX    │   %    │Grade │ Rk │Promo │ │
│  ├────┼──────────────────┼──────────┼──────────┼──────────┼──────────┼────────┼──────┼────┼──────┤ │
│  │ 1  │ GANZA KING       │   782    │   847    │  1,629   │  2,640   │ 81.7%  │  A-  │ 3rd│ 🎓   │ │
│  │ 2  │ MUGISHA BOSCO    │   512    │   547    │  1,059   │  2,640   │ 40.1%  │  D   │25th│ 🔄   │ │
│  └────┴──────────────────┴──────────┴──────────┴──────────┴──────────┴────────┴──────┴────┴──────┘ │
│  🎓 = Promoted  |  🔄 = Repeating  |  Promotion threshold: 50%                                     │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 7.4 Assessments

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     📝 ASSESSMENTS                       📅 Term 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Class [All ▼]  Subject [All ▼]  Type [All ▼]  [➕ New Assessment]           │
│  [🔒 Lock All]  [📤 Export]                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────┬──────────┬──────────────┬──────────────┬───────┬──────────┬────────┐ │
│  │ #  │ Class    │ Subject      │ Assessment   │ Max   │ Status   │Actions │ │
│  ├────┼──────────┼──────────────┼──────────────┼───────┼──────────┼────────┤ │
│  │ 1  │ PRIMARY4 │ Mathematics  │ Quiz 3       │  50   │ 🔒 Locked│👁️ 🗑️  │ │
│  │ 2  │ PRIMARY4 │ Mathematics  │ Assignment 2 │  30   │ ✏️ Open  │✏️👁️🗑️ │ │
│  │ 3  │ PRIMARY5 │ English      │ Midterm Exam │ 100   │ ⚠️ Pending│✏️👁️🗑️│ │
│  └────┴──────────┴──────────────┴──────────────┴───────┴──────────┴────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### New Assessment Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ➕ NEW ASSESSMENT                                               [✕]    │
├─────────────────────────────────────────────────────────────────────────┤
│  Class:           [PRIMARY 4                   ▼]                       │
│  Subject:         [Mathematics                 ▼]                       │
│  Type:            [Quiz ▼] Quiz/Assignment/Midterm/Exam/Project         │
│  Assessment Name: [Quiz 4                       ]                       │
│  Max Marks:       [50                           ]                       │
│  Term:            [Term 3                      ▼]                       │
│  Date:            [2026-06-20                   ]                       │
│  Lock after entry:[ ] Yes                                               │
│                                                                          │
│  [✅ Create Assessment]         [❌ Cancel]                              │
└─────────────────────────────────────────────────────────────────────────┘
```

## 7.5 Report Cards — 6 Formats

### Format 1: Nursery Pre-Midterm (French)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back  📄 REPORT CARDS  Class:[M1▼]  Term:[3▼]  Phase:[Pre-Mid▼]          │
│  [🖨️ Print All]  [📄 Print Selected]  [📥 Export PDF All]                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  [🏫 LOGO]           ECOLE LA FONTAINE                                  │ │
│  │                          Rubavu — Rwanda                                │ │
│  │                                                                         │ │
│  │            RÉSULTATS DES TESTS DEMI-TRIMESTRE                          │ │
│  │                 TROISIÈME TRIMESTRE — 2025-2026                        │ │
│  │                                                                         │ │
│  │  CLASSE:         MATERNELLE 1                                          │ │
│  │  NOM DE L'ÉLÈVE: GANZA KING                                            │ │
│  │  DATE:           15 Mai 2026                                           │ │
│  │  ─────────────────────────────────────────────────────────────────     │ │
│  │  MATIÈRES                          MAX    NOTE    COTE                 │ │
│  │  ─────────────────────────────────────────────────────────────────     │ │
│  │  PRE-CALCULÉ                        50      48      A+                 │ │
│  │  EDUCATION SANTÉ ENVIRONNEMENT      50      49      A+                 │ │
│  │  FRANÇAIS ÉCRITURE                  50      48      A+                 │ │
│  │  FRANÇAIS LECTURE                   50      48      A+                 │ │
│  │  ANGLAIS                            50      50      A+                 │ │
│  │  ART PLASTIQUE                      50      49      A+                 │ │
│  │  ─────────────────────────────────────────────────────────────────     │ │
│  │  TOTAL:  382 / 400    MOYENNE: 95.5%    COTE: A+    RANG: 1ère / 22   │ │
│  │                                                                         │ │
│  │  Fait à ECOLE LA FONTAINE, Le 15 Mai 2026                              │ │
│  │  UWAYO GANZA Eugene — DIRECTION                                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│  [◀ Previous]  Student 1 / 22  [Next ▶]                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Format 2: Nursery Post-Midterm (French)

```
│  MATIÈRES                MG     EX    TOTAL   MAX    COTE
│  PRE-CALCULÉ              45     48      93    100    A+
│  EDUCATION SANTÉ ENV      46     48      94    100    A+
│  FRANÇAIS ÉCRITURE        44     47      91    100    A+
│  ...
│  TOTAL MG: 356/400   TOTAL EX: 372/400   G_TOT: 728/800
│  MOYENNE: 91.0%    COTE: A+    RANG: 1ère / 22
```

### Format 3: Nursery Annual (French)

```
│  MATIÈRES            TOT-T1  TOT-T2  TOT-T3   G-TOT   MAX    %     COTE
│  PRE-CALCULÉ            93      91      94       278    300   92.7%   A+
│  ...
│  TOTAL MG: 1,068/1,200   TOTAL EX: 1,116/1,200   G-TOT: 2,184/2,400
│  MOYENNE: 91.0%   COTE: A+   RANG: 1ère / 22
│  🎉 PROMU(E) en MATERNELLE 2 pour 2026-2027
```

### Format 4: Primary Pre-Midterm (English)

```
│  SUBJECT              MAX    SCORE      %      GRADE
│  MATHEMATICS          100    78.5      78.5%    B+
│  ENGLISH              100    82.0      82.0%    A-
│  KINYARWANDA          100    75.0      75.0%    B
│  FRENCH               100    80.0      80.0%    A-
│  SET                   80    68.0      85.0%    B+
│  SRS                   80    72.0      90.0%    A-
│  TOTAL: 455.5 / 560   AVERAGE: 81.3%   GRADE: A-   RANK: 3rd / 25
```

### Format 5: Primary Post-Midterm (English)

```
│  SUBJECT           MG     EX    TOTAL   MAX      %      GRADE
│  MATHEMATICS       45     48      93    100     93.0%    A+
│  ENGLISH           42     46      88    100     88.0%    A
│  KINYARWANDA       40     44      84    100     84.0%    B+
│  FRENCH            38     42      80    100     80.0%    B+
│  SET               36     38      74     80     92.5%    A
│  SRS               35     37      72     80     90.0%    A-
│  READING           18     19      37     40     92.5%    A     ← Post-Mid
│  CREATIVE ARTS     17     19      36     40     90.0%    A-    ← Post-Mid
│  SPORTS             9     10      19     20     95.0%    A+    ← Post-Mid
│  TOTAL MG: 280/320   TOTAL EX: 303/320   G_TOT: 583/640
│  AVERAGE: 91.1%   GRADE: A+   RANK: 1st / 25
```

### Format 6: Primary Annual (English)

```
│  SUBJECT           TOT-MG   TOT-EX   G-TOT   MAX    %     GRADE
│  MATHEMATICS         136      144      280    300   93.3%    A+
│  ENGLISH             126      138      264    300   88.0%    A
│  ...
│  READING              52       57      109    120   90.8%    A+
│  CREATIVE ARTS        49       54      103    120   85.8%    A
│  SPORTS               26       29       55     60   91.7%    A+
│  TOTAL MG: 782/1,320   TOTAL EX: 847/1,320   G-TOT: 1,629/2,640
│  ANNUAL AVERAGE: 81.7%   GRADE: A-   RANK: 3rd / 25
│  🎉 PROMOTED to PRIMARY 5 for 2026-2027
```

## 7.6 Statistics

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                       📈 STATISTICS                      📅 Term 3   │
├──────────────────────────────────────────────────────────────────────────────┤
│  Class [All ▼]  Subject [All ▼]  Term [3 ▼]           [📥 Export Report]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────┐ ┌───────────────────────────────────┐   │
│  │  GRADE DISTRIBUTION             │ │  CLASS AVERAGES                   │   │
│  │  A+: ████████ 32%               │ │  NURSERY1 ████████████ 89%        │   │
│  │  A:  ██████   24%               │ │  NURSERY2 ██████████░░ 82%        │   │
│  │  B+: █████    20%               │ │  PRIMARY1 ██████░░░░░░ 74%        │   │
│  │  B:  ████     16%               │ │  PRIMARY4 ████████░░░░ 78%        │   │
│  │  C:  ██        8%               │ │  PRIMARY5 █████████░░░ 82%        │   │
│  └─────────────────────────────────┘ └───────────────────────────────────┘   │
│                                                                               │
│  SUBJECT PERFORMANCE                                                          │
│  ┌──────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐ │
│  │ Subject          │ Average  │ Highest  │ Lowest   │ Pass Rate│ Trend    │ │
│  ├──────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤ │
│  │ Mathematics      │  78.5%   │   98%    │   42%    │   87%    │ ↑ +3.2%  │ │
│  │ English          │  82.1%   │   99%    │   48%    │   91%    │ ↗ +1.1%  │ │
│  │ Kinyarwanda      │  74.3%   │   96%    │   38%    │   84%    │ → 0.0%   │ │
│  └──────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 7.7 Timetable Builder

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     🕐 TIMETABLE BUILDER                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  View: [Class ▼]  Target: [PRIMARY 4A ▼]                                     │
│  [✏️ Edit Mode]  [📤 Import Excel]  [📥 Export]  [🖨️ Print]  [⚠️ Conflicts]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────┐│
│  │ Time       │  Monday     │  Tuesday    │  Wednesday  │  Thursday   │ Fri ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │08:20-09:00 │ Mathematics │ English     │ Kinyarwanda │ Mathematics │ Fr. ││
│  │            │ J.MUKESA    │ A.UWIMANA   │ R.MUKANKUSI │ J.MUKESA    │     ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │09:00-09:40 │ English     │ French      │ Mathematics │ English     │ SET ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │09:40-10:20 │   ── BREAK ──────────────────────────────────────── ──     ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │10:20-11:00 │ Kinyarwanda │ SET         │ SRS         │ French      │ SRS ││
│  │11:00-11:40 │ French      │ SRS         │ English     │ SET         │ Rd. ││
│  │11:40-12:20 │ SET         │ Mathematics │ Sports      │ Kinyarwanda │ CA. ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │12:20-13:20 │   ── LUNCH ────────────────────────────────────────────     ││
│  ├────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤│
│  │13:20-14:00 │ SRS         │ Reading     │ French      │ Sports      │ Lib ││
│  │14:00-14:40 │ Reading     │ C.Arts      │ Sports      │ SRS         │ Kin ││
│  └────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

## 7.8 Student Promotion

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      🎓 STUDENT PROMOTION                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  From Year: [2025-2026 ▼]  Class: [All ▼]  [📊 Load Annual Results]         │
│  ⚠️ Promotion requires Annual Average ≥ 50%                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────┬──────────────────┬──────────┬─────────┬──────────┬──────────┬──────┐ │
│  │ #  │ Student          │ Class    │ Annual% │ Decision │ Next Cls │ OK   │ │
│  ├────┼──────────────────┼──────────┼─────────┼──────────┼──────────┼──────┤ │
│  │ 1  │ GANZA KING       │ PRIMARY4 │  81.7%  │ 🎓 PASS  │ PRIMARY5 │ [✅] │ │
│  │ 2  │ UWERA PHIONA     │ PRIMARY4 │  88.3%  │ 🎓 PASS  │ PRIMARY5 │ [✅] │ │
│  │ 3  │ MUGISHA BOSCO    │ PRIMARY4 │  40.1%  │ 🔄 REPEAT│ PRIMARY4 │ [✅] │ │
│  └────┴──────────────────┴──────────┴─────────┴──────────┴──────────┴──────┘ │
│  Summary: 24 promote · 3 repeat · 0 pending                                  │
│  [🎓 Confirm All]  [📥 Export List]                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 8. FINANCE MODULE

## 8.1 Fee Structure

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      🏷️  FEE STRUCTURE                               │
├──────────────────────────────────────────────────────────────────────────────┤
│  Year: [2025-2026 ▼]   [➕ Add Fee Category]   [📥 Export]                   │
│  ⚠️ Adding a fee applies it immediately to ALL active students.               │
│     Students with credit balance: credit deducted first.                      │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌────┬───────────────────┬──────────────┬───────────┬─────────────┬───────┐ │
│  │ #  │ Category          │ Amount (RWF) │ Applies To│ Reset Cycle │ Edit  │ │
│  ├────┼───────────────────┼──────────────┼───────────┼─────────────┼───────┤ │
│  │ 1  │ School Fees       │   200,000    │ All       │ Termly      │ ✏️ 🗑️ │ │
│  │ 2  │ Building Fund     │    80,000    │ All       │ Annual      │ ✏️ 🗑️ │ │
│  │ 3  │ Trip (Akagera)    │    75,000    │ All       │ One-time    │ ✏️ 🗑️ │ │
│  │ 4  │ Coaching          │    30,000    │ All       │ Monthly     │ ✏️ 🗑️ │ │
│  │ 5  │ Uniform           │    50,000    │ All       │ One-time    │ ✏️ 🗑️ │ │
│  └────┴───────────────────┴──────────────┴───────────┴─────────────┴───────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Add Fee Category Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ➕ ADD FEE CATEGORY                                             [✕]    │
├─────────────────────────────────────────────────────────────────────────┤
│  Category Name:    [School Fees                  ]                      │
│  Description:      [Tuition fees for the term    ]                      │
│  Amount (RWF):     [200,000                      ]                      │
│                                                                          │
│  Apply To:                                                               │
│  [● All Students] [ ] Specific Class [ ] Specific Student               │
│                                                                          │
│  Reset Frequency: [Termly ▼] Monthly / Termly / Annual / One-time      │
│  Due Date:        [End of term ▼]  or  [Custom: 2026-06-30]            │
│                                                                          │
│  ⚠️ Applied immediately to all active students.                          │
│     Credit balance deducted first if student has surplus.               │
│                                                                          │
│  [✅ Save & Apply to All Students]        [❌ Cancel]                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Student Fee Account

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back            💰 FEE ACCOUNT — GANZA KING — PRIMARY 4                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ████████████████████░░░░░░░░░░░░  53% paid                                  │
│  Total: 435,000 RWF │ Paid: 215,000 RWF │ Remaining: 220,000 RWF            │
│                                                                               │
│  FEE BREAKDOWN                                               [➕ Add Fee]    │
│  ┌───────────────┬──────────┬──────────┬──────────┬────────────┬──────────┐  │
│  │ Category      │ Amount   │ Paid     │ Remaining│ Status     │ Actions  │  │
│  ├───────────────┼──────────┼──────────┼──────────┼────────────┼──────────┤  │
│  │ School Fees   │ 200,000  │ 200,000  │    0     │ ✅ Paid    │[🧾 Rcpt] │  │
│  │ Trip (Akagera)│  75,000  │     0    │  75,000  │ 🔴 Due     │[💸 Pay]  │  │
│  │ Coaching      │  30,000  │  15,000  │  15,000  │ 🟡 Partial │[💸 Pay]  │  │
│  │ Uniform       │  50,000  │     0    │  50,000  │ 🔴 Due     │[💸 Pay]  │  │
│  │ Building Fund │  80,000  │     0    │  80,000  │ 🔴 Due     │[💸 Pay]  │  │
│  └───────────────┴──────────┴──────────┴──────────┴────────────┴──────────┘  │
│                                                                               │
│  MANUAL BALANCE ADJUSTMENT (overpayment / credit)                             │
│  Type: [● Add Credit] [○ Deduct] [○ Refund]                                  │
│  Amount: [                 ] RWF                                              │
│  Reason: [                                         ]                          │
│  [Apply Adjustment]                                                           │
│                                                                               │
│  PAYMENT HISTORY                                                              │
│  ┌────────────┬──────────┬──────────────┬────────────┬──────────┬──────────┐ │
│  │ Date       │ Amount   │ Method       │ Receipt #  │ By       │ Action   │ │
│  ├────────────┼──────────┼──────────────┼────────────┼──────────┼──────────┤ │
│  │ 10/03/2026 │ 200,000  │ Mobile Money │ RCP-001    │ Admin    │[🖨️ Print]│ │
│  │ 25/04/2026 │  15,000  │ Cash         │ RCP-002    │ Accountant│[🖨️Print]│ │
│  └────────────┴──────────┴──────────────┴────────────┴──────────┴──────────┘ │
│                                                                               │
│  [➕ Add Payment]   [🎁 Apply Waiver]   [📄 Print Statement]                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 8.3 Record Payment

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      💸 RECORD PAYMENT                               │
├──────────────────────────────────────────────────────────────────────────────┤
│  Student:      [🔍 Search by name or ID...        ]                           │
│                GANZA KING — PRIMARY 4 (selected)                             │
│                Outstanding: 220,000 RWF                                       │
│                                                                               │
│  Amount (RWF): [200,000                            ]                          │
│  Pay towards:  [● All Fees (auto-allocate)] [○ Specific category]            │
│                                                                               │
│  Method: [● Cash] [○ Bank Transfer] [○ Mobile Money MTN/Airtel] [○ Cheque]  │
│  Reference #:  [                    ] (optional)                              │
│  Date:         [2026-06-16          ]                                         │
│  Notes:        [                                   ]                          │
│                                                                               │
│  ALLOCATION PREVIEW                                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  → Trip (Akagera):  75,000 RWF  ✅ Full payment                          │ │
│  │  → Coaching:        15,000 RWF  ✅ Completes partial                     │ │
│  │  → Uniform:         50,000 RWF  ✅ Full payment                          │ │
│  │  → Building Fund:   60,000 RWF  🟡 Partial (20,000 remaining)           │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  [💾 Record & Print Receipt]    [💾 Record Only]    [❌ Cancel]               │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Auto-Generated Receipt (PDF after payment)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [🏫 LOGO]            ECOLE LA FONTAINE                                  │
│                            Rubavu, Rwanda                                │
│                                                                          │
│                          RECEIPT / REÇU                                 │
│  ──────────────────────────────────────────────────────────────         │
│  Receipt No:    RCP-2026-0152                                           │
│  Date:          16 June 2026                                            │
│  Received from: GANZA KING — PRIMARY 4                                  │
│  ──────────────────────────────────────────────────────────────         │
│  Description                           Amount (RWF)                    │
│  Trip (Akagera)                           75,000                        │
│  Coaching                                 15,000                        │
│  Uniform                                  50,000                        │
│  Building Fund (partial)                  60,000                        │
│  ──────────────────────────────────────────────────────────────         │
│  TOTAL RECEIVED:                         200,000 RWF                   │
│  Method:        Cash                                                    │
│  Remaining Balance:  20,000 RWF                                         │
│  ──────────────────────────────────────────────────────────────         │
│  Received by:   UWIMANA (Accountant)   Signature: ___________          │
└─────────────────────────────────────────────────────────────────────────┘
[🖨️ Print]   [📧 Email to Parent]   [📱 WhatsApp]   [❌ Close]
```

## 8.4 Financial Reports

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     📊 FINANCIAL REPORTS                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  [📋 Summary] [📈 By Class] [📅 By Month] [🏷️ By Category] [📤 Export]       │
│  Date: [2025-09-01] to [2026-06-30]  Term: [All ▼]  Class: [All ▼]          │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ 💰 98.5M    │ │ ✅ 71.2M    │ │ ⏳ 27.3M    │ │ 🎁 3.2M     │            │
│  │ Total Billed│ │ Collected   │ │ Outstanding │ │ Waivers     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                                               │
│  COLLECTION BY CATEGORY                                                       │
│  ┌────────────────┬──────────────┬──────────────┬──────────┬──────────────┐  │
│  │ Category       │ Billed       │ Collected    │    %     │ Outstanding  │  │
│  ├────────────────┼──────────────┼──────────────┼──────────┼──────────────┤  │
│  │ School Fees    │  49,000,000  │  44,100,000  │   90%    │  4,900,000   │  │
│  │ Building Fund  │  19,600,000  │  11,760,000  │   60%    │  7,840,000   │  │
│  │ Trip (Akagera) │  18,375,000  │  14,700,000  │   80%    │  3,675,000   │  │
│  │ Coaching       │   7,350,000  │   3,675,000  │   50%    │  3,675,000   │  │
│  └────────────────┴──────────────┴──────────────┴──────────┴──────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 8.5 Overdue Payments

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     ⚠️  OVERDUE PAYMENTS                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  Class: [All ▼]  Days: [All | 7+ | 30+ | 60+ | 90+]  [📥 Export] [💸 Bulk] │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬─────────┬────────────┬──────────┬──────────┬─────────┐ │
│  │ Student          │ Class   │ Due Date   │ Days     │ Amount   │ Action  │ │
│  ├──────────────────┼─────────┼────────────┼──────────┼──────────┼─────────┤ │
│  │ NSABIMANA ALINE  │PRIMARY3 │ 01/04/2026 │ 44d 🔴   │ 250,000  │[💸 Pay] │ │
│  │ MUGISHA BOSCO    │PRIMARY2 │ 15/04/2026 │ 30d 🟠   │ 180,000  │[💸 Pay] │ │
│  │ UWERA CLAUDETTE  │PRIMARY1 │ 20/04/2026 │ 25d 🟡   │ 120,000  │[💸 Pay] │ │
│  └──────────────────┴─────────┴────────────┴──────────┴──────────┴─────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 8.6 Fee Waivers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                        🎁 FEE WAIVERS                                │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ Add Waiver]  [📥 Export]                                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┬────────────┬─────────────┬──────────────┬─────────────┐ │
│  │ Student         │ Category   │ Waived Amt  │ Reason       │ Approved By │ │
│  ├─────────────────┼────────────┼─────────────┼──────────────┼─────────────┤ │
│  │ GANZA KING      │ Bldg Fund  │  80,000 RWF │ Sibling disc │ Admin       │ │
│  │ UWERA PHIONA    │ Trip Fee   │  75,000 RWF │ Scholarship  │ Admin       │ │
│  │ ISHIMWE BRUNO   │ Coaching   │  50,000 RWF │ Financial    │ Accountant  │ │
│  └─────────────────┴────────────┴─────────────┴──────────────┴─────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Add Waiver Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ➕ ADD FEE WAIVER                                               [✕]    │
├─────────────────────────────────────────────────────────────────────────┤
│  Student:        [🔍 GANZA KING                 ]                       │
│  Class:          PRIMARY 4 (auto)                                        │
│  Fee Category:   [Building Fund               ▼]                        │
│  Original Amt:   80,000 RWF (auto)                                       │
│  Waiver Type:    [Full Waiver ▼] Full / Partial / Percentage             │
│  Waived Amount:  [80,000                       ] RWF                    │
│  Reason:         [Sibling Discount — 3 children]                        │
│  Approved By:    Admin (auto-filled)                                     │
│  Carry to next year: [ ] Yes                                             │
│                                                                          │
│  [✅ Apply Waiver]                   [❌ Cancel]                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 9. STUDENTS MODULE

## 9.1 Student List

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                       📋 STUDENT LIST                                │
├──────────────────────────────────────────────────────────────────────────────┤
│  Status: [Active ▼]  Class: [All ▼]  Year: [2025-2026 ▼]                    │
│  🔍 [Search name, ID, or parent name...                ]                     │
│  [➕ Enroll]  [📤 Bulk Import]  [📥 Bulk Export]  [📊 Report]                │
│  Total: 245  |  Active: 238  |  Archived: 7                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌───┬───────┬──────────────────────┬─────────┬────────────────┬──────┬────┐ │
│  │ # │ Photo │ Full Name            │ Class   │ Parent         │Status│Act.│ │
│  ├───┼───────┼──────────────────────┼─────────┼────────────────┼──────┼────┤ │
│  │ 1 │ 👦    │ GANZA KING           │ PRIMARY4│ GANZA Emmanuel │ ✅   │👁️✏️🗑│ │
│  │ 2 │ 👧    │ UWERA PHIONA         │ PRIMARY4│ UWERA Jean     │ ✅   │👁️✏️🗑│ │
│  │ 3 │ 👦    │ ISHIMWE BRUNO        │ PRIMARY3│ ISHIMWE Alice  │ ✅   │👁️✏️🗑│ │
│  └───┴───────┴──────────────────────┴─────────┴────────────────┴──────┴────┘ │
│  1–25 of 245                             [< 1  2  3  4  5  6  7  8  9  10 >] │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Enroll Student (5-Tab Wizard)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      ➕ ENROLL NEW STUDENT                           │
│  [PERSONAL INFO] [PARENT/GUARDIAN] [ACADEMIC] [MEDICAL] [DOCUMENTS]          │
│  ●──────────────○──────────────────○────────────○──────────○                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TAB 1 — PERSONAL INFORMATION                                                 │
│  Photo:         [📷 Upload Photo]                                             │
│  First Name:    [                    ]  Last Name:  [                     ]   │
│  Date of Birth: [                    ]  Gender:     [Male ▼]                 │
│  Nationality:   [Rwandan             ]  NID/Birth:  [                     ]   │
│  Blood Group:   [A+ ▼]   Religion:   [                                    ]   │
│  Home Address:  [                                                          ]   │
│  District:      [Rubavu             ▼]  Village:    [                     ]   │
│  Prev. School:  [                    ] (if transferring)                      │
│                                               [Next: Parent/Guardian →]       │
├──────────────────────────────────────────────────────────────────────────────┤
│  TAB 2 — PARENT/GUARDIAN                                                      │
│  Father:        [                    ]  Phone: [                          ]   │
│  Mother:        [                    ]  Phone: [                          ]   │
│  Guardian:      [                    ]  Relation: [Uncle ▼]  Phone: [    ]   │
│  Email:         [                    ]                                        │
│  Emergency:     [                    ]  Phone: [                          ]   │
│  Link existing parent: [🔍 Search existing parent...]                        │
│                                [← Back]  [Next: Academic →]                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  TAB 3 — ACADEMIC                                                             │
│  Class:         [PRIMARY 4 ▼]  Stream: [A ▼]                                │
│  Academic Year: [2025-2026   ]                                                │
│  Admission No:  [AUTO-GENERATED]  Date: [2026-06-16]                         │
│  Status:        [Active ▼]                                                    │
│                                [← Back]  [Next: Medical →]                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  TAB 4 — MEDICAL                                                              │
│  Allergies:     [                                                          ]   │
│  Conditions:    [                                                          ]   │
│  Doctor:        [                    ]  Phone: [                          ]   │
│                                [← Back]  [Next: Documents →]                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  TAB 5 — DOCUMENTS                                                            │
│  Birth Certificate: [📂 Upload]                                               │
│  Parent ID:         [📂 Upload]                                               │
│  Transfer Letter:   [📂 Upload] (optional)                                    │
│                                [← Back]  [✅ Save & Enroll]                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9.3 Student Details (5 Tabs)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back           ℹ️  GANZA KING — PRIMARY 4                                 │
│  Status: ✅ Active  |  Enrolled: 2023-09-01  |  ID: SC-2023-001              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [📋 Info] [💰 Fees] [📚 Academics] [👨‍👩‍👧 Family] [📜 History]                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  INFO TAB                                                                     │
│  ┌──────────────────────────┐ ┌─────────────────────────────────────────┐    │
│  │ [Photo: 👦]              │ │ Full Name:    GANZA KING                │    │
│  │ SC-2023-001              │ │ DOB:          12 March 2015             │    │
│  └──────────────────────────┘ │ Gender:       Male | Rwandan            │    │
│                               │ Address:      Rubavu, Gisenyi           │    │
│                               │ Blood Group:  A+                        │    │
│                               └─────────────────────────────────────────┘    │
│  [✏️ Edit]  [📦 Archive]  [🖨️ Print Profile]  [🔑 Reset Password]            │
│                                                                               │
│  FEES TAB → shows fee breakdown + payment history + quick pay                │
│  ACADEMICS TAB → marks by term, report cards, ranking history               │
│  FAMILY TAB → parent info, siblings, emergency contacts                     │
│  HISTORY TAB → class changes, status changes, audit trail                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9.4 Bulk Import

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    📤 BULK IMPORT STUDENTS                           │
├──────────────────────────────────────────────────────────────────────────────┤
│  1. [📥 Download Excel Template]                                              │
│                                                                               │
│  2. Upload Filled Template                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  Drag & drop Excel here, or [📂 Browse Files]                             │ │
│  │  students_import.xlsx — 245 rows detected                                │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  3. Preview & Validate                                                        │
│  ┌────┬──────────────────────┬─────────┬─────────────┬────────┬───────────┐  │
│  │ #  │ Full Name            │ Class   │ Parent Phone│ Status │ Issue     │  │
│  ├────┼──────────────────────┼─────────┼─────────────┼────────┼───────────┤  │
│  │ 1  │ GANZA KING           │ PRIMARY4│ +250788xxx  │ ✅ OK  │ —         │  │
│  │ 2  │ UWERA PHIONA         │ PRIMARY4│ +250789xxx  │ ✅ OK  │ —         │  │
│  │ 3  │ [Missing Name]       │ PRIMARY3│ +250712xxx  │ ❌ ERR │ Name req. │  │
│  └────┴──────────────────────┴─────────┴─────────────┴────────┴───────────┘  │
│  Valid: 242  |  Errors: 3                                                     │
│  [Import Valid Rows Only]   [Fix & Re-upload]                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 9.5 Sibling Linking

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    👨‍👩‍👧 SIBLING LINKING                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🔗 Link Siblings]  [📊 Family Report]                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  EXISTING FAMILY GROUPS                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  👨‍👩‍👧 GANZA Family — GANZA Emmanuel (+250788123456)                     │ │
│  │  ├── GANZA KING    — PRIMARY 4  — ✅ Active                              │ │
│  │  ├── GANZA MARIE   — PRIMARY 2  — ✅ Active                              │ │
│  │  └── GANZA PIERRE  — NURSERY 2  — ✅ Active                              │ │
│  │  3 siblings — Sibling discount applies (see fee waivers)                 │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  UNLINKED STUDENTS                                                            │
│  ┌────┬────────────────────┬─────────┬──────────────┬──────────────────────┐ │
│  │ #  │ Student Name       │ Class   │ Parent Phone │ Action               │ │
│  ├────┼────────────────────┼─────────┼──────────────┼──────────────────────┤ │
│  │ 1  │ MUCYO PATRICK      │ PRIMARY3│ +250712xxxxx │ [🔗 Link to Family]  │ │
│  └────┴────────────────────┴─────────┴──────────────┴──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

# 10. STAFF MODULE

## 10.1 Teachers List

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      👩‍🏫 TEACHERS & STAFF                           │
├──────────────────────────────────────────────────────────────────────────────┤
│  Status: [All ▼]  Role: [All ▼]  🔍 [Search name, email, subject...]        │
│  [➕ Add Staff]  [📤 Import]  [📥 Export]  [📊 Report]                       │
│                                                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────────┐                    │
│  │ Total: 15  │ │ Active: 13 │ │ Subject Assignments: 47│                    │
│  └────────────┘ └────────────┘ └────────────────────────┘                    │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌───┬───────┬────────────────────┬───────────────┬──────────┬──────┬──────┐ │
│  │ # │ Photo │ Name               │ Role/Dept     │ Classes  │Status│ Act. │ │
│  ├───┼───────┼────────────────────┼───────────────┼──────────┼──────┼──────┤ │
│  │ 1 │ 👩🏫  │ Jean MUKESA        │ Teacher/Math  │ P4A, P4B │ ✅   │👁️✏️🗑│ │
│  │ 2 │ 👩‍🏫  │ Anne UWIMANA       │ Teacher/Eng.  │ P4A, P5A │ ✅   │👁️✏️🗑│ │
│  │ 3 │ 👨‍🏫  │ Paul NSENGIYUMVA   │ Teacher/French│ P4A, P4B │ ✅   │👁️✏️🗑│ │
│  │ 4 │ 👩🏫  │ UWIMANA GRACE      │ Accountant    │ Finance  │ ✅   │👁️✏️🗑│ │
│  │ 5 │ 👨‍💼  │ NZABONIMANA Claude │ Deputy Head   │ Admin    │ ✅   │👁️✏️🗑│ │
│  └───┴───────┴────────────────────┴───────────────┴──────────┴──────┴──────┘ │
│  1–10 of 15                                                   [< 1  2 >]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Add Staff Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ➕ ADD STAFF MEMBER                                             [✕]    │
├─────────────────────────────────────────────────────────────────────────┤
│  PERSONAL INFORMATION                                                    │
│  Full Name:    [                               ]                        │
│  Email:        [                               ]                        │
│  Phone:        [                               ]                        │
│  Role:         [Teacher ▼] Teacher/Accountant/Admin/Custom Role         │
│  Department:   [Mathematics                   ▼]                        │
│  Hire Date:    [                               ]                        │
│                                                                          │
│  LOGIN ACCOUNT                                                           │
│  Username:     [                               ]                        │
│  Password:     [                  ] [👁️]                                │
│  Confirm:      [                  ] [👁️]                                │
│                                                                          │
│  CUSTOM ROLE (if not preset)                                             │
│  Role:  [Custom Role ▼]  → [⚙️ Configure Permissions]                  │
│                                                                          │
│  SUBJECT ASSIGNMENTS (teachers only)                                     │
│  NURSERY                                                                 │
│  ┌──────────────────────┬──────┬──────┬──────┐                          │
│  │ Subject              │  N1  │  N2  │  N3  │                          │
│  ├──────────────────────┼──────┼──────┼──────┤                          │
│  │ Pre-Calculé          │  ☐   │  ☐   │  ☐   │                          │
│  │ Education Santé Env  │  ☐   │  ☐   │  ☐   │                          │
│  └──────────────────────┴──────┴──────┴──────┘                          │
│                                                                          │
│  PRIMARY                                                                 │
│  ┌──────────────────────┬────┬────┬────┬────┬────┐                      │
│  │ Subject              │ P1 │ P2 │ P3 │ P4 │ P5 │                      │
│  ├──────────────────────┼────┼────┼────┼────┼────┤                      │
│  │ Mathematics          │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │                      │
│  │ English              │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │                      │
│  │ French               │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │                      │
│  └──────────────────────┴────┴────┴────┴────┴────┘                      │
│                                                                          │
│  [✅ Create Staff Member]            [❌ Cancel]                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 10.2 Subjects Management

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    📖 SUBJECTS MANAGEMENT                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ Add Subject]  [💾 Save All Changes]                                      │
│  Tabs: [🎒 Nursery (8)]  [📚 Primary (9)]                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🎒 NURSERY SUBJECTS                                                          │
│  ┌──────┬─────────────────────────────────┬──────┬──────┬──────┬──────────┐  │
│  │ Order│ Subject Name                    │  MG  │  EX  │ MAX  │ Post-Mid │  │
│  ├──────┼─────────────────────────────────┼──────┼──────┼──────┼──────────┤  │
│  │⬆️⬇️1│ Pre-Calculé                     │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️2│ Education Santé Environnement   │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️3│ Français Écriture               │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️4│ Français Lecture                │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️5│ Anglais                         │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️6│ Expression Orale               │ [50] │ [50] │  100 │    ☑     │  │
│  │⬆️⬇️7│ Art Plastique                   │ [50] │ [50] │  100 │    ☐     │  │
│  │⬆️⬇️8│ Développement Social            │ [50] │ [50] │  100 │    ☑     │  │
│  └──────┴─────────────────────────────────┴──────┴──────┴──────┴──────────┘  │
│                                                                               │
│  📚 PRIMARY SUBJECTS                                                          │
│  ┌──────┬─────────────────┬──────┬──────┬──────┬────────────────────────────┐ │
│  │ Order│ Subject         │  MG  │  EX  │ MAX  │ Post-Mid                   │ │
│  ├──────┼─────────────────┼──────┼──────┼──────┼────────────────────────────┤ │
│  │⬆️⬇️1│ Mathematics     │ [50] │ [50] │  100 │ ☐                          │ │
│  │⬆️⬇️2│ English         │ [50] │ [50] │  100 │ ☐                          │ │
│  │⬆️⬇️3│ Kinyarwanda     │ [50] │ [50] │  100 │ ☐                          │ │
│  │⬆️⬇️4│ French          │ [50] │ [50] │  100 │ ☐                          │ │
│  │⬆️⬇️5│ SET             │ [40] │ [40] │   80 │ ☐                          │ │
│  │⬆️⬇️6│ SRS             │ [40] │ [40] │   80 │ ☐                          │ │
│  │⬆️⬇️7│ Reading         │ [20] │ [20] │   40 │ ☑ MG = copy from EX        │ │
│  │⬆️⬇️8│ Creative Arts   │ [20] │ [20] │   40 │ ☑ MG = copy from EX        │ │
│  │⬆️⬇️9│ Sports          │ [10] │ [10] │   20 │ ☑ MG = copy from EX        │ │
│  └──────┴─────────────────┴──────┴──────┴──────┴────────────────────────────┘ │
│  ⚠️ Post-Mid Only: MG auto-filled from EX when teacher enters exam marks.     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 10.3 Teacher Assignments

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    📌 TEACHER ASSIGNMENTS                            │
├──────────────────────────────────────────────────────────────────────────────┤
│  Year: [2025-2026 ▼]  Term: [Term 3 ▼]  [💾 Save All]  [📊 Report]          │
├──────────────────────────────────────────────────────────────────────────────┤
│  NURSERY LEVEL                                                                │
│  ┌──────────────────┬──────────┬──────────┬──────────┬─────────────────────┐ │
│  │ Subject          │ NURSERY1 │ NURSERY2 │ NURSERY3 │ Teacher             │ │
│  ├──────────────────┼──────────┼──────────┼──────────┼─────────────────────┤ │
│  │ Pre-Calculé      │   ☐      │   ☐      │   ☑      │ [Jean MUKESA     ▼] │ │
│  │ Health & Env     │   ☐      │   ☐      │   ☐      │ [Anne UWIMANA    ▼] │ │
│  │ French Writing   │   ☐      │   ☐      │   ☐      │ [Paul N.         ▼] │ │
│  └──────────────────┴──────────┴──────────┴──────────┴─────────────────────┘ │
│                                                                               │
│  PRIMARY LEVEL                                                                │
│  ┌──────────────┬────┬────┬────┬────┬────┬─────────────────────────────────┐ │
│  │ Subject      │ P1 │ P2 │ P3 │ P4 │ P5 │ Teacher                         │ │
│  ├──────────────┼────┼────┼────┼────┼────┼─────────────────────────────────┤ │
│  │ Mathematics  │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Jean MUKESA              ▼]   │ │
│  │ English      │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Anne UWIMANA             ▼]   │ │
│  │ Kinyarwanda  │ ☐  │ ☐  │ ☑  │ ☑  │ ☑  │ [Rose MUKANKUSI           ▼]   │ │
│  │ French       │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Paul NSENGIYUMVA         ▼]   │ │
│  │ SET          │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [John HABIMANA            ▼]   │ │
│  │ SRS          │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Rose MUKANKUSI           ▼]   │ │
│  │ Reading      │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Anne UWIMANA             ▼]   │ │
│  │ Creative Arts│ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [John HABIMANA            ▼]   │ │
│  │ Sports       │ ☐  │ ☐  │ ☐  │ ☑  │ ☑  │ [Coach Peter              ▼]   │ │
│  └──────────────┴────┴────┴────┴────┴────┴─────────────────────────────────┘ │
│  ⚠️ Unassigned: None   📊 Total: 47 assignments across 12 teachers            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 11. SETTINGS MODULE

## 11.1 School Settings

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     🏫 SCHOOL SETTINGS                               │
├──────────────────────────────────────────────────────────────────────────────┤
│  [🏫 General] [📅 Academic] [🎨 Branding] [🔐 Security] [📧 Notifications]   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  GENERAL TAB                                                                  │
│  School Name:    [Ecole La Fontaine               ]                           │
│  Tagline:        [Excellence in Nursery & Primary ]                           │
│  Country:        [Rwanda                         ▼]                           │
│  City/District:  [Rubavu                          ]                           │
│  Phone:          [+250788123456                   ]                           │
│  Email:          [info@lafontaine.rw              ]                           │
│  Website:        [lafontaine.skycampus.com        ]                           │
│  Director Name:  [UWAYO GANZA Eugene              ]                           │
│  School Levels:  [☑] Nursery  [☑] Primary  [ ] Secondary                    │
│                                                                               │
│  BRANDING TAB                                                                 │
│  School Logo:    [📷 Upload Logo]  [preview]                                  │
│  Primary Color:  [#1A8FE3] ████   Secondary: [#F5A623] ████                  │
│  School Motto:   [                                     ]                      │
│                                                                               │
│  ACADEMIC TAB                                                                 │
│  Current Year:   [2025-2026                       ]                           │
│  Current Term:   [Term 3                         ▼]                           │
│  Midterm Date:   [2026-05-25                      ]                           │
│  Term End Date:  [2026-06-30                      ]                           │
│  Promotion Min:  [50                              ]%                           │
│                                                                               │
│  [💾 Save Settings]                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Academic Calendar

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    📅 ACADEMIC CALENDAR                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Year: [2025-2026 ▼]  [➕ Add Term]  [➕ Add Holiday/Event]                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  TERMS                                                                        │
│  ┌───────────┬────────────┬────────────┬────────────┬──────────┬───────────┐ │
│  │ Term      │ Start Date │ Midterm    │ End Date   │ Status   │ Actions   │ │
│  ├───────────┼────────────┼────────────┼────────────┼──────────┼───────────┤ │
│  │ Term 1    │ 2025-09-02 │ 2025-10-20 │ 2025-12-05 │ ✅ Done  │ ✏️ 🗑️    │ │
│  │ Term 2    │ 2026-01-08 │ 2026-03-02 │ 2026-04-10 │ ✅ Done  │ ✏️ 🗑️    │ │
│  │ Term 3 📍 │ 2026-04-20 │ 2026-05-25 │ 2026-06-30 │ 🟢 Active│ ✏️ 🗑️    │ │
│  └───────────┴────────────┴────────────┴────────────┴──────────┴───────────┘ │
│                                                                               │
│  HOLIDAYS & EVENTS                                                            │
│  ┌────────────────┬──────────────────────────────┬──────────┬──────────────┐ │
│  │ Date           │ Event                        │ Type     │ Actions      │ │
│  ├────────────────┼──────────────────────────────┼──────────┼──────────────┤ │
│  │ 2026-01-01     │ New Year's Day               │ Holiday  │ ✏️ 🗑️        │ │
│  │ 2026-07-04     │ Liberation Day               │ Holiday  │ ✏️ 🗑️        │ │
│  │ 2026-06-20     │ School Trip (Akagera)        │ Event    │ ✏️ 🗑️        │ │
│  └────────────────┴──────────────────────────────┴──────────┴──────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.3 Grading Scale

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      📊 GRADING SCALE                                │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ Add Grade]  [💾 Save Changes]  [🔄 Reset Defaults]                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌───────┬───────────┬───────────┬──────────────────────┬──────────────────┐ │
│  │ Grade │ Min %     │ Max %     │ Label                │ Actions          │ │
│  ├───────┼───────────┼───────────┼──────────────────────┼──────────────────┤ │
│  │ A+    │ [90     ] │ [100    ] │ [Excellent           ]│ ✏️ 🗑️           │ │
│  │ A     │ [80     ] │ [89.99  ] │ [Very Good           ]│ ✏️ 🗑️           │ │
│  │ A-    │ [75     ] │ [79.99  ] │ [Good                ]│ ✏️ 🗑️           │ │
│  │ B+    │ [70     ] │ [74.99  ] │ [Above Average       ]│ ✏️ 🗑️           │ │
│  │ B     │ [65     ] │ [69.99  ] │ [Average             ]│ ✏️ 🗑️           │ │
│  │ B-    │ [60     ] │ [64.99  ] │ [Below Average       ]│ ✏️ 🗑️           │ │
│  │ C     │ [50     ] │ [59.99  ] │ [Pass                ]│ ✏️ 🗑️           │ │
│  │ D     │ [0      ] │ [49.99  ] │ [Fail                ]│ ✏️ 🗑️           │ │
│  └───────┴───────────┴───────────┴──────────────────────┴──────────────────┘ │
│  Live Preview:  Score [85] → Grade: A  (Very Good)                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.4 Class Management

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    🏛️  CLASS MANAGEMENT                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ Add Class]  Year: [2025-2026 ▼]                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│  🎒 NURSERY                                                                   │
│  ┌───┬──────────┬──────────┬──────────────┬──────────┬──────────────────┐    │
│  │ # │ Class    │ Students │ Class Teacher│ Room     │ Actions          │    │
│  ├───┼──────────┼──────────┼──────────────┼──────────┼──────────────────┤    │
│  │ 1 │ NURSERY1 │   42     │ Sœur Marie   │ Room 1   │ ✏️ 🗑️            │    │
│  │ 2 │ NURSERY2 │   38     │ Anne UWIMANA │ Room 2   │ ✏️ 🗑️            │    │
│  │ 3 │ NURSERY3 │   35     │ Rose MUKANK. │ Room 3   │ ✏️ 🗑️            │    │
│  └───┴──────────┴──────────┴──────────────┴──────────┴──────────────────┘    │
│  📚 PRIMARY                                                                   │
│  ┌───┬──────────┬──────────┬──────────────┬──────────┬──────────────────┐    │
│  │ 1 │ PRIMARY1 │   45     │ Jean MUKESA  │ Room 4   │ ✏️ 🗑️            │    │
│  │ 2 │ PRIMARY2 │   43     │ Paul NSENG.  │ Room 5   │ ✏️ 🗑️            │    │
│  │ 3 │ PRIMARY3 │   41     │ Grace UWIМ.  │ Room 6   │ ✏️ 🗑️            │    │
│  │ 4 │ PRIMARY4 │   39     │ Anne UWIМANA │ Room 7   │ ✏️ 🗑️            │    │
│  │ 5 │ PRIMARY5 │   37     │ Rose MUKANK. │ Room 8   │ ✏️ 🗑️            │    │
│  └───┴──────────┴──────────┴──────────────┴──────────┴──────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.5 User Management

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     👥 USER MANAGEMENT                               │
├──────────────────────────────────────────────────────────────────────────────┤
│  Role: [All ▼]  Status: [All ▼]  🔍 [Search...]  [➕ Add User] [📥 Export]   │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌───┬──────────────────────┬──────────────────┬──────────┬──────┬────────┐  │
│  │ # │ Full Name            │ Role             │ Username │Status│Actions │  │
│  ├───┼──────────────────────┼──────────────────┼──────────┼──────┼────────┤  │
│  │ 1 │ UWAYO GANZA Eugene   │ 🔵 Admin         │ admin    │ ✅   │✏️ 🔑 🗑│  │
│  │ 2 │ UWIMANA GRACE        │ 🟢 Accountant    │ grace.u  │ ✅   │✏️ 🔑 🗑│  │
│  │ 3 │ Jean MUKESA          │ 🟣 Teacher       │ jean.m   │ ✅   │✏️ 🔑 🗑│  │
│  │ 4 │ Anne UWIMANA         │ 🟣 Teacher       │ anne.u   │ ✅   │✏️ 🔑 🗑│  │
│  │ 5 │ NZABONIMANA Claude   │ 🟡 Deputy Head   │ claude.n │ ✅   │✏️ 🔑 🗑│  │
│  └───┴──────────────────────┴──────────────────┴──────────┴──────┴────────┘  │
│  🔑 = Reset Password   🗑️ = Deactivate (not delete)                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.6 Backup & Restore

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     💾 BACKUP & RESTORE                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  AUTOMATED BACKUPS                                                            │
│  Last backup:  June 16, 2026 at 02:00 AM  ✅ Success                        │
│  Next backup:  June 17, 2026 at 02:00 AM  (scheduled)                       │
│  Frequency:    [Daily ▼]  at [02:00 ▼]                                       │
│                                                                               │
│  [💾 Create Backup Now]                                                       │
│                                                                               │
│  BACKUP HISTORY (10 per page)                                                 │
│  ┌──────────────────────┬──────────┬──────────┬─────────────────────────────┐ │
│  │ Date & Time          │ Size     │ Type     │ Actions                     │ │
│  ├──────────────────────┼──────────┼──────────┼─────────────────────────────┤ │
│  │ 2026-06-16 02:00     │  45 MB   │ Auto     │ [📥 Download] [🔄 Restore]  │ │
│  │ 2026-06-15 02:00     │  44 MB   │ Auto     │ [📥 Download] [🔄 Restore]  │ │
│  │ 2026-06-14 15:30     │  44 MB   │ Manual   │ [📥 Download] [🔄 Restore]  │ │
│  └──────────────────────┴──────────┴──────────┴─────────────────────────────┘ │
│  Showing 1–10 of 45                                    [< 1  2  3  4  5 >]    │
│                                                                               │
│  RESTORE / IMPORT                                                             │
│  [📂 Upload Backup File]                                                      │
│  ⚠️ Restoring will overwrite all current data. Cannot be undone.             │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 11.7 System Logs

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      📋 SYSTEM LOGS                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│  From: [2026-06-01]  To: [2026-06-16]  User: [All ▼]  Action: [All ▼]      │
│  🔍 [Search logs...]   [📥 Export]   [🗑️ Clear Old Logs (Admin only)]        │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┬──────────┬───────────┬─────────────────────────┐   │
│  │ Timestamp            │ User     │ Action    │ Details                 │   │
│  ├──────────────────────┼──────────┼───────────┼─────────────────────────┤   │
│  │ 2026-06-16 09:32     │ jean.m   │ MARKS_ADD │ P4 Math Quiz3 — 28 rows │   │
│  │ 2026-06-16 09:15     │ grace.u  │ PAYMENT   │ GANZA KING — 200,000    │   │
│  │ 2026-06-16 08:55     │ admin    │ STUDENT   │ Enrolled: MUCYO PATRICK │   │
│  │ 2026-06-15 22:30     │ system   │ BACKUP    │ Auto-backup OK (45MB)   │   │
│  └──────────────────────┴──────────┴───────────┴─────────────────────────┘   │
│  1–25 of 1,247                                      [< 1  2  3  ...  50 >]   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 12. COMMUNICATION MODULE

## 12.1 Notifications Center

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                     🔔 NOTIFICATIONS                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│  Filter: [All | Academic | Finance | System | Alerts]  [✅ Mark All Read]    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🔵 ✏️  Teacher Jean MUKESA entered marks — PRIMARY 4 Mathematics Quiz 3     │
│          2 minutes ago                                    [✅ Read] [🗑️]     │
│                                                                               │
│  🔵 💰 Payment: 200,000 RWF received — GANZA KING — PRIMARY 4                │
│          15 minutes ago                                   [✅ Read] [🗑️]     │
│                                                                               │
│  ⚪ 👥 New student enrolled — MUCYO PATRICK — PRIMARY 3                      │
│          1 hour ago                                       [✅ Read] [🗑️]     │
│                                                                               │
│  ⚪ ⚠️  Marks overdue: PRIMARY 5 — English — Midterm Exam                    │
│          2 hours ago                                      [✅ Read] [🗑️]     │
│                                                                               │
│  ⚪ 💾 System backup completed successfully                                   │
│          3 hours ago                                      [✅ Read] [🗑️]     │
│                                                                               │
│  1–20 of 47                                                [< 1  2  3 >]     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Announcements

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                      📢 ANNOUNCEMENTS                                │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ New Announcement]  Audience: [All | Teachers | Parents | Students]      │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  📌 PINNED                                                               │ │
│  │  End of Term Dates — June 30, 2026                                       │ │
│  │  By: Admin | June 1, 2026 | Audience: All Staff & Parents               │ │
│  │  [✏️ Edit]  [📌 Unpin]  [🗑️ Delete]                                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  School Trip Payment Reminder                                            │ │
│  │  By: Accountant | June 10, 2026 | Audience: Parents                     │ │
│  │  [✏️ Edit]  [📌 Pin]  [🗑️ Delete]                                         │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 13. ROLES & PERMISSIONS BUILDER

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                   🔐 ROLES & PERMISSIONS                             │
├──────────────────────────────────────────────────────────────────────────────┤
│  [➕ Create New Role]                                                         │
│                                                                               │
│  EXISTING ROLES                                                               │
│  ┌──────────────────┬──────────────────────────────────┬────────┬──────────┐ │
│  │ Role Name        │ Description                      │ Users  │ Actions  │ │
│  ├──────────────────┼──────────────────────────────────┼────────┼──────────┤ │
│  │ 🔵 Admin         │ Full access to all modules       │   1    │ 👁️ locked│ │
│  │ 🟢 Accountant    │ Finance only, no academics       │   2    │ ✏️ 👁️ 🗑️ │ │
│  │ 🟣 Teacher       │ Academics only, own classes      │  12    │ ✏️ 👁️ 🗑️ │ │
│  │ 🟡 Deputy Head   │ Custom — configured below        │   1    │ ✏️ 👁️ 🗑️ │ │
│  └──────────────────┴──────────────────────────────────┴────────┴──────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│  CONFIGURE ROLE: Deputy Head                              [💾 Save Role]      │
│                                                                               │
│  Role Name:    [Deputy Head                   ]                               │
│  Description:  [Academic oversight, no finance]                               │
│                                                                               │
│  MODULE PERMISSIONS                                                           │
│  ┌────────────────────────────┬───────┬───────┬────────┬────────┬──────────┐ │
│  │ Module                     │ View  │ Edit  │ Create │ Delete │ Export   │ │
│  ├────────────────────────────┼───────┼───────┼────────┼────────┼──────────┤ │
│  │ 📊 Dashboard               │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [ ]    │ │
│  │ ✏️  Marks Entry            │  [☑]  │  [☑]  │  [☑]   │  [ ]   │   [☑]    │ │
│  │ 📋 Class Register          │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [☑]    │ │
│  │ 📄 Report Cards            │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [☑]    │ │
│  │ 📈 Statistics              │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [☑]    │ │
│  │ 👥 Student List            │  [☑]  │  [☑]  │  [☑]   │  [ ]   │   [☑]    │ │
│  │ 💰 Finance (all)           │  [ ]  │  [ ]  │  [ ]   │  [ ]   │   [ ]    │ │
│  │ 👩‍🏫 Staff                  │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [ ]    │ │
│  │ ⚙️  Settings               │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [ ]    │ │
│  │ 🔔 Notifications           │  [☑]  │  [ ]  │  [☑]   │  [ ]   │   [ ]    │ │
│  │ 📢 Announcements           │  [☑]  │  [☑]  │  [☑]   │  [☑]   │   [ ]    │ │
│  │ 📋 System Logs             │  [☑]  │  [ ]  │  [ ]   │  [ ]   │   [☑]    │ │
│  └────────────────────────────┴───────┴───────┴────────┴────────┴──────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 14. PARENT PORTAL

> URL: `lafontaine.skycampus.com/parent` | Login: email + password

## 14.1 Parent Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🏫 ECOLE LA FONTAINE — Parent Portal         [EN|FR|RW]  👤 GANZA P. ▼     │
│  [🏠 Home] [👶 My Children] [💰 Fees] [📢 Notices] [✉️ Messages]             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Welcome, GANZA Emmanuel! 👋                                                  │
│                                                                               │
│  MY CHILDREN                                                                  │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │  👦 GANZA KING                     │ │  👧 GANZA MARIE                  │ │
│  │  PRIMARY 4  |  Rank: 2nd of 28     │ │  PRIMARY 2  |  Rank: 5th of 43  │ │
│  │  Attendance: 96%                   │ │  Attendance: 94%                 │ │
│  │  Balance due: 220,000 RWF 🔴       │ │  Balance: 0 RWF ✅ Fully paid    │ │
│  │  [View Details →]                  │ │  [View Details →]                │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                               │
│  📌 RECENT SCHOOL NOTICES                                                     │
│  • End of Term: June 30, 2026                                                │
│  • School Trip Payment Due: June 20, 2026                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Child Details (Parent View — 5 Tabs)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back               👦 GANZA KING — PRIMARY 4                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  [📚 Results] [📅 Timetable] [💰 Fees] [📋 Attendance] [📚 Homework]          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  RESULTS TAB — Term 3, Post-Midterm                                           │
│  ┌──────────────────┬──────┬──────┬───────┬───────┬────────────────────┐     │
│  │ Subject          │  MG  │  EX  │ Total │   %   │ Grade              │     │
│  ├──────────────────┼──────┼──────┼───────┼───────┼────────────────────┤     │
│  │ Mathematics      │  45  │  48  │  93   │ 93.0% │ A+                 │     │
│  │ English          │  42  │  46  │  88   │ 88.0% │ A                  │     │
│  │ Kinyarwanda      │  40  │  44  │  84   │ 84.0% │ B+                 │     │
│  └──────────────────┴──────┴──────┴───────┴───────┴────────────────────┘     │
│  Rank: 2nd of 28 | Average: 89.5% | Grade: A                                 │
│  [📄 Download Report Card PDF]                                                │
│                                                                               │
│  FEES TAB — Outstanding: 220,000 RWF                                          │
│  ┌─────────────────┬──────────┬──────────┬────────────┐                      │
│  │ Category        │ Amount   │ Paid     │ Status     │                      │
│  ├─────────────────┼──────────┼──────────┼────────────┤                      │
│  │ Trip (Akagera)  │  75,000  │    0     │ 🔴 Due     │                      │
│  │ Uniform         │  50,000  │    0     │ 🔴 Due     │                      │
│  │ Building Fund   │  80,000  │    0     │ 🔴 Due     │                      │
│  └─────────────────┴──────────┴──────────┴────────────┘                      │
│  [📄 Print Statement]                                                         │
│                                                                               │
│  ATTENDANCE TAB                                                               │
│  Days Present: 92 / 96 | Rate: 95.8%                                         │
│  Recent Absences: June 5 (sick), May 28 (excused)                            │
│                                                                               │
│  TIMETABLE TAB                                                                │
│  → Shows weekly schedule (read only)                                          │
│                                                                               │
│  HOMEWORK TAB                                                                 │
│  → Assignments + deadlines posted by teachers                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 15. STUDENT PORTAL

> URL: `lafontaine.skycampus.com/student` | Login: Student ID + password

## 15.1 Student Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🏫 ECOLE LA FONTAINE              [EN|FR|RW]  👤 GANZA KING ▼               │
│  [🏠 Home] [📚 Results] [📅 Timetable] [📋 Attendance] [📚 Materials]         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Hello, GANZA KING! 👋  |  PRIMARY 4  |  Term 3  |  Rank: 2nd of 28         │
│                                                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                    │
│  │ 📊 89.5%  │ │ 🏆 2nd   │ │ ✅ 96%    │ │ 📝 3 Due  │                    │
│  │ Term Avg  │ │ of 28     │ │ Attendance│ │ Homework  │                    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘                    │
│                                                                               │
│  TODAY'S SCHEDULE                                                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │  08:20  Mathematics  — Room 7  — Mr. Jean MUKESA                         │ │
│  │  09:00  English      — Room 7  — Ms. Anne UWIMANA                        │ │
│  │  10:20  Kinyarwanda  — Room 7  — Ms. Rose MUKANKUSI                      │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  RECENT RESULTS                                                               │
│  • Mathematics Quiz 3: 45 / 50 — A+                                          │
│  • English Assignment:  28 / 30 — A+                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 15.2 Student Results Page

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Back                  📚 MY RESULTS — GANZA KING                          │
│  Term: [Term 3 ▼]  Phase: [Post-Midterm ▼]                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┬──────┬──────┬───────┬───────┬──────────────────────┐   │
│  │ Subject          │  MG  │  EX  │ Total │   %   │ Grade                │   │
│  ├──────────────────┼──────┼──────┼───────┼───────┼──────────────────────┤   │
│  │ Mathematics      │  45  │  48  │  93   │ 93.0% │ A+                   │   │
│  │ English          │  42  │  46  │  88   │ 88.0% │ A                    │   │
│  │ Kinyarwanda      │  40  │  44  │  84   │ 84.0% │ B+                   │   │
│  │ French           │  38  │  42  │  80   │ 80.0% │ B+                   │   │
│  │ SET              │  36  │  38  │  74   │ 92.5% │ A                    │   │
│  │ SRS              │  35  │  37  │  72   │ 90.0% │ A-                   │   │
│  │ Reading          │  18  │  19  │  37   │ 92.5% │ A                    │   │
│  │ Creative Arts    │  17  │  19  │  36   │ 90.0% │ A-                   │   │
│  │ Sports           │   9  │  10  │  19   │ 95.0% │ A+                   │   │
│  └──────────────────┴──────┴──────┴───────┴───────┴──────────────────────┘   │
│  G-TOT: 583 / 640  |  Average: 91.1%  |  Grade: A+  |  Rank: 1st / 28       │
│  [📄 Download My Report Card]                                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 16. MOBILE RESPONSIVE

## 16.1 Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│  ☰  Dashboard              🔔  👤   │
├─────────────────────────────────────┤
│  📅 Term 3 — 78% ████████░░         │
├─────────────────────────────────────┤
│  ┌───────────────┐ ┌───────────────┐ │
│  │ 👥 245        │ │ ✅ 238        │ │
│  │ Students      │ │ Active        │ │
│  └───────────────┘ └───────────────┘ │
│  ┌───────────────┐ ┌───────────────┐ │
│  │ 📝 34         │ │ ✏️ 1,234      │ │
│  │ Assessments   │ │ Marks         │ │
│  └───────────────┘ └───────────────┘ │
│                                      │
│  💰 FEE COLLECTION                   │
│  PRIMARY 5  ████████████ 92%         │
│  PRIMARY 4  ██████████░░ 78%         │
│  PRIMARY 3  ████████░░░░ 68%         │
│                                      │
│  ⚡ QUICK ACTIONS                    │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ ➕ Enroll    │ │ 💸 Pay Now   │   │
│  └──────────────┘ └──────────────┘   │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ 📊 Reports   │ │ ⚙️ Settings  │   │
│  └──────────────┘ └──────────────┘   │
└─────────────────────────────────────┘
```

## 16.2 Mobile Drawer Menu

```
┌─────────────────────────────────────┐
│  ✕  [LOGO]  ECOLE LA FONTAINE       │
├─────────────────────────────────────┤
│  📊 Dashboard                        │
│  🔔 Notifications                    │
│  ─────── ACADEMICS ──────────────── │
│  ✏️  Marks Entry                     │
│  📋 Class Register                   │
│  📄 Report Cards                     │
│  ─────── STUDENTS ───────────────── │
│  📋 Student List                     │
│  ➕ Enroll Student                    │
│  ─────── FINANCE ────────────────── │
│  💸 Record Payment                   │
│  ⚠️  Overdue Payments                │
│  🧾 Receipts                         │
│  ─────── SETTINGS ───────────────── │
│  ⚙️  Settings                         │
│  ─────────────────────────────────  │
│  🚪 Sign Out                         │
└─────────────────────────────────────┘
```

## 16.3 Mobile Table → Card View

```
Desktop:
┌───┬──────────────────┬─────────┬──────┬───────┬──────┐
│ # │ Student Name     │ Class   │  %   │ Grade │ Act. │

Mobile Card:
┌─────────────────────────────────────┐
│  #1  GANZA KING                     │
│  Class: PRIMARY 4   |   Grade: A+   │
│  Average: 89.5%                     │
│  [👁️ View]  [✏️ Edit]  [🗑️ Delete]  │
└─────────────────────────────────────┘
```

## 16.4 Tablet (768–1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ☰  Dashboard                  📅 Post-Midterm   🔔   👤    🌙  │
├─────────────────────────────────────────────────────────────────┤
│  📅 Term 3 — 78% ███████████████████████████████░░░░░░░░        │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ 👥 245      │ │ ✅ 238      │ │ 📝 34       │ │ ✏️ 1,234  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                  │
│  ┌──────────────────────────────┐ ┌──────────────────────────┐  │
│  │  💰 FEE COLLECTION           │ │  🔄 RECENT ACTIONS        │  │
│  │  PRIMARY 5  ████████████ 92% │ │  ✏️ Teacher entered marks │  │
│  │  PRIMARY 4  ██████████░░ 78% │ │  💰 Payment received      │  │
│  └──────────────────────────────┘ └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
Sidebar: 240px visible, no icon-only mode needed at tablet width.
```

---

# APPENDIX: PAGE INVENTORY SUMMARY

| Section               | Pages / Modules | Key Features                           |
|-----------------------|-----------------|----------------------------------------|
| Public Pages          | 7               | Platform landing, school site, register|
| Authentication        | 3               | Login (5 roles), forgot pw, reset      |
| App Shell             | 1               | Sidebar, topbar, term bar, dark mode   |
| Super Admin           | 8               | Schools, modules, billing, platform    |
| Dashboards            | 3               | Admin, Accountant, Teacher             |
| Academics             | 12              | Marks, register (6 formats), reports   |
| Finance               | 8               | Fees, payments, receipts, waivers      |
| Students              | 7               | List, enroll, details, import, siblings|
| Staff                 | 4               | Teachers, subjects, assignments        |
| Settings              | 8               | School, calendar, grading, users, roles|
| Communication         | 3               | Notifications, announcements, logs     |
| Roles & Permissions   | 1               | Full custom role builder               |
| Parent Portal         | 6               | Dashboard, child tabs, fees, results   |
| Student Portal        | 5               | Dashboard, results, timetable          |
| **TOTAL**             | **~86 views**   |                                        |

---

## KEY BUSINESS RULES (Frontend Enforcement)

```
MARKS:
  • Score > max → capped automatically
  • Negative scores → set to 0
  • Post-Mid Only subjects (Reading, Creative Arts, Sports):
    MG field auto-filled with EX value on entry
  • Locked assessments → read-only, no edits

FEES:
  • New fee category → applied to all active students immediately
  • Students with credit balance → credit deducted first
  • Overpayment → creates credit balance (shown in green)
  • Credit balance auto-applies when new fees added
  • Monthly/Termly/Annual fees → new charge inserted at reset date

PROMOTION:
  • Annual Average ≥ 50% → 🎓 Promoted
  • Annual Average < 50% → 🔄 Repeating same class

REPORT CARDS:
  • 6 formats auto-selected by: level (Nursery/Primary) + phase
    (Pre-Midterm / Post-Midterm / Annual)
  • French for Nursery, English for Primary (configurable per school)

ROLES:
  • Admin sees everything
  • Teacher sees only own classes and subjects
  • Accountant sees finance only, no marks or academic data
  • Custom roles: per-module permissions (View/Edit/Create/Delete/Export)
  • Parent sees only own children's data
  • Student sees only own data
```

---

*SkyCampus Frontend Blueprint v1.0 — Complete*
*Next: 02_backend.md → Database schema, tables, formulas, API logic*
