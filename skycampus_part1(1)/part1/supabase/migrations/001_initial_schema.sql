-- ============================================================
-- SKYCAMPUS — Migration 001: Initial Schema
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PLATFORM
CREATE TABLE schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
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
  plan            TEXT DEFAULT 'starter',
  plan_expires_at TIMESTAMPTZ,
  status          TEXT DEFAULT 'active',
  promotion_min   DECIMAL(5,2) DEFAULT 50.00,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE school_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL,
  is_enabled  BOOLEAN DEFAULT false,
  enabled_at  TIMESTAMPTZ,
  UNIQUE(school_id, module_key)
);

CREATE TABLE subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id),
  plan          TEXT NOT NULL,
  amount        DECIMAL(10,2),
  currency      TEXT DEFAULT 'USD',
  billing_cycle TEXT DEFAULT 'monthly',
  started_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  status        TEXT DEFAULT 'active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- AUTH & USERS
CREATE TABLE roles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID REFERENCES schools(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  description    TEXT,
  is_system_role BOOLEAN DEFAULT false,
  color          TEXT DEFAULT '#94A3B8',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);

CREATE TABLE role_permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id     UUID REFERENCES roles(id) ON DELETE CASCADE,
  module_key  TEXT NOT NULL,
  can_view    BOOLEAN DEFAULT false,
  can_create  BOOLEAN DEFAULT false,
  can_edit    BOOLEAN DEFAULT false,
  can_delete  BOOLEAN DEFAULT false,
  can_export  BOOLEAN DEFAULT false,
  UNIQUE(role_id, module_key)
);

CREATE TABLE users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  role_id      UUID REFERENCES roles(id),
  full_name    TEXT NOT NULL,
  username     TEXT,
  phone        TEXT,
  avatar_url   TEXT,
  push_token   TEXT,
  is_active    BOOLEAN DEFAULT true,
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, username)
);

-- ACADEMIC YEAR & TERMS
CREATE TABLE academic_years (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_current  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name)
);

CREATE TABLE terms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  term_number      INTEGER NOT NULL,
  start_date       DATE NOT NULL,
  midterm_date     DATE,
  end_date         DATE NOT NULL,
  is_current       BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, academic_year_id, term_number)
);

CREATE TABLE holidays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  date        DATE NOT NULL,
  type        TEXT DEFAULT 'holiday',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CLASSES & SUBJECTS
CREATE TABLE classes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id),
  name             TEXT NOT NULL,
  level            TEXT NOT NULL,
  stream           TEXT,
  class_teacher_id UUID REFERENCES users(id),
  room             TEXT,
  capacity         INTEGER DEFAULT 40,
  display_order    INTEGER DEFAULT 0,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, academic_year_id, name, stream)
);

CREATE TABLE subjects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  level            TEXT NOT NULL,
  mg_max           INTEGER DEFAULT 50,
  ex_max           INTEGER DEFAULT 50,
  is_post_mid_only BOOLEAN DEFAULT false,
  display_order    INTEGER DEFAULT 0,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, name, level)
);

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

-- STUDENTS
CREATE TABLE students (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  admission_number TEXT NOT NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  date_of_birth    DATE,
  gender           TEXT,
  nationality      TEXT DEFAULT 'Rwandan',
  national_id      TEXT,
  blood_group      TEXT,
  religion         TEXT,
  home_address     TEXT,
  district         TEXT,
  village          TEXT,
  photo_url        TEXT,
  previous_school  TEXT,
  status           TEXT DEFAULT 'active',
  enrolled_at      DATE DEFAULT CURRENT_DATE,
  archived_at      TIMESTAMPTZ,
  archive_reason   TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, admission_number)
);

CREATE TABLE student_class_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id),
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id         UUID REFERENCES classes(id),
  academic_year_id UUID REFERENCES academic_years(id),
  is_current       BOOLEAN DEFAULT true,
  promoted_from    UUID REFERENCES classes(id),
  promoted_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

CREATE TABLE parents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  relation    TEXT DEFAULT 'parent',
  phone       TEXT,
  email       TEXT,
  national_id TEXT,
  address     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_parents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES parents(id) ON DELETE CASCADE,
  is_primary  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, parent_id)
);

CREATE TABLE siblings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  student_id  UUID REFERENCES students(id),
  sibling_id  UUID REFERENCES students(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, sibling_id)
);

