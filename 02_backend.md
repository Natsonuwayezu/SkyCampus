# SKYCAMPUS — Backend Blueprint
## Database Schema · Business Logic · Formulas · API Structure
**Version:** 1.0 | **Database:** Supabase (PostgreSQL) | **Auth:** Supabase Auth
**Storage:** Supabase Storage | **Realtime:** Supabase Realtime

---

# TABLE OF CONTENTS

1. [Multi-Tenancy Design](#1-multi-tenancy)
2. [Database Tables](#2-database-tables)
3. [Relationships Diagram](#3-relationships)
4. [Business Logic & Formulas](#4-business-logic)
5. [Row Level Security (RLS)](#5-rls)
6. [Supabase Storage Buckets](#6-storage)
7. [API Endpoint Map](#7-api-endpoints)
8. [Realtime Subscriptions](#8-realtime)

---

# 1. MULTI-TENANCY

## Strategy: Shared Database, Tenant Isolation via `school_id`

```
Every table (except platform-level tables) has a school_id column.
All queries are filtered by school_id automatically via RLS policies.
Schools never see each other's data.

PLATFORM LEVEL (no school_id)
  └── schools
  └── subscriptions
  └── platform_logs

SCHOOL LEVEL (all have school_id)
  └── users
  └── students
  └── classes
  └── subjects
  └── marks
  └── fees
  └── payments
  └── ... (everything else)
```

## School Slug → Subdomain Routing

```
Request: lafontaine.skycampus.com
  → Middleware reads subdomain: "lafontaine"
  → Looks up schools WHERE slug = 'lafontaine'
  → Returns school_id → all queries filtered by this school_id
  → If slug not found → 404 school not found page
```

---

# 2. DATABASE TABLES

## 2.1 PLATFORM TABLES

### `schools`
```sql
CREATE TABLE schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,        -- lafontaine
  country         TEXT NOT NULL DEFAULT 'Rwanda',
  city            TEXT,
  phone           TEXT,
  email           TEXT,
  logo_url        TEXT,
  primary_color   TEXT DEFAULT '#1A8FE3',
  secondary_color TEXT DEFAULT '#F5A623',
  motto           TEXT,
  director_name   TEXT,
  has_nursery     BOOLEAN DEFAULT true,
  has_primary     BOOLEAN DEFAULT true,
  has_secondary   BOOLEAN DEFAULT false,
  plan            TEXT DEFAULT 'starter',      -- starter, professional, enterprise
  plan_expires_at TIMESTAMPTZ,
  status          TEXT DEFAULT 'active',       -- active, suspended, trial
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `school_modules`
```sql
-- Which modules are enabled per school
CREATE TABLE school_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL,    -- 'transport', 'hostel', 'library', 'ai_comments'
  is_enabled  BOOLEAN DEFAULT false,
  enabled_at  TIMESTAMPTZ,
  UNIQUE(school_id, module_key)
);
```

### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),
  plan          TEXT NOT NULL,
  amount        DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  billing_cycle TEXT DEFAULT 'monthly',   -- monthly, yearly
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  status        TEXT DEFAULT 'active',    -- active, expired, cancelled
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.2 AUTH & USERS

### `roles`
```sql
CREATE TABLE roles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID REFERENCES schools(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,            -- 'Admin', 'Teacher', 'Accountant', 'Deputy Head'
  description    TEXT,
  is_system_role BOOLEAN DEFAULT false,    -- true = cannot be deleted
  color          TEXT DEFAULT '#94A3B8',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);
```

### `role_permissions`
```sql
CREATE TABLE role_permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id     UUID REFERENCES roles(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL,   -- 'marks_entry', 'finance', 'students', etc.
  can_view    BOOLEAN DEFAULT false,
  can_create  BOOLEAN DEFAULT false,
  can_edit    BOOLEAN DEFAULT false,
  can_delete  BOOLEAN DEFAULT false,
  can_export  BOOLEAN DEFAULT false,
  UNIQUE(role_id, module_key)
);
```

### `users`
```sql
-- Extends Supabase auth.users
CREATE TABLE users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  role_id      UUID REFERENCES roles(id),
  full_name    TEXT NOT NULL,
  username     TEXT,                         -- for teacher/accountant login
  phone        TEXT,
  avatar_url   TEXT,
  is_active    BOOLEAN DEFAULT true,
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, username)
);
```

---

## 2.3 ACADEMIC YEAR & TERMS

### `academic_years`
```sql
CREATE TABLE academic_years (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,           -- '2025-2026'
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_current  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);
```

### `terms`
```sql
CREATE TABLE terms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,          -- 'Term 1', 'Term 2', 'Term 3'
  term_number      INTEGER NOT NULL,       -- 1, 2, 3
  start_date       DATE NOT NULL,
  midterm_date     DATE,
  end_date         DATE NOT NULL,
  is_current       BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, academic_year_id, term_number)
);
```

### `holidays`
```sql
CREATE TABLE holidays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  date        DATE NOT NULL,
  type        TEXT DEFAULT 'holiday',   -- 'holiday', 'event', 'break'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.4 CLASSES & SUBJECTS

### `classes`
```sql
CREATE TABLE classes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id),
  name             TEXT NOT NULL,           -- 'NURSERY 1', 'PRIMARY 4'
  level            TEXT NOT NULL,           -- 'nursery', 'primary'
  stream           TEXT,                    -- 'A', 'B' (optional)
  class_teacher_id UUID REFERENCES users(id),
  room             TEXT,
  capacity         INTEGER DEFAULT 40,
  display_order    INTEGER DEFAULT 0,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, academic_year_id, name, stream)
);
```

### `subjects`
```sql
CREATE TABLE subjects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  level           TEXT NOT NULL,           -- 'nursery', 'primary', 'both'
  mg_max          INTEGER DEFAULT 50,      -- midterm/test max marks
  ex_max          INTEGER DEFAULT 50,      -- exam max marks
  total_max       INTEGER GENERATED ALWAYS AS (mg_max + ex_max) STORED,
  is_post_mid_only BOOLEAN DEFAULT false,  -- if true, MG=copy of EX
  display_order   INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name, level)
);
```

### `teacher_subject_assignments`
```sql
-- Which teacher teaches which subject in which class
CREATE TABLE teacher_subject_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  term_id     UUID REFERENCES terms(id),
  teacher_id  UUID REFERENCES users(id),
  class_id    UUID REFERENCES classes(id),
  subject_id  UUID REFERENCES subjects(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, term_id, class_id, subject_id)
);
```

---

## 2.5 STUDENTS

### `students`
```sql
CREATE TABLE students (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID REFERENCES schools(id) ON DELETE CASCADE,
  admission_number  TEXT UNIQUE NOT NULL,   -- SC-2023-001 (auto-generated)
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  full_name         TEXT GENERATED ALWAYS AS (last_name || ' ' || first_name) STORED,
  date_of_birth     DATE,
  gender            TEXT,                   -- 'male', 'female'
  nationality       TEXT DEFAULT 'Rwandan',
  national_id       TEXT,                   -- NID or birth certificate
  blood_group       TEXT,
  religion          TEXT,
  home_address      TEXT,
  district          TEXT,
  village           TEXT,
  photo_url         TEXT,
  previous_school   TEXT,
  status            TEXT DEFAULT 'active',  -- 'active', 'archived', 'graduated'
  enrolled_at       DATE DEFAULT CURRENT_DATE,
  archived_at       TIMESTAMPTZ,
  archive_reason    TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### `student_class_history`
```sql
-- Tracks which class a student is in per academic year
CREATE TABLE student_class_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id),
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id         UUID REFERENCES classes(id),
  academic_year_id UUID REFERENCES academic_years(id),
  is_current       BOOLEAN DEFAULT true,
  promoted_from    UUID REFERENCES classes(id),    -- previous class
  promoted_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);
```

### `parents`
```sql
CREATE TABLE parents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id),      -- if parent has portal login
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  full_name  TEXT GENERATED ALWAYS AS (last_name || ' ' || first_name) STORED,
  relation   TEXT DEFAULT 'parent',          -- 'father','mother','guardian','uncle'
  phone      TEXT,
  email      TEXT,
  national_id TEXT,
  address    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `student_parents`
