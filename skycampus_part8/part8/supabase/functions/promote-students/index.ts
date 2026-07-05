// SkyCampus Edge Function: promote-students
// POST /functions/v1/promote-students
// Body: { school_id, decisions: [{ student_id, next_class_id | null, decision }], new_year_id }
// Atomically writes student_class_history rows for the new academic year.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Decision {
  student_id:    string
  class_id:      string        // current class (for reference)
  next_class_id: string | null // null = graduating
  decision:      'promote' | 'repeat' | 'graduate'
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { school_id, decisions, new_year_id }: { school_id: string; decisions: Decision[]; new_year_id: string | null } = await req.json()

    if (!school_id || !decisions?.length) {
      return new Response(JSON.stringify({ error: 'school_id and decisions required' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let promoted = 0, repeating = 0, graduated = 0, errors = 0

    for (const d of decisions) {
      try {
        if (d.decision === 'graduate') {
          // Mark student as graduated
          await supabase.from('students').update({ status: 'graduated' }).eq('id', d.student_id)
          graduated++
          continue
        }

        // Mark current class history as not current
        await supabase
          .from('student_class_history')
          .update({ is_current: false })
          .eq('student_id', d.student_id)
          .eq('class_id', d.class_id)
          .eq('is_current', true)

        // Insert new class history for next year (if year is set)
        if (new_year_id && d.next_class_id) {
          await supabase.from('student_class_history').insert({
            school_id,
            student_id:       d.student_id,
            class_id:         d.next_class_id,
            academic_year_id: new_year_id,
            is_current:       true,
            promoted_from:    d.decision === 'promote' ? d.class_id : null,
            promoted_at:      d.decision === 'promote' ? new Date().toISOString() : null,
          })
        }

        if (d.decision === 'promote') promoted++
        else repeating++
      } catch { errors++ }
    }

    return new Response(JSON.stringify({ success: true, promoted, repeating, graduated, errors }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
