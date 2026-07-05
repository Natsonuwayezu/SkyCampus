'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface FeeCategory {
  id: string; name: string; description: string | null
  amount: number; applies_to: string; reset_cycle: string
  due_date: string | null; is_active: boolean
  classes?: { name: string } | null
}

const CYCLES = ['monthly','termly','annual','one_time'] as const

export default function FeeStructurePage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [fees, setFees]       = useState<FeeCategory[]>([])
  const [classes, setClasses] = useState<{id:string;name:string}[]>([])
  const [yearId, setYearId]   = useState<string>('')
  const [showModal, setShow]  = useState(false)
  const [delId, setDelId]     = useState<string|null>(null)
  const [editItem, setEdit]   = useState<FeeCategory|null>(null)
  const [saving, setSaving]   = useState(false)
  const [form, setForm] = useState({
    name:'', description:'', amount:0,
    applies_to:'all', class_id:'', reset_cycle:'termly', due_date:'',
  })

  useEffect(() => { loadYear(); loadClasses() }, [])
  useEffect(() => { if (yearId) loadFees() }, [yearId])

  async function loadYear() {
    const { data } = await supabase.from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    if (data) setYearId(data.id)
  }
  async function loadClasses() {
    const { data } = await supabase.from('classes').select('id,name').eq('school_id', user!.school_id).order('display_order')
    setClasses(data ?? [])
  }
  async function loadFees() {
    const { data } = await supabase
      .from('fee_categories')
      .select('*, classes(name)')
      .eq('school_id', user!.school_id)
      .eq('academic_year_id', yearId)
      .order('created_at')
    setFees(data as any ?? [])
  }

  async function save() {
    setSaving(true)
    const payload = {
      ...form, school_id: user!.school_id, academic_year_id: yearId,
      amount: Number(form.amount),
      class_id: form.applies_to === 'class' ? form.class_id : null,
      due_date: form.due_date || null,
    }

    if (editItem) {
      const { error } = await supabase.from('fee_categories').update(payload).eq('id', editItem.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Fee category updated!')
    } else {
      const { data: newFee, error } = await supabase.from('fee_categories').insert(payload).select('id').single()
      if (error || !newFee) { toast.error(error?.message ?? 'Error'); setSaving(false); return }

      // Auto-apply to all active students
      const { data: students } = await supabase
        .from('students').select('id')
        .eq('school_id', user!.school_id).eq('status', 'active')

      if (students?.length) {
        const feeRows = students.map((s: any) => ({
          school_id:       user!.school_id,
          student_id:      s.id,
          fee_category_id: newFee.id,
          academic_year_id: yearId,
          amount:          Number(form.amount),
          status:          'pending',
          due_date:        form.due_date || null,
        }))
        // Insert in batches of 50
        for (let i = 0; i < feeRows.length; i += 50) {
          await supabase.from('student_fees').insert(feeRows.slice(i, i + 50))
        }
        toast.success(`Fee applied to ${students.length} students!`)
      }
    }

    setSaving(false)
    setShow(false)
    setEdit(null)
    resetForm()
    loadFees()
  }

  async function del() {
    if (!delId) return
    await supabase.from('fee_categories').update({ is_active: false }).eq('id', delId)
    toast.success('Fee category deactivated')
    setDelId(null)
    loadFees()
  }

  function openEdit(f: FeeCategory) {
    setEdit(f)
    setForm({
      name: f.name, description: f.description ?? '', amount: f.amount,
      applies_to: f.applies_to, class_id: '', reset_cycle: f.reset_cycle,
      due_date: f.due_date ?? '',
    })
    setShow(true)
  }

  function resetForm() {
    setForm({ name:'', description:'', amount:0, applies_to:'all', class_id:'', reset_cycle:'termly', due_date:'' })
  }

  const totalBilled = fees.reduce((s, f) => s + f.amount, 0)

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="Fee Structure" icon="🏷️"
        subtitle={`${fees.length} categories · Total: ${formatRWF(totalBilled)} per student`}
        actions={<button onClick={() => { setEdit(null); resetForm(); setShow(true) }} className="btn-primary text-sm">➕ Add Fee Category</button>}
      />

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
        ⚠️ Adding a new fee category automatically applies it to <strong>all active students</strong>. Students with credit balances will have them deducted first.
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>#</th><th>Category Name</th><th>Amount (RWF)</th>
              <th>Applies To</th><th>Reset Cycle</th><th>Due Date</th>
              <th>Status</th><th className="w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                No fee categories yet. Add one to get started.
              </td></tr>
            ) : fees.map((f, i) => (
              <tr key={f.id} className={!f.is_active ? 'opacity-50' : ''}>
                <td className="text-slate-400 text-xs">{i+1}</td>
                <td>
                  <p className="font-semibold text-slate-800 dark:text-white">{f.name}</p>
                  {f.description && <p className="text-xs text-slate-400">{f.description}</p>}
                </td>
                <td className="font-bold text-slate-800 dark:text-white">{formatRWF(f.amount)}</td>
                <td>
                  {f.applies_to === 'all'
                    ? <span className="badge-blue">All Students</span>
                    : f.applies_to === 'class'
                    ? <span className="badge-purple">{(f.classes as any)?.name ?? 'Class'}</span>
                    : <span className="badge-gray">Individual</span>
                  }
                </td>
                <td className="capitalize text-sm text-slate-500">{f.reset_cycle.replace('_',' ')}</td>
                <td className="text-sm text-slate-500">{f.due_date ? formatDate(f.due_date) : '—'}</td>
                <td>
                  <span className={f.is_active ? 'badge-green' : 'badge-gray'}>
                    {f.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(f)} className="text-brand-blue hover:underline text-xs">✏️ Edit</button>
                    {f.is_active && <button onClick={() => setDelId(f.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => { setShow(false); setEdit(null) }}
        title={editItem ? 'Edit Fee Category' : 'Add Fee Category'}
        footer={
          <>
            <button onClick={() => { setShow(false); setEdit(null) }} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? '⏳ Saving…' : editItem ? '💾 Update' : '✅ Save & Apply to All Students'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-xs">Category Name *</label>
            <input className="input-base" placeholder="School Fees" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
          </div>
          <div>
            <label className="label-xs">Description</label>
            <input className="input-base" placeholder="Tuition fees for the term" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
          </div>
          <div>
            <label className="label-xs">Amount (RWF) *</label>
            <input type="number" min={0} className="input-base" value={form.amount} onChange={e => setForm(f=>({...f,amount:+e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-xs">Applies To</label>
              <select className="input-base" value={form.applies_to} onChange={e => setForm(f=>({...f,applies_to:e.target.value}))}>
                <option value="all">All Students</option>
                <option value="class">Specific Class</option>
              </select>
            </div>
            {form.applies_to === 'class' && (
              <div>
                <label className="label-xs">Class</label>
                <select className="input-base" value={form.class_id} onChange={e => setForm(f=>({...f,class_id:e.target.value}))}>
                  <option value="">— Select Class —</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label-xs">Reset Cycle</label>
              <select className="input-base" value={form.reset_cycle} onChange={e => setForm(f=>({...f,reset_cycle:e.target.value}))}>
                <option value="monthly">Monthly</option>
                <option value="termly">Termly</option>
                <option value="annual">Annual</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
            <div>
              <label className="label-xs">Due Date (optional)</label>
              <input type="date" className="input-base" value={form.due_date} onChange={e => setForm(f=>({...f,due_date:e.target.value}))} />
            </div>
          </div>
          {!editItem && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-xs text-amber-700 dark:text-amber-300">
              ⚠️ This fee will be immediately applied to all active students.
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Deactivate Fee Category"
        message="This fee category will be deactivated. Existing student fee records are preserved."
        confirmLabel="Deactivate" danger />
    </div>
  )
}
