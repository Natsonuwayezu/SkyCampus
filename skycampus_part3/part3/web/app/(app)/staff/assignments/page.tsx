'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

interface Teacher { id: string; full_name: string }
interface ClassRow { id: string; name: string; level: string; display_order: number }
interface Subject  { id: string; name: string; level: string; display_order: number }
interface Assignment { class_id: string; subject_id: string; teacher_id: string }

export default function AssignmentsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [teachers, setTeachers]     = useState<Teacher[]>([])
  const [classes, setClasses]       = useState<ClassRow[]>([])
  const [subjects, setSubjects]     = useState<Subject[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [terms, setTerms]           = useState<{id:string;name:string}[]>([])
  const [termId, setTermId]         = useState<string>('')
  const [saving, setSaving]         = useState(false)
  const [tab, setTab]               = useState<'nursery'|'primary'>('primary')

  useEffect(() => { loadAll() }, [])
  useEffect(() => { if (termId) loadAssignments() }, [termId])

  async function loadAll() {
    const [teachRes, clsRes, subRes, termRes] = await Promise.all([
      supabase.from('users').select('id,full_name').eq('school_id', user!.school_id).eq('is_active', true).order('full_name'),
      supabase.from('classes').select('id,name,level,display_order').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('subjects').select('id,name,level,display_order').eq('school_id', user!.school_id).eq('is_active', true).order('display_order'),
      supabase.from('terms').select('id,name').eq('school_id', user!.school_id).eq('is_current', true),
    ])
    setTeachers(teachRes.data ?? [])
    setClasses(clsRes.data ?? [])
    setSubjects(subRes.data ?? [])
    if (termRes.data?.[0]) setTermId(termRes.data[0].id)
    setTerms(termRes.data ?? [])
  }

  async function loadAssignments() {
    const { data } = await supabase
      .from('teacher_subject_assignments')
      .select('class_id, subject_id, teacher_id')
      .eq('school_id', user!.school_id)
      .eq('term_id', termId)
    setAssignments(data ?? [])
  }

  function getAssignment(classId: string, subjectId: string) {
    return assignments.find(a => a.class_id === classId && a.subject_id === subjectId)?.teacher_id ?? ''
  }

  async function setAssignment(classId: string, subjectId: string, teacherId: string) {
    // Remove existing
    await supabase.from('teacher_subject_assignments')
      .delete()
      .eq('school_id', user!.school_id)
      .eq('term_id', termId)
      .eq('class_id', classId)
      .eq('subject_id', subjectId)

    if (teacherId) {
      await supabase.from('teacher_subject_assignments').insert({
        school_id:  user!.school_id,
        term_id:    termId,
        class_id:   classId,
        subject_id: subjectId,
        teacher_id: teacherId,
      })
    }

    // Update local state optimistically
    setAssignments(prev => {
      const filtered = prev.filter(a => !(a.class_id === classId && a.subject_id === subjectId))
      if (teacherId) return [...filtered, { class_id: classId, subject_id: subjectId, teacher_id: teacherId }]
      return filtered
    })
  }

  const levelClasses   = classes.filter(c => c.level === tab)
  const levelSubjects  = subjects.filter(s => s.level === tab)
  const totalAssigned  = assignments.length
  const totalSlots     = classes.length * subjects.length

  return (
    <div className="space-y-5">
      <PageHeader title="Teacher Assignments" icon="📌"
        subtitle={`${totalAssigned} assignments · ${totalSlots - totalAssigned} unassigned slots`}
      />

      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1">
          {(['nursery','primary'] as const).map(l => (
            <button key={l} onClick={() => setTab(l)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                tab === l ? 'bg-brand-blue text-white' : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-100'
              }`}>
              {l === 'nursery' ? '🎒' : '📚'} {l}
            </button>
          ))}
        </div>
        <span className="text-sm text-slate-400">
          {levelClasses.length} classes × {levelSubjects.length} subjects
        </span>
      </div>

      {/* Assignment matrix — horizontally scrollable */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="text-sm min-w-max">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky left-0 bg-white dark:bg-slate-800 w-48 z-10">
                  Subject
                </th>
                {levelClasses.map(c => (
                  <th key={c.id} className="px-3 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center min-w-[140px]">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {levelSubjects.length === 0 ? (
                <tr><td colSpan={levelClasses.length + 1} className="text-center py-10 text-slate-400">
                  No subjects for {tab} level.
                </td></tr>
              ) : levelSubjects.map(sub => (
                <tr key={sub.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-800 z-10">
                    {sub.name}
                  </td>
                  {levelClasses.map(cls => {
                    const current = getAssignment(cls.id, sub.id)
                    return (
                      <td key={cls.id} className="px-3 py-2 text-center">
                        <select
                          value={current}
                          onChange={e => setAssignment(cls.id, sub.id, e.target.value)}
                          className={`text-xs rounded-lg px-2 py-1.5 border transition w-full max-w-[130px] ${
                            current
                              ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 text-green-800 dark:text-green-300'
                              : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          <option value="">— Unassigned —</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.full_name}</option>
                          ))}
                        </select>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-slate-400 px-1">
        💡 Changes are saved instantly. Green = assigned · Gray = unassigned.
      </div>
    </div>
  )
}
