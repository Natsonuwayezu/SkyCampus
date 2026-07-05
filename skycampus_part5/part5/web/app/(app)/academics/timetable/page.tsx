'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

const DAYS = [
  { num: 1, label: 'Monday' }, { num: 2, label: 'Tuesday' }, { num: 3, label: 'Wednesday' },
  { num: 4, label: 'Thursday' }, { num: 5, label: 'Friday' },
]

interface Slot { id?:string; day_of_week:number; start_time:string; end_time:string; subject_id:string|null; teacher_id:string|null; is_break:boolean }

export default function TimetablePage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses]   = useState<any[]>([])
  const [classId, setClassId]   = useState('')
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [termId, setTermId]     = useState('')
  const [slots, setSlots]       = useState<Slot[]>([])
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [conflicts, setConflicts] = useState<string[]>([])

  // Default time periods (10 periods/day per blueprint)
  const PERIODS = [
    ['08:20','09:00'],['09:00','09:40'],['09:40','10:20'],['10:20','11:00'],
    ['11:00','11:40'],['11:40','12:20'],['12:20','13:20'],['13:20','14:00'],
    ['14:00','14:40'],['14:40','15:20'],
  ]
  const BREAK_AFTER  = 2 // index after which "break" shows (09:40-10:20)
  const LUNCH_AFTER  = 5 // index after which "lunch" shows (12:20-13:20)

  useEffect(() => { loadInit() }, [])
  useEffect(() => { if (classId && termId) loadSlots() }, [classId, termId])

  async function loadInit() {
    const [clsRes, subRes, teachRes, termRes] = await Promise.all([
      supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('subjects').select('id,name,level').eq('school_id', user!.school_id).eq('is_active', true),
      supabase.from('users').select('id,full_name').eq('school_id', user!.school_id).eq('is_active', true),
      supabase.from('terms').select('id').eq('school_id', user!.school_id).eq('is_current', true).single(),
    ])
    setClasses(clsRes.data ?? [])
    setSubjects(subRes.data ?? [])
    setTeachers(teachRes.data ?? [])
    if (termRes.data) setTermId(termRes.data.id)
    if (clsRes.data?.[0]) setClassId(clsRes.data[0].id)
  }

  async function loadSlots() {
    const { data } = await supabase.from('timetable_slots').select('*').eq('school_id', user!.school_id).eq('class_id', classId).eq('term_id', termId)
    setSlots(data ?? [])
  }

  function getSlot(day: number, start: string): Slot | undefined {
    return slots.find(s => s.day_of_week === day && s.start_time === start)
  }

  function updateSlot(day: number, start: string, end: string, field: 'subject_id'|'teacher_id', value: string) {
    setSlots(prev => {
      const existing = prev.find(s => s.day_of_week === day && s.start_time === start)
      if (existing) {
        return prev.map(s => s === existing ? { ...s, [field]: value || null } : s)
      }
      return [...prev, { day_of_week: day, start_time: start, end_time: end, subject_id: field==='subject_id'?value:null, teacher_id: field==='teacher_id'?value:null, is_break: false }]
    })
  }

  function checkConflicts(): string[] {
    const issues: string[] = []
    const teacherSlotMap: Record<string, Set<string>> = {}
    slots.forEach(s => {
      if (!s.teacher_id) return
      const key = `${s.day_of_week}-${s.start_time}`
      if (!teacherSlotMap[s.teacher_id]) teacherSlotMap[s.teacher_id] = new Set()
      if (teacherSlotMap[s.teacher_id].has(key)) {
        const t = teachers.find(t => t.id === s.teacher_id)
        issues.push(`${t?.full_name ?? 'Teacher'} is double-booked on ${DAYS.find(d=>d.num===s.day_of_week)?.label} at ${s.start_time}`)
      }
      teacherSlotMap[s.teacher_id].add(key)
    })
    return issues
  }

  async function save() {
    setSaving(true)
    // Delete existing slots for this class+term, then bulk insert
    await supabase.from('timetable_slots').delete().eq('school_id', user!.school_id).eq('class_id', classId).eq('term_id', termId)

    const validSlots = slots.filter(s => s.subject_id || s.teacher_id)
    if (validSlots.length) {
      await supabase.from('timetable_slots').insert(validSlots.map(s => ({
        school_id: user!.school_id, class_id: classId, term_id: termId,
        day_of_week: s.day_of_week, start_time: s.start_time, end_time: s.end_time,
        subject_id: s.subject_id, teacher_id: s.teacher_id, is_break: false,
      })))
    }
    setSaving(false)
    setEditMode(false)
    toast.success('Timetable saved!')
    loadSlots()
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = PERIODS.map(([start,end]) => {
      const row: any = { Time: `${start}-${end}` }
      DAYS.forEach(d => {
        const slot = getSlot(d.num, start)
        const subj = subjects.find(s => s.id === slot?.subject_id)?.name ?? ''
        const teach = teachers.find(t => t.id === slot?.teacher_id)?.full_name ?? ''
        row[d.label] = subj ? `${subj}${teach ? ' / '+teach : ''}` : ''
      })
      return row
    })
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(rows), 'Timetable')
    writeFile(wb, `timetable_${classes.find(c=>c.id===classId)?.name}.xlsx`)
    toast.success('Exported!')
  }

  const levelSubjects = subjects.filter(s => s.level === classes.find(c=>c.id===classId)?.level)

  return (
    <div className="space-y-5">
      <PageHeader title="Timetable Builder" icon="🕐"
        actions={
          <div className="flex gap-2">
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="btn-secondary text-sm">✏️ Edit Mode</button>
            ) : (
              <>
                <button onClick={() => { setConflicts(checkConflicts()) }} className="btn-secondary text-sm">⚠️ Check Conflicts</button>
                <button onClick={save} disabled={saving} className="btn-primary text-sm">{saving?'Saving…':'💾 Save'}</button>
              </>
            )}
            <button onClick={exportExcel} className="btn-secondary text-sm">📥 Export</button>
            <button onClick={() => window.print()} className="btn-secondary text-sm">🖨️ Print</button>
          </div>
        }
      />

      <div className="card p-4">
        <select className="input-base w-56" value={classId} onChange={e => setClassId(e.target.value)}>
          <optgroup label="🎒 Nursery">{classes.filter(c=>c.level==='nursery').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
          <optgroup label="📚 Primary">{classes.filter(c=>c.level==='primary').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
        </select>
      </div>

      {conflicts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-300 space-y-1">
          <p className="font-semibold">⚠️ {conflicts.length} Conflict(s) Found:</p>
          {conflicts.map((c,i) => <p key={i}>• {c}</p>)}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="text-sm min-w-max w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 w-28">Time</th>
                {DAYS.map(d => <th key={d.num} className="px-3 py-3 text-center text-xs font-semibold text-slate-500 min-w-[160px]">{d.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(([start,end], pIdx) => (
                <>
                  <tr key={start} className="border-b border-slate-50 dark:border-slate-700/50">
                    <td className="px-3 py-2 text-xs text-slate-500 font-mono">{start}-{end}</td>
                    {DAYS.map(d => {
                      const slot = getSlot(d.num, start)
                      return (
                        <td key={d.num} className="px-2 py-2 text-center">
                          {editMode ? (
                            <div className="space-y-1">
                              <select className="input-base text-xs py-1" value={slot?.subject_id ?? ''} onChange={e => updateSlot(d.num, start, end, 'subject_id', e.target.value)}>
                                <option value="">—</option>
                                {levelSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                              <select className="input-base text-xs py-1" value={slot?.teacher_id ?? ''} onChange={e => updateSlot(d.num, start, end, 'teacher_id', e.target.value)}>
                                <option value="">—</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                              </select>
                            </div>
                          ) : slot?.subject_id ? (
                            <div>
                              <p className="font-medium text-slate-700 dark:text-slate-200 text-xs">{subjects.find(s=>s.id===slot.subject_id)?.name}</p>
                              <p className="text-[10px] text-slate-400">{teachers.find(t=>t.id===slot.teacher_id)?.full_name ?? ''}</p>
                            </div>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                  {pIdx === BREAK_AFTER && (
                    <tr className="bg-amber-50 dark:bg-amber-900/10">
                      <td colSpan={6} className="text-center py-1.5 text-xs font-semibold text-amber-600 uppercase tracking-widest">— BREAK —</td>
                    </tr>
                  )}
                  {pIdx === LUNCH_AFTER && (
                    <tr className="bg-blue-50 dark:bg-blue-900/10">
                      <td colSpan={6} className="text-center py-1.5 text-xs font-semibold text-brand-blue uppercase tracking-widest">— LUNCH —</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
