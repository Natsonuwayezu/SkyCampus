'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { formatDate } from '@/lib/utils/formatters'

export default function StudentAttendancePage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: stu } = await supabase
      .from('students')
      .select('id')
      .eq('school_id', user!.school_id)
      .ilike('admission_number', user!.username ?? '')
      .maybeSingle()

    if (stu) {
      const { data } = await supabase.from('attendance').select('*').eq('student_id', stu.id).order('date', { ascending: false }).limit(60)
      setRecords(data ?? [])
    }
    setLoading(false)
  }

  const present = records.filter(r => r.status === 'present').length
  const absent  = records.filter(r => r.status === 'absent').length
  const late    = records.filter(r => r.status === 'late').length
  const rate    = records.length > 0 ? Math.round((present / records.length) * 100) : 0

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">📋 My Attendance</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card"><span className="text-2xl">✅</span><p className="font-display font-bold text-xl mt-2">{rate}%</p><p className="text-xs text-slate-500">Attendance Rate</p></div>
        <div className="stat-card"><span className="text-2xl">🟢</span><p className="font-display font-bold text-xl mt-2">{present}</p><p className="text-xs text-slate-500">Present</p></div>
        <div className="stat-card"><span className="text-2xl">🔴</span><p className="font-display font-bold text-xl mt-2">{absent}</p><p className="text-xs text-slate-500">Absent</p></div>
        <div className="stat-card"><span className="text-2xl">🟡</span><p className="font-display font-bold text-xl mt-2">{late}</p><p className="text-xs text-slate-500">Late</p></div>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead><tr><th>Date</th><th>Status</th><th>Note</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-12 text-slate-400 text-sm">No attendance records yet.</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td><span className={r.status==='present'?'badge-green':r.status==='late'?'badge-amber':'badge-red'}>{r.status}</span></td>
                <td className="text-slate-400 text-sm">{r.note ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
