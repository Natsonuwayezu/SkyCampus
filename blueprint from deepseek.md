Now here's the complete **`01_frontend.md`** — the full frontend blueprint with all ~134 pages, ASCII wireframes, interactions, and component breakdowns.

---

# SKYCAMPUS — Frontend Blueprint
## Complete Page Map with ASCII Wireframes & Interactions
**Version:** 1.0  
**Schools:** Multi-tenant SaaS (subdomain per school)  
**Languages:** English 🇬🇧 · French 🇫🇷 · Kinyarwanda 🇷🇼  

---

## TABLE OF CONTENTS

1. [App Shell (Global Layout)](#1-app-shell-global-layout)
2. [Public Pages](#2-public-pages)
3. [Authentication](#3-authentication)
4. [Super Admin Panel](#4-super-admin-panel)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Academics Module](#6-academics-module)
7. [Attendance Module](#7-attendance-module)
8. [Students Module](#8-students-module)
9. [Finance Module](#9-finance-module)
10. [Staff & HR Module](#10-staff--hr-module)
11. [Communication Module](#11-communication-module)
12. [Settings Module](#12-settings-module)
13. [Parent Portal](#13-parent-portal)
14. [Student Portal](#14-student-portal)
15. [Custom Role System](#15-custom-role-system)
16. [Shared Components](#16-shared-components)
17. [Responsive Breakpoints](#17-responsive-breakpoints)

---

## 1. APP SHELL (GLOBAL LAYOUT)

### 1.1 Layout Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  🔵 SKYCAMPUS  │  [Language: EN ▼]  [Notif: 🔔 3]  [👤 Admin]  │  ← TOPBAR (60px)
├──────────┬─────────────────────────────────────────────────────────┤
│          │                                                         │
│  📊      │                                                         │
│  Dashboard│       MAIN CONTENT AREA                                │
│          │                                                         │
│  👨‍🎓     │       (Scrollable, dynamic per page)                    │
│  Students│                                                         │
│          │                                                         │
│  📚      │                                                         │
│  Academics│                                                         │
│          │                                                         │
│  💰      │                                                         │
│  Finance │                                                         │
│          │                                                         │
│  👥      │                                                         │
│  Staff   │                                                         │
│          │                                                         │
│  ⚙️      │                                                         │
│  Settings│                                                         │
│          │                                                         │
│  🔒      │                                                         │
│  Logout  │                                                         │
├──────────┴─────────────────────────────────────────────────────────┤
│  © SkyCampus 2026  │  v1.0  │  Help  │  Support                   │  ← FOOTER (40px)
└────────────────────────────────────────────────────────────────────┘
```

**Topbar Components:**
- **Left:** School logo + name (click → dashboard)
- **Center:** (Reserved for search in future)
- **Right:**
  - Language switcher (`EN` / `FR` / `RW`)
  - Notification bell with badge
  - User avatar dropdown (Profile, Settings, Logout)

**Sidebar (collapsible to icons):**
- Auto-hides on mobile → hamburger menu
- Highlights current page
- Shows only modules user has permission to view
- Grouped sections with expandable categories

---

## 2. PUBLIC PAGES

### 2.1 Landing Page `/`

```
┌────────────────────────────────────────────────────────────────────┐
│  🔵 SkyCampus  │  [Login]  [Register School]  [EN ▼]             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│              ☁️  SKYCAMPUS                                          │
│     Premium Academic Management Platform                           │
│                                                                     │
│     ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│     │  📚       │  │  💰       │  │  📊       │                     │
│     │ Academics  │  │ Finance   │  │ Analytics │                     │
│     └──────────┘  └──────────┘  └──────────┘                     │
│                                                                     │
│     [Get Started Free]  [View Demo]                                │
│                                                                     │
│     ──── Features ────                                             │
│     ● Multi-school SaaS  ● Custom roles  ● Mobile app             │
│     ● Report cards       ● Fee tracking  ● Parent portal          │
│                                                                     │
│     ──── Trusted by 50+ schools ────                              │
│     [La Fontaine]  [Greenhill]  [St Joseph]  [...]                │
│                                                                     │
│     ──── Footer ────                                               │
│     About  │  Contact  │  Pricing  │  Privacy  │  Terms           │
└────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Hero section with tagline
- Feature cards (3-4)
- CTA buttons
- School logos carousel
- Footer with links

---

### 2.2 School Public Page `/s/:slug`

```
┌────────────────────────────────────────────────────────────────────┐
│  🔵 [School Logo]  La Fontaine  │  [Contact] [Admissions] [EN ▼] │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🏫 Welcome to Ecole La Fontaine                          │   │
│  │  Excellence in Education Since 1995                       │   │
│  │  [About Us]  [Academics]  [Admissions]  [Gallery]        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Quick Stats ────                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                         │
│  │ 1,200 │  │  48   │  │  95%  │  │  30  │                         │
│  │Students│  │Teachers│  │Pass Rate│  │Years │                         │
│  └──────┘  └──────┘  └──────┘  └──────┘                         │
│                                                                     │
│  ──── Latest News ────                                             │
│  ● 2026 Academic Year Starts Sept 1                               │
│  ● Sports Day Postponed to Oct 15                                 │
│  ● New Library Inauguration                                       │
│                                                                     │
│  ──── Upcoming Events ────                                        │
│  ● Parent-Teacher Meeting: Aug 25                                │
│  ● Mid-Term Exams: Sept 10-14                                    │
│                                                                     │
│  ──── Footer ────                                                 │
│  Address  │  Phone  │  Email  │  Hours                           │
└────────────────────────────────────────────────────────────────────┘
```

**Components:**
- School hero with branding
- Stats cards
- News feed
- Events list
- Contact info

---

### 2.3 Admissions Page `/s/:slug/admissions`

```
┌────────────────────────────────────────────────────────────────────┐
│  Back to School  │  Admissions 2026-2027                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Application Form ────                                       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Student Name:      [____________________________]        │   │
│  │  Date of Birth:     [____/____/____]                      │   │
│  │  Gender:            ○ Male  ○ Female                      │   │
│  │  Class Applying:    [Select Class ▼]                      │   │
│  │  Parent Name:       [____________________________]        │   │
│  │  Parent Phone:      [____________________________]        │   │
│  │  Parent Email:      [____________________________]        │   │
│  │  Address:           [____________________________]        │   │
│  │  Previous School:   [____________________________]        │   │
│  │  Documents:         [📎 Upload Birth Certificate]         │   │
│  │                     [📎 Upload Report Card]               │   │
│  │  [✓] I agree to the terms and conditions                  │   │
│  │                                                          │   │
│  │  [Submit Application]  [Reset]                          │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Form validation on submit
- Document upload with progress
- Success modal after submission
- Email notification to parent

---

### 2.4 News Page `/s/:slug/news`

```
┌────────────────────────────────────────────────────────────────────┐
│  📰 Latest News  │  Search: [🔍............]  [Filter ▼]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  📌 2026 Academic Year Launch                             │   │
│  │  By Admin  │  Aug 1, 2026  │  5 min read                  │   │
│  │  We are pleased to announce the start of the 2026...      │   │
│  │  [Read More →]                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🏆 Inter-School Sports Competition Results               │   │
│  │  By Sports Dept  │  Jul 28, 2026  │  3 min read           │   │
│  │  Our students performed exceptionally well at the...      │   │
│  │  [Read More →]                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]   Page 1 of 5   [Next ▶]                               │
└────────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Gallery Page `/s/:slug/gallery`

```
┌────────────────────────────────────────────────────────────────────┐
│  🖼️ Gallery  │  [All] [Events] [Sports] [Academics] [Filter ▼]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                             │
│  │ 📷   │  │ 📷   │  │ 📷   │  │ 📷   │                             │
│  │Sports│  │Class │  │Event │  │Gradu │                             │
│  │ Day  │  │Room  │  │ 2026 │  │ation │                             │
│  └─────┘  └─────┘  └─────┘  └─────┘                             │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                             │
│  │ 📷   │  │ 📷   │  │ 📷   │  │ 📷   │                             │
│  │Lib   │  │Lab   │  │Play  │  │Field │                             │
│  │rary  │  │      │  │ground│  │ Trip │                             │
│  └─────┘  └─────┘  └─────┘  └─────┘                             │
│                                                                     │
│  [Load More]                                                        │
└────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Grid → lightbox on click
- Filter by category
- Lazy loading images
- Infinite scroll or pagination

---

### 2.6 Contact Page `/s/:slug/contact`

```
┌────────────────────────────────────────────────────────────────────┐
│  📞 Contact Us                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌────────────────────────────────────────┐   │
│  │  📍 Address   │  │  Send us a message                    │   │
│  │  KG 123 St    │  │                                        │   │
│  │  Kigali       │  │  Name:    [____________________]      │   │
│  │               │  │  Email:   [____________________]      │   │
│  │  📞 Phone     │  │  Subject: [____________________]      │   │
│  │  +250 788...  │  │  Message: [____________________]      │   │
│  │               │  │          [____________________]      │   │
│  │  ✉️ Email     │  │          [____________________]      │   │
│  │  info@...     │  │                                        │   │
│  │               │  │  [Send Message]                       │   │
│  │  🕐 Hours     │  └────────────────────────────────────────┘   │
│  │  Mon-Fri 7-5  │                                             │
│  │  Sat 8-12     │                                             │
│  └──────────────┘                                             │
│                                                                     │
│  ──── Map ────                                                   │
│  [Google Maps Embed]                                             │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. AUTHENTICATION

### 3.1 Login Page `/login`

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    ☁️  SKYCAMPUS                                   │
│                                                                     │
│                    ┌────────────────────────────┐                  │
│                    │  🔐 Welcome Back           │                  │
│                    │                            │                  │
│                    │  Email: [_______________] │                  │
│                    │  Password: [______________] │                  │
│                    │  [✓] Remember Me           │                  │
│                    │                            │                  │
│                    │  [Sign In]                 │                  │
│                    │                            │                  │
│                    │  Forgot Password?          │                  │
│                    │  Don't have an account?    │                  │
│                    │  Contact your school       │                  │
│                    └────────────────────────────┘                  │
│                                                                     │
│                    Language: [EN ▼]                                │
│                    © SkyCampus 2026                               │
└────────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Redirects based on role after login
- Shows school selection if user has multiple schools
- 2FA optional (reserved)

---

### 3.2 Forgot Password `/forgot-password`

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    ☁️  SKYCAMPUS                                   │
│                                                                     │
│                    ┌────────────────────────────┐                  │
│                    │  🔑 Reset Password          │                  │
│                    │                            │                  │
│                    │  Email: [_______________] │                  │
│                    │                            │                  │
│                    │  [Send Reset Link]         │                  │
│                    │                            │                  │
│                    │  Remember password?        │                  │
│                    │  [Back to Login]           │                  │
│                    └────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────┘
```

**Flow:**
1. User enters email
2. System sends magic link
3. User clicks link → reset password form
4. Password updated → login

---

## 4. SUPER ADMIN PANEL

### 4.1 Super Admin Dashboard `/superadmin/dashboard`

```
┌────────────────────────────────────────────────────────────────────┐
│  🔵 SkyCampus  │  Super Admin  │  [EN ▼]  [🔔 3]  [👤]          │
├──────────┬─────────────────────────────────────────────────────────┤
│  📊      │  ──── Platform Overview ────                          │
│  Schools │                                                         │
│          │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │
│  👥      │  │  120   │  │  12K   │  │  $45K  │  │  98%   │      │
│  Users   │  │Schools │  │ Users  │  │Revenue │  │Uptime  │      │
│          │  └────────┘  └────────┘  └────────┘  └────────┘      │
│  💰      │                                                         │
│  Billing │  ──── Recent Schools ────                              │
│          │  ┌────────────────────────────────────────────────┐   │
│  ⚙️      │  │ 🏫 La Fontaine  │ Active │ 200 students │ $29 │   │
│  Settings│  │ 🏫 Greenhill    │ Active │ 450 students │ $79 │   │
│          │  │ 🏫 St Joseph   │ Trial │ 80 students  │ $0  │   │
│  🔒      │  │ 🏫 Sunrise     │ Inactive│ 0 students  │ $0  │   │
│  Logout  │  └────────────────────────────────────────────────┘   │
│          │                                                         │
│          │  ──── Revenue Chart ────                               │
│          │  [📊 Line Chart: MRR growth]                          │
│          │                                                         │
│          │  ──── Platform Activity ────                           │
│          │  ● 23 users logged in today                            │
│          │  ● 5 schools created this week                         │
│          │  ● 12 support tickets open                             │
└──────────┴─────────────────────────────────────────────────────────┘
```

**Key Metrics:**
- Total schools (active/trial/inactive)
- Total users (by role)
- Monthly Recurring Revenue (MRR)
- Platform uptime

---

### 4.2 Schools List `/superadmin/schools`

```
┌────────────────────────────────────────────────────────────────────┐
│  🏫 All Schools  │  [+ Add School]  [🔍 Search...]  [Filter ▼]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ School Name    │ Plan  │ Students │ Status  │ Action │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ La Fontaine    │ Pro   │ 1,200   │ 🟢 Active │ ⋮    │   │
│  │  2 │ Greenhill     │ Pro   │ 450     │ 🟢 Active │ ⋮    │   │
│  │  3 │ St Joseph     │ Basic │ 80      │ 🟡 Trial │ ⋮    │   │
│  │  4 │ Sunrise       │ Pro   │ 0       │ 🔴 Inactive│ ⋮    │   │
│  │  5 │ Wisdom       │ Basic │ 34      │ 🟢 Active │ ⋮    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 24  [Next ▶]                                 │
│  Showing 1-5 of 120 schools                                       │
└────────────────────────────────────────────────────────────────────┘
```

**Actions (⋮ menu):**
- View school details
- Edit settings
- Manage modules (toggle on/off)
- View subscription
- Suspend/Activate school
- Delete school (with confirmation)

---

### 4.3 School Detail `/superadmin/schools/:id`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back to Schools  │  🏫 La Fontaine  │  [Edit] [⋮]           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── School Information ────                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Name: La Fontaine School                                 │   │
│  │  Subdomain: lafontaine.skycampus.com                      │   │
│  │  Plan: Pro │ $79/month │ Next billing: Oct 1, 2026       │   │
│  │  Status: 🟢 Active │ Created: Jan 15, 2025               │   │
│  │  Contact: info@lafontaine.com  │  +250 788 123 456       │   │
│  │  Address: KG 123 St, Kigali                               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Usage Stats ────                                            │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │  1,200 │  │   48   │  │  2,400 │  │  95%  │                 │
│  │Students│  │Teachers│  │ Parents│  │Active │                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ──── Tabs ────                                                   │
│  [Modules] [Users] [Subscription] [Settings] [Audit Log]         │
│                                                                     │
│  ──── Active Modules ────                                         │
│  ✅ Academics    ✅ Finance     ✅ Attendance    ✅ Students       │
│  ✅ Staff        ✅ Comms       ✅ Settings      🔲 Transport      │
│  🔲 Hostel       🔲 Library    🔲 Inventory     🔲 AI Comments    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Manage Modules (Toggle) `/superadmin/schools/:id/modules`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back  │  ⚙️ Modules: La Fontaine                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Toggle features ON/OFF for this school:                          │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  📚 Academics          │  ON   │  [Toggle]                 │   │
│  │  Core: Marks, Reports, Timetable                         │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  💰 Finance            │  ON   │  [Toggle]                 │   │
│  │  Fees, Payments, Invoices                                │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  👨‍🎓 Students          │  ON   │  [Toggle]                 │   │
│  │  Enrollment, Profiles, Archive                           │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  📋 Attendance         │  ON   │  [Toggle]                 │   │
│  │  Daily tracking, Reports                                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  👥 Staff & HR         │  ON   │  [Toggle]                 │   │
│  │  Teachers, Payroll, Leave                                │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  💬 Communication      │  ON   │  [Toggle]                 │   │
│  │  SMS, Email, Notifications                               │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  🚌 Transport          │  OFF  │  [Toggle]                 │   │
│  │  Reserved - requires add-on                              │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  🏠 Hostel             │  OFF  │  [Toggle]                 │   │
│  │  Reserved - requires add-on                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Save Changes]                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Manage Subscription `/superadmin/schools/:id/subscription`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back  │  💳 Subscription: La Fontaine                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Current Plan ────                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Plan: Pro                                                │   │
│  │  Price: $79/month (billed annually)                       │   │
│  │  Status: 🟢 Active                                        │   │
│  │  Next billing: October 1, 2026                            │   │
│  │  Since: January 15, 2025                                  │   │
│  │  Payment method: Visa ending 4242                         │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Change Plan ────                                            │
│  ┌────────────┬──────────┬────────────┬──────────────┐          │
│  │ Basic      │ Pro      │ Enterprise │ Custom       │          │
│  │ $29/month  │ $79/month│ $199/month │ Contact us   │          │
│  │ 100 stud   │ 500 stud │ Unlimited  │ Bespoke      │          │
│  └────────────┴──────────┴────────────┴──────────────┘          │
│                                                                     │
│  ──── Billing History ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Aug 1, 2026 │ $79 │ Paid │ [Download Invoice]            │   │
│  │ Jul 1, 2026 │ $79 │ Paid │ [Download Invoice]            │   │
│  │ Jun 1, 2026 │ $79 │ Paid │ [Download Invoice]            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Cancel Subscription]  [Update Payment Method]                   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.6 All Users `/superadmin/users`

```
┌────────────────────────────────────────────────────────────────────┐
│  👥 All Users  │  [Add User]  [🔍 Search...]  [School Filter ▼] │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Name        │ Email         │ School      │ Role    │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ John Doe    │ john@...      │ La Fontaine │ Admin   │   │
│  │  2 │ Jane Smith  │ jane@...      │ Greenhill   │ Teacher │   │
│  │  3 │ Paul Kagame │ paul@...      │ St Joseph   │ Parent  │   │
│  │  4 │ Alice Mwiza │ alice@...     │ La Fontaine │ Student │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 240  [Next ▶]                               │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.7 Billing & Revenue `/superadmin/billing`

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Revenue Dashboard  │  [Export Report]  [Date Range ▼]       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │ $45,230 │  │ $3,769 │  │  120   │  │  $6.2K │                 │
│  │MRR     │  │ Avg/sub│  │Pay subs│  │Churned │                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ──── Revenue Chart ────                                           │
│  [📊 Bar Chart: Monthly Revenue]                                  │
│                                                                     │
│  ──── Recent Transactions ────                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ School        │ Plan  │ Amount │ Date     │ Status         │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │ La Fontaine   │ Pro   │ $79    │ Aug 1   │ ✅ Paid        │   │
│  │ Greenhill     │ Pro   │ $79    │ Aug 1   │ ✅ Paid        │   │
│  │ St Joseph     │ Basic │ $29    │ Aug 5   │ ⚠️ Pending     │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.8 Audit Logs `/superadmin/audit-logs`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 Audit Logs  │  [🔍 Search]  [Filter: All Actions ▼]          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Time          │ User      │ Action           │ School    │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  10:23 Aug 15  │ john@...  │ Student enrolled  │ La Fon   │   │
│  │  09:45 Aug 15  │ jane@...  │ Fee payment rec  │ Greenhil │   │
│  │  08:12 Aug 15  │ admin@... │ School created   │ Wisdom   │   │
│  │  07:30 Aug 15  │ paul@...  │ Login            │ St Jos   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 450  [Next ▶]                               │
└────────────────────────────────────────────────────────────────────┘
```

---

### 4.9 Platform Settings `/superadmin/settings`

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚙️ Platform Settings                                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Tabs ────                                                   │
│  [General] [Branding] [Email] [Security] [Integrations]          │
│                                                                     │
│  ──── General ────                                                │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Platform Name:  [SkyCampus________________________]      │   │
│  │  Default Language: [English ▼]                           │   │
│  │  Timezone: [Africa/Kigali ▼]                             │   │
│  │  Date Format: [DD/MM/YYYY ▼]                             │   │
│  │                                                          │   │
│  │  [✓] Allow school registration                           │   │
│  │  [✓] Enable trial mode (14 days)                         │   │
│  │  [ ] Require email verification                          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Save Settings]                                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. ADMIN DASHBOARD

### 5.1 Admin Dashboard `/admin/dashboard`

```
┌────────────────────────────────────────────────────────────────────┐
│  🏫 La Fontaine  │  Admin  │  [EN ▼]  [🔔 5]  [👤 John]        │
├──────────┬─────────────────────────────────────────────────────────┤
│  📊      │  ──── Welcome Back, John! ────                       │
│  Dashboard│  Today is August 15, 2026                            │
│          │                                                         │
│  👨‍🎓     │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │
│  Students│  │  1,200 │  │   48   │  │  2,400 │  │   15   │      │
│          │  │Students│  │Teachers│  │ Parents│  │Present │      │
│  📚      │  └────────┘  └────────┘  └────────┘  └────────┘      │
│  Academics│                                                         │
│          │  ──── Quick Actions ────                               │
│  💰      │  [📝 Take Attendance]  [💳 Record Payment]             │
│  Finance │  [📊 Generate Report]  [👨‍🎓 Enroll Student]            │
│          │                                                         │
│  👥      │  ──── Recent Activity ────                             │
│  Staff   │  ┌────────────────────────────────────────────────┐   │
│          │  │ 🟢 Alice Mwiza checked in at 07:45           │   │
│  ⚙️      │  │ 💰 Payment of $200 received from Peter       │   │
│  Settings│  │ 📝 Marks entered for Class 5A Math           │   │
│          │  │ 📢 Announcement: Sports Day Oct 15           │   │
│  🔒      │  └────────────────────────────────────────────────┘   │
│  Logout  │                                                         │
│          │  ──── Attendance Today ────                            │
│          │  [📊 Donut Chart: Present 95% | Absent 5%]           │
│          │                                                         │
│          │  ──── Upcoming Events ────                             │
│          │  ● Parent-Teacher Meeting: Aug 25                    │
│          │  ● Mid-Term Exams: Sept 10-14                       │
│          │  ● End of Term: Sept 30                              │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

### 5.2 Accountant Dashboard `/admin/dashboard/accountant` *(if accountant role)*

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Finance Dashboard  │  Accountant  │  [EN ▼]  [🔔 3]        │
├──────────┬─────────────────────────────────────────────────────────┤
│  📊      │  ──── Financial Overview ────                         │
│  Dashboard│                                                         │
│          │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐      │
│  💰      │  │ $45,200│  │ $8,300 │  │  230   │  │   $0   │      │
│  Finance │  │Revenue │  │Outstand│  │Paid    │  │Overdue │      │
│          │  └────────┘  └────────┘  └────────┘  └────────┘      │
│  👨‍🎓     │                                                         │
│  Students│  ──── Quick Actions ────                               │
│          │  [💳 Record Payment]  [📊 Fee Report]                  │
│  ⚙️      │  [📋 Fee Structure]   [📨 Send Reminder]              │
│  Settings│                                                         │
│          │  ──── Recent Payments ────                              │
│  🔒      │  ┌────────────────────────────────────────────────┐   │
│  Logout  │  │ Student        │ Amount │ Date     │ Status    │   │
│          │  ├────────────────────────────────────────────────┤   │
│          │  │ Peter Niyo     │ $200   │ Aug 15  │ ✅ Paid   │   │
│          │  │ Grace Uwimana  │ $150   │ Aug 14  │ ✅ Paid   │   │
│          │  │ Jean Claude    │ $200   │ Aug 13  │ ⚠️Pending │   │
│          │  └────────────────────────────────────────────────┘   │
│          │                                                         │
│          │  ──── Outstanding by Class ────                        │
│          │  [📊 Bar Chart]                                       │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

## 6. ACADEMICS MODULE

### 6.1 Marks Entry `/admin/academics/marks/entry`

```
┌────────────────────────────────────────────────────────────────────┐
│  📝 Marks Entry  │  Class: [P5 ▼]  Subject: [Math ▼]  Term: [1 ▼]│
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Student Name    │ CA1 │ CA2 │ Exams │ Total │ Grade │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ Aline Uwase     │ [18]│ [15]│  [62] │ [95]  │  A   │   │
│  │  2 │ Bosco Niyo      │ [14]│ [12]│  [58] │ [84]  │  B   │   │
│  │  3 │ Claire Mugisha  │ [16]│ [18]│  [70] │ [104] │  A   │   │
│  │  4 │ David Habimana  │ [10]│ [08]│  [45] │ [63]  │  C   │   │
│  │  5 │ Eva Uwitonze    │ [19]│ [17]│  [68] │ [104] │  A   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Assessment Weighting ────                                   │
│  CA1: 20%  │  CA2: 20%  │  Exams: 60%                           │
│  [Auto-calculate with this weighting]                             │
│                                                                     │
│  ──── Actions ────                                                │
│  [💾 Save Marks]  [📊 Preview Report]  [📥 Export CSV]           │
│  [🔒 Lock Marks (prevent further edits)]                          │
└────────────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Type marks → auto-calculates total & grade
- Color-coded cells: A=green, B=blue, C=yellow, D=orange, F=red
- Bulk fill option (same mark for all)
- Locking makes marks read-only

---

### 6.2 Marks Analysis `/admin/academics/marks/analysis`

```
┌────────────────────────────────────────────────────────────────────┐
│  📊 Marks Analysis  │  Class: [P5 ▼]  Term: [1 ▼]               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Class Performance ────                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │  78.5  │  │  82.3  │  │   12   │  │   3   │                 │
│  │Avg Score│  │Pass %  │  │Top Stud│  │Failing│                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ──── Grade Distribution ────                                     │
│  [📊 Bar Chart: A: 12 | B: 18 | C: 10 | D: 5 | F: 3]          │
│                                                                     │
│  ──── Subject Performance ────                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Subject    │ Avg  │ Pass% │ Top Score │ Top Student      │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Math       │ 72.4 │ 85%   │ 98       │ Aline Uwase      │   │
│  │  English    │ 68.2 │ 80%   │ 95       │ Claire Mugisha   │   │
│  │  Science    │ 75.1 │ 90%   │ 100      │ Eva Uwitonze     │   │
│  │  Kinyarwanda│ 70.8 │ 83%   │ 97       │ Bosco Niyo       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [📥 Export Report]  [📄 Print]                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 6.3 Timetable Builder `/admin/academics/timetable/builder`

```
┌────────────────────────────────────────────────────────────────────┐
│  🕐 Timetable Builder  │  Class: [P5 ▼]  Term: [1 ▼]            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐        │
│  │ Time   │  Mon   │  Tue   │  Wed   │  Thu   │  Fri   │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 7:30   │  Math  │ English│Science │ Kinyar │ Social │        │
│  │ 8:30   │        │        │        │        │        │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 8:40   │ English│  Math  │  Math  │Science │ English│        │
│  │ 9:40   │        │        │        │        │        │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 9:50   │Science │Social  │ English│  Math  │ Science│        │
│  │ 10:50  │        │        │        │        │        │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 11:00  │Kinyar  │Science │ Social │ English│  Math  │        │
│  │ 12:00  │        │        │        │        │        │        │
│  ├────────┴────────┴────────┴────────┴────────┴────────┤        │
│  │  LUNCH BREAK (12:00 - 1:00)                        │        │
│  ├────────┬────────┬────────┬────────┬────────┬────────┤        │
│  │ 1:00   │Social  │Kinyar  │English │ Social │Kinyar  │        │
│  │ 2:00   │        │        │        │        │        │        │
│  └────────┴────────┴────────┴────────┴────────┴────────┘        │
│                                                                     │
│  ──── Actions ────                                                │
│  [💾 Save Timetable]  [📋 Copy to Another Class]  [🔍 Conflicts]│
│  [📥 Export PDF]  [📤 Import from CSV]                           │
└────────────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Drag-and-drop subjects into cells
- Conflict detection (teacher double-booked)
- Auto-validate on save

---

### 6.4 Timetable Conflicts `/admin/academics/timetable/conflicts`

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚠️ Conflict Detector  │  Class: [All ▼]  │  [Refresh]         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Teacher Conflicts ────                                      │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  ⚠️ Mr. Habimana: 2 classes at 7:30 on Monday             │   │
│  │     → P5 Math and P6 Math conflict                        │   │
│  │  ⚠️ Ms. Uwimana: 3 classes on Wednesday                   │   │
│  │     → P4, P5, P6 all at 8:40                             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Room Conflicts ────                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  ⚠️ Room 201: Double-booked at 9:50 Tuesday               │   │
│  │     → P5 Science and P6 English                           │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Recommendations ────                                        │
│  ● Swap P5 Math (Mon 7:30) with P5 Social (Mon 1:00)            │
│  ● Move P6 English to Room 202                                  │
│                                                                     │
│  [Apply All Fixes]  [Dismiss]                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

### 6.5 Report Cards `/admin/academics/reports`

```
┌────────────────────────────────────────────────────────────────────┐
│  📄 Report Cards  │  Class: [P5 ▼]  Term: [1 ▼]  │  [Generate]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Student Name    │ Avg  │ Grade │ Rank │ Action       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ Aline Uwase     │ 94.5 │  A    │  1   │ [View] [PDF] │   │
│  │  2 │ Bosco Niyo      │ 84.2 │  B    │  2   │ [View] [PDF] │   │
│  │  3 │ Claire Mugisha  │ 79.8 │  B    │  3   │ [View] [PDF] │   │
│  │  4 │ David Habimana  │ 63.4 │  C    │  10  │ [View] [PDF] │   │
│  │  5 │ Eva Uwitonze    │ 92.1 │  A    │  2   │ [View] [PDF] │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Bulk Actions ────                                           │
│  [📥 Download All PDFs]  [📧 Email All Parents]  [📄 Print All] │
│                                                                     │
│  ──── Report Card Template ────                                   │
│  [Preview of selected student's report card]                     │
└────────────────────────────────────────────────────────────────────┘
```

**Report Card Preview (student view):**

```
┌────────────────────────────────────────────────────────────────────┐
│  🏫 ECOLE LA FONTAINE                                            │
│  REPORT CARD — Term 1, 2026                                     │
│                                                                   │
│  Student: Aline Uwase       Class: P5                          │
│  Adm No: 2026-001           Age: 10                           │
│                                                                   │
│  ──── Academic Performance ────                                 │
│  ┌────────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │ Subject    │ CA1 20%  │ CA2 20%  │ Exam 60% │ Total    │   │
│  ├────────────┼──────────┼──────────┼──────────┼──────────┤   │
│  │ Math       │ 18       │ 15       │ 62       │ 95       │   │
│  │ English    │ 16       │ 17       │ 60       │ 93       │   │
│  │ Science    │ 19       │ 18       │ 68       │ 105      │   │
│  │ Kinyarwanda│ 15       │ 14       │ 55       │ 84       │   │
│  │ Social     │ 17       │ 16       │ 58       │ 91       │   │
│  └────────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                                   │
│  Average: 93.6        Grade: A     Rank: 1/40                   │
│                                                                   │
│  ──── Teacher's Comments ────                                    │
│  Aline is an excellent student with a bright future.            │
│  She demonstrates strong analytical skills.                    │
│                                                                   │
│  ──── Attendance ────                                            │
│  Present: 45/45  │  Absent: 0  │  Late: 0                       │
│                                                                   │
│  ──── Next Term: Sept 1, 2026 ────                              │
│                                                                   │
│  [Download PDF]  [Print]  [Send to Parent]                      │
└────────────────────────────────────────────────────────────────────┘
```

---

### 6.6 Grading Formula Configurator `/admin/settings/grading`

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚙️ Grading Formula  │  School: La Fontaine                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Assessment Weighting ────                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  CA1: [20]%     CA2: [20]%     Exams: [60]%              │   │
│  │  [Reset to Default] [Save Weighting]                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Grade Scale ────                                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Grade │ From  │ To    │ Description                     │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  A     │  80   │  100  │ Excellent                       │   │
│  │  B     │  65   │  79   │ Good                            │   │
│  │  C     │  50   │  64   │ Satisfactory                    │   │
│  │  D     │  35   │  49   │ Needs Improvement               │   │
│  │  F     │  0    │  34   │ Fail                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [➕ Add Grade]  [✏️ Edit]  [🗑️ Delete]                        │
│  [Save Grade Scale]                                               │
│                                                                     │
│  ──── Report Card Settings ────                                   │
│  [✓] Include teacher comments                                     │
│  [✓] Include attendance summary                                   │
│  [ ] Include class rank                                           │
│  [✓] Include subject-wise breakdown                              │
│                                                                     │
│  [Save Settings]                                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. ATTENDANCE MODULE

### 7.1 Attendance Entry `/admin/attendance/entry`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 Take Attendance  │  Class: [P5 ▼]  │  Date: [Aug 15, 2026] │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Student Name    │ Status        │ Remark              │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ Aline Uwase     │ [● Present]   │ [_______________]   │   │
│  │  2 │ Bosco Niyo      │ [○ Absent]    │ [Sick___________]   │   │
│  │  3 │ Claire Mugisha  │ [● Present]   │ [_______________]   │   │
│  │  4 │ David Habimana  │ [● Present]   │ [_______________]   │   │
│  │  5 │ Eva Uwitonze    │ [○ Late]      │ [Traffic________]   │   │
│  │  6 │ Frank Nkurunziza│ [● Present]   │ [_______________]   │   │
│  │  7 │ Grace Uwimana   │ [● Present]   │ [_______________]   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Summary ────                                                │
│  Present: 20  │  Absent: 3  │  Late: 2  │  Total: 25           │
│                                                                     │
│  ──── Quick Actions ────                                          │
│  [📋 Mark All Present]  [📱 Send SMS to Absent Parents]          │
│  [💾 Save Attendance]                                             │
└────────────────────────────────────────────────────────────────────┘
```

**Interaction:**
- Click status toggles: Present → Absent → Late → Present
- Auto-save draft every 30 seconds
- SMS/Email notification to parents of absent students (optional)

---

### 7.2 Attendance Reports `/admin/attendance/reports`

```
┌────────────────────────────────────────────────────────────────────┐
│  📊 Attendance Report  │  Class: [P5 ▼]  │  Term: [1 ▼]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Summary Statistics ────                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │  95.2% │  │   45   │  │   3   │  │   2   │                 │
│  │Attendance│  │Days   │  │Absents│  │Lates  │                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ──── Monthly Trend ────                                          │
│  [📊 Line Chart: Attendance % by week]                           │
│                                                                     │
│  ──── Student Attendance List ────                                │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Student Name    │ Present │ Absent │ Late │ % Attended   │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Aline Uwase     │ 45      │ 0      │ 0    │ 100%         │   │
│  │  Bosco Niyo      │ 43      │ 2      │ 0    │ 95.6%        │   │
│  │  Claire Mugisha  │ 44      │ 0      │ 1    │ 97.8%        │   │
│  │  David Habimana  │ 40      │ 3      │ 2    │ 88.9%        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [📥 Export CSV]  [📄 Print]  [📧 Email to Parents]              │
└────────────────────────────────────────────────────────────────────┘
```

---

## 8. STUDENTS MODULE

### 8.1 Student List `/admin/students`

```
┌────────────────────────────────────────────────────────────────────┐
│  👨‍🎓 Students  │  [+ Enroll]  [🔍 Search...]  [Filter ▼]       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Adm No │ Name         │ Class │ Parent    │ Status   │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ 2026-001│ Aline Uwase   │ P5    │ Marie     │ 🟢 Active│   │
│  │  2 │ 2026-002│ Bosco Niyo    │ P5    │ Jean      │ 🟢 Active│   │
│  │  3 │ 2026-003│ Claire Mugisha│ P5    │ Claude    │ 🟡 Inactive│   │
│  │  4 │ 2026-004│ David Habimana│ P5    │ Alice     │ 🟢 Active│   │
│  │  5 │ 2026-005│ Eva Uwitonze  │ P5    │ Paul      │ 🟢 Active│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Showing 1-25 of 1,200 students  │  [◀ Prev] [1] [2] [3] [Next ▶]│
│                                                                     │
│  ──── Bulk Actions ────                                           │
│  [📥 Export CSV]  [📋 Bulk Import]  [📤 Promote Students]        │
└────────────────────────────────────────────────────────────────────┘
```

---

### 8.2 Enroll Student `/admin/students/new`

```
┌────────────────────────────────────────────────────────────────────┐
│  ➕ Enroll New Student  │  Step 1 of 3: Personal Info          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Student Photo:  [📷 Upload Photo]                        │   │
│  │  First Name:     [____________________________]           │   │
│  │  Last Name:      [____________________________]           │   │
│  │  Date of Birth:  [____/____/____]                         │   │
│  │  Gender:         ○ Male  ○ Female                         │   │
│  │  Nationality:    [Rwandan ▼]                              │   │
│  │  Religion:       [______________]                          │   │
│  │  Address:        [____________________________]           │   │
│  │  [Next: Family & Contact →]                               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Step 2: Family & Contact                                         │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Parent/Guardian: [Search or create new]                   │   │
│  │  Parent Name:     [____________________________]           │   │
│  │  Parent Phone:    [____________________________]           │   │
│  │  Parent Email:    [____________________________]           │   │
│  │  Relationship:    [Father ▼]                               │   │
│  │                                                          │   │
│  │  [← Back]  [Next: Academic Info →]                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Step 3: Academic Info                                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Class:            [P5 ▼]                                  │   │
│  │  Admission Date:   [____/____/____]                        │   │
│  │  Previous School:  [____________________________]           │   │
│  │  Documents:        [📎 Birth Certificate]                  │   │
│  │                     [📎 Report Card]                       │   │
│  │                     [📎 Health Certificate]                │   │
│  │                                                          │   │
│  │  [← Back]  [✅ Enroll Student]                           │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 8.3 Student Details `/admin/students/:id`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back to Students  │  Aline Uwase  │  [Edit] [⋮]            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ──── Student Info ────                             │
│  │  📷       │  Name: Aline Uwase                                 │
│  │  Photo    │  Adm No: 2026-001                                  │
│  │           │  Class: P5                                        │
│  │           │  DOB: Jan 15, 2016 (10 years)                    │
│  │           │  Gender: Female                                   │
│  │           │  Guardian: Marie Uwase (Mother)                  │
│  │           │  Phone: +250 788 123 456                        │
│  └──────────┘  Status: 🟢 Active                                │
│                                                                     │
│  ──── Tabs ────                                                   │
│  [Info] [Academics] [Attendance] [Fees] [Family] [Documents]    │
│                                                                     │
│  ──── Academics Tab ────                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Term  │ Math │ Eng │ Sci │ Kinyar │ Social │ Avg │ Rank │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  T1    │ 95   │ 93  │ 105 │ 84    │ 91     │ 93.6│  1   │   │
│  │  T2    │ 92   │ 88  │ 98  │ 86    │ 89     │ 90.6│  2   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Actions ────                                                │
│  [📊 View Report Card]  [📝 Edit Marks]  [📋 Transfer Class]    │
│  [📱 Message Parent]  [🗑️ Archive Student]                      │
└────────────────────────────────────────────────────────────────────┘
```

---

### 8.4 Bulk Import Students `/admin/students/import`

```
┌────────────────────────────────────────────────────────────────────┐
│  📥 Bulk Import Students                                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Upload CSV File ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │               📁  Drop CSV file here                      │   │
│  │               or click to browse                         │   │
│  │                                                          │   │
│  │  [Download Template.csv]                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Required Columns ────                                       │
│  ● First Name, Last Name, Date of Birth, Gender                  │
│  ● Class, Parent Name, Parent Phone, Parent Email               │
│  ● Admission Date (optional)                                    │
│                                                                     │
│  ──── Preview (after upload) ────                                │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Name         │ Class │ Parent       │ Status          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ Peter Niyo   │ P5    │ Jean Niyo    │ ✅ Valid        │   │
│  │  2 │ Grace Uwimana│ P5    │ Marie Uwimana│ ✅ Valid        │   │
│  │  3 │ Jean Claude  │ P6    │ Paul Claude  │ ⚠️ Class not found│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Import 48 Students]  [Cancel]                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 9. FINANCE MODULE

### 9.1 Fee Structure `/admin/finance/fee-structure`

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Fee Structure  │  Term: [1 ▼]  │  [+ Add Fee]              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Class-based Fees ────                                       │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Class  │ Tuition │ Activity │ Library │ Total │ Action   │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  P1    │ $200    │ $50     │ $20    │ $270  │ [✏️] [🗑️]  │   │
│  │  P2    │ $200    │ $50     │ $20    │ $270  │ [✏️] [🗑️]  │   │
│  │  P3    │ $200    │ $50     │ $20    │ $270  │ [✏️] [🗑️]  │   │
│  │  P4    │ $250    │ $60     │ $25    │ $335  │ [✏️] [🗑️]  │   │
│  │  P5    │ $250    │ $60     │ $25    │ $335  │ [✏️] [🗑️]  │   │
│  │  P6    │ $250    │ $60     │ $25    │ $335  │ [✏️] [🗑️]  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Additional Fees ────                                        │
│  ● Registration Fee: $50 (one-time)                              │
│  ● Sports Fee: $30 per term                                     │
│  ● Transport Fee: $100 per term (toggleable)                    │
│                                                                     │
│  [Apply to All Classes]  [Save Structure]                         │
└────────────────────────────────────────────────────────────────────┘
```

---

### 9.2 Student Fee Account `/admin/finance/student/:id`

```
┌────────────────────────────────────────────────────────────────────┐
│  💳 Fee Account: Aline Uwase  │  Class: P5  │  Term: 1          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Summary ────                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │  $335   │  │  $200   │  │  $135   │  │  $0    │                 │
│  │Total Due│  │ Paid   │  │Balance │  │Overdue │                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  ──── Fee Breakdown ────                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Fee Item      │ Amount  │ Paid │ Status   │ Action       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Tuition       │ $250    │ $200 │ Partial  │ [Record]     │   │
│  │  Activity      │ $60     │ $0   │ Unpaid   │ [Record]     │   │
│  │  Library       │ $25     │ $0   │ Unpaid   │ [Record]     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Payment History ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Date       │ Amount │ Method │ Receipt │ Status         │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Aug 1, 2026│ $200   │ Cash   │ #R-001  │ ✅ Confirmed   │   │
│  │  Jul 15, 2026│ $100   │ Mobile │ #R-002  │ ✅ Confirmed   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [💳 Record Payment]  [📄 Print Statement]  [📧 Email Parent]    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 9.3 Record Payment `/admin/finance/payments/new`

```
┌────────────────────────────────────────────────────────────────────┐
│  💳 Record Payment                                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Student:        [Search Student ▼]                       │   │
│  │  Amount:         [$____________]                         │   │
│  │  Payment Method: [Cash ▼]                                  │   │
│  │                  ● Cash  ● Mobile  ● Bank  ● Cheque       │   │
│  │  Payment Date:   [____/____/____]                         │   │
│  │  Reference No:   [____________________________]           │   │
│  │  Fee Item:       [Tuition ▼]                               │   │
│  │                                                          │   │
│  │  [✓] Send receipt to parent email                         │   │
│  │  [✓] Send SMS confirmation to parent                      │   │
│  │                                                          │   │
│  │  [💾 Record Payment]  [Cancel]                           │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 9.4 Financial Reports `/admin/finance/reports`

```
┌────────────────────────────────────────────────────────────────────┐
│  📊 Financial Reports  │  Term: [1 ▼]  │  Year: [2026 ▼]       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Revenue Reports ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Report Type        │ Description                        │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Fee Collection     │ Total fees collected by class      │   │
│  │  Outstanding Report │ All students with balances         │   │
│  │  Payment History    │ All payments with date range       │   │
│  │  Revenue Analytics  │ Income trends over time            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Summary ────                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                 │
│  │ $45,200 │  │ $8,300 │  │ 85.6%  │  │  230   │                 │
│  │Collected│  │Outstand│  │Collection│  │Students│                 │
│  └────────┘  └────────┘  └────────┘  └────────┘                 │
│                                                                     │
│  [📥 Export Excel]  [📄 Print]  [📧 Email Report]                │
└────────────────────────────────────────────────────────────────────┘
```

---

## 10. STAFF & HR MODULE

### 10.1 Staff List `/admin/staff`

```
┌────────────────────────────────────────────────────────────────────┐
│  👥 Staff  │  [+ Add Staff]  [🔍 Search...]  [Filter ▼]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Name         │ Role      │ Department  │ Status       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ John Habimana│ Teacher   │ Math       │ 🟢 Active    │   │
│  │  2 │ Jane Uwimana │ Teacher   │ English    │ 🟢 Active    │   │
│  │  3 │ Paul Niyo    │ Admin     │ Admin      │ 🟢 Active    │   │
│  │  4 │ Alice Mwiza  │ Accountant│ Finance    │ 🟢 Active    │   │
│  │  5 │ Jean Claude  │ Teacher   │ Science    │ 🟡 Inactive  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 5  [Next ▶]                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

### 10.2 Teacher Profile `/admin/staff/:id`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back to Staff  │  John Habimana  │  [Edit] [⋮]             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ──── Personal Info ────                             │
│  │  📷       │  Name: John Habimana                                │
│  │  Photo    │  Role: Teacher (Math)                               │
│  │           │  Department: Science                                │
│  │           │  Employee ID: T-2026-001                           │
│  │           │  Email: john@lafontaine.com                       │
│  │           │  Phone: +250 788 123 456                         │
│  │           │  Status: 🟢 Active                                │
│  └──────────┘                                                     │
│                                                                     │
│  ──── Tabs ────                                                   │
│  [Info] [Classes] [Timetable] [Performance] [Leave] [Payroll]    │
│                                                                     │
│  ──── Classes Tab ────                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Class  │ Subject    │ Students │ Schedule                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  P5     │ Math       │ 45      │ Mon/Wed/Fri 7:30-8:30   │   │
│  │  P6     │ Math       │ 42      │ Tue/Thu 8:40-9:40       │   │
│  │  S1     │ Algebra    │ 38      │ Mon/Wed 11:00-12:00     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Performance Tab ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Term  │ Class  │ Avg Score │ Pass % │ Ranking             │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  T1    │ P5     │ 78.5%     │ 92%    │ 2/8                 │   │
│  │  T1    │ P6     │ 74.2%     │ 88%    │ 4/8                 │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 10.3 Payroll Management `/admin/staff/payroll`

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Payroll  │  Month: [August 2026 ▼]  │  [Run Payroll]       │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Name         │ Role    │ Basic │ Allow │ Deduct │ Net │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ John Habimana│ Teacher │ $800  │ $100  │ $50   │ $850│   │
│  │  2 │ Jane Uwimana │ Teacher │ $800  │ $100  │ $40   │ $860│   │
│  │  3 │ Paul Niyo    │ Admin   │ $1,200│ $200  │ $100  │$1,300│   │
│  │  4 │ Alice Mwiza  │ Account │ $900  │ $150  │ $60   │ $990│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Summary ────                                                │
│  Total Payroll: $4,000  │  Staff: 12  │  Avg: $333              │
│                                                                     │
│  [📥 Export Payroll CSV]  [📄 Print Payslips]                     │
│  [📧 Email Payslips to Staff]                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

### 10.4 Leave Requests `/admin/staff/leave`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 Leave Requests  │  Status: [All ▼]  │  [+ New Request]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Staff        │ Type     │ Dates      │ Status  │ Action│   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ John Habimana│ Sick     │ Aug 20-22 │ Pending │ [✅]  │   │
│  │  2 │ Jane Uwimana │ Vacation │ Sept 1-5  │ Approved│ [✅]  │   │
│  │  3 │ Paul Niyo    │ Personal │ Aug 25    │ Denied  │ [✅]  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Leave Balance ────                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Staff        │ Allowed │ Used │ Remaining                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  John Habimana│ 20 days │ 3    │ 17 days                   │   │
│  │  Jane Uwimana │ 20 days │ 5    │ 15 days                   │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 11. COMMUNICATION MODULE

### 11.1 Notifications Center `/admin/notifications`

```
┌────────────────────────────────────────────────────────────────────┐
│  🔔 Notifications  │  [Mark All Read]  [Settings]               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🔵 NEW │ Aline Uwase was absent today                    │   │
│  │         │ 2 min ago                                       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  🔵 NEW │ Payment of $200 received from Peter Niyo       │   │
│  │         │ 1 hour ago                                     │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  ⚪ Read │ Parent-Teacher Meeting reminder sent            │   │
│  │         │ 2 days ago                                     │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  ⚪ Read │ Marks for P5 Math locked for Term 1           │   │
│  │         │ 3 days ago                                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Load More]                                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

### 11.2 Send Message `/admin/messages/new`

```
┌────────────────────────────────────────────────────────────────────┐
│  ✉️ Compose Message                                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  To:            [Select Recipients ▼]                     │   │
│  │                 ○ All Students  ○ All Parents              │   │
│  │                 ○ All Teachers  ○ Specific Class           │   │
│  │  Subject:       [____________________________]           │   │
│  │                                                          │   │
│  │  Message:       [____________________________]           │   │
│  │                 [____________________________]           │   │
│  │                 [____________________________]           │   │
│  │                 [____________________________]           │   │
│  │                                                          │   │
│  │  Attachments:   [📎 Add Attachment]                     │   │
│  │                                                          │   │
│  │  [✓] Send as SMS also  [✓] Send as Push Notification    │   │
│  │                                                          │   │
│  │  [📤 Send Message]  [Save Draft]  [Cancel]             │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 11.3 Bulk SMS `/admin/sms/bulk`

```
┌────────────────────────────────────────────────────────────────────┐
│  📱 Bulk SMS  │  Balance: 2,450 credits  │  [Purchase]         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Recipients:    [Select Group ▼]                          │   │
│  │                 ● All Parents  ○ All Teachers              │   │
│  │                 ○ Class P5     ○ Custom List               │   │
│  │                                                          │   │
│  │  Message:       [____________________________]           │   │
│  │  (160 chars max per SMS)                                │   │
│  │                                                          │   │
│  │  Preview:       "Dear Parents, ..."                     │   │
│  │                                                          │   │
│  │  Recipients:    240 parents                              │   │
│  │  Estimated Cost: 240 credits                            │   │
│  │                                                          │   │
│  │  [📤 Send SMS]  [Schedule]  [Cancel]                    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── SMS History ────                                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Date       │ To      │ Message      │ Status             │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Aug 15     │ Parents │ Sports Day   │ ✅ Sent (240)      │   │
│  │  Aug 12     │ Teachers│ Staff Meeting│ ✅ Sent (48)       │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 12. SETTINGS MODULE

### 12.1 School Settings `/admin/settings`

```
┌────────────────────────────────────────────────────────────────────┐
│  ⚙️ Settings  │  School: La Fontaine                             │
├──────────┬─────────────────────────────────────────────────────────┤
│  General │  ──── Tabs ────                                       │
│  Academic│  [General] [Academic] [Grading] [Branding] [Users]    │
│  Grading │  [Modules] [Security] [Integrations]                  │
│  Branding│                                                         │
│  Users   │  ──── General Settings ────                           │
│  Modules │  ┌────────────────────────────────────────────────┐   │
│  Security│  │  School Name: [La Fontaine School]            │   │
│          │  │  Subdomain: [lafontaine] .skycampus.com      │   │
│  🔒      │  │  Email: [info@lafontaine.com]               │   │
│  Logout  │  │  Phone: [+250 788 123 456]                   │   │
│          │  │  Address: [KG 123 St, Kigali]                │   │
│          │  │  Timezone: [Africa/Kigali ▼]                 │   │
│          │  │  Language: [English ▼]                       │   │
│          │  │                                              │   │
│          │  │  [Save Changes]                              │   │
│          │  └────────────────────────────────────────────────┘   │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

### 12.2 Academic Year Settings `/admin/settings/academic-year`

```
┌────────────────────────────────────────────────────────────────────┐
│  📅 Academic Calendar  │  [+ Add Term]  │  School: La Fontaine  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Current Academic Year ────                                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Year: 2026-2027  │  Status: 🟢 Active                     │   │
│  │  Start: Sept 1, 2026  │  End: Aug 31, 2027               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Terms ────                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Term   │ Start Date │ End Date │ Status  │ Action   │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ Term 1 │ Sep 1, 2026│ Nov 30   │ 🔴 Not started │   │
│  │  2 │ Term 2 │ Jan 10, 2027│ Apr 10  │ 🔴 Not started │   │
│  │  3 │ Term 3 │ Apr 25, 2027│ Jul 30  │ 🔴 Not started │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Holidays ────                                               │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Date        │ Description          │ Type                │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Dec 25, 2026│ Christmas Day        │ Public Holiday      │   │
│  │  Jan 1, 2027 │ New Year's Day      │ Public Holiday      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Save Calendar]  [Generate Academic Year]                        │
└────────────────────────────────────────────────────────────────────┘
```

---

### 12.3 Branding Settings `/admin/settings/branding`

```
┌────────────────────────────────────────────────────────────────────┐
│  🎨 Branding  │  School: La Fontaine                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  School Logo:     [📷 Upload Logo]                        │   │
│  │                   (PNG, SVG recommended)                  │   │
│  │  Favicon:         [📷 Upload Favicon]                     │   │
│  │  School Colors:   Primary: [🎨 #1A8FE3]                   │   │
│  │                   Secondary: [🎨 #F5A623]                  │   │
│  │  School Name:     [La Fontaine School]                    │   │
│  │  Tagline:         [Excellence in Education]                │   │
│  │  School Slogan:   [Learning for Life]                     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Preview ────                                                │
│  [Live preview of school's public page with current branding]   │
│                                                                     │
│  [Save Branding]                                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 12.4 User Management `/admin/settings/users`

```
┌────────────────────────────────────────────────────────────────────┐
│  👤 Users  │  [+ Add User]  [🔍 Search...]  [Role Filter ▼]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  # │ Name         │ Email         │ Role      │ Status   │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  1 │ John Habimana│ john@...      │ Admin     │ 🟢 Active│   │
│  │  2 │ Jane Uwimana │ jane@...      │ Teacher   │ 🟢 Active│   │
│  │  3 │ Alice Mwiza  │ alice@...     │ Accountant│ 🟢 Active│   │
│  │  4 │ Paul Niyo    │ paul@...      │ Teacher   │ 🟡 Inactive│   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 5  [Next ▶]                                 │
│                                                                     │
│  ──── Role Permissions ────                                       │
│  [Manage custom roles and permissions →]                         │
└────────────────────────────────────────────────────────────────────┘
```

---

### 12.5 Audit Log (School Level) `/admin/settings/audit-log`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 School Audit Log  │  🔍 Filter: [All Actions ▼]            │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Time          │ User      │ Action           │ Module    │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  10:23 Aug 15  │ john@...  │ Student enrolled  │ Students │   │
│  │  09:45 Aug 15  │ jane@...  │ Marks entered     │ Academics│   │
│  │  08:12 Aug 15  │ alice@... │ Payment recorded  │ Finance  │   │
│  │  07:30 Aug 15  │ paul@...  │ Login             │ Auth     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [◀ Prev]  Page 1 of 120  [Next ▶]                               │
│  [📥 Export Log]                                                  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 13. PARENT PORTAL

### 13.1 Parent Dashboard `/parent/dashboard`

```
┌────────────────────────────────────────────────────────────────────┐
│  🏠 Parent Dashboard  │  Welcome, Marie!  │  [EN ▼]  [🔔 5]   │
├──────────┬─────────────────────────────────────────────────────────┤
│  📊      │  ──── My Children ────                                │
│  Children│                                                         │
│          │  ┌────────────────────────────────────────────────┐   │
│  📚      │  │  Aline Uwase (P5)  🟢 Present Today          │   │
│  Results │  │  ● Avg: 93.6  ● Rank: 1/40                   │   │
│          │  │  ● Fees: $135 balance                         │   │
│  💰      │  │  [View Details →]                             │   │
│  Fees    │  └────────────────────────────────────────────────┘   │
│          │                                                         │
│  📋      │  ──── Quick Access ────                               │
│  Messages│  [📊 View Results]  [📋 Attendance]  [💰 Pay Fees]    │
│          │  [📩 Messages]  [📅 School Calendar]                  │
│  ⚙️      │                                                         │
│  Settings│  ──── School Announcements ────                        │
│          │  ┌────────────────────────────────────────────────┐   │
│  🔒      │  │ 📢 Sports Day: October 15, 2026              │   │
│  Logout  │  │ 📢 Parent-Teacher Meeting: Aug 25, 2026     │   │
│          │  │ 📢 Mid-Term Exams: Sept 10-14               │   │
│          │  └────────────────────────────────────────────────┘   │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

### 13.2 Child Details `/parent/children/:id`

```
┌────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard  │  Aline Uwase  │  P5                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Tabs ────                                                   │
│  [Overview] [Attendance] [Results] [Timetable] [Fees] [Messages] │
│                                                                     │
│  ──── Overview Tab ────                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  📊 Academic Summary                                      │   │
│  │  Term 1, 2026:                                            │   │
│  │  ● Average: 93.6%  ● Grade: A  ● Rank: 1/40             │   │
│  │  ● Attendance: 100% (45/45 days)                        │   │
│  │  ● Fees: $200 paid / $335 total ($135 balance)           │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Recent Performance ────                                     │
│  [📊 Line Chart: Scores by subject]                              │
│                                                                     │
│  ──── Upcoming Events ────                                        │
│  ● Math Quiz: Aug 20                                            │
│  ● Science Project: Aug 25                                      │
│  ● Mid-Term Exams: Sept 10-14                                  │
└────────────────────────────────────────────────────────────────────┘
```

---

### 13.3 Child Results `/parent/children/:id/results`

```
┌────────────────────────────────────────────────────────────────────┐
│  📊 Results: Aline Uwase  │  Term: [1 ▼]  │  Year: [2026 ▼]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Subject    │ CA1 │ CA2 │ Exam │ Total │ Grade │          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Math       │ 18  │ 15  │ 62   │ 95    │  A    │ ✅       │   │
│  │  English    │ 16  │ 17  │ 60   │ 93    │  A    │ ✅       │   │
│  │  Science    │ 19  │ 18  │ 68   │ 105   │  A    │ ✅       │   │
│  │  Kinyarwanda│ 15  │ 14  │ 55   │ 84    │  B    │ ✅       │   │
│  │  Social     │ 17  │ 16  │ 58   │ 91    │  A    │ ✅       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Average: 93.6  │  Grade: A  │  Rank: 1/40                      │
│                                                                     │
│  ──── Teacher's Comment ────                                      │
│  "Aline is an excellent student with a bright future. She       │
│  demonstrates strong analytical skills and is a pleasure to     │
│  teach."                                                         │
│                                                                     │
│  [📄 Download Report Card PDF]  [🖨️ Print]                      │
└────────────────────────────────────────────────────────────────────┘
```

---

### 13.4 Child Attendance `/parent/children/:id/attendance`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 Attendance: Aline Uwase  │  Term: [1 ▼]                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Summary ────                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐                              │
│  │  100%  │  │   45   │  │   0   │                              │
│  │Rate    │  │Present │  │Absent │                              │
│  └────────┘  └────────┘  └────────┘                              │
│                                                                     │
│  ──── Monthly Calendar ────                                       │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Aug 2026                                                 │   │
│  │  Mon Tue Wed Thu Fri Sat Sun                              │   │
│  │          1   2   3   4   5   6                            │   │
│  │   7   8   9  10  11  12  13                              │   │
│  │  14  15  16  17  18  19  20                              │   │
│  │  21  22  23  24  25  26  27                              │   │
│  │  28  29  30  31                                          │   │
│  │  🟢=Present  🔴=Absent  🟡=Late                        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [📥 Download Report]                                             │
└────────────────────────────────────────────────────────────────────┘
```

---

### 13.5 Child Fees `/parent/children/:id/fees`

```
┌────────────────────────────────────────────────────────────────────┐
│  💰 Fees: Aline Uwase  │  Term: [1 ▼]                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Summary ────                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐                              │
│  │  $335  │  │  $200  │  │  $135  │                              │
│  │Total Due│  │ Paid  │  │Balance │                              │
│  └────────┘  └────────┘  └────────┘                              │
│                                                                     │
│  ──── Fee Breakdown ────                                          │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Fee Item      │ Amount  │ Paid │ Status   │              │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Tuition       │ $250    │ $200 │ Partial  │              │   │
│  │  Activity      │ $60     │ $0   │ Unpaid   │              │   │
│  │  Library       │ $25     │ $0   │ Unpaid   │              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Payment History ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Date       │ Amount │ Method │ Receipt │                 │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Aug 1, 2026│ $200   │ Cash   │ #R-001  │ ✅ Paid        │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [💳 Pay Now]  [📄 Download Statement]                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 14. STUDENT PORTAL

### 14.1 Student Dashboard `/student/dashboard`

```
┌────────────────────────────────────────────────────────────────────┐
│  🏠 Student Dashboard  │  Welcome, Aline!  │  [EN ▼]  [🔔 3]   │
├──────────┬─────────────────────────────────────────────────────────┤
│  📊      │  ──── My Overview ────                                │
│  Dashboard│                                                         │
│          │  ┌────────┐  ┌────────┐  ┌────────┐                  │
│  📚      │  │  93.6  │  │   1    │  │  100%  │                  │
│  My Results│  │Average │  │Rank   │  │Attend  │                  │
│          │  └────────┘  └────────┘  └────────┘                  │
│  📋      │                                                         │
│  Attendance│  ──── My Classes ────                               │
│          │  ● P5 - Room 201 - Math, English, Science            │
│  📅      │                                                         │
│  Timetable│  ──── Today's Schedule ────                          │
│          │  ┌────────────────────────────────────────────────┐   │
│  📝      │  │ 7:30   Math    Room 201                       │   │
│  Assignments│  │ 8:40   English  Room 201                    │   │
│          │  │ 9:50   Science  Room 201                      │   │
│  ⚙️      │  │ 11:00  Kinyar   Room 201                     │   │
│  Settings│  │ 1:00   Social   Room 201                      │   │
│          │  └────────────────────────────────────────────────┘   │
│  🔒      │                                                         │
│  Logout  │  ──── Upcoming Deadlines ────                           │
│          │  ● Math Quiz: Aug 20                                  │
│          │  ● Science Project: Aug 25                            │
└──────────┴─────────────────────────────────────────────────────────┘
```

---

### 14.2 My Results `/student/results`

```
┌────────────────────────────────────────────────────────────────────┐
│  📊 My Results  │  Term: [1 ▼]  │  Year: [2026 ▼]              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Subject    │ CA1 │ CA2 │ Exam │ Total │ Grade │          │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Math       │ 18  │ 15  │ 62   │ 95    │  A    │ ✅       │   │
│  │  English    │ 16  │ 17  │ 60   │ 93    │  A    │ ✅       │   │
│  │  Science    │ 19  │ 18  │ 68   │ 105   │  A    │ ✅       │   │
│  │  Kinyarwanda│ 15  │ 14  │ 55   │ 84    │  B    │ ✅       │   │
│  │  Social     │ 17  │ 16  │ 58   │ 91    │  A    │ ✅       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Average: 93.6  │  Grade: A  │  Rank: 1/40                      │
│                                                                     │
│  ──── Teacher's Comment ────                                      │
│  "Excellent work, Aline! Keep it up."                             │
│                                                                     │
│  [📄 Download Report Card]                                        │
└────────────────────────────────────────────────────────────────────┘
```

---

### 14.3 My Attendance `/student/attendance`

```
┌────────────────────────────────────────────────────────────────────┐
│  📋 My Attendance  │  Term: [1 ▼]                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── Summary ────                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐                              │
│  │  100%  │  │   45   │  │   0   │                              │
│  │Rate    │  │Present │  │Absent │                              │
│  └────────┘  └────────┘  └────────┘                              │
│                                                                     │
│  ──── Calendar ────                                               │
│  [Same calendar view as parent portal]                            │
│                                                                     │
│  [📥 Download Report]                                             │
└────────────────────────────────────────────────────────────────────┘
```

---

### 14.4 My Timetable `/student/timetable`

```
┌────────────────────────────────────────────────────────────────────┐
│  📅 My Timetable  │  Class: P5  │  Term: 1  │  Week: [1 ▼]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐        │
│  │ Time   │  Mon   │  Tue   │  Wed   │  Thu   │  Fri   │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 7:30   │  Math  │ English│Science │ Kinyar │ Social │        │
│  │ 8:30   │  R201  │  R201  │  R201  │  R201  │  R201  │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 8:40   │ English│  Math  │  Math  │Science │ English│        │
│  │ 9:40   │  R201  │  R201  │  R201  │  R201  │  R201  │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 9:50   │Science │Social  │ English│  Math  │ Science│        │
│  │ 10:50  │  R201  │  R201  │  R201  │  R201  │  R201  │        │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤        │
│  │ 11:00  │Kinyar  │Science │ Social │ English│  Math  │        │
│  │ 12:00  │  R201  │  R201  │  R201  │  R201  │  R201  │        │
│  └────────┴────────┴────────┴────────┴────────┴────────┘        │
│                                                                     │
│  [📥 Download PDF Timetable]                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

### 14.5 My Assignments `/student/assignments`

```
┌────────────────────────────────────────────────────────────────────┐
│  📝 My Assignments  │  Filter: [All ▼]  │  Subject: [All ▼]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Assignment            │ Subject │ Due Date  │ Status      │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Math Quiz              │ Math    │ Aug 20   │ ⏳ Pending   │   │
│  │  Science Project        │ Science │ Aug 25   │ ⏳ Pending   │   │
│  │  English Essay          │ English │ Aug 22   │ ✅ Submitted │   │
│  │  Social Studies Report  │ Social  │ Aug 18   │ ⏳ Pending   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Assignment Details (click to expand) ────                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Math Quiz                                               │   │
│  │  Topic: Algebra - Linear Equations                        │   │
│  │  Instructions: Complete all 20 questions                  │   │
│  │  Resources: [📎 Download Worksheet]                       │   │
│  │  [Submit Online]                                          │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15. CUSTOM ROLE SYSTEM

### 15.1 Role Management `/admin/settings/roles`

```
┌────────────────────────────────────────────────────────────────────┐
│  👥 Role Management  │  [+ Create Role]  │  School: La Fontaine│
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ──── System Roles ──── (can't delete)                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Role        │ Users │ Permissions   │ Actions             │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Admin       │ 3     │ Full          │ [✏️] [🔒]          │   │
│  │  Teacher     │ 48    │ Limited       │ [✏️] [🔒]          │   │
│  │  Accountant  │ 2     │ Finance only  │ [✏️] [🔒]          │   │
│  │  Parent      │ 2,400 │ View only     │ [✏️] [🔒]          │   │
│  │  Student     │ 1,200 │ Own data only │ [✏️] [🔒]          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Custom Roles ────                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Role           │ Users │ Permissions      │ Actions       │   │
│  ├────────────────────────────────────────────────────────────┤   │
│  │  Deputy Head    │ 1     │ Custom           │ [✏️] [🗑️]    │   │
│  │  Bursar         │ 1     │ Custom           │ [✏️] [🗑️]    │   │
│  │  Class Teacher  │ 8     │ Custom           │ [✏️] [🗑️]    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [Save Changes]                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 15.2 Create Custom Role `/admin/settings/roles/new`

```
┌────────────────────────────────────────────────────────────────────┐
│  ➕ Create Custom Role                                            │
├────────────────────────────────────────────────────────────────────┤
 │                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Role Name:  [Deputy Head____________________________]    │   │
│  │  Description:[Assists admin with academic oversight]      │   │
│  │                                                          │   │
│  │  ──── Permissions ────                                  │   │
│  │                                                          │   │
│  │  📚 Academics                                            │   │
│  │  [✓] View Marks  [✓] Edit Marks  [ ] Delete Marks       │   │
│  │  [✓] View Reports  [✓] Generate Reports  [ ] Delete     │   │
│  │                                                          │   │
│  │  👨‍🎓 Students                                            │   │
│  │  [✓] View Students  [✓] Edit Students  [ ] Delete       │   │
│  │  [✓] Enroll Students  [✓] View Archives                 │   │
│  │                                                          │   │
│  │  💰 Finance                                              │   │
│  │  [ ] View Finance  [ ] Edit Finance  [ ] Delete         │   │
│  │                                                          │   │
│  │  👥 Staff                                                │   │
│  │  [✓] View Staff  [ ] Edit Staff  [ ] Delete             │   │
│  │                                                          │   │
│  │  ⚙️ Settings                                             │   │
│  │  [✓] View Settings  [ ] Edit Settings                    │   │
│  │                                                          │   │
│  │  [Create Role]  [Cancel]                                │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

## 16. SHARED COMPONENTS

### 16.1 Profile Page (All Roles) `/profile`

```
┌────────────────────────────────────────────────────────────────────┐
│  👤 My Profile  │  [Edit Profile]                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┐  ──── Personal Info ────                             │
│  │  📷       │  Name: John Habimana                                │
│  │  Photo    │  Email: john@lafontaine.com                       │
│  │           │  Role: Admin                                      │
│  │           │  School: La Fontaine                              │
│  │           │  Phone: +250 788 123 456                         │
│  │           │  Joined: Jan 15, 2025                            │
│  └──────────┘                                                     │
│                                                                     │
│  ──── Change Password ────                                        │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Current Password: [____________________________]         │   │
│  │  New Password:     [____________________________]         │   │
│  │  Confirm Password: [____________________________]         │   │
│  │                                                          │   │
│  │  [Update Password]                                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ──── Language Preference ────                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Preferred Language: [English ▼]                          │   │
│  │  [Save Preference]                                       │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

---

### 16.2 Notification Drawer (Global)

```
┌────────────────────────────────────────────────────────────────────┐
│  🔔 Notifications  │  [Mark All Read]  [⚙️ Settings]           │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔵 NEW  │  Aline Uwase was absent today                          │
│          │  2 min ago                                             │
│                                                                     │
│  🔵 NEW  │  Payment of $200 received from Peter Niyo             │
│          │  1 hour ago                                           │
│                                                                     │
│  ⚪ Read  │  Parent-Teacher Meeting reminder sent                 │
│          │  2 days ago                                           │
│                                                                     │
│  ⚪ Read  │  Marks for P5 Math locked for Term 1                 │
│          │  3 days ago                                           │
│                                                                     │
│  ──── Older Notifications ────                                    │
│  [Load More]                                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 17. RESPONSIVE BREAKPOINTS

| Device | Breakpoint | Layout Changes |
|--------|------------|----------------|
| **Desktop** | ≥ 1024px | Full sidebar visible, multi-column layout |
| **Tablet** | 768px - 1023px | Collapsible sidebar, 2-column content |
| **Mobile** | < 768px | Hamburger menu, stacked layout, full-width tables |

**Mobile-Specific Adjustments:**
- Tables → scroll horizontally or card view
- Sidebar → hidden behind hamburger
- Topbar → condensed (logo only, action icons)
- Buttons → full width (touch-friendly)
- Modals → full-screen bottom sheets

---

## END OF FRONTEND BLUEPRINT

---
# SKYCAMPUS — Backend Blueprint
## Database Schema, Business Logic & Data Layer
**Version:** 1.0  
**Database:** PostgreSQL (Supabase)  
**Multi-tenant:** Shared database with `school_id` isolation  

---

## TABLE OF CONTENTS

1. [Database Design Principles](#1-database-design-principles)
2. [Core Tables](#2-core-tables)
3. [Academics Tables](#3-academics-tables)
4. [Attendance Tables](#4-attendance-tables)
5. [Finance Tables](#5-finance-tables)
6. [Staff & HR Tables](#6-staff--hr-tables)
7. [Communication Tables](#7-communication-tables)
8. [Settings & Config Tables](#8-settings--config-tables)
9. [Audit & Logging Tables](#9-audit--logging-tables)
10. [Business Logic & Formulas](#10-business-logic--formulas)
11. [Triggers & Functions](#11-triggers--functions)
12. [RLS Policies](#12-rls-policies)
13. [Indexes & Performance](#13-indexes--performance)
14. [Seed Data](#14-seed-data)

---

## 1. DATABASE DESIGN PRINCIPLES

### Multi-Tenancy Strategy
- **Shared database** with `school_id` on every table
- **Row Level Security (RLS)** enforces tenant isolation
- **No cross-school data leaks** — enforced at database level

### Naming Conventions
- Tables: `plural_snake_case` (e.g., `students`, `fee_payments`)
- Columns: `snake_case` (e.g., `first_name`, `created_at`)
- Primary keys: `id` (UUID or BIGSERIAL)
- Foreign keys: `[table]_id` (e.g., `student_id`, `school_id`)
- Timestamps: `created_at`, `updated_at` (with triggers)
- Soft delete: `deleted_at` (NULL = active)

### UUID vs Serial
- **UUID** for public-facing IDs (security, no guessable sequences)
- **BIGSERIAL** for internal joins (performance)
- Both used: `id` (BIGSERIAL internal) + `uuid` (UUID public)

---

## 2. CORE TABLES

### 2.1 Schools Table
```sql
CREATE TABLE schools (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    
    -- Contact Info
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Rwanda',
    timezone VARCHAR(50) DEFAULT 'Africa/Kigali',
    
    -- Branding
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#1A8FE3',
    secondary_color VARCHAR(7) DEFAULT '#F5A623',
    tagline VARCHAR(255),
    
    -- Subscription
    plan VARCHAR(50) DEFAULT 'trial' CHECK (plan IN ('trial', 'basic', 'pro', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'suspended')),
    trial_ends_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    
    -- Features (JSON for flexible module toggles)
    modules_enabled JSONB DEFAULT '{
        "academics": true,
        "finance": true,
        "attendance": true,
        "students": true,
        "staff": true,
        "communication": true,
        "transport": false,
        "hostel": false,
        "library": false,
        "inventory": false,
        "ai_comments": false
    }'::JSONB,
    
    -- Settings (JSON for flexible config)
    settings JSONB DEFAULT '{
        "grading_scale": {"A": 80, "B": 65, "C": 50, "D": 35, "F": 0},
        "assessment_weights": {"ca1": 20, "ca2": 20, "exams": 60},
        "date_format": "DD/MM/YYYY",
        "language": "en"
    }'::JSONB,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_schools_subdomain ON schools(subdomain);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_status ON schools(subscription_status);
```

---

### 2.2 Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    
    -- Role & Permissions
    role_id BIGINT REFERENCES roles(id),
    is_super_admin BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    
    -- Preferences
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'fr', 'rw')),
    timezone VARCHAR(50) DEFAULT 'Africa/Kigali',
    notifications_enabled JSONB DEFAULT '{"email": true, "sms": true, "push": true}'::JSONB,
    
    -- Security
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    refresh_token TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);
```

---

### 2.3 Roles Table (Custom Roles per School)
```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE, -- Admin, Teacher, etc. can't delete
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Permission matrix (JSON for flexibility)
    permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
    -- Structure: {
    --   "module": {
    --     "view": true,
    --     "create": false,
    --     "edit": false,
    --     "delete": false,
    --     "export": false
    --   }
    -- }
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(school_id, name)
);

CREATE INDEX idx_roles_school_id ON roles(school_id);
```

---

### 2.4 Students Table
```sql
CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    nationality VARCHAR(100) DEFAULT 'Rwandan',
    religion VARCHAR(100),
    
    -- Contact
    address TEXT,
    
    -- Academic
    class_id BIGINT REFERENCES classes(id),
    admission_date DATE DEFAULT CURRENT_DATE,
    previous_school VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred', 'suspended')),
    
    -- Parent/Guardian links (many-to-many via junction table)
    
    -- Documents (JSON array of file URLs)
    documents JSONB DEFAULT '[]'::JSONB,
    
    -- Medical (JSON)
    medical_info JSONB DEFAULT '{}'::JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_status ON students(status);
```

---

### 2.5 Parents/Guardians Table
```sql
CREATE TABLE parents (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    alternative_phone VARCHAR(50),
    address TEXT,
    occupation VARCHAR(100),
    
    relationship_to_student VARCHAR(50), -- Father, Mother, Guardian, etc.
    is_primary_contact BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_parents_school_id ON parents(school_id);
CREATE INDEX idx_parents_phone ON parents(phone);
```

---

### 2.6 Student-Parent Junction
```sql
CREATE TABLE student_parents (
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id BIGINT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (student_id, parent_id)
);

CREATE INDEX idx_student_parents_student_id ON student_parents(student_id);
CREATE INDEX idx_student_parents_parent_id ON student_parents(parent_id);
```

---

### 2.7 Classes Table
```sql
CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- P5, S1, etc.
    code VARCHAR(50) UNIQUE, -- 2026-P5
    academic_year_id BIGINT REFERENCES academic_years(id),
    level VARCHAR(50), -- Primary, Secondary, etc.
    capacity INT DEFAULT 50,
    current_enrollment INT DEFAULT 0,
    
    room_number VARCHAR(50),
    
    class_teacher_id BIGINT REFERENCES users(id),
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(school_id, name, academic_year_id)
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year_id);
CREATE INDEX idx_classes_teacher ON classes(class_teacher_id);
```

---

### 2.8 Subjects Table
```sql
CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    
    -- Subject grouping
    department VARCHAR(100), -- Math, Science, Languages, etc.
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(school_id, name)
);

CREATE INDEX idx_subjects_school_id ON subjects(school_id);
```

---

### 2.9 Class Subjects (Teacher Assignment)
```sql
CREATE TABLE class_subjects (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES users(id),
    
    -- Weightage for this class-subject
    ca1_weight DECIMAL(5,2) DEFAULT 20,
    ca2_weight DECIMAL(5,2) DEFAULT 20,
    exam_weight DECIMAL(5,2) DEFAULT 60,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(class_id, subject_id)
);

CREATE INDEX idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject_id ON class_subjects(subject_id);
CREATE INDEX idx_class_subjects_teacher ON class_subjects(teacher_id);
```

---

## 3. ACADEMICS TABLES

### 3.1 Academic Years & Terms
```sql
CREATE TABLE academic_years (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- 2026-2027
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(school_id, name)
);

CREATE TABLE terms (
    id BIGSERIAL PRIMARY KEY,
    academic_year_id BIGINT NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- Term 1, Term 2, Term 3
    sequence INT NOT NULL, -- 1, 2, 3
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(academic_year_id, sequence)
);

CREATE INDEX idx_terms_academic_year ON terms(academic_year_id);
```

---

### 3.2 Assessments (CA1, CA2, Exams)
```sql
CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_subject_id BIGINT NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
    term_id BIGINT NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('ca1', 'ca2', 'exam')),
    name VARCHAR(255),
    max_score DECIMAL(10,2) DEFAULT 100,
    weight DECIMAL(5,2),
    
    date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE, -- Locked = no more edits
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    UNIQUE(class_subject_id, term_id, type)
);

CREATE INDEX idx_assessments_class_subject ON assessments(class_subject_id);
CREATE INDEX idx_assessments_term ON assessments(term_id);
```

---

### 3.3 Marks Table
```sql
CREATE TABLE marks (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    score DECIMAL(10,2),
    remark TEXT,
    
    -- Computed fields (for reporting)
    grade VARCHAR(5),
    is_passing BOOLEAN,
    
    entered_by BIGINT REFERENCES users(id),
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(assessment_id, student_id)
);

CREATE INDEX idx_marks_assessment ON marks(assessment_id);
CREATE INDEX idx_marks_student ON marks(student_id);
```

---

### 3.4 Report Cards Table
```sql
CREATE TABLE report_cards (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    term_id BIGINT NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    
    -- Summary fields
    total_score DECIMAL(10,2),
    average DECIMAL(10,2),
    grade VARCHAR(5),
    rank INT,
    class_size INT,
    
    -- Teacher comments
    teacher_comment TEXT,
    head_teacher_comment TEXT,
    
    -- Attendance summary
    days_present INT,
    days_absent INT,
    days_late INT,
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(student_id, term_id)
);

CREATE INDEX idx_report_cards_student ON report_cards(student_id);
CREATE INDEX idx_report_cards_term ON report_cards(term_id);
```

---

### 3.5 Timetable Table
```sql
CREATE TABLE timetable_entries (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id BIGINT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES users(id),
    
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 5), -- 1=Monday, 5=Friday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    
    term_id BIGINT NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_time CHECK (start_time < end_time)
);

CREATE INDEX idx_timetable_class ON timetable_entries(class_id);
CREATE INDEX idx_timetable_teacher ON timetable_entries(teacher_id);
CREATE INDEX idx_timetable_term ON timetable_entries(term_id);
```

---

## 4. ATTENDANCE TABLES

### 4.1 Attendance Table
```sql
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remark TEXT,
    
    -- Entry info
    entered_by BIGINT REFERENCES users(id),
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- For parent notifications
    parent_notified BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

---

## 5. FINANCE TABLES

### 5.1 Fee Structures Table
```sql
CREATE TABLE fee_structures (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- Tuition, Activity, Library, etc.
    description TEXT,
    
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id) ON DELETE CASCADE,
    term_id BIGINT REFERENCES terms(id) ON DELETE CASCADE,
    
    amount DECIMAL(10,2) NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    is_required BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT TRUE, -- Every term or one-time?
    
    -- For tracking
    collected_amount DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_fee_structures_school ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_class ON fee_structures(class_id);
```

---

### 5.2 Student Fee Accounts
```sql
CREATE TABLE student_fee_accounts (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id BIGINT NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    term_id BIGINT NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (amount_due - amount_paid) STORED,
    
    is_waived BOOLEAN DEFAULT FALSE,
    waiver_reason TEXT,
    waived_amount DECIMAL(10,2) DEFAULT 0,
    
    status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'waived')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(student_id, fee_structure_id, term_id)
);

CREATE INDEX idx_student_fee_accounts_student ON student_fee_accounts(student_id);
CREATE INDEX idx_student_fee_accounts_status ON student_fee_accounts(status);
```

---

### 5.3 Payments Table
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'bank', 'mobile_money', 'cheque', 'other')),
    reference_number VARCHAR(100),
    payment_date DATE NOT NULL,
    
    -- Which fee items this payment applies to
    fee_structure_ids BIGINT[] DEFAULT '{}',
    
    -- Receipt
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    receipt_generated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'reversed')),
    
    -- Metadata
    notes TEXT,
    entered_by BIGINT REFERENCES users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_receipt ON payments(receipt_number);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

---

### 5.4 Payment Allocations (Linking Payments to Fee Accounts)
```sql
CREATE TABLE payment_allocations (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    student_fee_account_id BIGINT NOT NULL REFERENCES student_fee_accounts(id) ON DELETE CASCADE,
    
    amount_allocated DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_allocations_payment ON payment_allocations(payment_id);
CREATE INDEX idx_payment_allocations_account ON payment_allocations(student_fee_account_id);
```

---

## 6. STAFF & HR TABLES

### 6.1 Staff Table
```sql
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, -- Can be NULL if user hasn't signed up
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    job_title VARCHAR(100),
    role VARCHAR(50) CHECK (role IN ('admin', 'accountant', 'teacher', 'librarian', 'other')),
    
    hire_date DATE,
    termination_date DATE,
    
    salary DECIMAL(10,2),
    payroll_details JSONB DEFAULT '{}'::JSONB,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_staff_school ON staff(school_id);
CREATE INDEX idx_staff_user ON staff(user_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
```

---

### 6.2 Leave Requests
```sql
CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('annual', 'sick', 'personal', 'maternity', 'paternity', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'cancelled')),
    
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leave_requests_staff ON leave_requests(staff_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
```

---

### 6.3 Payroll Records
```sql
CREATE TABLE payroll_records (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    
    month DATE NOT NULL, -- First day of the month (e.g., 2026-08-01)
    
    base_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (base_salary + allowances - deductions) STORED,
    
    days_worked INT DEFAULT 30,
    days_absent INT DEFAULT 0,
    late_days INT DEFAULT 0,
    
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    paid_at TIMESTAMPTZ,
    payment_reference VARCHAR(100),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(staff_id, month)
);

CREATE INDEX idx_payroll_staff ON payroll_records(staff_id);
CREATE INDEX idx_payroll_month ON payroll_records(month);
```

---

## 7. COMMUNICATION TABLES

### 7.1 Notifications Table
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
    
    -- Who is this for?
    audience VARCHAR(50) CHECK (audience IN ('all', 'students', 'parents', 'teachers', 'staff', 'specific')),
    audience_ids BIGINT[] DEFAULT '{}', -- Specific user IDs if audience = 'specific'
    
    -- Delivery methods
    is_email BOOLEAN DEFAULT FALSE,
    is_sms BOOLEAN DEFAULT FALSE,
    is_push BOOLEAN DEFAULT FALSE,
    is_in_app BOOLEAN DEFAULT TRUE,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- For scheduled notifications
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    -- Deep link (for app/web)
    link_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_school ON notifications(school_id);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

---

### 7.2 Messages Table
```sql
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    
    -- Recipients
    recipient_type VARCHAR(50) CHECK (recipient_type IN ('individual', 'class', 'all_students', 'all_parents', 'all_teachers', 'all_staff')),
    recipient_ids BIGINT[] DEFAULT '{}',
    
    -- Attachments (JSON array)
    attachments JSONB DEFAULT '[]'::JSONB,
    
    -- Status
    is_draft BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ,
    is_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_school ON messages(school_id);
CREATE INDEX idx_messages_sent ON messages(sent_at);
```

---

### 7.3 Communication Logs
```sql
CREATE TABLE communication_logs (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('sms', 'email', 'push', 'in_app')),
    recipient VARCHAR(255) NOT NULL, -- email, phone number, or user_id
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    provider VARCHAR(50), -- Twilio, SendGrid, etc.
    provider_message_id VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    error TEXT,
    
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comm_logs_school ON communication_logs(school_id);
CREATE INDEX idx_comm_logs_provider_id ON communication_logs(provider_message_id);
CREATE INDEX idx_comm_logs_status ON communication_logs(status);
```

---

## 8. SETTINGS & CONFIG TABLES

### 8.1 School Settings (JSON-based already in schools table)
*Settings stored as JSON in `schools.settings` column.*

### 8.2 Audit Logs (Detailed)
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, etc.
    module VARCHAR(100) NOT NULL, -- Students, Finance, Academics, etc.
    
    -- Details
    record_id BIGINT,
    record_type VARCHAR(100),
    changes JSONB, -- Before/after comparison
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_school ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

### 8.3 System Settings (Super Admin)
```sql
CREATE TABLE system_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO system_settings (key, value, description) VALUES
('platform_name', '"SkyCampus"', 'Platform display name'),
('default_language', '"en"', 'Default language: en, fr, rw'),
('timezone', '"Africa/Kigali"', 'Default timezone'),
('date_format', '"DD/MM/YYYY"', 'Date format'),
('allow_school_registration', 'true', 'Allow new schools to register'),
('trial_days', '14', 'Number of trial days'),
('plans', '{"basic": {"price": 29, "students_limit": 100}, "pro": {"price": 79, "students_limit": 500}, "enterprise": {"price": 199, "students_limit": null}}', 'Pricing plans');
```

---

## 9. AUDIT & LOGGING TABLES

### 9.1 Login History
```sql
CREATE TABLE login_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id BIGINT REFERENCES schools(id) ON DELETE CASCADE,
    
    ip_address INET,
    user_agent TEXT,
    login_type VARCHAR(50) DEFAULT 'password' CHECK (login_type IN ('password', 'magic_link', 'social', '2fa')),
    
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_created ON login_history(created_at);
```

---

### 9.2 Session Tracking (for real-time activity)
```sql
CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    device_name VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
```

---

## 10. BUSINESS LOGIC & FORMULAS

### 10.1 Grading Calculation

**Input:** `total_score` (0-100)  
**Output:** `grade` (A, B, C, D, F)

```sql
-- Function to get grade based on school's grading scale
CREATE OR REPLACE FUNCTION calculate_grade(
    score DECIMAL,
    grading_scale JSONB
) RETURNS VARCHAR AS $$
DECLARE
    grade_record RECORD;
BEGIN
    -- Default grading scale if not provided
    IF grading_scale IS NULL THEN
        grading_scale := '{"A": 80, "B": 65, "C": 50, "D": 35, "F": 0}'::JSONB;
    END IF;
    
    IF score >= (grading_scale->>'A')::DECIMAL THEN RETURN 'A';
    ELSIF score >= (grading_scale->>'B')::DECIMAL THEN RETURN 'B';
    ELSIF score >= (grading_scale->>'C')::DECIMAL THEN RETURN 'C';
    ELSIF score >= (grading_scale->>'D')::DECIMAL THEN RETURN 'D';
    ELSE RETURN 'F';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

### 10.2 Total Score Calculation

```sql
-- Function to calculate total score from CA1, CA2, Exam with weights
CREATE OR REPLACE FUNCTION calculate_total_score(
    ca1_score DECIMAL,
    ca2_score DECIMAL,
    exam_score DECIMAL,
    ca1_weight DECIMAL DEFAULT 20,
    ca2_weight DECIMAL DEFAULT 20,
    exam_weight DECIMAL DEFAULT 60
) RETURNS DECIMAL AS $$
BEGIN
    -- Ensure weights sum to 100
    -- Normalize if not (just in case)
    RETURN ROUND(
        (COALESCE(ca1_score, 0) * ca1_weight / 100) +
        (COALESCE(ca2_score, 0) * ca2_weight / 100) +
        (COALESCE(exam_score, 0) * exam_weight / 100)
    , 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

### 10.3 Fee Balance Calculation

```sql
-- Function to calculate total outstanding fees for a student
CREATE OR REPLACE FUNCTION get_student_balance(
    p_student_id BIGINT,
    p_term_id BIGINT DEFAULT NULL
) RETURNS DECIMAL AS $$
DECLARE
    total_due DECIMAL := 0;
    total_paid DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(amount_due), 0) INTO total_due
    FROM student_fee_accounts
    WHERE student_id = p_student_id
      AND (p_term_id IS NULL OR term_id = p_term_id)
      AND is_waived = FALSE;
    
    SELECT COALESCE(SUM(amount_allocated), 0) INTO total_paid
    FROM payment_allocations pa
    JOIN student_fee_accounts sfa ON pa.student_fee_account_id = sfa.id
    WHERE sfa.student_id = p_student_id
      AND (p_term_id IS NULL OR sfa.term_id = p_term_id);
    
    RETURN total_due - total_paid;
END;
$$ LANGUAGE plpgsql;
```

---

### 10.4 Class Rank Calculation

```sql
-- Function to rank students in a class for a term
CREATE OR REPLACE FUNCTION calculate_class_rank(
    p_class_id BIGINT,
    p_term_id BIGINT
) RETURNS TABLE (
    student_id BIGINT,
    average DECIMAL,
    rank INT
) AS $$
BEGIN
    RETURN QUERY
    WITH student_averages AS (
        SELECT
            rc.student_id,
            rc.average
        FROM report_cards rc
        WHERE rc.term_id = p_term_id
          AND rc.student_id IN (SELECT id FROM students WHERE class_id = p_class_id)
    ),
    ranked AS (
        SELECT
            student_id,
            average,
            RANK() OVER (ORDER BY average DESC) as rank
        FROM student_averages
    )
    SELECT * FROM ranked
    ORDER BY rank;
END;
$$ LANGUAGE plpgsql;
```

---

### 10.5 Auto-Generate Report Card

```sql
-- Function to generate/update report card for a student
CREATE OR REPLACE FUNCTION generate_report_card(
    p_student_id BIGINT,
    p_term_id BIGINT
) RETURNS VOID AS $$
DECLARE
    v_student RECORD;
    v_term RECORD;
    v_class_id BIGINT;
    v_average DECIMAL;
    v_grade VARCHAR;
    v_total_score DECIMAL;
    v_attendance RECORD;
    v_rank INT;
    v_class_size INT;
    v_grading_scale JSONB;
    v_school_id BIGINT;
BEGIN
    -- Get student info
    SELECT s.id, s.class_id, s.school_id, s.first_name, s.last_name
    INTO v_student
    FROM students s
    WHERE s.id = p_student_id;
    
    -- Get term info
    SELECT * INTO v_term FROM terms WHERE id = p_term_id;
    
    -- Get school's grading scale
    SELECT settings->'grading_scale' INTO v_grading_scale
    FROM schools WHERE id = v_student.school_id;
    
    -- Calculate average from marks
    SELECT
        ROUND(AVG(
            calculate_total_score(
                MAX(CASE WHEN a.type = 'ca1' THEN m.score END),
                MAX(CASE WHEN a.type = 'ca2' THEN m.score END),
                MAX(CASE WHEN a.type = 'exam' THEN m.score END),
                cs.ca1_weight,
                cs.ca2_weight,
                cs.exam_weight
            )
        ), 1) INTO v_average
    FROM marks m
    JOIN assessments a ON m.assessment_id = a.id
    JOIN class_subjects cs ON a.class_subject_id = cs.id
    WHERE m.student_id = p_student_id
      AND a.term_id = p_term_id;
    
    -- Get grade
    SELECT calculate_grade(v_average, v_grading_scale) INTO v_grade;
    
    -- Get attendance summary
    SELECT
        COUNT(*) FILTER (WHERE status = 'present') as present,
        COUNT(*) FILTER (WHERE status = 'absent') as absent,
        COUNT(*) FILTER (WHERE status = 'late') as late
    INTO v_attendance
    FROM attendance
    WHERE student_id = p_student_id
      AND date BETWEEN v_term.start_date AND v_term.end_date;
    
    -- Get class size
    SELECT COUNT(*) INTO v_class_size
    FROM students
    WHERE class_id = v_student.class_id
      AND status = 'active';
    
    -- Get rank
    WITH ranked AS (
        SELECT
            rc.student_id,
            RANK() OVER (ORDER BY rc.average DESC) as rank
        FROM report_cards rc
        WHERE rc.term_id = p_term_id
          AND rc.student_id IN (SELECT id FROM students WHERE class_id = v_student.class_id)
    )
    SELECT rank INTO v_rank
    FROM ranked
    WHERE student_id = p_student_id;
    
    -- Insert or update report card
    INSERT INTO report_cards (
        student_id, term_id, total_score, average, grade, rank, class_size,
        days_present, days_absent, days_late
    ) VALUES (
        p_student_id, p_term_id,
        v_average, v_average, v_grade, v_rank, v_class_size,
        COALESCE(v_attendance.present, 0),
        COALESCE(v_attendance.absent, 0),
        COALESCE(v_attendance.late, 0)
    ) ON CONFLICT (student_id, term_id) DO UPDATE SET
        total_score = EXCLUDED.total_score,
        average = EXCLUDED.average,
        grade = EXCLUDED.grade,
        rank = EXCLUDED.rank,
        class_size = EXCLUDED.class_size,
        days_present = EXCLUDED.days_present,
        days_absent = EXCLUDED.days_absent,
        days_late = EXCLUDED.days_late,
        updated_at = NOW();
    
    RAISE NOTICE 'Report card generated for student % for term %', p_student_id, p_term_id;
END;
$$ LANGUAGE plpgsql;
```

---

## 11. TRIGGERS & FUNCTIONS

### 11.1 Auto-Update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all tables)
```

---

### 11.2 Auto-Generate Admission Number
```sql
CREATE OR REPLACE FUNCTION generate_admission_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix VARCHAR(4);
    school_prefix VARCHAR(10);
    next_number INT;
BEGIN
    -- Get current year
    year_prefix := TO_CHAR(NOW(), 'YYYY');
    
    -- Get school prefix from school
    SELECT SUBSTRING(name, 1, 3) INTO school_prefix
    FROM schools WHERE id = NEW.school_id;
    
    -- Get next sequential number for this school
    SELECT COALESCE(MAX(CAST(SUBSTRING(admission_number FROM 6) AS INT)), 0) + 1
    INTO next_number
    FROM students
    WHERE school_id = NEW.school_id
      AND admission_number LIKE year_prefix || '%';
    
    -- Format: YYYY-SSS-NNNN (e.g., 2026-LAF-0001)
    NEW.admission_number := year_prefix || '-' || school_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_admission_number
BEFORE INSERT ON students
FOR EACH ROW
WHEN (NEW.admission_number IS NULL)
EXECUTE FUNCTION generate_admission_number();
```

---

### 11.3 Auto-Generate Receipt Number
```sql
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix VARCHAR(4);
    next_number INT;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YYYY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM 6) AS INT)), 0) + 1
    INTO next_number
    FROM payments
    WHERE school_id = NEW.school_id
      AND receipt_number LIKE 'RCPT-' || year_prefix || '%';
    
    NEW.receipt_number := 'RCPT-' || year_prefix || '-' || LPAD(next_number::TEXT, 6, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_receipt_number
BEFORE INSERT ON payments
FOR EACH ROW
WHEN (NEW.receipt_number IS NULL)
EXECUTE FUNCTION generate_receipt_number();
```

---

### 11.4 Update Fee Account Balance on Payment
```sql
CREATE OR REPLACE FUNCTION update_fee_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the student_fee_accounts amount_paid
    UPDATE student_fee_accounts sfa
    SET amount_paid = (
        SELECT COALESCE(SUM(pa.amount_allocated), 0)
        FROM payment_allocations pa
        WHERE pa.student_fee_account_id = sfa.id
    ),
    updated_at = NOW()
    WHERE sfa.id = NEW.student_fee_account_id;
    
    -- Update status based on new balance
    UPDATE student_fee_accounts
    SET status = CASE
        WHEN amount_paid = 0 THEN 'unpaid'
        WHEN amount_paid >= amount_due THEN 'paid'
        ELSE 'partial'
    END
    WHERE id = NEW.student_fee_account_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_fee_balance
AFTER INSERT OR UPDATE ON payment_allocations
FOR EACH ROW
EXECUTE FUNCTION update_fee_account_balance();
```

---

### 11.5 Auto-Calculate Student Fee Accounts on Fee Structure Creation
```sql
CREATE OR REPLACE FUNCTION create_student_fee_accounts()
RETURNS TRIGGER AS $$
DECLARE
    student_record RECORD;
BEGIN
    -- When a new fee structure is created for a class
    IF NEW.class_id IS NOT NULL THEN
        FOR student_record IN
            SELECT id FROM students
            WHERE class_id = NEW.class_id
              AND status = 'active'
              AND deleted_at IS NULL
        LOOP
            INSERT INTO student_fee_accounts (
                student_id, fee_structure_id, term_id, amount_due, amount_paid
            ) VALUES (
                student_record.id, NEW.id, NEW.term_id, NEW.amount, 0
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_student_fee_accounts
AFTER INSERT ON fee_structures
FOR EACH ROW
WHEN (NEW.class_id IS NOT NULL)
EXECUTE FUNCTION create_student_fee_accounts();
```

---

### 11.6 Update Class Enrollment Count
```sql
CREATE OR REPLACE FUNCTION update_class_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE classes
        SET current_enrollment = current_enrollment + 1
        WHERE id = NEW.class_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE classes
        SET current_enrollment = current_enrollment - 1
        WHERE id = OLD.class_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.class_id IS DISTINCT FROM NEW.class_id THEN
            UPDATE classes SET current_enrollment = current_enrollment - 1 WHERE id = OLD.class_id;
            UPDATE classes SET current_enrollment = current_enrollment + 1 WHERE id = NEW.class_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_class_enrollment
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW
WHEN (TG_OP = 'DELETE' OR OLD.class_id IS NOT NULL OR NEW.class_id IS NOT NULL)
EXECUTE FUNCTION update_class_enrollment();
```

---

## 12. RLS POLICIES

### 12.1 Enable RLS on All Tables
```sql
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### 12.2 School-Level Isolation (All Tables)
```sql
-- Example: Students table
CREATE POLICY students_school_isolation ON students
    USING (school_id = (SELECT school_id FROM users WHERE id = auth.uid()));

CREATE POLICY students_school_isolation_insert ON students
    WITH CHECK (school_id = (SELECT school_id FROM users WHERE id = auth.uid()));
```

### 12.3 Super Admin Access
```sql
-- Super admin can see everything
CREATE POLICY super_admin_all ON schools
    USING ((SELECT is_super_admin FROM users WHERE id = auth.uid()) = TRUE);

CREATE POLICY super_admin_all_operations ON schools
    WITH CHECK ((SELECT is_super_admin FROM users WHERE id = auth.uid()) = TRUE);
```

### 12.4 Teacher Limited Access
```sql
-- Teacher can only see students in their classes
CREATE POLICY teacher_students ON students
    USING (
        class_id IN (
            SELECT class_id FROM class_subjects
            WHERE teacher_id = auth.uid()
        )
    );
```

### 12.5 Parent Limited Access
```sql
-- Parent can only see their own children
CREATE POLICY parent_students ON students
    USING (
        id IN (
            SELECT student_id FROM student_parents
            WHERE parent_id IN (
                SELECT id FROM parents WHERE user_id = auth.uid()
            )
        )
    );
```

### 12.6 Student Own Data Only
```sql
-- Student can only see their own profile
CREATE POLICY student_self ON students
    USING (user_id = auth.uid());
```

---

## 13. INDEXES & PERFORMANCE

### 13.1 Core Indexes
```sql
-- Schools
CREATE INDEX idx_schools_subdomain ON schools(subdomain);
CREATE INDEX idx_schools_status ON schools(subscription_status);

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_school_role ON users(school_id, role_id);

-- Students
CREATE INDEX idx_students_class_status ON students(class_id, status);
CREATE INDEX idx_students_school_status ON students(school_id, status);

-- Attendance
CREATE INDEX idx_attendance_date_status ON attendance(date, status);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);

-- Marks
CREATE INDEX idx_marks_assessment_student ON marks(assessment_id, student_id);

-- Report Cards
CREATE INDEX idx_report_cards_student_term ON report_cards(student_id, term_id);

-- Payments
CREATE INDEX idx_payments_student_status ON payments(student_id, status);
CREATE INDEX idx_payments_date_status ON payments(payment_date, status);
```

### 13.2 Full-Text Search Indexes
```sql
-- Student search by name
CREATE INDEX idx_students_name_search ON students
    USING GIN (to_tsvector('english', first_name || ' ' || last_name));

-- User search
CREATE INDEX idx_users_name_search ON users
    USING GIN (to_tsvector('english', first_name || ' ' || last_name));
```

### 13.3 Partial Indexes for Active Records
```sql
CREATE INDEX idx_active_students ON students(class_id)
    WHERE status = 'active' AND deleted_at IS NULL;

CREATE INDEX idx_active_users ON users(school_id)
    WHERE is_active = TRUE AND deleted_at IS NULL;
```

---

## 14. SEED DATA

### 14.1 Default Roles
```sql
-- For each school, create system roles
INSERT INTO roles (school_id, name, description, is_system_role, permissions) VALUES
(1, 'Admin', 'Full school management', TRUE, '{"all": {"view": true, "create": true, "edit": true, "delete": true, "export": true}}'),
(1, 'Accountant', 'Finance management only', TRUE, '{"finance": {"view": true, "create": true, "edit": true, "delete": false, "export": true}}'),
(1, 'Teacher', 'Classroom management', TRUE, '{"students": {"view": true, "create": false, "edit": true, "delete": false}, "academics": {"view": true, "create": true, "edit": true, "delete": false}}'),
(1, 'Parent', 'View children\'s data', TRUE, '{"students": {"view": true, "create": false, "edit": false, "delete": false}, "finance": {"view": true, "create": false, "edit": false, "delete": false}}'),
(1, 'Student', 'Own data only', TRUE, '{"students": {"view": true, "create": false, "edit": false, "delete": false}}');
```

### 14.2 Default Admin User
```sql
-- Super Admin (platform owner)
INSERT INTO users (
    school_id, first_name, last_name, email, password_hash, is_super_admin
) VALUES (
    1, 'System', 'Admin', 'admin@skycampus.com', '$2a$10$hashedpasswordhere', TRUE
);
```

### 14.3 Default School
```sql
INSERT INTO schools (
    name, subdomain, slug, email, phone, address, city, country
) VALUES (
    'SkyCampus Demo School',
    'demo',
    'demo',
    'demo@skycampus.com',
    '+250 788 123 456',
    'KG 123 St',
    'Kigali',
    'Rwanda'
);
```

---

## END OF BACKEND BLUEPRINT

---

# SKYCAMPUS — Architecture Blueprint
## Tech Stack, API Design, Deployment & System Architecture
**Version:** 1.0  
**Type:** SaaS Multi-Tenant School Management Platform  

---

## TABLE OF CONTENTS

1. [Technology Stack](#1-technology-stack)
2. [Project Folder Structure](#2-project-folder-structure)
3. [API Endpoints](#3-api-endpoints)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Multi-Tenancy Strategy](#5-multi-tenancy-strategy)
6. [System Architecture Diagrams](#6-system-architecture-diagrams)
7. [Data Flow & Connectors](#7-data-flow--connectors)
8. [Deployment Strategy](#8-deployment-strategy)
9. [Environment Variables](#9-environment-variables)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Monitoring & Logging](#11-monitoring--logging)
12. [Performance Optimization](#12-performance-optimization)
13. [Security Best Practices](#13-security-best-practices)
14. [Mobile App Architecture](#14-mobile-app-architecture)
15. [Development Roadmap](#15-development-roadmap)

---

## 1. TECHNOLOGY STACK

### 1.1 Frontend (Web)
```
┌─────────────────────────────────────────────────────────────────────┐
│  WEB FRONTEND                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Framework:     Next.js 15 (App Router)                           │
│  Language:      TypeScript 5+                                     │
│  UI Library:    React 19                                          │
│  Styling:       Tailwind CSS 4 + ShadCN UI                       │
│  State:         Zustand + React Query (TanStack Query)           │
│  Forms:         React Hook Form + Zod                            │
│  Charts:        Recharts                                          │
│  Icons:         Lucide React + Font Awesome                      │
│  Tables:        TanStack Table (React Table)                     │
│  Date/Time:     date-fns + dayjs                                 │
│  Animations:    Framer Motion                                     │
│  i18n:          next-i18next                                     │
│  SSR:           Next.js Server Components                         │
│  API Client:    @supabase/ssr + fetch                            │
│  Real-time:     Supabase Realtime                                │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mobile App
```
┌─────────────────────────────────────────────────────────────────────┐
│  MOBILE APP (React Native)                                         │
├─────────────────────────────────────────────────────────────────────┤
│  Framework:     React Native + Expo 51                            │
│  Language:      TypeScript                                        │
│  Navigation:    React Navigation 7 (Stack + Bottom Tabs)         │
│  State:         Zustand + React Query                            │
│  UI:            React Native Paper + NativeWind                  │
│  Forms:         React Hook Form                                  │
│  Storage:       AsyncStorage + SecureStore                       │
│  Push:          Expo Notifications                               │
│  Camera:        Expo Camera                                      │
│  File:          Expo FileSystem                                  │
│  Biometrics:    Expo LocalAuthentication                         │
│  Offline:       MMKV + React Query Persist                      │
│  API Client:    Supabase Realtime + REST                         │
│  Platform:      iOS 15+ / Android 12+                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 Backend (Supabase)
```
┌─────────────────────────────────────────────────────────────────────┐
│  SUPABASE PLATFORM                                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Database:       PostgreSQL 16                                    │
│  Auth:           Supabase Auth (JWT + Magic Links)              │
│  Storage:        Supabase Storage (S3-compatible)               │
│  Real-time:      Supabase Realtime (WebSockets)                  │
│  Edge Functions: Deno (TypeScript)                              │
│  Row Level:      PostgreSQL RLS                                  │
│  Vector:         pgvector (for AI features)                     │
│  Full-Text:      PostgreSQL TSVector                            │
│  Backups:        Automated daily backups                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 Infrastructure
```
┌─────────────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  Hosting:        Vercel (Web) + Supabase (Backend)               │
│  Domain:         skycampus.com + *.skycampus.com                 │
│  CDN:            Vercel Edge Network + Cloudflare                │
│  SSL:            Automatic (Vercel + Cloudflare)                │
│  Email:          Resend (or SendGrid)                           │
│  SMS:            Africa's Talking (Rwanda) / Twilio             │
│  Monitoring:     Sentry + LogRocket                             │
│  Analytics:      PostHog / Mixpanel                             │
│  CI/CD:          GitHub Actions                                 │
│  Testing:        Jest + Cypress + Vitest                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. PROJECT FOLDER STRUCTURE

### 2.1 Frontend (Next.js)
```
skycampus-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register-school/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── (public)/
│   │   ├── page.tsx                    # Landing page
│   │   ├── s/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # School public page
│   │   │       ├── about/
│   │   │       ├── admissions/
│   │   │       ├── news/
│   │   │       ├── events/
│   │   │       ├── gallery/
│   │   │       └── contact/
│   │   └── (marketing)/
│   │       ├── pricing/
│   │       ├── features/
│   │       └── contact/
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard layout + sidebar
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   ├── [id]/
│   │   │   │   └── import/
│   │   │   ├── academics/
│   │   │   │   ├── marks/
│   │   │   │   │   ├── entry/
│   │   │   │   │   ├── analysis/
│   │   │   │   │   └── settings/
│   │   │   │   ├── timetable/
│   │   │   │   │   ├── builder/
│   │   │   │   │   └── conflicts/
│   │   │   │   └── reports/
│   │   │   ├── finance/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── fee-structure/
│   │   │   │   ├── payments/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── new/
│   │   │   │   ├── invoices/
│   │   │   │   └── reports/
│   │   │   ├── attendance/
│   │   │   │   ├── entry/
│   │   │   │   └── reports/
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   ├── payroll/
│   │   │   │   └── leave/
│   │   │   ├── communication/
│   │   │   │   ├── messages/
│   │   │   │   ├── announcements/
│   │   │   │   └── sms/
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── academic/
│   │   │       ├── grading/
│   │   │       ├── branding/
│   │   │       ├── users/
│   │   │       └── roles/
│   │   ├── teacher/
│   │   │   ├── dashboard/
│   │   │   ├── classes/
│   │   │   ├── marks/
│   │   │   ├── attendance/
│   │   │   └── messages/
│   │   ├── parent/
│   │   │   ├── dashboard/
│   │   │   ├── children/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── results/
│   │   │   │       ├── attendance/
│   │   │   │       ├── fees/
│   │   │   │       └── timetable/
│   │   │   └── messages/
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   ├── results/
│   │   │   ├── attendance/
│   │   │   ├── timetable/
│   │   │   └── assignments/
│   │   └── superadmin/
│   │       ├── dashboard/
│   │       ├── schools/
│   │       │   ├── page.tsx
│   │       │   ├── new/
│   │       │   └── [id]/
│   │       │       ├── page.tsx
│   │       │       ├── modules/
│   │       │       └── subscription/
│   │       ├── users/
│   │       ├── billing/
│   │       ├── audit-logs/
│   │       └── settings/
│   ├── api/
│   │   └── (internal)/
│   │       ├── auth/
│   │       ├── schools/
│   │       ├── users/
│   │       └── webhooks/
│   ├── (shared)/
│   │   ├── profile/
│   │   ├── notifications/
│   │   └── help/
│   └── layout.tsx
│
├── components/
│   ├── ui/                           # ShadCN UI components
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── forms/
│   │   ├── StudentForm.tsx
│   │   ├── FeeStructureForm.tsx
│   │   └── PaymentForm.tsx
│   ├── tables/
│   │   ├── StudentsTable.tsx
│   │   ├── PaymentsTable.tsx
│   │   └── DataTable.tsx
│   ├── charts/
│   │   ├── AttendanceChart.tsx
│   │   ├── RevenueChart.tsx
│   │   └── PerformanceChart.tsx
│   ├── modals/
│   │   ├── ConfirmationModal.tsx
│   │   ├── StudentModal.tsx
│   │   └── PaymentModal.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       └── Breadcrumbs.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSchool.ts
│   │   ├── useStudents.ts
│   │   └── usePermissions.ts
│   ├── utils/
│   │   ├── permissions.ts
│   │   ├── formatting.ts
│   │   └── validation.ts
│   ├── config/
│   │   ├── site.ts
│   │   └── constants.ts
│   └── i18n/
│       ├── config.ts
│       └── translations/
│           ├── en.json
│           ├── fr.json
│           └── rw.json
│
├── types/
│   ├── database.ts                   # Supabase generated types
│   ├── api.ts
│   ├── school.ts
│   ├── student.ts
│   └── user.ts
│
├── middleware.ts                     # Next.js middleware (auth + i18n)
├── next.config.js
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

### 2.2 Mobile App (React Native)
```
skycampus-mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── dashboard.tsx
│   │   ├── students.tsx
│   │   ├── messages.tsx
│   │   └── profile.tsx
│   ├── (stack)/
│   │   ├── student/
│   │   │   ├── [id].tsx
│   │   │   ├── results.tsx
│   │   │   ├── attendance.tsx
│   │   │   └── fees.tsx
│   │   └── settings/
│   │       ├── index.tsx
│   │       └── profile.tsx
│   └── _layout.tsx
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── cards/
│   └── shared/
│
├── hooks/
├── lib/
│   └── supabase/
├── stores/
│   ├── auth.ts
│   ├── school.ts
│   └── student.ts
├── types/
├── constants/
├── app.json
├── package.json
└── tsconfig.json
```

---

## 3. API ENDPOINTS

### 3.1 REST API Structure
```
Base URL: https://api.skycampus.com/v1
Base URL: https://schoolname.skycampus.com/api/v1  (tenant-aware)
```

### 3.2 Authentication Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTH ENDPOINTS                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  POST   /auth/login              - Login with email/password      │
│  POST   /auth/register           - Register new user              │
│  POST   /auth/logout             - Logout                         │
│  POST   /auth/refresh            - Refresh JWT token              │
│  POST   /auth/forgot-password    - Request password reset         │
│  POST   /auth/reset-password     - Reset password with token      │
│  POST   /auth/verify-email       - Verify email with token        │
│  GET    /auth/me                 - Get current user profile       │
│  PUT    /auth/me                 - Update user profile            │
│  POST   /auth/change-password    - Change password                │
│  POST   /auth/magic-link         - Send magic link email          │
│  POST   /auth/magic-link/verify  - Verify magic link              │
│  POST   /auth/2fa/enable         - Enable 2FA                    │
│  POST   /auth/2fa/verify         - Verify 2FA code               │
│  POST   /auth/switch-school      - Switch to different school    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 School Management (Super Admin)
```
┌─────────────────────────────────────────────────────────────────────┐
│  SCHOOL ENDPOINTS                                                  │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /schools                 - List all schools                │
│  POST   /schools                 - Create new school               │
│  GET    /schools/:id             - Get school details              │
│  PUT    /schools/:id             - Update school                   │
│  DELETE /schools/:id             - Delete school                   │
│  GET    /schools/:id/modules     - Get school modules             │
│  PUT    /schools/:id/modules     - Update school modules          │
│  GET    /schools/:id/subscription- Get subscription details       │
│  PUT    /schools/:id/subscription- Update subscription            │
│  GET    /schools/:id/stats       - Get school usage stats         │
│  GET    /schools/:id/audit       - Get school audit logs          │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 User Management
```
┌─────────────────────────────────────────────────────────────────────┐
│  USER ENDPOINTS                                                    │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /users                   - List users (school filtered)    │
│  POST   /users                   - Create user                     │
│  GET    /users/:id               - Get user details                │
│  PUT    /users/:id               - Update user                     │
│  DELETE /users/:id               - Delete user                     │
│  POST   /users/:id/roles         - Assign role to user            │
│  PUT    /users/:id/status        - Activate/deactivate user       │
│  GET    /users/roles             - List all roles for school      │
│  POST   /users/roles             - Create custom role             │
│  PUT    /users/roles/:id         - Update role permissions        │
│  DELETE /users/roles/:id         - Delete custom role             │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.5 Student Management
```
┌─────────────────────────────────────────────────────────────────────┐
│  STUDENT ENDPOINTS                                                 │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /students               - List students (filtered)        │
│  POST   /students               - Enroll new student              │
│  GET    /students/:id           - Get student details             │
│  PUT    /students/:id           - Update student                  │
│  DELETE /students/:id           - Archive/delete student          │
│  POST   /students/import        - Bulk import from CSV            │
│  GET    /students/export        - Export students to CSV          │
│  POST   /students/promote       - Promote students to next class  │
│  GET    /students/:id/family    - Get student's family            │
│  POST   /students/:id/parents   - Link parent to student          │
│  DELETE /students/:id/parents/:parent_id - Unlink parent          │
│  GET    /students/:id/attendance- Get student attendance history  │
│  GET    /students/:id/results   - Get student academic results    │
│  GET    /students/:id/fees      - Get student fee account         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.6 Academics Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  ACADEMICS ENDPOINTS                                               │
├─────────────────────────────────────────────────────────────────────┤
│  CLASSES                                                           │
│  GET    /classes                 - List classes                    │
│  POST   /classes                 - Create class                    │
│  GET    /classes/:id             - Get class details               │
│  PUT    /classes/:id             - Update class                    │
│  DELETE /classes/:id             - Delete class                    │
│  GET    /classes/:id/students    - Get students in class          │
│  GET    /classes/:id/timetable   - Get class timetable            │
│                                                                     │
│  SUBJECTS                                                          │
│  GET    /subjects                - List subjects                   │
│  POST   /subjects                - Create subject                  │
│  PUT    /subjects/:id            - Update subject                  │
│  DELETE /subjects/:id            - Delete subject                  │
│  POST   /subjects/:id/assign     - Assign teacher to subject      │
│                                                                     │
│  TIMETABLE                                                         │
│  GET    /timetable               - Get timetable                   │
│  POST   /timetable/entries       - Add timetable entry            │
│  PUT    /timetable/entries/:id   - Update entry                   │
│  DELETE /timetable/entries/:id   - Delete entry                   │
│  GET    /timetable/conflicts     - Detect timetable conflicts     │
│  POST   /timetable/import        - Import timetable from CSV      │
│  GET    /timetable/export        - Export timetable               │
│                                                                     │
│  MARKS                                                            │
│  GET    /marks                   - List marks                     │
│  POST   /marks                   - Enter marks                    │
│  PUT    /marks/:id               - Update marks                   │
│  DELETE /marks/:id               - Delete marks                   │
│  POST   /marks/lock              - Lock marks for term            │
│  GET    /marks/analysis          - Get marks analysis             │
│  POST   /marks/calculate         - Calculate totals & grades      │
│                                                                     │
│  REPORT CARDS                                                      │
│  GET    /reports                 - List report cards               │
│  GET    /reports/:studentId/:termId - Get specific report         │
│  POST   /reports/generate        - Generate report cards          │
│  PUT    /reports/:id             - Update report (comments)       │
│  POST   /reports/publish         - Publish report cards           │
│  GET    /reports/export          - Export reports (PDF/CSV)       │
│  POST   /reports/email           - Email reports to parents       │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.7 Finance Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  FINANCE ENDPOINTS                                                 │
├─────────────────────────────────────────────────────────────────────┤
│  FEE STRUCTURES                                                    │
│  GET    /fees/structures         - List fee structures             │
│  POST   /fees/structures         - Create fee structure            │
│  PUT    /fees/structures/:id     - Update fee structure            │
│  DELETE /fees/structures/:id     - Delete fee structure            │
│                                                                     │
│  STUDENT FEES                                                      │
│  GET    /fees/students           - List student fee accounts       │
│  GET    /fees/students/:id       - Get student fee details        │
│  GET    /fees/students/:id/balance - Get balance                 │
│  POST   /fees/students/:id/waive - Apply fee waiver              │
│                                                                     │
│  PAYMENTS                                                          │
│  GET    /payments                - List payments                   │
│  POST   /payments                - Record payment                  │
│  GET    /payments/:id            - Get payment details             │
│  PUT    /payments/:id            - Update payment                  │
│  DELETE /payments/:id            - Reverse payment                 │
│  GET    /payments/receipts/:id   - Download receipt PDF           │
│  POST   /payments/bulk           - Bulk record payments           │
│                                                                     │
│  REPORTS                                                           │
│  GET    /finance/reports/outstanding - Outstanding report         │
│  GET    /finance/reports/collection - Fee collection report       │
│  GET    /finance/reports/summary  - Financial summary             │
│  GET    /finance/reports/export   - Export financial data         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.8 Attendance Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  ATTENDANCE ENDPOINTS                                              │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /attendance              - List attendance records         │
│  POST   /attendance              - Mark attendance                 │
│  PUT    /attendance/:id          - Update attendance               │
│  DELETE /attendance/:id          - Delete attendance               │
│  POST   /attendance/bulk         - Bulk mark attendance           │
│  GET    /attendance/class/:classId - Get class attendance today   │
│  GET    /attendance/reports      - Get attendance reports         │
│  GET    /attendance/reports/student/:id - Student attendance      │
│  POST   /attendance/notify       - Send absence notifications     │
│  GET    /attendance/analytics    - Get attendance analytics       │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.9 Staff & HR Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  STAFF & HR ENDPOINTS                                              │
├─────────────────────────────────────────────────────────────────────┤
│  STAFF                                                             │
│  GET    /staff                  - List staff members               │
│  POST   /staff                  - Add staff member                 │
│  GET    /staff/:id              - Get staff details                │
│  PUT    /staff/:id              - Update staff                     │
│  DELETE /staff/:id              - Remove staff                     │
│                                                                     │
│  PAYROLL                                                           │
│  GET    /staff/payroll          - Get payroll records              │
│  POST   /staff/payroll          - Run payroll                     │
│  PUT    /staff/payroll/:id      - Update payroll record           │
│  GET    /staff/payroll/export   - Export payroll                  │
│                                                                     │
│  LEAVE                                                             │
│  GET    /staff/leave            - List leave requests             │
│  POST   /staff/leave            - Request leave                   │
│  PUT    /staff/leave/:id        - Approve/deny leave              │
│  GET    /staff/leave/balance    - Get leave balances              │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.10 Communication Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  COMMUNICATION ENDPOINTS                                           │
├─────────────────────────────────────────────────────────────────────┤
│  MESSAGES                                                          │
│  GET    /messages               - List messages                    │
│  POST   /messages               - Send message                     │
│  GET    /messages/:id           - Get message details              │
│  DELETE /messages/:id           - Delete message                   │
│                                                                     │
│  NOTIFICATIONS                                                     │
│  GET    /notifications          - Get user notifications           │
│  PUT    /notifications/:id/read - Mark as read                    │
│  PUT    /notifications/read-all - Mark all as read               │
│  DELETE /notifications/:id      - Delete notification             │
│  POST   /notifications/bulk     - Send bulk notification          │
│                                                                     │
│  SMS/EMAIL                                                         │
│  POST   /comms/sms              - Send SMS                        │
│  POST   /comms/email            - Send email                      │
│  GET    /comms/sms/balance      - Get SMS balance                │
│  GET    /comms/logs             - Get communication logs         │
│                                                                     │
│  ANNOUNCEMENTS                                                     │
│  GET    /announcements          - List announcements              │
│  POST   /announcements          - Create announcement             │
│  PUT    /announcements/:id      - Update announcement             │
│  DELETE /announcements/:id      - Delete announcement             │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.11 Settings Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  SETTINGS ENDPOINTS                                                │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /settings/school        - Get school settings              │
│  PUT    /settings/school        - Update school settings           │
│  GET    /settings/academic      - Get academic settings           │
│  PUT    /settings/academic      - Update academic settings        │
│  GET    /settings/grading       - Get grading settings            │
│  PUT    /settings/grading       - Update grading settings         │
│  GET    /settings/branding      - Get branding settings           │
│  PUT    /settings/branding      - Update branding settings        │
│  GET    /settings/modules       - Get module settings             │
│  PUT    /settings/modules       - Update module settings          │
│  GET    /settings/audit         - Get audit logs                  │
│  GET    /settings/backup        - Get backup status              │
│  POST   /settings/backup        - Create backup                  │
│  POST   /settings/restore       - Restore from backup            │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.12 Parent Portal Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  PARENT PORTAL ENDPOINTS                                           │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /parent/children        - Get parent's children            │
│  GET    /parent/children/:id/results - Child's results            │
│  GET    /parent/children/:id/attendance - Child's attendance      │
│  GET    /parent/children/:id/fees - Child's fee status            │
│  GET    /parent/children/:id/timetable - Child's timetable        │
│  GET    /parent/children/:id/assignments - Child's assignments    │
│  GET    /parent/messages        - Get parent's messages           │
│  POST   /parent/messages        - Send message to teacher         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.13 Student Portal Endpoints
```
┌─────────────────────────────────────────────────────────────────────┐
│  STUDENT PORTAL ENDPOINTS                                          │
├─────────────────────────────────────────────────────────────────────┤
│  GET    /student/profile        - Get student profile              │
│  GET    /student/results        - Get student results              │
│  GET    /student/attendance     - Get student attendance           │
│  GET    /student/timetable      - Get student timetable            │
│  GET    /student/assignments    - Get student assignments          │
│  GET    /student/messages       - Get student messages             │
│  POST   /student/messages       - Send message to teacher         │
│  GET    /student/resources      - Get learning resources           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. AUTHENTICATION & AUTHORIZATION

### 4.1 Authentication Flow
```
┌─────────────────────────────────────────────────────────────────────┐
│  AUTHENTICATION FLOW                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. USER LOGIN                                                     │
│     ┌─────┐    ┌──────────┐    ┌──────────────┐                   │
│     │User │───▶│/auth/login│───▶│  Supabase   │                   │
│     └─────┘    └──────────┘    │   Auth      │                   │
│                    │            └──────┬───────┘                   │
│                    │                   │                           │
│                    ▼                   ▼                           │
│               ┌──────────┐    ┌──────────────┐                   │
│               │  JWT     │◀───│  Access Token│                   │
│               │  Return  │    │  + Refresh   │                   │
│               └──────────┘    └──────────────┘                   │
│                                                                     │
│  2. AUTHENTICATED REQUESTS                                         │
│     ┌──────────┐    ┌──────────┐    ┌──────────────┐             │
│     │  Client  │───▶│  API     │───▶│  Verify JWT  │             │
│     │  Request │    │  Gateway │    │  + RLS       │             │
│     └──────────┘    └──────────┘    └──────┬───────┘             │
│                     │                       │                      │
│                     │                       ▼                      │
│                     │               ┌──────────────┐             │
│                     │               │   Database   │             │
│                     │               │   (RLS)      │             │
│                     │               └──────────────┘             │
│                     │                                              │
│                     ▼                                              │
│               ┌──────────┐                                        │
│               │ Response │                                        │
│               └──────────┘                                        │
│                                                                     │
│  3. REFRESH TOKEN FLOW                                             │
│     ┌──────────┐    ┌──────────────┐    ┌──────────────┐        │
│     │   JWT    │───▶│   /auth/     │───▶│  New JWT    │        │
│     │  Expired │    │   refresh    │    │  + Refresh  │        │
│     └──────────┘    └──────────────┘    └──────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 JWT Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_uuid",
    "email": "user@school.com",
    "school_id": 123,
    "role_id": 45,
    "permissions": {
      "students": {"view": true, "edit": true},
      "finance": {"view": false}
    },
    "iat": 1234567890,
    "exp": 1234567890,
    "iss": "skycampus.com"
  }
}
```

### 4.3 Permission Checking Middleware
```typescript
// lib/permissions.ts
export const checkPermission = (
  user: User,
  module: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'export'
): boolean => {
  // Super admin has all permissions
  if (user.is_super_admin) return true;
  
  // Check role permissions
  const permissions = user.permissions;
  
  // Check module-specific permission
  if (permissions[module]?.[action]) return true;
  
  // Check 'all' module permission (admin)
  if (permissions['all']?.[action]) return true;
  
  return false;
};

// Usage in API routes
export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  
  if (!checkPermission(user, 'students', 'view')) {
    return new Response('Unauthorized', { status: 403 });
  }
  
  // Proceed with request
}
```

### 4.4 Row Level Security Policies (Supabase)
```sql
-- Policy: Users can only see records from their school
CREATE POLICY school_isolation ON students
  USING (school_id = (SELECT school_id FROM users WHERE id = auth.uid()));

-- Policy: Teachers can only see students in their classes
CREATE POLICY teacher_visibility ON students
  USING (
    school_id = (SELECT school_id FROM users WHERE id = auth.uid())
    AND (
      class_id IN (
        SELECT class_id FROM class_subjects WHERE teacher_id = auth.uid()
      )
      OR
      (SELECT role_name FROM users WHERE id = auth.uid()) IN ('admin', 'accountant')
    )
  );

-- Policy: Parents can only see their children
CREATE POLICY parent_visibility ON students
  USING (
    school_id = (SELECT school_id FROM users WHERE id = auth.uid())
    AND (
      id IN (
        SELECT student_id FROM student_parents 
        WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
      )
    )
  );
```

---

## 5. MULTI-TENANCY STRATEGY

### 5.1 Isolation Model
```
┌─────────────────────────────────────────────────────────────────────┐
│  MULTI-TENANT ISOLATION                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Shared Database with school_id isolation                   │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │  School A (id=1)  │  School B (id=2)               │   │  │
│  │  │  ────────────────│────────────────────────────────│   │  │
│  │  │  students: 1,200 │  students: 450                  │   │  │
│  │  │  teachers: 48    │  teachers: 25                   │   │  │
│  │  │  parents: 2,400  │  parents: 800                   │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                             │  │
│  │  RLS ensures:                                              │  │
│  │  ● SELECT * FROM students → only school's own data        │  │
│  │  ● INSERT → school_id auto-populated from user context   │  │
│  │  ● UPDATE/DELETE → school_id check enforced              │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Subdomain Routing
```
┌─────────────────────────────────────────────────────────────────────┐
│  SUBDOMAIN ROUTING                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  skycampus.com                                              │  │
│  │  ├── Platform landing page                                  │  │
│  │  ├── /login → redirects to school subdomain               │  │
│  │  ├── /register-school → Super admin only                  │  │
│  │  └── /superadmin → Platform admin panel                   │  │
│  │                                                             │  │
│  │  lafontaine.skycampus.com                                  │  │
│  │  ├── School public page                                     │  │
│  │  ├── /login → La Fontaine login page                       │  │
│  │  ├── /admin → Admin dashboard                              │  │
│  │  ├── /teacher → Teacher portal                             │  │
│  │  ├── /parent → Parent portal                               │  │
│  │  └── /student → Student portal                             │  │
│  │                                                             │  │
│  │  greenhill.skycampus.com                                   │  │
│  │  └── Similar structure                                     │  │
│  │                                                             │  │
│  │  app.skycampus.com                                          │  │
│  │  └── Mobile app API gateway                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.3 Middleware for Tenant Detection
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Public domains
  if (hostname === 'skycampus.com' || hostname === 'www.skycampus.com') {
    // Platform landing page
    return NextResponse.next();
  }
  
  // Check if subdomain exists
  const { data: school } = await supabase
    .from('schools')
    .select('id, subdomain')
    .eq('subdomain', subdomain)
    .single();
  
  if (!school) {
    return NextResponse.redirect(new URL('/', 'https://skycampus.com'));
  }
  
  // Set school context in request headers
  const response = NextResponse.next();
  response.headers.set('x-school-id', school.id.toString());
  response.headers.set('x-school-subdomain', subdomain);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
```

---

## 6. SYSTEM ARCHITECTURE DIAGRAMS

### 6.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SKYCAMPUS PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────┐          ┌──────────────────────────┐    │
│  │      WEB CLIENTS        │          │      MOBILE CLIENTS      │    │
│  │  ┌───────────────────┐  │          │  ┌───────────────────┐  │    │
│  │  │  Next.js App      │  │          │  │  React Native     │  │    │
│  │  │  (Vercel)         │  │          │  │  + Expo           │  │    │
│  │  └───────────────────┘  │          │  └───────────────────┘  │    │
│  └───────────┬─────────────┘          └───────────┬──────────────┘    │
│              │                                     │                     │
│              └──────────────┬──────────────────────┘                     │
│                             │                                            │
│                      ┌──────▼───────┐                                    │
│                      │  API Gateway │                                    │
│                      │  (Vercel)    │                                    │
│                      └──────┬───────┘                                    │
│                             │                                            │
│              ┌──────────────┼──────────────┐                            │
│              │              │              │                            │
│       ┌──────▼─────┐ ┌──────▼─────┐ ┌──────▼─────┐                    │
│       │  Supabase  │ │  Supabase  │ │  Supabase  │                    │
│       │   Auth     │ │  Database  │ │  Storage   │                    │
│       │  (JWT)     │ │(PostgreSQL)│ │  (S3)      │                    │
│       └──────┬─────┘ └──────┬─────┘ └──────┬─────┘                    │
│              │              │              │                            │
│              └──────────────┼──────────────┘                            │
│                             │                                            │
│              ┌──────────────▼───────────────┐                          │
│              │   External Services           │                          │
│              │  ┌──────────┐ ┌──────────┐  │                          │
│              │  │ SendGrid │ │Africa's  │  │                          │
│              │  │ (Email)  │ │Talking  │  │                          │
│              │  └──────────┘ └──────────┘  │                          │
│              └──────────────────────────────┘                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Data Flow Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ Request  │───▶│  Auth    │───▶│  RLS     │───▶│  Query   │         │
│  │ (Client) │    │ Check    │    │  Filter  │    │  Execute │         │
│  └──────────┘    └──────────┘    └──────────┘    └────┬─────┘         │
│                                                         │                │
│                                                         ▼                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ Response │◀───│  Format  │◀───│  Data    │◀───│PostgreSQL│         │
│  │ (Client) │    │ (JSON)   │    │  Return  │    │  Result  │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                                                                         │
│  ──── Real-time Flow ────                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  Change  │───▶│  Trigger │───▶│  Realtime│───▶│ WebSocket│         │
│  │  (DB)    │    │  Detect  │    │  Broadcast│   │ (Client)│         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│                                                                         │
│  ──── File Upload Flow ────                                           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │  Upload  │───▶│  Presign │───▶│  Upload  │───▶│  Store   │         │
│  │  (Client)│    │  (API)   │    │  (S3)    │    │  URL     │         │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Database Schema Diagram (ASCII)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA (Core Tables)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐          │
│  │ SCHOOLS │──────│  USERS  │──────│  ROLES  │      │CLASSES  │          │
│  └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘          │
│       │                │                 │                 │                 │
│       │                │                 │                 │                 │
│       ▼                ▼                 ▼                 ▼                 │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐          │
│  │STUDENTS │      │ PARENTS │      │SUBJECTS │      │  TERMS  │          │
│  └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘          │
│       │                │                 │                 │                 │
│       │                │                 │                 │                 │
│       ▼                ▼                 ▼                 ▼                 │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐          │
│  │ATTENDANCE│      │STUDENT  │      │CLASS    │      │ASSESS-  │          │
│  │         │      │PARENTS  │      │SUBJECTS │      │MENTS    │          │
│  └─────────┘      └─────────┘      └────┬────┘      └────┬────┘          │
│                                          │                 │                 │
│                                          ▼                 ▼                 │
│                                     ┌─────────┐      ┌─────────┐          │
│                                     │TIMETABLE│      │  MARKS  │          │
│                                     └─────────┘      └─────────┘          │
│                                                                             │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐          │
│  │FEE      │──────│STUDENT  │──────│PAYMENTS │      │REPORT   │          │
│  │STRUCTURES│      │FEE      │      │         │      │CARDS    │          │
│  └─────────┘      │ACCOUNTS │      └────┬────┘      └─────────┘          │
│                   └─────────┘           │                                   │
│                                    ┌─────▼─────┐                           │
│                                    │PAYMENT    │                           │
│                                    │ALLOCATIONS│                           │
│                                    └───────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. DATA FLOW & CONNECTORS

### 7.1 Frontend ↔ Backend Communication
```
┌─────────────────────────────────────────────────────────────────────────┐
│  FRONTEND → BACKEND COMMUNICATION                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. REST API Calls                                                     │
│     ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│     │  React     │──────│  fetch/    │──────│  Next.js   │           │
│     │  Component │      │  axios     │      │  API Route │           │
│     └────────────┘      └────────────┘      └──────┬─────┘           │
│                                                      │                   │
│                                                      ▼                   │
│                                               ┌────────────┐           │
│                                               │  Supabase  │           │
│                                               │  Client    │           │
│                                               └────────────┘           │
│                                                                         │
│  2. Real-time (WebSockets)                                             │
│     ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│     │  React     │──────│  Supabase  │──────│ PostgreSQL │           │
│     │  Component │      │  Realtime  │      │  Trigger   │           │
│     └────────────┘      └────────────┘      └────────────┘           │
│                                                                         │
│  3. File Uploads                                                       │
│     ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│     │  File      │──────│  Supabase  │──────│  S3        │           │
│     │  Selector  │      │  Storage   │      │  Bucket    │           │
│     └────────────┘      └────────────┘      └────────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Connector: Supabase Client Setup
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Server-side client (for API routes)
export const createServerClient = (cookieStore: any) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Cookie: cookieStore,
      },
    },
  });
};
```

### 7.3 Connector: API Route Template
```typescript
// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permission
    const hasPermission = await checkPermission(user.id, 'students', 'view');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Query with RLS (school_id filtered automatically)
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        class:classes(*),
        parents:student_parents(parent:parents(*))
      `)
      .eq('status', 'active')
      .order('last_name', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json({ data, count: data?.length || 0 });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permission
    const hasPermission = await checkPermission(user.id, 'students', 'create');
    if (!hasPermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get school_id from user context
    const { data: userData } = await supabase
      .from('users')
      .select('school_id')
      .eq('id', user.id)
      .single();
    
    // Insert student with school_id
    const { data, error } = await supabase
      .from('students')
      .insert({
        ...body,
        school_id: userData.school_id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 8. DEPLOYMENT STRATEGY

### 8.1 Deployment Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│  DEPLOYMENT ARCHITECTURE                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  VERCEL (Frontend)                                              │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  Production: skycampus.com                             │   │   │
│  │  │  Preview: preview-<hash>.vercel.app                   │   │   │
│  │  │  Environment: next.config.js + .env                   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  SUPABASE CLOUD                                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  Database   │  │   Auth      │  │  Storage    │           │   │
│  │  │  PostgreSQL │  │   (JWT)     │  │  (S3)       │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  EXTERNAL SERVICES                                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  SendGrid   │  │Africa's     │  │  Cloudflare │           │   │
│  │  │  (Email)    │  │Talking (SMS)│  │  (DNS/CDN)  │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_key"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "domains": [
    "skycampus.com",
    "*.skycampus.com"
  ]
}
```

### 8.3 Environment Variables
```env
# .env.local (Development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=your-resend-key

# SMS
SMS_PROVIDER=africas_talking
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key

# Storage
STORAGE_BUCKET=skycampus

# Features
ENABLE_AI_COMMENTS=false
ENABLE_MULTI_LANGUAGE=true

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## 9. ENVIRONMENT VARIABLES

### 9.1 Required Variables
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ENVIRONMENT VARIABLES                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ──── Supabase ────                                                   │
│  NEXT_PUBLIC_SUPABASE_URL         - Supabase project URL              │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY    - Public anon key                   │
│  SUPABASE_SERVICE_ROLE_KEY        - Service role key (admin)          │
│                                                                         │
│  ──── App ────                                                        │
│  NEXT_PUBLIC_APP_URL              - https://skycampus.com             │
│  NEXT_PUBLIC_API_URL              - https://api.skycampus.com         │
│  NEXTAUTH_SECRET                  - NextAuth secret                   │
│  NEXTAUTH_URL                     - https://skycampus.com             │
│                                                                         │
│  ──── Email ────                                                      │
│  EMAIL_PROVIDER                   - resend | sendgrid                 │
│  RESEND_API_KEY                   - Resend API key                    │
│  SENDGRID_API_KEY                 - SendGrid API key                  │
│  EMAIL_FROM                       - noreply@skycampus.com            │
│                                                                         │
│  ──── SMS ────                                                        │
│  SMS_PROVIDER                     - africas_talking | twilio          │
│  AFRICASTALKING_USERNAME          - Africa's Talking username         │
│  AFRICASTALKING_API_KEY           - Africa's Talking API key          │
│  TWILIO_ACCOUNT_SID               - Twilio Account SID                │
│  TWILIO_AUTH_TOKEN                - Twilio Auth Token                 │
│  TWILIO_PHONE_NUMBER              - +1234567890                      │
│                                                                         │
│  ──── Storage ────                                                    │
│  STORAGE_BUCKET                   - skycampus                         │
│                                                                         │
│  ──── Monitoring ────                                                 │
│  SENTRY_DSN                       - Sentry DSN                        │
│  LOGROCKET_APP_ID                 - LogRocket app ID                  │
│                                                                         │
│  ──── Analytics ────                                                  │
│  NEXT_PUBLIC_POSTHOG_KEY          - PostHog API key                   │
│  NEXT_PUBLIC_POSTHOG_HOST         - https://app.posthog.com          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. CI/CD PIPELINE

### 10.1 GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy SkyCampus

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (Preview)
        run: npx vercel --token ${{ secrets.VERCEL_TOKEN }} --yes

  deploy-production:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel (Production)
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }} --yes
      
      - name: Run database migrations
        run: npm run db:migrate
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## 11. MONITORING & LOGGING

### 11.1 Logging Strategy
```
┌─────────────────────────────────────────────────────────────────────────┐
│  LOGGING STRATEGY                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  APPLICATION LOGS                                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  API Routes │  │  Database   │  │  Auth       │           │   │
│  │  │  (Request)  │  │  (Queries)  │  │  (JWT)      │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  LOG AGGREGATION                                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  Vercel     │  │  Supabase   │  │  Sentry     │           │   │
│  │  │  Logs       │  │  Logs       │  │  (Errors)   │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ALERTING                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │  │  Slack      │  │  Email      │  │  PagerDuty  │           │   │
│  │  │  Alerts     │  │  Alerts     │  │  Alerts     │           │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Audit Log Implementation
```typescript
// lib/audit-log.ts
export async function logAudit(
  userId: string,
  action: string,
  module: string,
  recordId: string,
  changes?: any
) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    module,
    record_id: recordId,
    changes,
    ip_address: getClientIP(),
    user_agent: getClientUserAgent(),
  });
}

// Usage in API routes
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // ... delete operation
  await logAudit(
    user.id,
    'DELETE',
    'students',
    params.id,
    { deleted_student: studentData }
  );
}
```

---

## 12. PERFORMANCE OPTIMIZATION

### 12.1 Caching Strategy
```
┌─────────────────────────────────────────────────────────────────────────┐
│  CACHING STRATEGY                                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐               │
│  │  Browser    │───▶│  Vercel     │───▶│  Supabase   │               │
│  │  Cache      │    │  Edge Cache │    │  Database   │               │
│  └─────────────┘    └─────────────┘    └─────────────┘               │
│                                                                         │
│  ──── Cache Types ────                                                │
│  1. Browser: Static assets, images (public pages)                    │
│  2. Vercel Edge: API responses (reports, public data)               │
│  3. Supabase: Query results (PostgreSQL cache)                      │
│                                                                         │
│  ──── Cache Invalidation ────                                        │
│  ● On CREATE/UPDATE/DELETE operations                                │
│  ● On schedule (daily for reports)                                  │
│  ● Manual flush via admin panel                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Database Optimization Checklist
```
✓ Proper indexing on foreign keys
✓ Partial indexes for active records
✓ Full-text search indexes for name searches
✓ Materialized views for reports (if heavy)
✓ Connection pooling configured
✓ Query optimization (EXPLAIN ANALYZE)
✓ RLS policies optimized with indexes
✓ Partitioning for large tables (attendance, logs)
```

---

## 13. SECURITY BEST PRACTICES

### 13.1 Security Checklist
```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECURITY CHECKLIST                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✅ Authentication                                                     │
│     ● JWT with short expiry (15 min) + refresh tokens                 │
│     ● Password hashing with bcrypt                                    │
│     ● Rate limiting on login endpoints                                │
│     ● Email verification before access                                │
│     ● 2FA support (TOTP)                                             │
│                                                                         │
│  ✅ Authorization                                                      │
│     ● Row Level Security (RLS) on all tables                         │
│     ● Role-based access control (RBAC)                                │
│     ● Permission checking middleware                                  │
│     ● API endpoint protection                                        │
│                                                                         │
│  ✅ Data Security                                                      │
│     ● HTTPS only (SSL/TLS)                                           │
│     ● Environment variables for secrets                               │
│     ● No hardcoded credentials                                       │
│     ● Data encryption at rest (Supabase)                              │
│     ● PII data masked in logs                                        │
│                                                                         │
│  ✅ Input Validation                                                   │
│     ● Zod schemas for all API requests                                │
│     ● SQL injection prevention (Supabase prepared)                   │
│     ● XSS protection (React/Next.js)                                  │
│     ● CSRF protection                                                 │
│     ● File upload validation (type, size)                            │
│                                                                         │
│  ✅ Monitoring                                                         │
│     ● Audit logs for all modifications                               │
│     ● Suspicious activity detection                                  │
│     ● Rate limiting per IP                                           │
│     ● Failed login tracking                                          │
│     ● Security headers (CSP, HSTS, etc.)                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Security Headers
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  },
];
```

---

## 14. MOBILE APP ARCHITECTURE

### 14.1 Mobile Architecture
```
┌─────────────────────────────────────────────────────────────────────────┐
│  MOBILE APP ARCHITECTURE                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  REACT NATIVE + EXPO                                            │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  UI Layer (React Native Paper + NativeWind)             │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │   │
│  │  │  │  Screens    │  │  Components │  │  Navigation │   │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  State Layer (Zustand + React Query)                   │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │   │
│  │  │  │  Auth Store │  │  Data Store │  │  Cache      │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  Data Layer (Supabase Client)                          │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │   │
│  │  │  │  REST       │  │  Realtime   │  │  Storage    │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  Native Layer (Expo Modules)                           │   │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │   │
│  │  │  │  Camera     │  │  Location   │  │  Push       │   │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ──── Offline Support ────                                           │
│  ● MMKV for fast local storage                                      │
│  ● React Query cache persistence                                   │
│  ● Sync queue for offline mutations                                │
│  ● Conflict resolution strategy                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 15. DEVELOPMENT ROADMAP

### 15.1 Phased Development Plan
```
┌─────────────────────────────────────────────────────────────────────────┐
│  DEVELOPMENT ROADMAP                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ──── PHASE 1: Foundation (Weeks 1-4) ────                          │
│  ● Project setup (Next.js + Supabase)                               │
│  ● Database schema creation                                         │
│  ● Authentication (JWT + RLS)                                      │
│  ● Multi-tenancy setup (schools table + middleware)                │
│  ● Super Admin panel (school management)                           │
│  ● Basic UI framework (Sidebar + Topbar)                           │
│                                                                         │
│  ──── PHASE 2: Core Features (Weeks 5-10) ────                    │
│  ● Student Management (CRUD + enrollment)                          │
│  ● Class & Subject management                                      │
│  ● Attendance (entry + reports)                                   │
│  ● Marks entry & calculation                                      │
│  ● Timetable builder                                              │
│  ● Basic dashboard for admin                                      │
│                                                                         │
│  ──── PHASE 3: Finance & Reports (Weeks 11-14) ────              │
│  ● Fee structure management                                        │
│  ● Payment processing                                              │
│  ● Student fee accounts                                            │
│  ● Financial reports                                               │
│  ● Report cards generation                                         │
│  ● Grading formula configurator                                    │
│                                                                         │
│  ──── PHASE 4: Communication & HR (Weeks 15-18) ────             │
│  ● Messaging system                                                 │
│  ● SMS/Email integration                                           │
│  ● Staff & HR management                                           │
│  ● Payroll management                                              │
│  ● Leave management                                                │
│  ● Notification system                                             │
│                                                                         │
│  ──── PHASE 5: Portals & Customization (Weeks 19-22) ────        │
│  ● Parent portal                                                    │
│  ● Student portal                                                   │
│  ● Teacher portal                                                   │
│  ● Custom role system                                               │
│  ● Permission management                                            │
│  ● Branding settings                                                │
│                                                                         │
│  ──── PHASE 6: SaaS & Scale (Weeks 23-26) ────                   │
│  ● Subscription/billing system                                     │
│  ● Multi-school onboarding                                         │
│  ● Custom domains                                                   │
│  ● Mobile app (React Native)                                       │
│  ● AI features (report comments)                                  │
│  ● Performance optimization                                        │
│                                                                         │
│  ──── PHASE 7: Polish & Launch (Weeks 27-30) ────               │
│  ● Testing (unit + integration + E2E)                             │
│  ● Security audit                                                  │
│  ● Documentation (API + User)                                     │
│  ● Monitoring setup                                                │
│  ● Production deployment                                           │
│  ● Launch marketing                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## END OF ARCHITECTURE BLUEPRINT

--- 

**SkyCampus — Built to Scale.** 🚀