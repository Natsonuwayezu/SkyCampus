// SkyCampus Edge Function: create-backup
// POST /functions/v1/create-backup
// Body: { school_id: string }
// Exports all school data as compressed JSON to Supabase Storage

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { school_id } = await req.json()
    if (!school_id) return new Response(JSON.stringify({ error: 'school_id required' }), { status: 400 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Collect all data for this school
    const tables = [
      'academic_years', 'terms', 'holidays', 'classes', 'subjects',
      'teacher_subject_assignments', 'students', 'student_class_history',
      'parents', 'student_parents', 'siblings', 'student_medical',
      'grading_scales', 'assessments', 'marks', 'timetable_slots',
      'fee_categories', 'student_fees', 'payments', 'payment_allocations',
      'fee_waivers', 'credit_balances', 'announcements', 'users', 'roles',
      'role_permissions', 'school_modules',
    ]

    const backupData: Record<string, any[]> = { school_id, created_at: new Date().toISOString() }

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').eq('school_id', school_id)
      if (!error) backupData[table] = data ?? []
    }

    // Also include the school record itself
    const { data: school } = await supabase.from('schools').select('*').eq('id', school_id).single()
    backupData['school'] = school

    const json    = JSON.stringify(backupData)
    const encoder = new TextEncoder()
    const bytes   = encoder.encode(json)

    // Store in Supabase Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename  = `backup_${school_id}_${timestamp}.json`
    const path      = `${school_id}/backups/${filename}`

    const { error: uploadErr } = await supabase.storage
      .from('backups')
      .upload(path, bytes, { contentType: 'application/json', upsert: false })

    if (uploadErr) throw uploadErr

    const fileSizeMB = (bytes.length / 1024 / 1024).toFixed(2)

    // Log the backup
    await supabase.from('backup_logs').insert({
      school_id,
      file_name:    filename,
      file_size_mb: parseFloat(fileSizeMB),
      storage_path: path,
      type:         'manual',
      status:       'success',
    })

    return new Response(JSON.stringify({ success: true, file: filename, size_mb: fileSizeMB }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
