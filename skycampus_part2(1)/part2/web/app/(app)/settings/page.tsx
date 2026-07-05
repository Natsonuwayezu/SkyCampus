'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

const TABS = ['General','Academic','Branding'] as const
type Tab = typeof TABS[number]

export default function SchoolSettingsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('General')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:'', city:'', country:'Rwanda', phone:'', email:'', director_name:'', motto:'',
    has_nursery:true, has_primary:true, has_secondary:false,
    primary_color:'#1A8FE3', secondary_color:'#F5A623',
    promotion_min:50,
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('schools').select('*').eq('id', user!.school_id).single()
    if (data) setForm(f => ({ ...f, ...data }))
  }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('schools').update(form).eq('id', user!.school_id)
    setSaving(false)
    if (error) toast.error('Failed to save: ' + error.message)
    else toast.success('School settings saved!')
  }

  const F = (key: keyof typeof form) => ({
    value: form[key] as any,
    onChange: (e: any) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'number' ? +e.target.value : e.target.value }))
  })

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="School Settings" icon="🏫" />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab===t ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="card p-6 space-y-5">
        {tab === 'General' && <>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">School Name</label><input className="input-base" {...F('name')} /></div>
            <div><label className="label-xs">Director Name</label><input className="input-base" {...F('director_name')} /></div>
            <div><label className="label-xs">Country</label><input className="input-base" {...F('country')} /></div>
            <div><label className="label-xs">City / District</label><input className="input-base" {...F('city')} /></div>
            <div><label className="label-xs">Phone</label><input className="input-base" {...F('phone')} /></div>
            <div><label className="label-xs">Email</label><input className="input-base" type="email" {...F('email')} /></div>
          </div>
          <div><label className="label-xs">School Motto</label><input className="input-base" {...F('motto')} /></div>
          <div>
            <label className="label-xs">School Levels</label>
            <div className="flex gap-6 mt-2">
              {([['has_nursery','Nursery'],['has_primary','Primary'],['has_secondary','Secondary']] as const).map(([k,l]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" {...F(k)} className="rounded border-slate-300 text-brand-blue" />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </>}

        {tab === 'Academic' && <>
          <div>
            <label className="label-xs">Promotion Minimum (%)</label>
            <input type="number" min={0} max={100} className="input-base max-w-[120px]" {...F('promotion_min')} />
            <p className="text-xs text-slate-400 mt-1">Students must achieve this annual average to be promoted.</p>
          </div>
        </>}

        {tab === 'Branding' && <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-xs">Primary Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input type="color" {...F('primary_color')} className="w-10 h-10 rounded cursor-pointer border border-slate-200" />
                <input className="input-base" {...F('primary_color')} />
              </div>
            </div>
            <div>
              <label className="label-xs">Secondary Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input type="color" {...F('secondary_color')} className="w-10 h-10 rounded cursor-pointer border border-slate-200" />
                <input className="input-base" {...F('secondary_color')} />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 mb-3">Preview</p>
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{backgroundColor: form.primary_color}}>Primary Button</div>
              <div className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{backgroundColor: form.secondary_color}}>Secondary Button</div>
            </div>
          </div>
        </>}

        <div className="pt-2 flex justify-end">
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? '⏳ Saving…' : '💾 Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
