-- ============================================================
-- SKYCAMPUS — Migration 004: Functions & Triggers
-- ============================================================

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_student_fees_updated_at
  BEFORE UPDATE ON student_fees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STUDENT FEE STATUS AUTO-UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION update_fee_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_waived >= NEW.amount THEN
    NEW.status := 'waived';
  ELSIF NEW.amount_paid >= (NEW.amount - NEW.amount_waived) THEN
    NEW.status := 'paid';
  ELSIF NEW.amount_paid > 0 THEN
    NEW.status := 'partial';
  ELSE
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_student_fees_status
  BEFORE INSERT OR UPDATE ON student_fees
  FOR EACH ROW EXECUTE FUNCTION update_fee_status();

-- ============================================================
-- ADMISSION NUMBER AUTO-GENERATION
-- ============================================================
CREATE OR REPLACE FUNCTION generate_admission_number(p_school_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INTEGER;
  v_number TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO v_count
  FROM students
  WHERE school_id = p_school_id
    AND TO_CHAR(enrolled_at, 'YYYY') = v_year;
  v_number := 'SC-' || v_year || '-' || LPAD(v_count::TEXT, 3, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RECEIPT NUMBER AUTO-GENERATION
-- ============================================================
CREATE OR REPLACE FUNCTION generate_receipt_number(p_school_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INTEGER;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO v_count
  FROM payments
  WHERE school_id = p_school_id
    AND TO_CHAR(created_at, 'YYYY') = v_year;
  RETURN 'RCP-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- GET GRADE FROM PERCENTAGE
-- ============================================================
CREATE OR REPLACE FUNCTION get_grade(p_school_id UUID, p_percentage DECIMAL)
RETURNS TEXT AS $$
DECLARE
  v_grade TEXT;
BEGIN
  SELECT grade INTO v_grade
  FROM grading_scales
  WHERE school_id = p_school_id
    AND p_percentage >= min_percent
    AND p_percentage <= max_percent
  ORDER BY min_percent DESC
  LIMIT 1;
  RETURN COALESCE(v_grade, 'N/A');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- MARK GRADE AUTO-COMPUTE ON INSERT/UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION compute_mark_grade()
RETURNS TRIGGER AS $$
DECLARE
  v_max_marks INTEGER;
  v_percentage DECIMAL;
BEGIN
  SELECT max_marks INTO v_max_marks
  FROM assessments WHERE id = NEW.assessment_id;

  IF v_max_marks > 0 THEN
    v_percentage := (NEW.score / v_max_marks) * 100;
    NEW.grade := get_grade(NEW.school_id, v_percentage);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_marks_compute_grade
  BEFORE INSERT OR UPDATE ON marks
  FOR EACH ROW EXECUTE FUNCTION compute_mark_grade();

-- ============================================================
-- AUDIT LOG TRIGGER (marks + payments only for now)
-- ============================================================
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (school_id, user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    COALESCE(NEW.school_id, OLD.school_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_marks_audit
  AFTER INSERT OR UPDATE OR DELETE ON marks
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER trg_payments_audit
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ============================================================
-- ONLY ONE CURRENT ACADEMIC YEAR PER SCHOOL
-- ============================================================
CREATE OR REPLACE FUNCTION ensure_single_current_year()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE academic_years
    SET is_current = false
    WHERE school_id = NEW.school_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_current_year
  BEFORE INSERT OR UPDATE ON academic_years
  FOR EACH ROW EXECUTE FUNCTION ensure_single_current_year();

-- ONLY ONE CURRENT TERM PER SCHOOL
CREATE OR REPLACE FUNCTION ensure_single_current_term()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE terms
    SET is_current = false
    WHERE school_id = NEW.school_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_current_term
  BEFORE INSERT OR UPDATE ON terms
  FOR EACH ROW EXECUTE FUNCTION ensure_single_current_term();
