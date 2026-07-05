-- ============================================================
-- SKYCAMPUS — Seed: Run once per new school after creation
-- Replace :school_id with the actual school UUID
-- ============================================================

-- Default grading scale
INSERT INTO grading_scales (school_id, grade, min_percent, max_percent, label, display_order) VALUES
  (:school_id, 'A+', 90.00, 100.00, 'Excellent',     1),
  (:school_id, 'A',  80.00,  89.99, 'Very Good',     2),
  (:school_id, 'A-', 75.00,  79.99, 'Good',          3),
  (:school_id, 'B+', 70.00,  74.99, 'Above Average', 4),
  (:school_id, 'B',  65.00,  69.99, 'Average',       5),
  (:school_id, 'B-', 60.00,  64.99, 'Below Average', 6),
  (:school_id, 'C',  50.00,  59.99, 'Pass',          7),
  (:school_id, 'D',   0.00,  49.99, 'Fail',          8);

-- Default roles
INSERT INTO roles (school_id, name, description, is_system_role, color) VALUES
  (:school_id, 'Admin',      'Full access to all modules',          true,  '#1A8FE3'),
  (:school_id, 'Accountant', 'Finance only, no academic data',      true,  '#10B981'),
  (:school_id, 'Teacher',    'Academics only for assigned classes',  true,  '#8B5CF6');

-- Default role permissions for Admin (full access)
INSERT INTO role_permissions (role_id, module_key, can_view, can_create, can_edit, can_delete, can_export)
SELECT r.id, m.module_key, true, true, true, true, true
FROM roles r
CROSS JOIN (VALUES
  ('dashboard'), ('marks_entry'), ('marks_database'), ('class_register'),
  ('statistics'), ('timetable'), ('report_cards'), ('assessments'),
  ('students'), ('finance'), ('staff'), ('settings'), ('notifications'),
  ('announcements'), ('system_logs'), ('backup'), ('analytics')
) AS m(module_key)
WHERE r.school_id = :school_id AND r.name = 'Admin';

-- Default role permissions for Accountant (finance only)
INSERT INTO role_permissions (role_id, module_key, can_view, can_create, can_edit, can_delete, can_export)
SELECT r.id, m.module_key, m.v, m.c, m.e, m.d, m.ex
FROM roles r
CROSS JOIN (VALUES
  ('dashboard',    true,  false, false, false, false),
  ('finance',      true,  true,  true,  false, true),
  ('students',     true,  false, false, false, false),
  ('notifications',true,  false, false, false, false),
  ('announcements',true,  false, false, false, false)
) AS m(module_key, v, c, e, d, ex)
WHERE r.school_id = :school_id AND r.name = 'Accountant';

-- Default role permissions for Teacher
INSERT INTO role_permissions (role_id, module_key, can_view, can_create, can_edit, can_delete, can_export)
SELECT r.id, m.module_key, m.v, m.c, m.e, m.d, m.ex
FROM roles r
CROSS JOIN (VALUES
  ('dashboard',      true,  false, false, false, false),
  ('marks_entry',    true,  true,  true,  false, true),
  ('marks_database', true,  false, false, false, true),
  ('class_register', true,  false, false, false, true),
  ('statistics',     true,  false, false, false, true),
  ('timetable',      true,  false, false, false, false),
  ('report_cards',   true,  false, false, false, true),
  ('assessments',    true,  true,  true,  false, false),
  ('students',       true,  false, false, false, false),
  ('notifications',  true,  false, false, false, false),
  ('announcements',  true,  false, false, false, false)
) AS m(module_key, v, c, e, d, ex)
WHERE r.school_id = :school_id AND r.name = 'Teacher';

-- Default nursery subjects
INSERT INTO subjects (school_id, name, level, mg_max, ex_max, is_post_mid_only, display_order) VALUES
  (:school_id, 'Pre-Calculé',                   'nursery', 50, 50, false, 1),
  (:school_id, 'Education Santé Environnement', 'nursery', 50, 50, false, 2),
  (:school_id, 'Français Écriture',             'nursery', 50, 50, false, 3),
  (:school_id, 'Français Lecture',              'nursery', 50, 50, false, 4),
  (:school_id, 'Anglais',                       'nursery', 50, 50, false, 5),
  (:school_id, 'Expression Orale',              'nursery', 50, 50, true,  6),
  (:school_id, 'Art Plastique',                 'nursery', 50, 50, false, 7),
  (:school_id, 'Développement Social',          'nursery', 50, 50, true,  8);

-- Default primary subjects
INSERT INTO subjects (school_id, name, level, mg_max, ex_max, is_post_mid_only, display_order) VALUES
  (:school_id, 'Mathematics',   'primary', 50, 50, false, 1),
  (:school_id, 'English',       'primary', 50, 50, false, 2),
  (:school_id, 'Kinyarwanda',   'primary', 50, 50, false, 3),
  (:school_id, 'French',        'primary', 50, 50, false, 4),
  (:school_id, 'SET',           'primary', 40, 40, false, 5),
  (:school_id, 'SRS',           'primary', 40, 40, false, 6),
  (:school_id, 'Reading',       'primary', 20, 20, true,  7),
  (:school_id, 'Creative Arts', 'primary', 20, 20, true,  8),
  (:school_id, 'Sports',        'primary', 10, 10, true,  9);

-- Default modules
INSERT INTO school_modules (school_id, module_key, is_enabled) VALUES
  (:school_id, 'academics',   true),
  (:school_id, 'finance',     true),
  (:school_id, 'students',    true),
  (:school_id, 'staff',       true),
  (:school_id, 'transport',   false),
  (:school_id, 'hostel',      false),
  (:school_id, 'library',     false),
  (:school_id, 'ai_comments', false);
