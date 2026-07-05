'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { computeClassRegister, type Phase } from '@/lib/academics/computeRegister'
import { formatRWF, formatDate, feeStatusColor, formatPercent } from '@/lib/utils/formatters'

type Tab = 'results' | 'fees' | 'attendance' | 'timetable'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday']

export default function ChildDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const supabase = createClient()

  const [tab, setTab]         = useState<Tab>('results')
  const [student, setStudent] = useState<any>(null)
  const [fees, setFees]       = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [register, setRegister] = useState<any>(null)
  const [attendance, setAttendance] = useState<any[]>([])
  const [timetable, setTimetable] = useState<any[]>([])
  const [termId, setTermId]   = useState('')
  const [phase, setPhase]     = useState<Phase>('post_mid')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [id])

  async function load() {
    setLoading(true)
    const { data: stu } = await supabase
      .from('students')
      .select(`*, student_class_history!inner(is_current, class_id, classes(id, name))`)
      .eq('id', id).eq('student_class_history.is_current', true).single()
    setStudent(stu)

    const { data: feeData } = await supabase.from('student_fees').select('*, fee_categories(name)').eq('student_id', id).order('created_at', { ascending: false })
    setFees(feeData ?? [])

    const { data: payData } = await supabase.from('payments').select('*').eq('student_id', id).order('payment_date', { ascending: false }).limit(10)
    setPayments(payData ?? [])

    const { data: term } = await supabase.from('terms').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    if (term) setTermId(term.id)

    const { data: attData } = await supabase.from('attendance').select('*').eq('student_id', id).order('date', { ascending: false }).limit(30)
    setAttendance(attData ?? [])

    if (stu) {
      const classId = (stu as any).student_class_history?.[0]?.class_id
      if (classId) {
        const { data: tt } = await supabase
          .from('timetable_slots')
          .select('day_of_week, start_time, end_time, subjects(name), users(full_name)')
          .eq('class_id', classId)
        setTimetable(tt ?? [])
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!termId || !student) return
    const classId = student.student_class_history?.[0]?.class_id
    if (!classId) return
    computeClassRegister(user!.school_id, classId, termId, phase).then(setRegister).catch(() => {})
  }, [termId, phase, student])

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/></div>
  if (!student) return <div className="text-center py-16 text-slate-400">Student not found.</div>

  const myResult = register?.students.find((s: any) => s.student_id === id)
  const totalFees = fees.reduce((s,f) => s + f.amount, 0)
  const totalPaid = fees.reduce((s,f) => s + f.amount_paid, 0)
  const outstanding = totalFees - totalPaid
  const presentDays = attendance.filter(a => a.status === 'present').length
  const attendanceRate = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'results',    label: 'Results',    icon: '📚' },
    { key: 'fees',       label: 'Fees',       icon: '💰' },
    { key: 'attendance', label: 'Attendance', icon: '📋' },
    { key: 'timetable',  label: 'Timetable',  icon: '📅' },
  ]

  return (
    <div className="space-y-5">
      <Link href="/parent/children" className="text-sm text-slate-400 hover:text-brand-blue">← My Children</Link>

      <div className="card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
          {student.photo_url ? <img src={student.photo_url} className="w-full h-full object-cover"/> : '👦'}
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">{student.last_name} {student.first_name}</h1>
          <span className="badge-blue">{student.student_class_history?.[0]?.classes?.name}</span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${tab===t.key?'border-brand-blue text-brand-blue':'border-transparent text-slate-500'}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* RESULTS */}
      {tab === 'results' && (
        <div className="space-y-4">
          <div className="flex gap-1">
            {(['pre_mid','post_mid'] as Phase[]).map(p => (
              <button key={p} onClick={() => setPhase(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${phase===p?'bg-brand-blue text-white':'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {p === 'pre_mid' ? 'Pre-Midterm' : 'Post-Midterm'}
              </button>
            ))}
          </div>
          {myResult ? (
            <>
              <div className="card overflow-hidden">
                <table className="table-base">
                  <thead><tr><th>Subject</th>{phase==='post_mid'&&<><th>MG</th><th>EX</th></>}<th>Total</th><th>%</th><th>Grade</th></tr></thead>
                  <tbody>
                    {myResult.subjects.map((s: any) => (
                      <tr key={s.subject_id}>
                        <td className="font-medium">{s.subject_name}</td>
                        {phase==='post_mid' && <><td>{s.mg}</td><td>{s.ex}</td></>}
                        <td className="font-semibold">{s.total}</td>
                        <td>{formatPercent(s.percent)}</td>
                        <td><span className="badge-blue">{s.grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card p-4 flex justify-between text-sm">
                <span>Rank: <strong>{myResult.rank} of {register.students.length}</strong></span>
                <span>Average: <strong>{formatPercent(myResult.percent)}</strong></span>
                <span>Grade: <strong>{myResult.grade}</strong></span>
              </div>
            </>
          ) : <div className="card p-8 text-center text-slate-400 text-sm">No results available yet for this term.</div>}
        </div>
      )}

      {/* FEES */}
      {tab === 'fees' && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500">Outstanding Balance</span>
              <span className={outstanding > 0 ? 'badge-red' : 'badge-green'}>{outstanding > 0 ? formatRWF(outstanding) : 'Fully Paid ✅'}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full" style={{width: totalFees>0?`${Math.round((totalPaid/totalFees)*100)}%`:'0%'}}/>
            </div>
          </div>
          <div className="card overflow-hidden">
            <table className="table-base">
              <thead><tr><th>Category</th><th>Amount</th><th>Paid</th><th>Status</th></tr></thead>
              <tbody>
                {fees.map((f:any) => (
                  <tr key={f.id}>
                    <td className="font-medium">{f.fee_categories?.name}</td>
                    <td>{formatRWF(f.amount)}</td>
                    <td className="text-green-600">{formatRWF(f.amount_paid)}</td>
                    <td><span className={`badge ${feeStatusColor(f.status)}`}>{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ATTENDANCE */}
      {tab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center"><p className="font-display font-bold text-2xl text-brand-blue">{attendanceRate}%</p><p className="text-xs text-slate-500">Attendance Rate</p></div>
            <div className="card p-4 text-center"><p className="font-display font-bold text-2xl text-slate-700 dark:text-white">{presentDays}/{attendance.length}</p><p className="text-xs text-slate-500">Days Present</p></div>
          </div>
          <div className="card overflow-hidden">
            <table className="table-base">
              <thead><tr><th>Date</th><th>Status</th><th>Note</th></tr></thead>
              <tbody>
                {attendance.map((a:any) => (
                  <tr key={a.id}>
                    <td>{formatDate(a.date)}</td>
                    <td><span className={a.status==='present'?'badge-green':a.status==='late'?'badge-amber':'badge-red'}>{a.status}</span></td>
                    <td className="text-slate-400 text-sm">{a.note ?? '—'}</td>
                  </tr>
                ))}
                {attendance.length === 0 && <tr><td colSpan={3} className="text-center py-8 text-slate-400 text-sm">No attendance records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TIMETABLE */}
      {tab === 'timetable' && (
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr></thead>
            <tbody>
              {timetable.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No timetable published yet.</td></tr>
              ) : timetable.sort((a:any,b:any)=>a.day_of_week-b.day_of_week || a.start_time.localeCompare(b.start_time)).map((t:any, i:number) => (
                <tr key={i}>
                  <td>{DAYS[t.day_of_week-1]}</td>
                  <td className="font-mono text-xs">{t.start_time}-{t.end_time}</td>
                  <td className="font-medium">{t.subjects?.name}</td>
                  <td className="text-slate-500">{t.users?.full_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