```sql
-- Links students to parents (many-to-many)
CREATE TABLE student_parents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES parents(id) ON DELETE CASCADE,
  is_primary  BOOLEAN DEFAULT false,   -- primary contact
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);
```

### `siblings`
```sql
-- Links students in same family
CREATE TABLE siblings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  student_id  UUID REFERENCES students(id),
  sibling_id  UUID REFERENCES students(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, sibling_id)
);
```

### `student_medical`
```sql
CREATE TABLE student_medical (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),
  student_id    UUID REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  allergies     TEXT,
  conditions    TEXT,
  doctor_name   TEXT,
  doctor_phone  TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### `student_documents`
```sql
CREATE TABLE student_documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id),
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,    -- 'birth_cert', 'parent_id', 'transfer_letter'
  file_url     TEXT NOT NULL,
  file_name    TEXT,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.6 ATTENDANCE

### `attendance`
```sql
CREATE TABLE attendance (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id),
  term_id     UUID REFERENCES terms(id),
  date        DATE NOT NULL,
  status      TEXT NOT NULL,     -- 'present', 'absent', 'late', 'excused'
  note        TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, student_id, date)
);
```

---

## 2.7 ACADEMICS (MARKS)

### `assessments`
```sql
CREATE TABLE assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id),
  subject_id  UUID REFERENCES subjects(id),
  term_id     UUID REFERENCES terms(id),
  name        TEXT NOT NULL,             -- 'Quiz 3', 'Midterm Exam', 'Assignment 2'
  type        TEXT NOT NULL,             -- 'quiz', 'assignment', 'midterm', 'exam', 'project'
  max_marks   INTEGER NOT NULL,
  date        DATE,
  is_locked   BOOLEAN DEFAULT false,
  locked_at   TIMESTAMPTZ,
  locked_by   UUID REFERENCES users(id),
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `marks`
```sql
CREATE TABLE marks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id     UUID REFERENCES students(id) ON DELETE CASCADE,
  assessment_id  UUID REFERENCES assessments(id) ON DELETE CASCADE,
  score          DECIMAL(6,2) NOT NULL,
  percentage     DECIMAL(5,2) GENERATED ALWAYS AS
                   (CASE WHEN (SELECT max_marks FROM assessments a WHERE a.id = assessment_id) > 0
                    THEN ROUND((score / (SELECT max_marks FROM assessments a WHERE a.id = assessment_id)) * 100, 2)
                    ELSE 0 END) STORED,
  grade          TEXT,                   -- computed via grading_scales
  entered_by     UUID REFERENCES users(id),
  entered_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assessment_id)
);
```

### `grading_scales`
```sql
CREATE TABLE grading_scales (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  grade       TEXT NOT NULL,             -- 'A+', 'A', 'B+', ...
  min_percent DECIMAL(5,2) NOT NULL,
  max_percent DECIMAL(5,2) NOT NULL,
  label       TEXT,                      -- 'Excellent', 'Very Good', ...
  display_order INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, grade)
);
```

---

## 2.8 FINANCE

### `fee_categories`
```sql
CREATE TABLE fee_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id),
  name            TEXT NOT NULL,            -- 'School Fees', 'Building Fund', 'Trip'
  description     TEXT,
  amount          DECIMAL(12,2) NOT NULL,
  applies_to      TEXT DEFAULT 'all',       -- 'all', 'class', 'student'
  class_id        UUID REFERENCES classes(id),   -- if applies_to = 'class'
  reset_cycle     TEXT DEFAULT 'termly',    -- 'monthly', 'termly', 'annual', 'one_time'
  due_date        DATE,
  is_active       BOOLEAN DEFAULT true,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `student_fees`
