'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatPercent } from '@/lib/utils/formatters'

interface MarkRow {
  student_id: string; full_name: string; admission_number: string
  score: number | ''; grade: string; saved: boolean; changed: boolean
}
interface GradeScale { grade: string; min_percent: number; max_percent: number; label: string }

export default function MarksEntryPage() {
  const { user }  = useAuthStore()
  const supabase  = createClient()

  const [classes, setClasses]       = useState<any[]>([])
  const [subjects, setSubjects]     = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [grades, setGrades]         = useState<GradeScale[]>([])
  const [selectedClass, setClass]   = useState('')
  const [selectedSubject, setSubject] = useState('')
  const [selectedAssessment, setAssess] = useState('')
  const [rows, setRows]             = useState<MarkRow[]>([])
  const [loading, setLoading]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [maxMarks, setMax]          = useState(0)
  const [isLocked, setLocked]       = useState(false)
  const [lockAfter, setLockAfter]   = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { loadClasses(); loadGrades() }, [])
  useEffect(() => { if (selectedClass && selectedSubject) loadAssessments() }, [selectedClass, selectedSubject])

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order')
    setClasses(data ?? [])
  }
  async function loadSubjectsForClass(classId: string) {
    const cls = classes.find(c => c.id === classId)
    if (!cls) return
    const { data } = await supabase.from('subjects').select('id,name').eq('school_id', user!.school_id).eq('level', cls.level).eq('is_active', true).order('display_order')
    setSubjects(data ?? [])
  }
  async function loadAssessments() {
    const { data: termData } = await supabase.from('terms').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    if (!termData) return
    const { data } = await supabase.from('assessments').select('id,name,type,max_marks,is_locked').eq('school_id', user!.school_id).eq('class_id', selectedClass).eq('subject_id', selectedSubject).eq('term_id', termData.id).order('created_at')
    setAssessments(data ?? [])
  }
  async function loadGrades() {
    const { data } = await supabase.from('grading_scales').select('*').eq('school_id', user!.school_id).order('min_percent', { ascending: false })
    setGrades(data ?? [])
  }

  function computeGrade(score: number, max: number): string {
    if (!max || score < 0) return ''
    const pct = (score / max) * 100
    return grades.find(g => pct >= g.min_percent && pct <= g.max_percent)?.grade ?? 'N/A'
  }

  async function loadStudents() {
    if (!selectedAssessment) { toast.error('Select an assessment first'); return }
    setLoading(true)

    const assessment = assessments.find(a => a.id === selectedAssessment)
    setMax(assessment?.max_marks ?? 0)
    setLocked(assessment?.is_locked ?? false)

    // Load students in class
    const { data: stuData } = await supabase
      .from('student_class_history')
      .select('student_id, students(id, first_name, last_name, admission_number)')
      .eq('class_id', selectedClass).eq('is_current', true)

    // Load existing marks
    const { data: markData } = await supabase.from('marks').select('student_id, score, grade').eq('assessment_id', selectedAssessment)
    const markMap: Record<string,{score:number;grade:string}> = {}
    markData?.forEach((m:any) => { markMap[m.student_id] = { score: m.score, grade: m.grade ?? '' } })

    setRows((stuData ?? []).map((h:any) => {
      const s = h.students
      const existing = markMap[s.id]
      return {
        student_id:       s.id,
        full_name:        `${s.last_name} ${s.first_name}`,
        admission_number: s.admission_number,
        score:            existing?.score ?? '',
        grade:            existing?.grade ?? '',
        saved:            !!existing,
        changed:          false,
      }
    }).sort((a,b) => a.full_name.localeCompare(b.full_name)))

    setLoading(false)
  }

  function updateScore(idx: number, value: string) {
    const num = value === '' ? '' : Math.min(maxMarks, Math.max(0, parseFloat(value) || 0))
    setRows(r => r.map((row, i) => {
      if (i !== idx) return row
      const grade = num !== '' ? computeGrade(num as number, maxMarks) : ''
      return { ...row, score: num, grade, changed: true }
    }))
  }

  // Tab key navigation
  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      inputRefs.current[idx + 1]?.focus()
    }
  }

  async function saveAll() {
    if (isLocked) { toast.error('This assessment is locked'); return }
    const changed = rows.filter(r => r.changed && r.score !== '')
    if (!changed.length) { toast.info('No changes to save'); return }

    setSaving(true)
    let success = 0, errors = 0

    for (const row of changed) {
      const { error } = await supabase.from('marks').upsert({
        school_id:     user!.school_id,
        student_id:    row.student_id,
        assessment_id: selectedAssessment,
        score:         Number(row.score),
        grade:         row.grade,
        entered_by:    user!.id,
      }, { onConflict: 'student_id,assessment_id' })

      if (error) errors++
      else success++
    }

    if (lockAfter) {
      await supabase.from('assessments').update({ is_locked: true, locked_at: new Date().toISOString(), locked_by: user!.id }).eq('id', selectedAssessment)
      setLocked(true)
    }

    setSaving(false)
    setRows(r => r.map(row => ({ ...row, saved: row.changed ? true : row.saved, changed: false })))

    if (errors) toast.error(`${errors} marks failed to save`)
    else toast.success(`${success} marks saved!`)

    // Notification
    await supabase.from('notifications').insert({
      school_id: user!.school_id, user_id: user!.id,
      type: 'marks', title: `Marks entered: ${assessments.find(a=>a.id===selectedAssessment)?.name}`,
    })
  }

  const entered   = rows.filter(r => r.score !== '').length
  const avgScore  = rows.length > 0 && entered > 0
    ? rows.filter(r => r.score !== '').reduce((s,r) => s + Number(r.score), 0) / entered
    : 0
  const passRate  = entered > 0
    ? Math.round((rows.filter(r => r.score !== '' && maxMarks > 0 && (Number(r.score)/maxMarks)*100 >= 50).length / entered) * 100)
    : 0

  return (
    <div className="space-y-5">
      <PageHeader title="Marks Entry" icon="✏️" />

      {/* Selectors */}
      <div className="card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label-xs">Class</label>
            <select className="input-base" value={selectedClass} onChange={e => {
              setClass(e.target.value); setSubject(''); setAssess(''); setRows([])
              if (e.target.value) loadSubjectsForClass(e.target.value)
            }}>
              <option value="">— Select Class —</option>
              <optgroup label="🎒 Nursery">{classes.filter(c=>c.level==='nursery').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
              <optgroup label="📚 Primary">{classes.filter(c=>c.level==='primary').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
            </select>
          </div>
          <div>
            <label className="label-xs">Subject</label>
            <select className="input-base" value={selectedSubject} onChange={e => { setSubject(e.target.value); setAssess(''); setRows([]) }}>
              <option value="">— Select Subject —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-xs">Assessment</label>
            <select className="input-base" value={selectedAssessment} onChange={e => { setAssess(e.target.value); setRows([]) }}>
              <option value="">— Select Assessment —</option>
              {assessments.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type}) /{a.max_marks}{a.is_locked?' 🔒':''}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={loadStudents} disabled={!selectedAssessment || loading} className="btn-primary w-full justify-center">
              {loading ? '⏳ Loading…' : '📋 Load Students'}
            </button>
          </div>
        </div>

        {isLocked && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
            🔒 This assessment is locked. Marks are read-only.
          </div>
        )}
      </div>

      {/* Summary stats */}
      {rows.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label:'Students', value: rows.length },
            { label:'Entered', value: `${entered} / ${rows.length}` },
            { label:'Average', value: entered > 0 ? `${avgScore.toFixed(1)} / ${maxMarks}` : '—' },
            { label:'Pass Rate', value: entered > 0 ? `${passRate}%` : '—' },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <p className="font-display font-bold text-lg text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Marks table */}
      {rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="font-display font-bold text-sm text-slate-700 dark:text-white">
              Student Marks — Max: {maxMarks}
            </span>
            <div className="flex items-center gap-3">
              {!isLocked && (
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={lockAfter} onChange={e => setLockAfter(e.target.checked)} className="rounded border-slate-300 text-brand-blue"/>
                  Lock after saving
                </label>
              )}
              {!isLocked && (
                <button onClick={saveAll} disabled={saving} className="btn-primary text-sm">
                  {saving ? '⏳ Saving…' : '💾 Save All Marks'}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>Student Name</th>
                  <th className="w-28">Adm. No.</th>
                  <th className="w-36">Score / {maxMarks}</th>
                  <th className="w-20">%</th>
                  <th className="w-20">Grade</th>
                  <th className="w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const pct = row.score !== '' && maxMarks > 0 ? (Number(row.score)/maxMarks)*100 : null
                  const fail = pct !== null && pct < 50
                  return (
                    <tr key={row.student_id} className={fail ? 'bg-red-50/30 dark:bg-red-900/5' : ''}>
                      <td className="text-slate-400 text-xs">{i+1}</td>
                      <td className="font-medium text-slate-800 dark:text-white">{row.full_name}</td>
                      <td className="font-mono text-xs text-slate-400">{row.admission_number}</td>
                      <td>
                        <input
                          ref={el => { inputRefs.current[i] = el }}
                          type="number" min={0} max={maxMarks} step="0.5"
                          disabled={isLocked}
                          value={row.score}
                          onChange={e => updateScore(i, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, i)}
                          className={`input-base w-24 text-center font-semibold text-base ${
                            fail ? 'border-red-300 bg-red-50 dark:bg-red-900/10' :
                            row.score !== '' ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : ''
                          }`}
                          placeholder="—"
                        />
                      </td>
                      <td className={`text-sm font-medium ${fail ? 'text-red-600' : pct !== null ? 'text-green-600' : 'text-slate-400'}`}>
                        {pct !== null ? `${pct.toFixed(1)}%` : '—'}
                      </td>
                      <td>
                        {row.grade
                          ? <span className={`badge ${row.grade === 'D' ? 'badge-red' : row.grade.startsWith('A') ? 'badge-green' : 'badge-blue'}`}>{row.grade}</span>
                          : <span className="text-slate-300 text-sm">—</span>
                        }
                      </td>
                      <td>
                        {row.score === ''
                          ? <span className="badge-gray text-xs">Empty</span>
                          : row.changed
                          ? <span className="badge-amber text-xs">● Changed</span>
                          : row.saved
                          ? <span className="badge-green text-xs">✓ Saved</span>
                          : null
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!isLocked && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button onClick={saveAll} disabled={saving} className="btn-primary">
                {saving ? '⏳ Saving…' : `💾 Save ${rows.filter(r=>r.changed).length || ''} Changes`}
              </button>
            </div>
          )}
        </div>
      )}

      {rows.length === 0 && selectedAssessment && !loading && (
        <div className="card p-8 text-center text-slate-400">Click "Load Students" to begin entering marks.</div>
      )}
    </div>
  )
}
