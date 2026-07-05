// SkyCampus Edge Function: seed-school
// POST /functions/v1/seed-school
// Body: { school_id: string }
// Inserts all default data for a newly created school atomically.
// Called by the registration wizard after creating the school record.

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

    // 1. Grading scale
    await supabase.from('grading_scales').insert([
      { school_id, grade:'A+', min_percent:90,   max_percent:100,  label:'Excellent',     display_order:1 },
      { school_id, grade:'A',  min_percent:80,   max_percent:89.99,label:'Very Good',     display_order:2 },
      { school_id, grade:'A-', min_percent:75,   max_percent:79.99,label:'Good',          display_order:3 },
      { school_id, grade:'B+', min_percent:70,   max_percent:74.99,label:'Above Average', display_order:4 },
      { school_id, grade:'B',  min_percent:65,   max_percent:69.99,label:'Average',       display_order:5 },
      { school_id, grade:'B-', min_percent:60,   max_percent:64.99,label:'Below Average', display_order:6 },
      { school_id, grade:'C',  min_percent:50,   max_percent:59.99,label:'Pass',          display_order:7 },
      { school_id, grade:'D',  min_percent:0,    max_percent:49.99,label:'Fail',          display_order:8 },
    ])

    // 2. Default roles
    await supabase.from('roles').insert([
      { school_id, name:'Admin',      is_system_role:true, color:'#1A8FE3' },
      { school_id, name:'Accountant', is_system_role:true, color:'#10B981' },
      { school_id, name:'Teacher',    is_system_role:true, color:'#8B5CF6' },
      { school_id, name:'Parent',     is_system_role:true, color:'#F59E0B' },
      { school_id, name:'Student',    is_system_role:true, color:'#06B6D4' },
    ])

    // 3. Role permissions (Admin gets all)
    const { data: adminRole } = await supabase.from('roles').select('id').eq('school_id', school_id).eq('name', 'Admin').single()
    if (adminRole) {
      const modules = [
        'dashboard','marks_entry','marks_database','class_register','statistics',
        'timetable','report_cards','assessments','students','finance','staff',
        'settings','notifications','announcements','system_logs','backup','analytics',
      ]
      await supabase.from('role_permissions').insert(
        modules.map(m => ({ role_id: adminRole.id, module_key: m, can_view:true, can_create:true, can_edit:true, can_delete:true, can_export:true }))
      )
    }

    // 4. School modules
    await supabase.from('school_modules').insert([
      { school_id, module_key:'academics',   is_enabled:true },
      { school_id, module_key:'finance',     is_enabled:true },
      { school_id, module_key:'students',    is_enabled:true },
      { school_id, module_key:'staff',       is_enabled:true },
      { school_id, module_key:'transport',   is_enabled:false },
      { school_id, module_key:'hostel',      is_enabled:false },
      { school_id, module_key:'library',     is_enabled:false },
      { school_id, module_key:'ai_comments', is_enabled:false },
    ])

    // 5. Nursery subjects
    await supabase.from('subjects').insert([
      { school_id, name:'Pre-Calculé',                   level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:1 },
      { school_id, name:'Education Santé Environnement', level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:2 },
      { school_id, name:'Français Écriture',             level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:3 },
      { school_id, name:'Français Lecture',              level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:4 },
      { school_id, name:'Anglais',                       level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:5 },
      { school_id, name:'Expression Orale',              level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:true,  display_order:6 },
      { school_id, name:'Art Plastique',                 level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:7 },
      { school_id, name:'Développement Social',          level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:true,  display_order:8 },
    ])

    // 6. Primary subjects
    await supabase.from('subjects').insert([
      { school_id, name:'Mathematics',   level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:1 },
      { school_id, name:'English',       level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:2 },
      { school_id, name:'Kinyarwanda',   level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:3 },
      { school_id, name:'French',        level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:4 },
      { school_id, name:'SET',           level:'primary', mg_max:40, ex_max:40, is_post_mid_only:false, display_order:5 },
      { school_id, name:'SRS',           level:'primary', mg_max:40, ex_max:40, is_post_mid_only:false, display_order:6 },
      { school_id, name:'Reading',       level:'primary', mg_max:20, ex_max:20, is_post_mid_only:true,  display_order:7 },
      { school_id, name:'Creative Arts', level:'primary', mg_max:20, ex_max:20, is_post_mid_only:true,  display_order:8 },
      { school_id, name:'Sports',        level:'primary', mg_max:10, ex_max:10, is_post_mid_only:true,  display_order:9 },
    ])

    return new Response(JSON.stringify({ success: true, school_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
