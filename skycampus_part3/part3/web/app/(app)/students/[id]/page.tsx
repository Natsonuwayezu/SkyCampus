'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate, formatRWF, feeStatusColor } from '@/lib/utils/formatters'

type Tab = 'info' | 'fees' | 'academics' | 'family' | 'history'
const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'info',      label: 'Info',     icon: '📋' },
  { key: 'fees',      label: 'Fees',     icon: '💰' },
  { key: 'academics', label: 'Academics',icon: '📚' },
  { key: 'family',    label: 'Family',   icon: '👨‍👩‍👧' },
  { key: 'history',   label: 'History',  icon: '📜' },
]

export default function StudentDetailPage() {
  const { id }     = useParams<{ id: string }>()
  const params     = useSearchParams()
  const router     = useRouter()
  const { user }   = useAuthStore()
  const supabase   = createClient()

  const [tab, setTab]       = useState<Tab>((params.get('tab') as Tab) ?? 'info')
  const [student, setStudent] = useState<any>(null)
  const [fees, setFees]       = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [marks, setMarks]     = useState<any[]>([])
  const [parents, setParents] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [archiving, setArchiving] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  useEffect(() => { load() }, [id])

  async function load() {
    setLoading(true)
    const [stuRes, feeRes, payRes, parRes, histRes] = await Promise.all([
      supabase.from('students').select(`
        *, student_medical(*),
        student_class_history!inner(is_current, classes(name, level))
      `).eq('id', id).eq('student_class_history.is_current', true).single(),

      supabase.from('student_fees').select(`
        *, fee_categories(name, reset_cycle)
      `).eq('student_id', id).order('created_at', { ascending: false }),

      supabase.from('payments').select('*').eq('student_id', id).order('payment_date', { ascending: false }),

      supabase.from('student_parents').select(`
        is_primary, parents(*)
      `).eq('student_id', id),

      supabase.from('student_class_history').select(`
        *, classes(name), academic_years(name)
      `).eq('student_id', id).order('created_at', { ascending: false }),
    ])

    setStudent(stuRes.data)
    setFees(feeRes.data ?? [])
    setPayments(payRes.data ?? [])
    setParents(parRes.data ?? [])
    setHistory(histRes.data ?? [])
    setLoading(false)
  }

  async function archive() {
    setArchiving(true)
    await supabase.from('students').update({ status: 'archived', archived_at: new Date().toISOString() }).eq('id', id)
    setArchiving(false)
    toast.success('Student archived')
    router.push('/students')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
    </div>
  )

  if (!student) return <div className="text-center py-16 text-slate-400">Student not found.</div>

  const currentClass = student.student_class_history?.[0]?.classes
  const totalFees    = fees.reduce((s: number, f: any) => s + f.amount, 0)
  const totalPaid    = fees.reduce((s: number, f: any) => s + f.amount_paid, 0)
  const outstanding  = totalFees - totalPaid
  const pctPaid      = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <Link href="/students" className="text-sm text-slate-400 hover:text-brand-blue">← Students</Link>
      </div>

      {/* Student header card */}
      <div className="card p-5 flex items-start gap-5">
        <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
          {student.photo_url
            ? <img src={student.photo_url} alt="" className="w-full h-full object-cover"/>
            : student.gender === 'female' ? '👧' : '👦'
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                {student.last_name} {student.first_name}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="font-mono text-xs text-slate-400">{student.admission_number}</span>
                {currentClass && <span className="badge-blue">{currentClass.name}</span>}
                <span className={student.status === 'active' ? 'badge-green' : 'badge-gray'}>{student.status}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Enrolled: {formatDate(student.enrolled_at)}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/students/${id}?tab=edit`} className="btn-secondary text-sm">✏️ Edit</Link>
              {student.status === 'active' && (
                <button onClick={() => setShowArchive(true)} className="btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50">📦 Archive</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition ${
              tab === t.key ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-5 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-700 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Personal Details</h3>
            {[
              ['Date of Birth', student.date_of_birth ? formatDate(student.date_of_birth) : '—'],
              ['Gender', student.gender ?? '—'],
              ['Nationality', student.nationality],
              ['National ID', student.national_id ?? '—'],
              ['Blood Group', student.blood_group ?? '—'],
              ['Religion', student.religion ?? '—'],
              ['District', student.district ?? '—'],
              ['Village', student.village ?? '—'],
              ['Address', student.home_address ?? '—'],
              ['Previous School', student.previous_school ?? '—'],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-400">{k}</span>
                <span className="text-slate-700 dark:text-slate-200 text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>
          <div className="card p-5 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-700 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Medical</h3>
            {student.student_medical ? <>
              {[
                ['Allergies', student.student_medical.allergies ?? 'None'],
                ['Conditions', student.student_medical.conditions ?? 'None'],
                ['Doctor', student.student_medical.doctor_name ?? '—'],
                ['Doctor Phone', student.student_medical.doctor_phone ?? '—'],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-700 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </> : <p className="text-slate-400 text-sm">No medical info recorded.</p>}
          </div>
        </div>
      )}

      {/* ── FEES TAB ── */}
      {tab === 'fees' && (
        <div className="space-y-4">
          {/* Balance overview */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Fee Balance Overview</span>
              <span className={outstanding > 0 ? 'badge-red' : 'badge-green'}>
                {outstanding > 0 ? `${formatRWF(outstanding)} due` : 'Fully paid ✅'}
              </span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${pctPaid}%` }}/>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total: <strong>{formatRWF(totalFees)}</strong></span>
              <span className="text-green-600">Paid: <strong>{formatRWF(totalPaid)}</strong></span>
              <span className="text-red-500">Due: <strong>{formatRWF(outstanding)}</strong></span>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-sm text-slate-700 dark:text-white">Fee Breakdown</span>
              <Link href={`/finance/record-payment?student=${id}`} className="btn-primary text-xs">💸 Record Payment</Link>
            </div>
            <table className="table-base">
              <thead><tr><th>Category</th><th>Amount</th><th>Paid</th><th>Remaining</th><th>Status</th></tr></thead>
              <tbody>
                {fees.map((f: any) => (
                  <tr key={f.id}>
                    <td className="font-medium">{f.fee_categories?.name}</td>
                    <td>{formatRWF(f.amount)}</td>
                    <td className="text-green-600">{formatRWF(f.amount_paid)}</td>
                    <td className={f.amount - f.amount_paid > 0 ? 'text-red-500 font-medium' : 'text-slate-400'}>
                      {formatRWF(f.amount - f.amount_paid)}
                    </td>
                    <td><span className={`badge ${feeStatusColor(f.status)}`}>{f.status}</span></td>
                  </tr>
                ))}
                {fees.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No fees assigned.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* Payment history */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-white">
              Payment History
            </div>
            <table className="table-base">
              <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Receipt</th><th>By</th></tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id}>
                    <td>{formatDate(p.payment_date)}</td>
                    <td className="font-semibold text-green-600">{formatRWF(p.total_amount)}</td>
                    <td><span className="badge-gray capitalize">{p.payment_method.replace('_',' ')}</span></td>
                    <td className="font-mono text-xs text-slate-500">{p.receipt_number}</td>
                    <td className="text-slate-500 text-sm">{p.recorded_by ? 'Staff' : '—'}</td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No payments recorded.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACADEMICS TAB ── */}
      {tab === 'academics' && (
        <div className="card p-6 text-center text-slate-400 text-sm py-16">
          📊 Academic results will be available after marks are entered.<br/>
          <Link href="/academics/marks-entry" className="text-brand-blue hover:underline mt-2 inline-block">Go to Marks Entry →</Link>
        </div>
      )}

      {/* ── FAMILY TAB ── */}
      {tab === 'family' && (
        <div className="space-y-4">
          {parents.map((sp: any, i: number) => {
            const p = sp.parents
            return (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-slate-700 dark:text-white">
                    {p.last_name} {p.first_name}
                    <span className="ml-2 badge-gray capitalize text-[10px]">{p.relation}</span>
                    {sp.is_primary && <span className="ml-1 badge-blue text-[10px]">Primary</span>}
                  </h3>
                </div>
                {[['Phone', p.phone], ['Email', p.email ?? '—'], ['Address', p.address ?? '—']].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className="text-slate-700 dark:text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            )
          })}
          {parents.length === 0 && <div className="card p-8 text-center text-slate-400 text-sm">No parent/guardian linked.</div>}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Academic Year</th><th>Class</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {history.map((h: any) => (
                <tr key={h.id}>
                  <td>{h.academic_years?.name ?? '—'}</td>
                  <td>{h.classes?.name ?? '—'}</td>
                  <td>{h.is_current ? <span className="badge-blue">Current</span> : <span className="badge-gray">Past</span>}</td>
                  <td className="text-slate-400 text-xs">{formatDate(h.created_at)}</td>
                </tr>
              ))}
              {history.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No history found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={showArchive} onClose={() => setShowArchive(false)} onConfirm={archive}
        title="Archive Student" message={`Archive ${student.last_name} ${student.first_name}? They will lose active status but all data is preserved.`}
        confirmLabel="Archive" loading={archiving} danger />
    </div>
  )
}
