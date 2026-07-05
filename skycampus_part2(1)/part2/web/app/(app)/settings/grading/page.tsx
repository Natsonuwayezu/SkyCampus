'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

interface GradeRow { id?:string; grade:string; min_percent:number; max_percent:number; label:string; display_order:number }

const DEFAULTS: GradeRow[] = [
  { grade:'A+', min_percent:90,   max_percent:100,  label:'Excellent',     display_order:1 },
  { grade:'A',  min_percent:80,   max_percent:89.99, label:'Very Good',    display_order:2 },
  { grade:'A-', min_percent:75,   max_percent:79.99, label:'Good',         display_order:3 },
  { grade:'B+', min_percent:70,   max_percent:74.99, label:'Above Average',display_order:4 },
  { grade:'B',  min_percent:65,   max_percent:69.99, label:'Average',      display_order:5 },
  { grade:'B-', min_percent:60,   max_percent:64.99, label:'Below Average',display_order:6 },
  { grade:'C',  min_percent:50,   max_percent:59.99, label:'Pass',         display_order:7 },
  { grade:'D',  min_percent:0,    max_percent:49.99, label:'Fail',         display_order:8 },
]

export default function GradingScalePage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [rows, setRows] = useState<GradeRow[]>([])
  const [preview, setPreview] = useState(85)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('grading_scales').select('*').eq('school_id', user!.school_id).order('display_order')
    setRows(data?.length ? data : DEFAULTS)
  }

  async function save() {
    setSaving(true)
    for (const row of rows) {
      if (row.id) {
        await supabase.from('grading_scales').update({ grade:row.grade, min_percent:row.min_percent, max_percent:row.max_percent, label:row.label }).eq('id', row.id)
      } else {
        await supabase.from('grading_scales').insert({ ...row, school_id: user!.school_id })
      }
    }
    setSaving(false)
    toast.success('Grading scale saved!')
    load()
  }

  async function resetDefaults() {
    setSaving(true)
    await supabase.from('grading_scales').delete().eq('school_id', user!.school_id)
    await supabase.from('grading_scales').insert(DEFAULTS.map(d => ({ ...d, school_id: user!.school_id })))
    setSaving(false)
    toast.success('Reset to defaults!')
    load()
  }

  function update(i: number, field: keyof GradeRow, value: any) {
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  const previewGrade = rows.find(r => preview >= r.min_percent && preview <= r.max_percent)

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Grading Scale" icon="📊"
        actions={<>
          <button onClick={resetDefaults} disabled={saving} className="btn-secondary text-sm">🔄 Reset Defaults</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving?'Saving…':'💾 Save Changes'}</button>
        </>}
      />

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead><tr><th>Grade</th><th>Min %</th><th>Max %</th><th>Label</th></tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td><input className="input-base w-16 text-center font-bold" value={row.grade} onChange={e => update(i,'grade',e.target.value)} /></td>
                <td><input type="number" step="0.01" min={0} max={100} className="input-base w-24" value={row.min_percent} onChange={e => update(i,'min_percent',+e.target.value)} /></td>
                <td><input type="number" step="0.01" min={0} max={100} className="input-base w-24" value={row.max_percent} onChange={e => update(i,'max_percent',+e.target.value)} /></td>
                <td><input className="input-base" value={row.label} onChange={e => update(i,'label',e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live preview */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">Live Preview</h3>
        <div className="flex items-center gap-4">
          <div>
            <label className="label-xs">Score</label>
            <input type="number" min={0} max={100} value={preview} onChange={e => setPreview(+e.target.value)} className="input-base w-24" />
          </div>
          <div className="text-2xl">→</div>
          <div>
            {previewGrade
              ? <><span className="font-display font-bold text-3xl text-brand-blue">{previewGrade.grade}</span><span className="ml-3 text-slate-500">{previewGrade.label}</span></>
              : <span className="text-slate-400">No grade found</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
