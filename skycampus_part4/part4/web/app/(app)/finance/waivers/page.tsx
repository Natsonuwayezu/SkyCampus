'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface Waiver {
  id: string; waiver_type: string; waived_amount: number|null; waived_percent: number|null
  reason: string|null; carry_to_next_year: boolean; created_at: string
  students: { first_name:string; last_name:string }
  fee_categories: { name:string }
  users: { full_name:string } | null
}

export default function WaiversPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [waivers, setWaivers]   = useState<Waiver[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [fees, setFees]         = useState<any[]>([])
  const [showModal, setShow]    = useState(false)
  const [delId, setDelId]       = useState<string|null>(null)
  const [saving, setSaving]     = useState(false)
  const [form, setForm] = useState({
    student_id:'', student_fee_id:'', waiver_type:'full',
    waived_amount:0, waived_percent:0, reason:'', carry_to_next_year:false,
  })
  const [studentFees, setStudentFees] = useState<any[]>([])

  useEffect(() => { load(); loadStudents() }, [])

  async function load() {
    const { data } = await supabase
      .from('fee_waivers')
      .select(`*, students(first_name, last_name), fee_categories(name), users(full_name)`)
      .eq('school_id', user!.school_id)
      .order('created_at', { ascending: false })
    setWaivers(data as any ?? [])
  }

  async function loadStudents() {
    const { data } = await supabase.from('students').select('id,first_name,last_name').eq('school_id', user!.school_id).eq('status','active').order('last_name')
    setStudents(data ?? [])
  }

  async function loadStudentFees(studentId: string) {
    const { data } = await supabase
      .from('student_fees')
      .select('id, amount, amount_paid, fee_categories(name)')
      .eq('student_id', studentId)
      .in('status', ['pending','partial'])
    setStudentFees(data as any ?? [])
  }

  async function save() {
    const sf = studentFees.find(f => f.id === form.student_fee_id)
    if (!sf) { toast.error('Select a fee category'); return }
    setSaving(true)

    const waivedAmt = form.waiver_type === 'full'
      ? sf.amount - sf.amount_paid
      : form.waiver_type === 'percentage'
      ? Math.round((sf.amount * form.waived_percent) / 100)
      : form.waived_amount

    const { error } = await supabase.from('fee_waivers').insert({
      school_id:          user!.school_id,
      student_id:         form.student_id,
      student_fee_id:     form.student_fee_id,
      fee_category_id:    sf.fee_categories?.id,
      waiver_type:        form.waiver_type,
      waived_amount:      waivedAmt,
      waived_percent:     form.waiver_type === 'percentage' ? form.waived_percent : null,
      reason:             form.reason || null,
      carry_to_next_year: form.carry_to_next_year,
      approved_by:        user!.id,
    })

    if (!error) {
      // Update student_fee amount_waived
      await supabase.from('student_fees').update({ amount_waived: (sf.amount_paid_waived ?? 0) + waivedAmt }).eq('id', form.student_fee_id)
    }

    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Waiver applied!')
    setShow(false)
    setForm({ student_id:'', student_fee_id:'', waiver_type:'full', waived_amount:0, waived_percent:0, reason:'', carry_to_next_year:false })
    load()
  }

  async function del() {
    if (!delId) return
    await supabase.from('fee_waivers').delete().eq('id', delId)
    toast.success('Waiver removed')
    setDelId(null); load()
  }

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="Fee Waivers" icon="🎁"
        actions={<button onClick={() => setShow(true)} className="btn-primary text-sm">➕ Add Waiver</button>}
      />

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr><th>#</th><th>Student</th><th>Fee Category</th><th>Waived</th><th>Type</th><th>Reason</th><th>Approved By</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {waivers.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No waivers yet.</td></tr>
            ) : waivers.map((w,i) => (
              <tr key={w.id}>
                <td className="text-slate-400 text-xs">{i+1}</td>
                <td className="font-medium">{w.students.last_name} {w.students.first_name}</td>
                <td className="text-sm text-slate-600 dark:text-slate-300">{w.fee_categories.name}</td>
                <td className="font-bold text-blue-600">{w.waived_amount ? formatRWF(w.waived_amount) : `${w.waived_percent}%`}</td>
                <td><span className="badge-blue capitalize">{w.waiver_type.replace('_',' ')}</span></td>
                <td className="text-sm text-slate-500 max-w-[160px] truncate">{w.reason ?? '—'}</td>
                <td className="text-sm text-slate-500">{w.users?.full_name ?? '—'}</td>
                <td><button onClick={() => setDelId(w.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShow(false)} title="Apply Fee Waiver"
        footer={
          <>
            <button onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">{saving?'Applying…':'✅ Apply Waiver'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-xs">Student *</label>
            <select className="input-base" value={form.student_id} onChange={e => {
              setForm(f=>({...f,student_id:e.target.value,student_fee_id:''}))
              if (e.target.value) loadStudentFees(e.target.value)
            }}>
              <option value="">— Select Student —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.last_name} {s.first_name}</option>)}
            </select>
          </div>
          {form.student_id && (
            <div>
              <label className="label-xs">Fee Category *</label>
              <select className="input-base" value={form.student_fee_id} onChange={e => setForm(f=>({...f,student_fee_id:e.target.value}))}>
                <option value="">— Select Fee —</option>
                {studentFees.map(f => <option key={f.id} value={f.id}>{(f.fee_categories as any)?.name} ({formatRWF(f.amount)})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="label-xs">Waiver Type</label>
            <select className="input-base" value={form.waiver_type} onChange={e => setForm(f=>({...f,waiver_type:e.target.value}))}>
              <option value="full">Full Waiver</option>
              <option value="partial">Partial Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          {form.waiver_type === 'partial' && (
            <div><label className="label-xs">Waived Amount (RWF)</label>
              <input type="number" min={0} className="input-base" value={form.waived_amount} onChange={e => setForm(f=>({...f,waived_amount:+e.target.value}))} />
            </div>
          )}
          {form.waiver_type === 'percentage' && (
            <div><label className="label-xs">Percentage (%)</label>
              <input type="number" min={0} max={100} className="input-base" value={form.waived_percent} onChange={e => setForm(f=>({...f,waived_percent:+e.target.value}))} />
            </div>
          )}
          <div>
            <label className="label-xs">Reason</label>
            <input className="input-base" placeholder="Sibling discount, scholarship, financial need…" value={form.reason} onChange={e => setForm(f=>({...f,reason:e.target.value}))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={form.carry_to_next_year} onChange={e => setForm(f=>({...f,carry_to_next_year:e.target.checked}))} className="rounded border-slate-300 text-brand-blue"/>
            Carry this waiver to next academic year
          </label>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Remove Waiver" message="Remove this waiver? The student's fee balance will be restored." confirmLabel="Remove" danger />
    </div>
  )
}
