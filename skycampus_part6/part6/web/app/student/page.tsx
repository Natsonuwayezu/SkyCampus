'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { computeClassRegister } from '@/lib/academics/computeRegister'
import { formatPercent } from '@/lib/utils/formatters'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday']

export default function StudentDashboard() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [student, setStudent]   = useState<any>(null)
  const [todaySlots, setSlots]  = useState<any[]>([])
  const [myResult, setResult]   = useState<any>(null)
  const [recentMarks, setRecentMarks] = useState<any[]>([])
  const [attendanceRate, setRate] = useState(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    // Find student record linked to this user (via email match or direct link — assumes students table has matching record)
    const { data: stu } = await supabase
      .from('students')
      .select(`id, first_name, last_name, student_class_history!inner(is_current, class_id, classes(name))`)
      .eq('school_id', user!.school_id)
      .eq('student_class_history.is_current', true)
      .ilike('admission_number', user!.username ?? '')
      .maybeSingle()

    if (!stu) { setLoading(false); return }
    setStudent(stu)

    const classId = (stu as any).student_class_history?.[0]?.class_id
    const todayDow = new Date().getDay() // 0=Sun

    if (classId) {
      const { data: tt } = await supabase
        .from('timetable_slots')
        .select('day_of_week, start_time, end_time, subjects(name), users(full_name)')
        .eq('class_id', classId)
        .eq('day_of_week', todayDow)
        .order('start_time')
      setSlots(tt ?? [])

      const { data: term } = await supabase.from('terms').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
      if (term) {
        const reg = await computeClassRegister(user!.school_id, classId, term.id, 'post_mid')
        const mine = reg.students.find(s => s.student_id === stu.id)
        setResult(mine ?? null)
      }
    }

    const { data: marks } = await supabase
      .from('marks')
      .select('score, assessments(name, max_marks, subjects(name))')
      .eq('student_id', stu.id)
      .order('entered_at', { ascending: false })
      .limit(5)
    setRecentMarks(marks ?? [])

    const { data: att } = await supabase.from('attendance').select('status').eq('student_id', stu.id).limit(30)
    if (att?.length) setRate(Math.round((att.filter(a=>a.status==='present').length / att.length) * 100))

    setLoading(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"/></div>
  if (!student) return <div className="card p-8 text-center text-slate-400 text-sm">Student record not linked to this account. Contact your administrator.</div>

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">
        Hello, {student.first_name}! 👋
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card"><span className="text-2xl">📊</span><p className="font-display font-bold text-xl mt-2">{myResult ? formatPercent(myResult.percent) : '—'}</p><p className="text-xs text-slate-500">Term Average</p></div>
        <div className="stat-card"><span className="text-2xl">🏆</span><p className="font-display font-bold text-xl mt-2">{myResult ? `${myResult.rank}` : '—'}</p><p className="text-xs text-slate-500">Class Rank</p></div>
        <div className="stat-card"><span className="text-2xl">✅</span><p className="font-display font-bold text-xl mt-2">{attendanceRate}%</p><p className="text-xs text-slate-500">Attendance</p></div>
        <div className="stat-card"><span className="text-2xl">📝</span><p className="font-display font-bold text-xl mt-2">{recentMarks.length}</p><p className="text-xs text-slate-500">Recent Marks</p></div>
      </div>

      {/* Today's schedule */}
      <div>
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">📅 Today's Schedule</h2>
        <div className="card divide-y divide-slate-50 dark:divide-slate-700">
          {todaySlots.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">No classes scheduled today.</p>
          ) : todaySlots.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400 w-20">{s.start_time}</span>
                <span className="font-medium text-slate-800 dark:text-white">{s.subjects?.name}</span>
              </div>
              <span className="text-sm text-slate-400">{s.users?.full_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent results */}
      <div>
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">📝 Recent Results</h2>
        <div className="card divide-y divide-slate-50 dark:divide-slate-700">
          {recentMarks.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">No marks recorded yet.</p>
          ) : recentMarks.map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-slate-700 dark:text-slate-200">{m.assessments?.subjects?.name}: {m.assessments?.name}</span>
              <span className="font-semibold text-brand-blue">{m.score} / {m.assessments?.max_marks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
