'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/shared/Toast'

type Step = 1 | 2 | 3

const PLANS = [
  { id: 'starter', name: 'Starter', desc: 'Up to 200 students', price: 'Contact us', highlight: false },
  { id: 'professional', name: 'Professional ⭐', desc: 'Up to 500 students', price: 'Contact us', highlight: true },
  { id: 'enterprise', name: 'Enterprise', desc: 'Unlimited students', price: 'Contact us', highlight: false },
]

export default function RegisterSchoolPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [step, setStep]           = useState<Step>(1)
  const [saving, setSaving]       = useState(false)
  const [slugStatus, setSlugStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle')
  const [selectedPlan, setPlan]   = useState('professional')

  const [schoolForm, setSchool] = useState({
    name: '', slug: '', country: 'Rwanda', city: '', phone: '', email: '',
    has_nursery: true, has_primary: true, has_secondary: false,
  })
  const [adminForm, setAdmin] = useState({
    full_name: '', email: '', password: '', confirm: '',
  })

  let debounceTimer: any
  function handleSlugInput(slug: string) {
    const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '')
    setSchool(s => ({ ...s, slug: clean }))
    setSlugStatus('checking')
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
      if (!clean) { setSlugStatus('idle'); return }
      const { data } = await supabase.from('schools').select('id').eq('slug', clean).maybeSingle()
      setSlugStatus(data ? 'taken' : 'available')
    }, 500)
  }

  async function launch() {
    if (!adminForm.email || !adminForm.password || !adminForm.full_name) {
      toast.error('All admin fields are required'); return
    }
    if (adminForm.password !== adminForm.confirm) {
      toast.error('Passwords do not match'); return
    }
    if (adminForm.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return
    }
    if (slugStatus !== 'available') {
      toast.error('Please go back and check your school slug'); return
    }

    setSaving(true)
    try {
      // 1. Create school
      const { data: school, error: schErr } = await supabase.from('schools').insert({
        ...schoolForm,
        plan: selectedPlan,
        status: 'trial',
      }).select('id').single()
      if (schErr || !school) throw schErr ?? new Error('Failed to create school')

      // 2. Create admin auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: adminForm.email,
        password: adminForm.password,
      })
      if (authErr || !authData.user) throw authErr ?? new Error('Failed to create account')

      // 3. Create Admin role
      const { data: role } = await supabase.from('roles').insert({
        school_id: school.id, name: 'Admin', is_system_role: true, color: '#1A8FE3',
      }).select('id').single()

      // 4. Create admin user profile
      await supabase.from('users').insert({
        id: authData.user.id,
        school_id: school.id,
        role_id: role?.id,
        full_name: adminForm.full_name,
        is_active: true,
      })

      // 5. Seed defaults
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
        { school_id: school.id, name:'Accountant', is_system_role:true, color:'#10B981' },
        { school_id: school.id, name:'Teacher', is_system_role:true, color:'#8B5CF6' },
        { school_id: school.id, name:'Parent', is_system_role:true, color:'#F59E0B' },
        { school_id: school.id, name:'Student', is_system_role:true, color:'#06B6D4' },
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
      await supabase.from('subjects').insert([
        { school_id: school.id, name:'Pre-Calculé', level:'nursery', mg_max:50, ex_max:50, display_order:1 },
        { school_id: school.id, name:'Education Santé Environnement', level:'nursery', mg_max:50, ex_max:50, display_order:2 },
        { school_id: school.id, name:'Français Écriture', level:'nursery', mg_max:50, ex_max:50, display_order:3 },
        { school_id: school.id, name:'Français Lecture', level:'nursery', mg_max:50, ex_max:50, display_order:4 },
        { school_id: school.id, name:'Anglais', level:'nursery', mg_max:50, ex_max:50, display_order:5 },
        { school_id: school.id, name:'Art Plastique', level:'nursery', mg_max:50, ex_max:50, display_order:6 },
        { school_id: school.id, name:'Mathematics', level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:1 },
        { school_id: school.id, name:'English', level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:2 },
        { school_id: school.id, name:'Kinyarwanda', level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:3 },
        { school_id: school.id, name:'French', level:'primary', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:4 },
        { school_id: school.id, name:'SET', level:'primary', mg_max:40, ex_max:40, is_post_mid_only:false, display_order:5 },
        { school_id: school.id, name:'SRS', level:'primary', mg_max:40, ex_max:40, is_post_mid_only:false, display_order:6 },
        { school_id: school.id, name:'Reading', level:'primary', mg_max:20, ex_max:20, is_post_mid_only:true, display_order:7 },
        { school_id: school.id, name:'Creative Arts', level:'primary', mg_max:20, ex_max:20, is_post_mid_only:true, display_order:8 },
        { school_id: school.id, name:'Sports', level:'primary', mg_max:10, ex_max:10, is_post_mid_only:true, display_order:9 },
      ])

      toast.success('🎉 School registered! Redirecting to your admin panel…')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (e: any) {
      toast.error(e.message ?? 'Registration failed')
    } finally {
      setSaving(false)
    }
  }

  const STEP_LABELS = ['School Information', 'Admin Account', 'Choose Plan']

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-blue mx-auto mb-3 flex items-center justify-center font-display font-bold text-white">SC</div>
        <h1 className="font-display font-bold text-2xl text-white">Register Your School</h1>
        <p className="text-slate-400 text-sm mt-1">Get started with SkyCampus in minutes</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as Step
          return (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > n ? 'bg-green-500 text-white' : step === n ? 'bg-brand-blue text-white' : 'bg-white/10 text-slate-400'}`}>
                {step > n ? '✓' : n}
              </div>
              <span className={`text-xs hidden sm:block ${step === n ? 'text-white font-semibold' : 'text-slate-400'}`}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-white/10 mx-1"/>}
            </div>
          )
        })}
      </div>

      <div className="w-full max-w-lg">
        {/* STEP 1 — School Info */}
        {step === 1 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="font-display font-bold text-white">School Information</h2>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">School Name *</label>
              <input className="input-base bg-white/5 border-white/10 text-white" value={schoolForm.name}
                onChange={e => { setSchool(s=>({...s,name:e.target.value})); handleSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,20)) }} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Subdomain *</label>
              <div className="flex items-center gap-2">
                <input className="input-base bg-white/5 border-white/10 text-white flex-1" value={schoolForm.slug}
                  onChange={e => handleSlugInput(e.target.value)} />
                <span className="text-slate-500 text-sm whitespace-nowrap">.skycampus.com</span>
              </div>
              {slugStatus === 'checking' && <p className="text-xs text-slate-500 mt-1">Checking availability…</p>}
              {slugStatus === 'available' && <p className="text-xs text-green-400 mt-1">✅ Available!</p>}
              {slugStatus === 'taken' && <p className="text-xs text-red-400 mt-1">❌ Already taken — try another</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Country</label>
                <input className="input-base bg-white/5 border-white/10 text-white" value={schoolForm.country} onChange={e => setSchool(s=>({...s,country:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">City</label>
                <input className="input-base bg-white/5 border-white/10 text-white" value={schoolForm.city} onChange={e => setSchool(s=>({...s,city:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                <input className="input-base bg-white/5 border-white/10 text-white" value={schoolForm.phone} onChange={e => setSchool(s=>({...s,phone:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
                <input type="email" className="input-base bg-white/5 border-white/10 text-white" value={schoolForm.email} onChange={e => setSchool(s=>({...s,email:e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">School Levels</label>
              <div className="flex gap-5">
                {([['has_nursery','Nursery'],['has_primary','Primary'],['has_secondary','Secondary']] as const).map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                    <input type="checkbox" checked={schoolForm[k]} onChange={e => setSchool(s=>({...s,[k]:e.target.checked}))} className="rounded border-slate-500 text-brand-blue"/>
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!schoolForm.name || !schoolForm.slug || slugStatus !== 'available'} className="btn-primary w-full justify-center py-3 disabled:opacity-40">
              Next: Admin Account →
            </button>
          </div>
        )}

        {/* STEP 2 — Admin Account */}
        {step === 2 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <h2 className="font-display font-bold text-white">Admin Account</h2>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name *</label>
              <input className="input-base bg-white/5 border-white/10 text-white" value={adminForm.full_name} onChange={e => setAdmin(a=>({...a,full_name:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Email *</label>
              <input type="email" className="input-base bg-white/5 border-white/10 text-white" value={adminForm.email} onChange={e => setAdmin(a=>({...a,email:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Password *</label>
              <input type="password" className="input-base bg-white/5 border-white/10 text-white" value={adminForm.password} onChange={e => setAdmin(a=>({...a,password:e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Confirm Password *</label>
              <input type="password" className="input-base bg-white/5 border-white/10 text-white" value={adminForm.confirm} onChange={e => setAdmin(a=>({...a,confirm:e.target.value}))} />
              {adminForm.confirm && adminForm.password !== adminForm.confirm && <p className="text-xs text-red-400 mt-1">Passwords do not match</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
              <button onClick={() => setStep(3)} disabled={!adminForm.full_name || !adminForm.email || !adminForm.password || adminForm.password !== adminForm.confirm}
                className="btn-primary flex-1 justify-center disabled:opacity-40">Next: Choose Plan →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Choose Plan */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-white text-center">Choose a Plan</h2>
            <div className="grid grid-cols-1 gap-3">
              {PLANS.map(p => (
                <button key={p.id} onClick={() => setPlan(p.id)}
                  className={`p-4 rounded-xl border text-left transition ${selectedPlan===p.id ? 'border-brand-blue bg-brand-blue/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-white">{p.name}</p>
                      <p className="text-sm text-slate-400">{p.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{p.price}</p>
                      {selectedPlan === p.id && <span className="text-brand-blue text-xs">✓ Selected</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">← Back</button>
              <button onClick={launch} disabled={saving} className="btn-primary flex-1 justify-center py-3">
                {saving ? '⏳ Launching…' : '🎉 Launch My School'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
