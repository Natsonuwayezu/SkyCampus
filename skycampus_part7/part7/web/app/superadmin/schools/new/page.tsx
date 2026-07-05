'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/shared/Toast'

export default function AddSchoolPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [slugStatus, setSlugStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle')
  const [form, setForm] = useState({
    name:'', slug:'', country:'Rwanda', city:'', phone:'', email:'',
    has_nursery:true, has_primary:true, has_secondary:false, plan:'starter',
  })

  async function checkSlug(slug: string) {
    if (!slug) { setSlugStatus('idle'); return }
    setSlugStatus('checking')
    const { data } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle()
    setSlugStatus(data ? 'taken' : 'available')
  }

  async function create() {
    if (!form.name || !form.slug) { toast.error('Name and slug are required'); return }
    if (slugStatus === 'taken') { toast.error('Slug already taken'); return }
    setSaving(true)

    const { data: school, error } = await supabase.from('schools').insert({
      ...form, status: 'trial',
    }).select('id').single()

    if (error || !school) { toast.error(error?.message ?? 'Failed to create school'); setSaving(false); return }

    // Seed defaults: grading scale, roles, subjects, modules
    await supabase.from('grading_scales').insert([
      { school_id: school.id, grade:'A+', min_percent:90, max_percent:100, label:'Excellent', display_order:1 },
      { school_id: school.id, grade:'A',  min_percent:80, max_percent:89.99, label:'Very Good', display_order:2 },
      { school_id: school.id, grade:'A-', min_percent:75, max_percent:79.99, label:'Good', display_order:3 },
      { school_id: school.id, grade:'B+', min_percent:70, max_percent:74.99, label:'Above Average', display_order:4 },
      { school_id: school.id, grade:'B',  min_percent:65, max_percent:69.99, label:'Average', display_order:5 },
      { school_id: school.id, grade:'B-', min_percent:60, max_percent:64.99, label:'Below Average', display_order:6 },
      { school_id: school.id, grade:'C',  min_percent:50, max_percent:59.99, label:'Pass', display_order:7 },
      { school_id: school.id, grade:'D',  min_percent:0,  max_percent:49.99, label:'Fail', display_order:8 },
    ])
    await supabase.from('roles').insert([
      { school_id: school.id, name:'Admin', is_system_role:true, color:'#1A8FE3' },
      { school_id: school.id, name:'Accountant', is_system_role:true, color:'#10B981' },
      { school_id: school.id, name:'Teacher', is_system_role:true, color:'#8B5CF6' },
    ])
    await supabase.from('school_modules').insert([
      { school_id: school.id, module_key:'academics', is_enabled:true },
      { school_id: school.id, module_key:'finance', is_enabled:true },
      { school_id: school.id, module_key:'students', is_enabled:true },
      { school_id: school.id, module_key:'staff', is_enabled:true },
      { school_id: school.id, module_key:'transport', is_enabled:false },
      { school_id: school.id, module_key:'hostel', is_enabled:false },
      { school_id: school.id, module_key:'library', is_enabled:false },
      { school_id: school.id, module_key:'ai_comments', is_enabled:false },
    ])

    setSaving(false)
    toast.success('School created!')
    router.push(`/superadmin/schools/${school.id}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display font-bold text-xl text-white">➕ Add New School</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">School Name *</label>
            <input className="input-base bg-white/5 border-white/10 text-white" value={form.name} onChange={e => {
              const name = e.target.value
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,20)
              setForm(f=>({...f,name,slug}))
              checkSlug(slug)
            }} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Subdomain Slug *</label>
            <div className="flex items-center gap-2">
              <input className="input-base bg-white/5 border-white/10 text-white" value={form.slug} onChange={e => {
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]/g,'')
                setForm(f=>({...f,slug}))
                checkSlug(slug)
              }} />
              <span className="text-slate-400 text-sm">.skycampus.com</span>
            </div>
            {slugStatus === 'checking' && <p className="text-xs text-slate-400 mt-1">Checking…</p>}
            {slugStatus === 'available' && <p className="text-xs text-green-400 mt-1">✅ Available</p>}
            {slugStatus === 'taken' && <p className="text-xs text-red-400 mt-1">❌ Already taken</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Country</label>
            <input className="input-base bg-white/5 border-white/10 text-white" value={form.country} onChange={e => setForm(f=>({...f,country:e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">City</label>
            <input className="input-base bg-white/5 border-white/10 text-white" value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Phone</label>
            <input className="input-base bg-white/5 border-white/10 text-white" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
            <input type="email" className="input-base bg-white/5 border-white/10 text-white" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">School Levels</label>
          <div className="flex gap-6">
            {([['has_nursery','Nursery'],['has_primary','Primary'],['has_secondary','Secondary']] as const).map(([k,l]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                <input type="checkbox" checked={form[k]} onChange={e => setForm(f=>({...f,[k]:e.target.checked}))} className="rounded border-slate-300 text-brand-blue"/>
                {l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Plan</label>
          <select className="input-base bg-white/5 border-white/10 text-white" value={form.plan} onChange={e => setForm(f=>({...f,plan:e.target.value}))}>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <button onClick={create} disabled={saving || slugStatus==='taken'} className="btn-primary w-full justify-center py-3">
          {saving ? '⏳ Creating…' : '🎉 Create School'}
        </button>
      </div>
    </div>
  )
}
