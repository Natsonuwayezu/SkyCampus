-- ============================================================
-- SKYCAMPUS — Migration 003: Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_subject_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_class_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE siblings ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_medical ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_waivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user's school_id
CREATE OR REPLACE FUNCTION auth.school_id() RETURNS UUID AS $$
  SELECT school_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's role name
CREATE OR REPLACE FUNCTION auth.role_name() RETURNS TEXT AS $$
  SELECT r.name FROM public.users u
  JOIN public.roles r ON r.id = u.role_id
  WHERE u.id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if current user has permission on a module
CREATE OR REPLACE FUNCTION auth.can(module_key TEXT, action TEXT) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.role_permissions rp
    JOIN public.users u ON u.role_id = rp.role_id
    WHERE u.id = auth.uid()
    AND rp.module_key = module_key
    AND CASE action
      WHEN 'view'   THEN rp.can_view
      WHEN 'create' THEN rp.can_create
      WHEN 'edit'   THEN rp.can_edit
      WHEN 'delete' THEN rp.can_delete
      WHEN 'export' THEN rp.can_export
      ELSE false
    END = true
  )
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is super admin (no school_id)
CREATE OR REPLACE FUNCTION auth.is_super_admin() RETURNS BOOLEAN AS $$
  SELECT school_id IS NULL FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================================
-- SCHOOLS — Super admin only
-- ============================================================
CREATE POLICY "super_admin_schools" ON schools
  USING (auth.is_super_admin());

-- ============================================================
-- SCHOOL_MODULES — Same school only
-- ============================================================
CREATE POLICY "school_modules_isolation" ON school_modules
  USING (school_id = auth.school_id() OR auth.is_super_admin());

-- ============================================================
-- ROLES — Same school
-- ============================================================
CREATE POLICY "roles_isolation" ON roles
  USING (school_id = auth.school_id() OR auth.is_super_admin());

CREATE POLICY "role_permissions_isolation" ON role_permissions
  USING (
    role_id IN (
      SELECT id FROM roles WHERE school_id = auth.school_id()
    ) OR auth.is_super_admin()
  );

-- ============================================================
-- USERS — Same school
-- ============================================================
CREATE POLICY "users_isolation" ON users
  USING (school_id = auth.school_id() OR auth.is_super_admin() OR id = auth.uid());

-- ============================================================
-- ACADEMIC YEARS & TERMS — Same school, everyone can view
-- ============================================================
CREATE POLICY "academic_years_isolation" ON academic_years
  USING (school_id = auth.school_id());

CREATE POLICY "terms_isolation" ON terms
  USING (school_id = auth.school_id());

CREATE POLICY "holidays_isolation" ON holidays
  USING (school_id = auth.school_id());

-- ============================================================
-- CLASSES & SUBJECTS — Same school
-- ============================================================
CREATE POLICY "classes_isolation" ON classes
  USING (school_id = auth.school_id());

CREATE POLICY "subjects_isolation" ON subjects
  USING (school_id = auth.school_id());

CREATE POLICY "tsa_isolation" ON teacher_subject_assignments
  USING (school_id = auth.school_id());

-- ============================================================
-- STUDENTS — Same school + parents see only own children
-- ============================================================
CREATE POLICY "students_school_isolation" ON students
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

CREATE POLICY "student_class_history_isolation" ON student_class_history
  USING (school_id = auth.school_id());

CREATE POLICY "parents_isolation" ON parents
  USING (school_id = auth.school_id());

CREATE POLICY "student_parents_isolation" ON student_parents
  USING (school_id = auth.school_id());

CREATE POLICY "siblings_isolation" ON siblings
  USING (school_id = auth.school_id());

CREATE POLICY "student_medical_isolation" ON student_medical
  USING (school_id = auth.school_id());

CREATE POLICY "student_documents_isolation" ON student_documents
  USING (school_id = auth.school_id());

-- ============================================================
-- ATTENDANCE — Same school
-- ============================================================
CREATE POLICY "attendance_isolation" ON attendance
  USING (school_id = auth.school_id());

-- ============================================================
-- MARKS & ASSESSMENTS — Same school + teacher sees own classes
-- ============================================================
CREATE POLICY "assessments_isolation" ON assessments
  USING (
    school_id = auth.school_id()
    AND (
      auth.can('marks_entry', 'view')
      OR auth.role_name() = 'Admin'
    )
  );

CREATE POLICY "marks_isolation" ON marks
  USING (
    school_id = auth.school_id()
    AND (
      auth.can('marks_entry', 'view')
      OR auth.role_name() = 'Admin'
    )
  );

CREATE POLICY "grading_scales_isolation" ON grading_scales
  USING (school_id = auth.school_id());

-- ============================================================
-- TIMETABLE — Same school, everyone can view
-- ============================================================
CREATE POLICY "timetable_isolation" ON timetable_slots
  USING (school_id = auth.school_id());

-- ============================================================
-- FINANCE — Same school, only finance roles
-- ============================================================
CREATE POLICY "fee_categories_access" ON fee_categories
  USING (
    school_id = auth.school_id()
    AND auth.can('finance', 'view')
  );

CREATE POLICY "student_fees_access" ON student_fees
  USING (
    school_id = auth.school_id()
    AND (
      auth.can('finance', 'view')
      OR id IN (
        SELECT sf.id FROM student_fees sf
        JOIN student_parents sp ON sp.student_id = sf.student_id
        JOIN parents p ON p.id = sp.parent_id
        WHERE p.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "payments_access" ON payments
  USING (
    school_id = auth.school_id()
    AND auth.can('finance', 'view')
  );

CREATE POLICY "payment_allocations_access" ON payment_allocations
  USING (school_id = auth.school_id() AND auth.can('finance', 'view'));

CREATE POLICY "fee_waivers_access" ON fee_waivers
  USING (school_id = auth.school_id() AND auth.can('finance', 'view'));

CREATE POLICY "credit_balances_access" ON credit_balances
  USING (school_id = auth.school_id() AND auth.can('finance', 'view'));

-- ============================================================
-- COMMUNICATION — User sees own notifications
-- ============================================================
CREATE POLICY "notifications_own" ON notifications
  USING (school_id = auth.school_id() AND user_id = auth.uid());

CREATE POLICY "announcements_isolation" ON announcements
  USING (school_id = auth.school_id());

CREATE POLICY "messages_own" ON messages
  USING (
    school_id = auth.school_id()
    AND (sender_id = auth.uid() OR recipient_id = auth.uid())
  );

-- ============================================================
-- AUDIT & BACKUPS — Admin only
-- ============================================================
CREATE POLICY "audit_logs_admin" ON audit_logs
  USING (
    school_id = auth.school_id()
    AND auth.can('settings', 'view')
  );

CREATE POLICY "backup_logs_admin" ON backup_logs
  USING (
    school_id = auth.school_id()
    AND auth.can('settings', 'view')
  );
