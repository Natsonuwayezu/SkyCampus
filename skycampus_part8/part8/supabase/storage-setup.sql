-- ============================================================
-- SKYCAMPUS — Supabase Storage Bucket Setup
-- Run this in the Supabase SQL editor AFTER migrations 001-004
-- ============================================================

-- ── 1. Create storage buckets ─────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- School logos — public read so they show on login page
  ('school-logos',       'school-logos',       true,  2097152,  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
  -- Student photos — authenticated read only
  ('student-photos',     'student-photos',     false, 2097152,  ARRAY['image/jpeg','image/png','image/webp']),
  -- Student documents — admin only
  ('student-documents',  'student-documents',  false, 10485760, ARRAY['application/pdf','image/jpeg','image/png']),
  -- Report card PDFs — authenticated read (admin, teacher, parent of student)
  ('report-cards',       'report-cards',       false, 10485760, ARRAY['application/pdf']),
  -- Backup exports
  ('backups',            'backups',            false, 104857600,ARRAY['application/json','application/gzip']),
  -- Temporary import uploads (auto-deleted)
  ('imports',            'imports',            false, 10485760, ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'])
ON CONFLICT (id) DO NOTHING;


-- ── 2. Storage RLS Policies ───────────────────────────────

-- school-logos: public read, authenticated admin write
CREATE POLICY "logos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'school-logos');

CREATE POLICY "logos_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'school-logos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );

CREATE POLICY "logos_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'school-logos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );


-- student-photos: same-school authenticated read, admin write
CREATE POLICY "photos_school_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );

CREATE POLICY "photos_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'student-photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );


-- student-documents: admin only
CREATE POLICY "docs_admin_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'student-documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
    AND auth.can('students', 'view')
  );

CREATE POLICY "docs_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'student-documents'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
    AND auth.can('students', 'edit')
  );


-- report-cards: school authenticated read
CREATE POLICY "reports_school_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'report-cards'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );

CREATE POLICY "reports_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'report-cards'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
    AND auth.can('report_cards', 'view')
  );


-- backups: admin only
CREATE POLICY "backups_admin_access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'backups'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
    AND auth.can('backup', 'view')
  );


-- imports: same-school admin write, auto-expire via lifecycle (set in dashboard)
CREATE POLICY "imports_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'imports'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );

CREATE POLICY "imports_admin_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'imports'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.school_id()::text
  );


-- ── 3. CORS configuration for Storage ────────────────────
-- Run this via Supabase CLI or set in dashboard:
-- supabase storage update-bucket school-logos --public --allowed-origins "https://skycampus.com,https://*.skycampus.com"
-- For all other buckets:
-- supabase storage update-bucket student-photos --allowed-origins "https://*.skycampus.com"
