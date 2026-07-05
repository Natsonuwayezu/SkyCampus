-- ============================================================
-- SKYCAMPUS — Migration 002: Performance Indexes
-- ============================================================

-- schools
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_status ON schools(status);

-- users
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_username ON users(school_id, username);

-- students
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_status ON students(school_id, status);
CREATE INDEX idx_students_name ON students(school_id, last_name, first_name);
CREATE INDEX idx_students_admission ON students(school_id, admission_number);

-- student_class_history
CREATE INDEX idx_sch_student ON student_class_history(student_id);
CREATE INDEX idx_sch_class ON student_class_history(class_id);
CREATE INDEX idx_sch_year ON student_class_history(academic_year_id);
CREATE INDEX idx_sch_current ON student_class_history(student_id, is_current);

-- classes
CREATE INDEX idx_classes_school_year ON classes(school_id, academic_year_id);
CREATE INDEX idx_classes_level ON classes(school_id, level);

-- subjects
CREATE INDEX idx_subjects_school ON subjects(school_id);
CREATE INDEX idx_subjects_level ON subjects(school_id, level);

-- assessments
CREATE INDEX idx_assessments_class ON assessments(class_id);
CREATE INDEX idx_assessments_subject ON assessments(subject_id);
CREATE INDEX idx_assessments_term ON assessments(term_id);
CREATE INDEX idx_assessments_school_term ON assessments(school_id, term_id);

-- marks
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_assessment ON marks(assessment_id);
CREATE INDEX idx_marks_school ON marks(school_id);

-- attendance
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX idx_attendance_term ON attendance(term_id);

-- student_fees
CREATE INDEX idx_student_fees_student ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(school_id, status);
CREATE INDEX idx_student_fees_category ON student_fees(fee_category_id);

-- payments
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_payments_date ON payments(school_id, payment_date);
CREATE INDEX idx_payments_receipt ON payments(school_id, receipt_number);

-- notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_school ON notifications(school_id);

-- audit_logs
CREATE INDEX idx_audit_school ON audit_logs(school_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- timetable
CREATE INDEX idx_timetable_class ON timetable_slots(class_id);
CREATE INDEX idx_timetable_teacher ON timetable_slots(teacher_id);
CREATE INDEX idx_timetable_term ON timetable_slots(term_id);
