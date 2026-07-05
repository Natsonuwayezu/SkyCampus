'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'

const DAYS = [
  { num: 1, label: 'Monday' }, { num: 2, label: 'Tuesday' }, { num: 3, label: 'Wednesday' },
  { num: 4, label: 'Thursday' }, { num: 5, label: 'Friday' },
]

export default function StudentTimetablePage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [slots, setSlots]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: stu } = await supabase
      .from('students')
      .select(`id, student_class_history!inner(is_current, class_id)`)
      .eq('school_id', user!.school_id)
      .eq('student_class_history.is_current', true)
      .ilike('admission_number', user!.username ?? '')
      .maybeSingle()

    if (stu) {
      const classId = (stu as any).student_class_history?.[0]?.class_id
      const { data } = await supabase
        .from('timetable_slots')
        .select('day_of_week, start_time, end_time, subjects(name), users(full_name)')
        .eq('class_id', classId)
        .order('start_time')
      setSlots(data ?? [])
    }
    setLoading(false)
  }

  function getSlot(day: number, time: string) {
    return slots.find(s => s.day_of_week === day && s.start_time === time)
  }

  const times = Array.from(new Set(slots.map(s => s.start_time))).sort()

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">📅 My Timetable</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"/></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="text-sm min-w-max w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">Time</th>
                  {DAYS.map(d => <th key={d.num} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 min-w-[120px]">{d.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {times.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No timetable published yet.</td></tr>
                ) : times.map(time => (
                  <tr key={time} className="border-b border-slate-50 dark:border-slate-700/50">
                    <td className="px-3 py-2 text-xs text-slate-500 font-mono">{time}</td>
                    {DAYS.map(d => {
                      const slot = getSlot(d.num, time)
                      return (
                        <td key={d.num} className="px-3 py-2 text-center">
                          {slot ? (
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-200 text-xs">{slot.subjects?.name}</p>
                              <p className="text-[10px] text-slate-400">{slot.users?.full_name}</p>
                            </div>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
