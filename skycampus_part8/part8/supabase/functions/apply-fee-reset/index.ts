// SkyCampus Edge Function: apply-fee-reset
// POST /functions/v1/apply-fee-reset
// Body: { school_id: string, trigger: 'monthly' | 'termly' | 'annual' }
// Creates new student_fee rows for all active students when a cycle resets.
// Intended to be called by a cron job (Supabase cron or external scheduler).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { school_id, trigger } = await req.json()
    if (!school_id || !trigger) {
      return new Response(JSON.stringify({ error: 'school_id and trigger required' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get current year and term
    const { data: year }  = await supabase.from('academic_years').select('id').eq('school_id', school_id).eq('is_current', true).single()
    const { data: term }  = await supabase.from('terms').select('id').eq('school_id', school_id).eq('is_current', true).single()

    // Get fee categories matching this reset cycle
    const { data: categories } = await supabase
      .from('fee_categories')
      .select('*')
      .eq('school_id', school_id)
      .eq('reset_cycle', trigger)
      .eq('is_active', true)

    if (!categories?.length) {
      return new Response(JSON.stringify({ success: true, inserted: 0, message: 'No matching fee categories' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get all active students
    const { data: students } = await supabase
      .from('students')
      .select('id')
      .eq('school_id', school_id)
      .eq('status', 'active')

    if (!students?.length) {
      return new Response(JSON.stringify({ success: true, inserted: 0, message: 'No active students' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let totalInserted = 0

    for (const cat of categories) {
      // Check which students already have this fee for this cycle
      const { data: existing } = await supabase
        .from('student_fees')
        .select('student_id')
        .eq('fee_category_id', cat.id)
        .eq('academic_year_id', year?.id)
        .eq('term_id', trigger === 'termly' ? term?.id : null)

      const existingIds = new Set((existing ?? []).map((e: any) => e.student_id))
      const newStudents = students.filter((s: any) => !existingIds.has(s.id))

      if (!newStudents.length) continue

      // Insert in batches of 50
      for (let i = 0; i < newStudents.length; i += 50) {
        const batch = newStudents.slice(i, i + 50)
        const { error } = await supabase.from('student_fees').insert(
          batch.map((s: any) => ({
            school_id,
            student_id:       s.id,
            fee_category_id:  cat.id,
            academic_year_id: year?.id,
            term_id:          trigger === 'termly' ? term?.id : null,
            amount:           cat.amount,
            status:           'pending',
            due_date:         cat.due_date,
          }))
        )
        if (!error) totalInserted += batch.length
      }
    }

    return new Response(JSON.stringify({ success: true, inserted: totalInserted, trigger }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