```sql
-- One row per student per fee category per period
CREATE TABLE student_fees (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_category_id  UUID REFERENCES fee_categories(id),
  academic_year_id UUID REFERENCES academic_years(id),
  term_id          UUID REFERENCES terms(id),     -- NULL for annual/one-time
  amount           DECIMAL(12,2) NOT NULL,
  amount_paid      DECIMAL(12,2) DEFAULT 0,
  amount_waived    DECIMAL(12,2) DEFAULT 0,
  amount_remaining DECIMAL(12,2) GENERATED ALWAYS AS
                     (amount - amount_paid - amount_waived) STORED,
  status           TEXT DEFAULT 'pending',    -- 'paid', 'partial', 'pending', 'waived'
  due_date         DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, fee_category_id, academic_year_id, term_id)
);
```

### `payments`
```sql
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES students(id) ON DELETE CASCADE,
  receipt_number  TEXT UNIQUE NOT NULL,      -- RCP-2026-0152 (auto-generated)
  total_amount    DECIMAL(12,2) NOT NULL,
  payment_method  TEXT NOT NULL,             -- 'cash', 'bank', 'mobile_money', 'cheque'
  reference_number TEXT,
  payment_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT,
  is_reversed     BOOLEAN DEFAULT false,
  reversed_at     TIMESTAMPTZ,
  reversed_by     UUID REFERENCES users(id),
  reversal_reason TEXT,
  recorded_by     UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `payment_allocations`
```sql
-- How a payment is split across fee categories
CREATE TABLE payment_allocations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id),
  payment_id      UUID REFERENCES payments(id) ON DELETE CASCADE,
  student_fee_id  UUID REFERENCES student_fees(id),
  amount          DECIMAL(12,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### `fee_waivers`
```sql
CREATE TABLE fee_waivers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES students(id),
  student_fee_id   UUID REFERENCES student_fees(id),
  fee_category_id  UUID REFERENCES fee_categories(id),
  waiver_type      TEXT DEFAULT 'full',     -- 'full', 'partial', 'percentage'
  waived_amount    DECIMAL(12,2),
  waived_percent   DECIMAL(5,2),
  reason           TEXT,
  carry_to_next_year BOOLEAN DEFAULT false,
  approved_by      UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### `credit_balances`
```sql
-- Tracks overpayments / credit per student
CREATE TABLE credit_balances (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  balance      DECIMAL(12,2) DEFAULT 0,      -- positive = credit, 0 = clear
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.9 TIMETABLE

### `timetable_slots`
```sql
CREATE TABLE timetable_slots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id     UUID REFERENCES classes(id),
  subject_id   UUID REFERENCES subjects(id),
  teacher_id   UUID REFERENCES users(id),
  term_id      UUID REFERENCES terms(id),
  day_of_week  INTEGER NOT NULL,    -- 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  room         TEXT,
  is_break     BOOLEAN DEFAULT false,   -- true for BREAK/LUNCH slots
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.10 COMMUNICATION

### `notifications`
```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,           -- 'marks', 'payment', 'attendance', 'system'
  title       TEXT NOT NULL,
  body        TEXT,
  is_read     BOOLEAN DEFAULT false,
  read_at     TIMESTAMPTZ,
  link        TEXT,                    -- optional deep link
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `announcements`
```sql
CREATE TABLE announcements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  audience     TEXT DEFAULT 'all',    -- 'all', 'teachers', 'parents', 'students'
  is_pinned    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `messages`
```sql
CREATE TABLE messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  sender_id    UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  subject      TEXT,
  body         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT false,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.11 AUDIT

### `audit_logs`
```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,          -- 'MARKS_ADD', 'PAYMENT', 'STUDENT_ENROLL', etc.
  table_name  TEXT,
  record_id   UUID,
  old_values  JSONB,
  new_values  JSONB,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2.12 BACKUPS (Metadata)

### `backup_logs`
```sql
CREATE TABLE backup_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id),
  file_name    TEXT NOT NULL,
  file_size_mb DECIMAL(8,2),
  storage_path TEXT NOT NULL,       -- Supabase Storage path
  type         TEXT DEFAULT 'auto', -- 'auto', 'manual'
  status       TEXT DEFAULT 'success', -- 'success', 'failed'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

# 3. RELATIONSHIPS DIAGRAM

```
                         PLATFORM LEVEL
                        ┌──────────────┐
                        │   schools    │
                        └──────┬───────┘
                               │ school_id (on every table below)
           ┌───────────────────┼────────────────────────┐
           │                   │                        │
    ┌──────▼──────┐    ┌───────▼──────┐    ┌───────────▼──────┐
    │  academic   │    │    roles     │    │  school_modules  │
    │   _years    │    └───────┬──────┘    └──────────────────┘
    └──────┬──────┘            │
           │           ┌───────▼──────────┐
    ┌──────▼──────┐    │ role_permissions │
    │    terms    │    └──────────────────┘
    └──────┬──────┘
           │
    ┌──────┼───────────────────────────────────────────┐
    │      │                                           │
    ▼      ▼                                           ▼
 classes  assessments                              student_fees
    │      │                                           │
    │   ┌──▼──┐                                 ┌─────▼──────┐
    │   │marks│                                 │  payments  │
    │   └─────┘                                 └─────┬──────┘
    │                                                 │
    │                                    ┌────────────▼──────────┐
    │                                    │  payment_allocations  │
    │                                    └───────────────────────┘
    ▼
  students ──────────────────────────────────────────────────┐
    │                                                        │
    ├── student_class_history                                │
    ├── student_parents ──► parents ──► users               │
    ├── siblings                                             │
    ├── student_medical                                      │
    ├── student_documents                                    │
    ├── attendance                                           │
    └── credit_balances                                      │
                                                             │
  users ◄──────────────────────────────────────────────────┘
    │  (teachers, admins, accountants, parents, students)
    ├── teacher_subject_assignments
    ├── timetable_slots
    ├── notifications
    ├── messages
    └── audit_logs
```

---

# 4. BUSINESS LOGIC & FORMULAS

## 4.1 Grade Calculation

```
FUNCTION get_grade(score, max_marks, school_id):
  percentage = (score / max_marks) * 100
  SELECT grade FROM grading_scales
  WHERE school_id = school_id
    AND percentage >= min_percent
    AND percentage <= max_percent
  ORDER BY min_percent DESC
  LIMIT 1
  RETURN grade

DEFAULT GRADING SCALE (inserted on school creation):
  A+  → 90–100%   Excellent
  A   → 80–89.99% Very Good
  A-  → 75–79.99% Good
  B+  → 70–74.99% Above Average
  B   → 65–69.99% Average
  B-  → 60–64.99% Below Average
  C   → 50–59.99% Pass
  D   → 0–49.99%  Fail
```

## 4.2 Class Register Calculation — Pre-Midterm

```
FOR each student IN class:
  FOR each subject IN class.subjects:
    subject_score = SUM of all marks WHERE
      assessment.type IN ('quiz', 'assignment', 'project')
      AND assessment.term_id = current_term
      AND student_id = student.id
      AND subject_id = subject.id
    subject_max = SUM of assessment.max_marks for same filters

  student_total = SUM(all subject_scores)
  student_max   = SUM(all subject_maxes)
  student_pct   = (student_total / student_max) * 100
  student_grade = get_grade(student_total, student_max, school_id)

RANKING:
  ORDER BY student_total DESC
  RANK = ROW_NUMBER() (ties get same rank)
```

## 4.3 Class Register Calculation — Post-Midterm

```
POST-MIDTERM FORMULA:
  Each subject has MG (pre-midterm tests) and EX (exam) columns.

  MG_score  = SUM of quizzes/assignments up to midterm date
  EX_score  = exam mark entered after midterm
  Subject_TOT = MG_score + EX_score
  Subject_MAX = subject.mg_max + subject.ex_max

  NOTE for Post-Mid Only subjects (Reading, Creative Arts, Sports):
    is_post_mid_only = true
    MG = auto-copy of EX when teacher enters EX
    (so MG_score = EX_score = exam mark)

  G_TOT = SUM(all Subject_TOT)
  G_MAX  = SUM(all Subject_MAX)
  AVERAGE = (G_TOT / G_MAX) * 100
  GRADE   = get_grade(G_TOT, G_MAX, school_id)
  RANK    = rank by G_TOT DESC
```

## 4.4 Annual Register Calculation

```
ANNUAL FORMULA:
  For each term (T1, T2, T3):
    term_total_mg = SUM(MG_scores across all subjects in that term)
    term_total_ex = SUM(EX_scores across all subjects in that term)
    term_g_tot    = term_total_mg + term_total_ex

  ANNUAL_G_TOT = term1_g_tot + term2_g_tot + term3_g_tot
  ANNUAL_G_MAX = term1_max   + term2_max   + term3_max
  ANNUAL_PCT   = (ANNUAL_G_TOT / ANNUAL_G_MAX) * 100
  ANNUAL_GRADE = get_grade(ANNUAL_G_TOT, ANNUAL_G_MAX, school_id)
  ANNUAL_RANK  = rank by ANNUAL_G_TOT DESC

PROMOTION RULE:
  IF ANNUAL_PCT >= school.promotion_min (default 50%)
    THEN status = 'promoted'
    ELSE status = 'repeating'
```

## 4.5 Nursery Register Formats

```
NURSERY PRE-MIDTERM:
  Same as Primary Pre-Midterm but uses Nursery subjects.
  Language: French labels (NOTE, COTE, TOTAL, RANG, MOYENNE)

NURSERY POST-MIDTERM:
  Same MG + EX formula as Primary Post-Midterm.
  All 8 Nursery subjects have MG + EX columns.
  No Post-Mid-Only subjects in Nursery.

NURSERY ANNUAL:
  Sums T1 + T2 + T3 totals per subject.
  Nursery promotion: same 50% threshold.
```

## 4.6 Payment & Fee Logic

```
WHEN new fee_category is created:
  FOR each active student IN school:
    INSERT INTO student_fees (
      student_id, fee_category_id,
      amount = fee_category.amount,
      status = 'pending'
    )
  IF student has credit_balance > 0:
    auto_apply_credit(student_id)

FUNCTION auto_apply_credit(student_id):
  credit = SELECT balance FROM credit_balances WHERE student_id
  IF credit > 0:
    pending_fees = SELECT * FROM student_fees
      WHERE student_id AND status IN ('pending','partial')
      ORDER BY due_date ASC
    FOR each fee IN pending_fees:
      IF credit >= fee.amount_remaining:
        pay full fee, credit -= fee.amount_remaining
      ELSE:
        pay partial, credit = 0; BREAK
    UPDATE credit_balances SET balance = credit

WHEN payment is recorded (amount X for student):
  remaining = X
  pending_fees = SELECT FROM student_fees
    WHERE student_id = student
    AND status IN ('pending','partial')
    ORDER BY due_date ASC
  FOR each fee IN pending_fees:
    IF remaining <= 0: BREAK
    allocate = MIN(remaining, fee.amount_remaining)
    INSERT INTO payment_allocations (payment_id, student_fee_id, amount=allocate)
    UPDATE student_fees SET amount_paid += allocate
    remaining -= allocate
  IF remaining > 0:
    -- Overpayment: create/update credit balance
    INSERT INTO credit_balances or UPDATE balance += remaining

RECEIPT NUMBER GENERATION:
  RCP-{YEAR}-{padded_sequence}
  e.g. RCP-2026-0152
  sequence = COUNT(payments WHERE school_id AND YEAR(created_at) = current_year) + 1

FEE STATUS RULES:
  amount_paid = 0                    → 'pending'
  amount_paid > 0 AND < amount       → 'partial'
  amount_paid >= (amount-amount_waived) → 'paid'
  amount_waived = amount             → 'waived'

RESET CYCLE LOGIC (cron job):
  Monthly fees  → new student_fee rows on 1st of each month
  Termly fees   → new rows at start of each term
  Annual fees   → new rows at start of each academic year
  One-time fees → never reset (is_active = false after first billing)
```

## 4.7 Admission Number Generation

```
FUNCTION generate_admission_number(school_id):
  year = EXTRACT(YEAR FROM NOW())
  count = COUNT(students WHERE school_id AND YEAR(enrolled_at) = year)
  padded = LPAD((count + 1)::TEXT, 3, '0')
  RETURN 'SC-' || year || '-' || padded
  -- e.g. SC-2026-001, SC-2026-002, SC-2026-245
```

## 4.8 Attendance Summary

```
FUNCTION get_attendance_summary(student_id, term_id):
  total_days = COUNT(DISTINCT date) FROM attendance
    WHERE school_id AND term_id
  present_days = COUNT(*) WHERE student_id AND term_id AND status='present'
  absent_days  = COUNT(*) WHERE student_id AND term_id AND status='absent'
  late_days    = COUNT(*) WHERE student_id AND term_id AND status='late'
  rate = (present_days / total_days) * 100
  RETURN {total_days, present_days, absent_days, late_days, rate}
```

## 4.9 Promotion Logic

```
FUNCTION run_promotion(academic_year_id, school_id):
  FOR each student WITH is_current=true AND status='active':
    annual = get_annual_result(student_id, academic_year_id)
    IF annual.percentage >= school.promotion_min:
      next_class = get_next_class(current_class)
      INSERT student_class_history for new academic year
      student.status = 'active'
    ELSE:
      -- stays in same class
      INSERT student_class_history with same class_id
    log_promotion(student_id, decision)

FUNCTION get_next_class(current_class):
  -- NURSERY 1 → NURSERY 2 → NURSERY 3 → PRIMARY 1 → ... → PRIMARY 5
  ORDER classes BY display_order
  FIND current_class.display_order
  RETURN class WHERE display_order = current + 1
  IF no next class → 'graduated'
```

---

# 5. ROW LEVEL SECURITY (RLS)

## 5.1 Core Policy Pattern

```sql
-- Enable RLS on every table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's school_id
CREATE OR REPLACE FUNCTION auth.school_id() RETURNS UUID AS $$
  SELECT school_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function: get current user's role name
CREATE OR REPLACE FUNCTION auth.role_name() RETURNS TEXT AS $$
  SELECT r.name FROM users u
  JOIN roles r ON r.id = u.role_id
  WHERE u.id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function: check module permission
CREATE OR REPLACE FUNCTION auth.can(module TEXT, action TEXT) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM role_permissions rp
    JOIN users u ON u.role_id = rp.role_id
    WHERE u.id = auth.uid()
    AND rp.module_key = module
    AND CASE action
      WHEN 'view'   THEN rp.can_view
      WHEN 'create' THEN rp.can_create
      WHEN 'edit'   THEN rp.can_edit
      WHEN 'delete' THEN rp.can_delete
      WHEN 'export' THEN rp.can_export
    END = true
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

## 5.2 Example RLS Policies

```sql
-- STUDENTS table: school isolation
CREATE POLICY "school_isolation" ON students
  USING (school_id = auth.school_id());

-- MARKS table: teachers see only their assigned classes
CREATE POLICY "teacher_marks_access" ON marks
  USING (
    school_id = auth.school_id()
    AND (
      auth.role_name() IN ('Admin', 'Super Admin')
      OR auth.can('marks_entry', 'view')
    )
  );

-- FINANCE: only admin and accountant
CREATE POLICY "finance_access" ON payments
  USING (
    school_id = auth.school_id()
    AND auth.can('finance', 'view')
  );

-- STUDENTS: parents see only own children
CREATE POLICY "parent_student_access" ON students
  USING (
    school_id = auth.school_id()
    AND (
      auth.role_name() != 'Parent'
      OR id IN (
        SELECT sp.student_id FROM student_parents sp
        JOIN parents p ON p.id = sp.parent_id
        WHERE p.user_id = auth.uid()
      )
    )
  );
```

---

# 6. SUPABASE STORAGE BUCKETS

```
BUCKET: school-logos
  Path: /{school_id}/logo.{ext}
  Access: Public read, authenticated write (admin only)

BUCKET: student-photos
  Path: /{school_id}/students/{student_id}/photo.{ext}
  Access: Authenticated read (same school), admin write

BUCKET: student-documents
  Path: /{school_id}/students/{student_id}/{type}/{filename}
  Access: Authenticated read (admin only), admin write

BUCKET: report-cards
  Path: /{school_id}/reports/{academic_year}/{class}/{student_id}/{term}.pdf
  Access: Authenticated read (admin, teacher, parent of student)
  Generated: server-side PDF on demand

BUCKET: backups
  Path: /{school_id}/backups/{timestamp}.json.gz
  Access: Admin only read/write, super admin read

BUCKET: imports
  Path: /{school_id}/imports/{timestamp}/{filename}
  Access: Admin/accountant write, auto-deleted after 7 days
```

---

# 7. API ENDPOINT MAP

> All endpoints are Supabase client calls (not traditional REST).
> Listed as: METHOD /table or RPC function

## 7.1 Authentication

```
POST   /auth/sign-in-with-password     Login (email or username + pw)
POST   /auth/sign-out                  Logout
POST   /auth/reset-password            Send reset email
POST   /auth/update-user               Change password
GET    /rpc/get_current_user           Get logged-in user + role + permissions
```

## 7.2 Schools (Super Admin only)

```
GET    /schools                        List all schools
POST   /schools                        Create new school
GET    /schools/:id                    Get school detail
PATCH  /schools/:id                    Update school
DELETE /schools/:id                    Delete school
GET    /school_modules?school_id=      Get enabled modules
PATCH  /school_modules                 Enable/disable module
```

## 7.3 Academic Years & Terms

```
GET    /academic_years                 List years for school
POST   /academic_years                 Create year
PATCH  /academic_years/:id             Update year
GET    /terms?academic_year_id=        List terms
POST   /terms                          Create term
PATCH  /terms/:id                      Update term (dates, midterm)
DELETE /terms/:id                      Delete term
GET    /holidays?academic_year_id=     List holidays
POST   /holidays                       Add holiday/event
```

## 7.4 Classes & Subjects

```
GET    /classes                        List classes for school+year
POST   /classes                        Create class
PATCH  /classes/:id                    Update class
DELETE /classes/:id                    Delete class

GET    /subjects                       List subjects
POST   /subjects                       Create subject
PATCH  /subjects/:id                   Update subject (max marks, order)
DELETE /subjects/:id                   Delete subject

GET    /teacher_subject_assignments    Get assignments
POST   /teacher_subject_assignments    Assign teacher to subject+class
DELETE /teacher_subject_assignments/:id Remove assignment
```

## 7.5 Students

```
GET    /students                       List students (filters: class, status, year)
POST   /students                       Enroll new student
GET    /students/:id                   Get student detail
PATCH  /students/:id                   Update student
POST   /rpc/archive_student            Archive student
POST   /rpc/promote_students           Bulk promotion
POST   /rpc/bulk_import_students       Import from Excel (parsed client-side)
GET    /student_class_history?student_id= Class history for student
GET    /siblings?student_id=           Get siblings
POST   /siblings                       Link siblings
DELETE /siblings/:id                   Unlink sibling
```

## 7.6 Marks

```
GET    /assessments                    List assessments (class, subject, term)
POST   /assessments                    Create assessment
PATCH  /assessments/:id                Update assessment
DELETE /assessments/:id                Delete assessment
POST   /rpc/lock_assessment            Lock/unlock assessment

GET    /marks?assessment_id=           Get marks for an assessment
POST   /marks                          Insert single mark
POST   /rpc/bulk_save_marks            Save multiple marks at once
DELETE /marks/:id                      Delete mark (admin only)

GET    /rpc/get_class_register         Computed register (pre/post/annual)
GET    /rpc/get_report_card            Single student report card data
GET    /rpc/get_statistics             Class/school statistics
GET    /rpc/get_rankings               Rankings for class+term
```

## 7.7 Finance

```
GET    /fee_categories                 List fee categories
POST   /fee_categories                 Create category (auto-applies to students)
PATCH  /fee_categories/:id             Update category
DELETE /fee_categories/:id             Delete category

GET    /student_fees?student_id=       Get fees for student
GET    /student_fees?class_id=         Get fees for whole class
PATCH  /student_fees/:id               Manual fee adjustment

POST   /payments                       Record payment (triggers allocation)
GET    /payments?student_id=           Payment history for student
DELETE /rpc/reverse_payment            Reverse a payment

GET    /fee_waivers?student_id=        Get waivers for student
POST   /fee_waivers                    Apply waiver
DELETE /fee_waivers/:id                Remove waiver

GET    /rpc/get_financial_report       School-wide financial summary
GET    /rpc/get_overdue_payments       List overdue by days
GET    /rpc/get_fee_status_by_class    Collection rates per class
GET    /credit_balances?student_id=    Student credit balance
```

## 7.8 Attendance

```
GET    /attendance?class_id=&date=     Get attendance for class on date
POST   /attendance                     Mark student present/absent
POST   /rpc/bulk_mark_attendance       Mark whole class at once
GET    /rpc/get_attendance_summary     Student attendance summary
GET    /rpc/get_attendance_report      Class/school attendance report
```

## 7.9 Timetable

```
GET    /timetable_slots?class_id=      Get timetable for class
GET    /timetable_slots?teacher_id=    Get timetable for teacher
POST   /timetable_slots                Add slot
PATCH  /timetable_slots/:id            Update slot
DELETE /timetable_slots/:id            Delete slot
GET    /rpc/check_timetable_conflicts  Detect conflicts
```

## 7.10 Users & Roles

```
GET    /users                          List users for school
POST   /users                          Create user (also creates auth.user)
PATCH  /users/:id                      Update user
POST   /rpc/deactivate_user            Deactivate user
POST   /rpc/reset_user_password        Reset password

GET    /roles                          List roles for school
POST   /roles                          Create custom role
PATCH  /roles/:id                      Update role
DELETE /roles/:id                      Delete role

GET    /role_permissions?role_id=      Get permissions for role
POST   /rpc/save_role_permissions      Save all permissions for role at once
```

## 7.11 Communication

```
GET    /notifications?user_id=         Get notifications for user
PATCH  /notifications/:id              Mark read
POST   /rpc/mark_all_notifications_read

GET    /announcements                  List announcements
POST   /announcements                  Create announcement
PATCH  /announcements/:id              Update/pin/unpin
DELETE /announcements/:id              Delete

GET    /messages?user_id=              Get messages (inbox)
POST   /messages                       Send message
```

## 7.12 Settings & Admin

```
GET    /schools/:id                    Get school settings
PATCH  /schools/:id                    Update settings (branding, year, term)

GET    /grading_scales                 Get grading scale
POST   /grading_scales                 Add grade
PATCH  /grading_scales/:id             Edit grade
DELETE /grading_scales/:id             Delete grade

GET    /audit_logs                     Get audit log (admin only)
GET    /backup_logs                    Get backup history
POST   /rpc/create_backup              Trigger manual backup
POST   /rpc/restore_backup             Restore from backup
```

---

# 8. REALTIME SUBSCRIPTIONS

```
Supabase Realtime channels used:

CHANNEL: marks:{school_id}:{class_id}
  → Subscribe when teacher is on marks entry page
  → Fires when another teacher saves marks for same class
  → Used to show live "X entered marks for Y" notifications

CHANNEL: payments:{school_id}
  → Fires when payment is recorded
  → Updates accountant dashboard totals in real time

CHANNEL: notifications:{user_id}
  → Personal notifications channel
  → Fires on INSERT to notifications table for this user
  → Updates bell counter in topbar instantly

CHANNEL: announcements:{school_id}
  → Fires when new announcement is created
  → All logged-in users in school receive it

CHANNEL: students:{school_id}
  → Fires on student enroll/archive
  → Updates dashboard student counts
```

---

# 9. DEFAULT SEED DATA (on school creation)

```sql
-- Grading scale
INSERT INTO grading_scales (school_id, grade, min_percent, max_percent, label) VALUES
  (school_id, 'A+', 90,    100,   'Excellent'),
  (school_id, 'A',  80,    89.99, 'Very Good'),
  (school_id, 'A-', 75,    79.99, 'Good'),
  (school_id, 'B+', 70,    74.99, 'Above Average'),
  (school_id, 'B',  65,    69.99, 'Average'),
  (school_id, 'B-', 60,    64.99, 'Below Average'),
  (school_id, 'C',  50,    59.99, 'Pass'),
  (school_id, 'D',  0,     49.99, 'Fail');

-- Default roles
INSERT INTO roles (school_id, name, is_system_role, color) VALUES
  (school_id, 'Admin',      true, '#1A8FE3'),
  (school_id, 'Accountant', true, '#10B981'),
  (school_id, 'Teacher',    true, '#8B5CF6');

-- Default subjects (Nursery)
INSERT INTO subjects (school_id, name, level, mg_max, ex_max, display_order) VALUES
  (school_id, 'Pre-Calculé',                   'nursery', 50, 50, 1),
  (school_id, 'Education Santé Environnement', 'nursery', 50, 50, 2),
  (school_id, 'Français Écriture',             'nursery', 50, 50, 3),
  (school_id, 'Français Lecture',              'nursery', 50, 50, 4),
  (school_id, 'Anglais',                       'nursery', 50, 50, 5),
  (school_id, 'Expression Orale',              'nursery', 50, 50, 6),
  (school_id, 'Art Plastique',                 'nursery', 50, 50, 7),
  (school_id, 'Développement Social',          'nursery', 50, 50, 8);

-- Default subjects (Primary)
INSERT INTO subjects (school_id, name, level, mg_max, ex_max, is_post_mid_only, display_order) VALUES
  (school_id, 'Mathematics',   'primary', 50, 50, false, 1),
  (school_id, 'English',       'primary', 50, 50, false, 2),
  (school_id, 'Kinyarwanda',   'primary', 50, 50, false, 3),
  (school_id, 'French',        'primary', 50, 50, false, 4),
  (school_id, 'SET',           'primary', 40, 40, false, 5),
  (school_id, 'SRS',           'primary', 40, 40, false, 6),
  (school_id, 'Reading',       'primary', 20, 20, true,  7),
  (school_id, 'Creative Arts', 'primary', 20, 20, true,  8),
  (school_id, 'Sports',        'primary', 10, 10, true,  9);

-- Default module statuses
INSERT INTO school_modules (school_id, module_key, is_enabled) VALUES
  (school_id, 'academics',   true),
  (school_id, 'finance',     true),
  (school_id, 'students',    true),
  (school_id, 'staff',       true),
  (school_id, 'transport',   false),
  (school_id, 'hostel',      false),
  (school_id, 'library',     false),
  (school_id, 'ai_comments', false);
```

---

*SkyCampus Backend Blueprint v1.0 — Complete*
*Next: 03_architecture.md → Tech stack, folder structure, deployment, connectors, flows*