CREATE TABLE student_medical (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id),
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  allergies    TEXT,
  conditions   TEXT,
  doctor_name  TEXT,
  doctor_phone TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id),
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_name   TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ATTENDANCE
CREATE TABLE attendance (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id),
  term_id     UUID REFERENCES terms(id),
  date        DATE NOT NULL,
  status      TEXT NOT NULL,
  note        TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, student_id, date)
);

-- ACADEMICS
CREATE TABLE grading_scales (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id) ON DELETE CASCADE,
  grade         TEXT NOT NULL,
  min_percent   DECIMAL(5,2) NOT NULL,
  max_percent   DECIMAL(5,2) NOT NULL,
  label         TEXT,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, grade)
);

CREATE TABLE assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id),
  subject_id  UUID REFERENCES subjects(id),
  term_id     UUID REFERENCES terms(id),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  max_marks   INTEGER NOT NULL,
  date        DATE,
  is_locked   BOOLEAN DEFAULT false,
  locked_at   TIMESTAMPTZ,
  locked_by   UUID REFERENCES users(id),
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id    UUID REFERENCES students(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  score         DECIMAL(6,2) NOT NULL,
  grade         TEXT,
  entered_by    UUID REFERENCES users(id),
  entered_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, assessment_id)
);

-- TIMETABLE
CREATE TABLE timetable_slots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id    UUID REFERENCES classes(id),
  subject_id  UUID REFERENCES subjects(id),
  teacher_id  UUID REFERENCES users(id),
  term_id     UUID REFERENCES terms(id),
  day_of_week INTEGER NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  room        TEXT,
  is_break    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- FINANCE
CREATE TABLE fee_categories (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID REFERENCES academic_years(id),
  name             TEXT NOT NULL,
  description      TEXT,
  amount           DECIMAL(12,2) NOT NULL,
  applies_to       TEXT DEFAULT 'all',
  class_id         UUID REFERENCES classes(id),
  reset_cycle      TEXT DEFAULT 'termly',
  due_date         DATE,
  is_active        BOOLEAN DEFAULT true,
  created_by       UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_fees (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_category_id  UUID REFERENCES fee_categories(id),
  academic_year_id UUID REFERENCES academic_years(id),
  term_id          UUID REFERENCES terms(id),
  amount           DECIMAL(12,2) NOT NULL,
  amount_paid      DECIMAL(12,2) DEFAULT 0,
  amount_waived    DECIMAL(12,2) DEFAULT 0,
  status           TEXT DEFAULT 'pending',
  due_date         DATE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, fee_category_id, academic_year_id, term_id)
);

CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID REFERENCES students(id) ON DELETE CASCADE,
  receipt_number   TEXT NOT NULL,
  total_amount     DECIMAL(12,2) NOT NULL,
  payment_method   TEXT NOT NULL,
  reference_number TEXT,
  payment_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  notes            TEXT,
  is_reversed      BOOLEAN DEFAULT false,
  reversed_at      TIMESTAMPTZ,
  reversed_by      UUID REFERENCES users(id),
  reversal_reason  TEXT,
  recorded_by      UUID REFERENCES users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, receipt_number)
);

CREATE TABLE payment_allocations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID REFERENCES schools(id),
  payment_id     UUID REFERENCES payments(id) ON DELETE CASCADE,
  student_fee_id UUID REFERENCES student_fees(id),
  amount         DECIMAL(12,2) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fee_waivers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id          UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id         UUID REFERENCES students(id),
  student_fee_id     UUID REFERENCES student_fees(id),
  fee_category_id    UUID REFERENCES fee_categories(id),
  waiver_type        TEXT DEFAULT 'full',
  waived_amount      DECIMAL(12,2),
  waived_percent     DECIMAL(5,2),
  reason             TEXT,
  carry_to_next_year BOOLEAN DEFAULT false,
  approved_by        UUID REFERENCES users(id),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_balances (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID REFERENCES schools(id) ON DELETE CASCADE,
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE UNIQUE,
  balance     DECIMAL(12,2) DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- COMMUNICATION
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  is_read    BOOLEAN DEFAULT false,
  read_at    TIMESTAMPTZ,
  link       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE announcements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  audience     TEXT DEFAULT 'all',
  is_pinned    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

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

-- AUDIT & BACKUPS
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID REFERENCES schools(id),
  user_id    UUID REFERENCES users(id),
  action     TEXT NOT NULL,
  table_name TEXT,
  record_id  UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE backup_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id),
  file_name    TEXT NOT NULL,
  file_size_mb DECIMAL(8,2),
  storage_path TEXT NOT NULL,
  type         TEXT DEFAULT 'auto',
  status       TEXT DEFAULT 'success',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
