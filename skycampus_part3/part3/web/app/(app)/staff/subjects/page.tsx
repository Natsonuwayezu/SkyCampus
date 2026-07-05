'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Subject {
  id: string; name: string; level: string; mg_max: number; ex_max: number
  is_post_mid_only: boolean; display_order: number; is_active: boolean
}

export default function SubjectsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tab, setTab]           = useState<'nursery'|'primary'>('nursery')
  const [showModal, setShow]    = useState(false)
  const [delId, setDelId]       = useState<string|null>(null)
  const [saving, setSaving]     = useState(false)
  const [editRow, setEditRow]   = useState<Subject|null>(null)
  const [form, setForm] = useState({
    name: '', level: 'nursery', mg_max: 50, ex_max: 50,
    is_post_mid_only: false, display_order: 0,
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('school_id', user!.school_id)
      .order('display_order')
    setSubjects(data ?? [])
  }

  async function save() {
    setSaving(true)
    if (editRow) {
      const { error } = await supabase.from('subjects').update({ ...form }).eq('id', editRow.id)
      if (error) toast.error(error.message)
      else toast.success('Subject updated!')
    } else {
      const { error } = await supabase.from('subjects').insert({ ...form, school_id: user!.school_id })
      if (error) toast.error(error.message)
      else toast.success('Subject created!')
    }
    setSaving(false)
    setShow(false)
    setEditRow(null)
    setForm({ name:'', level:'nursery', mg_max:50, ex_max:50, is_post_mid_only:false, display_order:0 })
    load()
  }

  async function del() {
    if (!delId) return
    await supabase.from('subjects').delete().eq('id', delId)
    toast.success('Subject deleted')
    setDelId(null)
    load()
  }

  async function moveOrder(id: string, direction: 'up'|'down') {
    const levelSubjects = subjects.filter(s => s.level === tab)
    const idx = levelSubjects.findIndex(s => s.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= levelSubjects.length) return
    const a = levelSubjects[idx]
    const b = levelSubjects[swapIdx]
    await supabase.from('subjects').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('subjects').update({ display_order: a.display_order }).eq('id', b.id)
    load()
  }

  function openEdit(s: Subject) {
    setEditRow(s)
    setForm({ name: s.name, level: s.level, mg_max: s.mg_max, ex_max: s.ex_max, is_post_mid_only: s.is_post_mid_only, display_order: s.display_order })
    setShow(true)
  }

  const nursery = subjects.filter(s => s.level === 'nursery')
  const primary = subjects.filter(s => s.level === 'primary')
  const displayed = tab === 'nursery' ? nursery : primary

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Subjects Management" icon="📖"
        actions={
          <button onClick={() => { setEditRow(null); setForm(f=>({...f, level:tab})); setShow(true) }}
            className="btn-primary text-sm">➕ Add Subject</button>
        }
      />

      {/* Level tabs */}
      <div className="flex gap-1">
        {(['nursery','primary'] as const).map(l => (
          <button key={l} onClick={() => setTab(l)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
              tab === l ? 'bg-brand-blue text-white' : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-100'
            }`}>
            {l === 'nursery' ? '🎒' : '📚'} {l} ({(l === 'nursery' ? nursery : primary).length})
          </button>
        ))}
      </div>

      {/* Subjects table */}
      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th className="w-16">Order</th>
              <th>Subject Name</th>
              <th className="text-center w-20">MG Max</th>
              <th className="text-center w-20">EX Max</th>
              <th className="text-center w-24">Total</th>
              <th className="text-center w-28">Post-Mid Only</th>
              <th className="w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                No {tab} subjects yet.
              </td></tr>
            ) : displayed.map((s, i) => (
              <tr key={s.id}>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => moveOrder(s.id, 'up')} disabled={i===0} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 text-xs">⬆️</button>
                    <button onClick={() => moveOrder(s.id, 'down')} disabled={i===displayed.length-1} className="text-slate-300 hover:text-slate-500 disabled:opacity-20 text-xs">⬇️</button>
                  </div>
                </td>
                <td className="font-medium">{s.name}</td>
                <td className="text-center text-slate-600 dark:text-slate-300">{s.mg_max}</td>
                <td className="text-center text-slate-600 dark:text-slate-300">{s.ex_max}</td>
                <td className="text-center font-semibold text-brand-blue">{s.mg_max + s.ex_max}</td>
                <td className="text-center">
                  {s.is_post_mid_only
                    ? <span className="badge-blue text-xs">✓ Yes</span>
                    : <span className="text-slate-300 text-xs">—</span>
                  }
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-brand-blue hover:underline text-xs">✏️ Edit</button>
                    <button onClick={() => setDelId(s.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400 px-1">
        💡 <strong>Post-Mid Only</strong>: Reading, Creative Arts, Sports. When checked, MG marks are automatically copied from EX marks at entry time.
      </div>

      {/* Add/Edit modal */}
      <Modal open={showModal} onClose={() => { setShow(false); setEditRow(null) }}
        title={editRow ? 'Edit Subject' : 'Add Subject'}
        footer={
          <>
            <button onClick={() => { setShow(false); setEditRow(null) }} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editRow ? '💾 Update Subject' : '✅ Add Subject'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-xs">Subject Name *</label>
            <input className="input-base" placeholder="Mathematics" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label className="label-xs">Level</label>
            <select className="input-base" value={form.level} onChange={e => setForm(f=>({...f,level:e.target.value}))}>
              <option value="nursery">🎒 Nursery</option>
              <option value="primary">📚 Primary</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label-xs">MG Max Marks</label>
              <input type="number" min={0} max={200} className="input-base" value={form.mg_max} onChange={e => setForm(f=>({...f,mg_max:+e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">EX Max Marks</label>
              <input type="number" min={0} max={200} className="input-base" value={form.ex_max} onChange={e => setForm(f=>({...f,ex_max:+e.target.value}))} />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <p className="text-xs text-slate-400 mb-1">Total</p>
              <p className="font-bold text-xl text-brand-blue">{form.mg_max + form.ex_max}</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_post_mid_only} onChange={e => setForm(f=>({...f,is_post_mid_only:e.target.checked}))}
              className="rounded border-slate-300 text-brand-blue"/>
            <span className="text-sm text-slate-700 dark:text-slate-200">Post-Midterm Only (MG = copy of EX at entry)</span>
          </label>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Delete Subject" message="Delete this subject? All marks associated with it will also be deleted."
        confirmLabel="Delete Subject" danger />
    </div>
  )
}
