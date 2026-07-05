'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils/formatters'

interface Assessment {
  id:string; name:string; type:string; max_marks:number; date:string|null
  is_locked:boolean; locked_at:string|null; created_at:string
  classes:{name:string}; subjects:{name:string}; terms:{name:string}
}

const TYPES = ['quiz','assignment','midterm','exam','project','test'] as const

export default function AssessmentsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [classes, setClasses]         = useState<any[]>([])
  const [subjects, setSubjects]       = useState<any[]>([])
  const [termId, setTermId]           = useState<string>('')
  const [classFilter, setClassF]      = useState('')
  const [subjectFilter, setSubjectF]  = useState('')
  const [showModal, setShow]          = useState(false)
  const [delId, setDelId]             = useState<string|null>(null)
  const [saving, setSaving]           = useState(false)
  const [form, setForm] = useState({
    class_id:'', subject_id:'', name:'', type:'quiz', max_marks:50,
    date:'', lock_after:false,
  })
  const [formSubjects, setFormSubjects] = useState<any[]>([])

  useEffect(() => { loadInit() }, [])
  useEffect(() => { if (termId) loadAssessments() }, [termId, classFilter, subjectFilter])

  async function loadInit() {
    const [termRes, clsRes] = await Promise.all([
      supabase.from('terms').select('id,name').eq('school_id', user!.school_id).eq('is_current', true).single(),
      supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order'),
    ])
    if (termRes.data) setTermId(termRes.data.id)
    setClasses(clsRes.data ?? [])
  }

  async function loadSubjectsForClass(classId: string) {
    const cls = classes.find(c => c.id === classId)
    if (!cls) return
    const { data } = await supabase.from('subjects').select('id,name').eq('school_id', user!.school_id).eq('level', cls.level).eq('is_active', true).order('display_order')
    setFormSubjects(data ?? [])
  }

  async function loadAssessments() {
    let q = supabase
      .from('assessments')
      .select('*, classes(name), subjects(name), terms(name)')
      .eq('school_id', user!.school_id)
      .eq('term_id', termId)
      .order('created_at', { ascending: false })
    if (classFilter)   q = q.eq('class_id', classFilter)
    if (subjectFilter) q = q.eq('subject_id', subjectFilter)
    const { data } = await q
    setAssessments(data as any ?? [])

    // Load subjects for filter
    const { data: subData } = await supabase.from('subjects').select('id,name').eq('school_id', user!.school_id).order('display_order')
    setSubjects(subData ?? [])
  }

  async function save() {
    if (!form.class_id || !form.subject_id || !form.name) {
      toast.error('Class, subject, and name are required'); return
    }
    setSaving(true)
    const { data: asmnt, error } = await supabase.from('assessments').insert({
      school_id:  user!.school_id,
      class_id:   form.class_id,
      subject_id: form.subject_id,
      term_id:    termId,
      name:       form.name,
      type:       form.type,
      max_marks:  form.max_marks,
      date:       form.date || null,
      is_locked:  false,
      created_by: user!.id,
    }).select('id').single()
    setSaving(false)
    if (error || !asmnt) { toast.error(error?.message ?? 'Failed'); return }
    toast.success('Assessment created!')
    setShow(false)
    setForm({ class_id:'', subject_id:'', name:'', type:'quiz', max_marks:50, date:'', lock_after:false })
    setFormSubjects([])
    loadAssessments()
  }

  async function toggleLock(a: Assessment) {
    const { error } = await supabase.from('assessments').update({
      is_locked:  !a.is_locked,
      locked_at:  !a.is_locked ? new Date().toISOString() : null,
      locked_by:  !a.is_locked ? user!.id : null,
    }).eq('id', a.id)
    if (error) toast.error(error.message)
    else toast.success(!a.is_locked ? 'Assessment locked' : 'Assessment unlocked')
    loadAssessments()
  }

  async function del() {
    if (!delId) return
    await supabase.from('assessments').delete().eq('id', delId)
    toast.success('Assessment deleted')
    setDelId(null)
    loadAssessments()
  }

  const TYPE_COLORS: Record<string,string> = {
    quiz:'badge-blue', assignment:'badge-purple', midterm:'badge-amber',
    exam:'badge-red', project:'badge-green', test:'badge-gray',
  }

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Assessments" icon="📝"
        subtitle={`${assessments.length} assessments this term`}
        actions={<button onClick={() => setShow(true)} className="btn-primary text-sm">➕ New Assessment</button>}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="input-base w-44" value={classFilter} onChange={e => setClassF(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-base w-44" value={subjectFilter} onChange={e => setSubjectF(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>#</th><th>Class</th><th>Subject</th><th>Assessment Name</th>
              <th>Type</th><th className="text-center">Max</th>
              <th>Date</th><th>Status</th><th className="w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                No assessments this term. Create one to start entering marks.
              </td></tr>
            ) : assessments.map((a, i) => (
              <tr key={a.id}>
                <td className="text-slate-400 text-xs">{i+1}</td>
                <td><span className="badge-blue text-xs">{a.classes.name}</span></td>
                <td className="text-sm text-slate-600 dark:text-slate-300">{a.subjects.name}</td>
                <td className="font-semibold">{a.name}</td>
                <td><span className={`badge text-xs capitalize ${TYPE_COLORS[a.type] ?? 'badge-gray'}`}>{a.type}</span></td>
                <td className="text-center font-bold text-slate-600 dark:text-slate-300">{a.max_marks}</td>
                <td className="text-sm text-slate-500">{a.date ? formatDate(a.date) : '—'}</td>
                <td>
                  {a.is_locked
                    ? <span className="badge-gray text-xs">🔒 Locked</span>
                    : <span className="badge-green text-xs">✏️ Open</span>
                  }
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <a href={`/academics/marks-entry`} className="text-brand-blue hover:underline text-xs">✏️ Marks</a>
                    <button onClick={() => toggleLock(a)} className="text-slate-400 hover:text-slate-600 text-xs">
                      {a.is_locked ? '🔓' : '🔒'}
                    </button>
                    {!a.is_locked && (
                      <button onClick={() => setDelId(a.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShow(false)} title="New Assessment"
        footer={
          <>
            <button onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary">{saving?'Creating…':'✅ Create Assessment'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-xs">Class *</label>
              <select className="input-base" value={form.class_id} onChange={e => {
                setForm(f=>({...f,class_id:e.target.value,subject_id:''}))
                if (e.target.value) loadSubjectsForClass(e.target.value)
              }}>
                <option value="">— Select Class —</option>
                <optgroup label="🎒 Nursery">{classes.filter(c=>c.level==='nursery').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
                <optgroup label="📚 Primary">{classes.filter(c=>c.level==='primary').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
              </select>
            </div>
            <div>
              <label className="label-xs">Subject *</label>
              <select className="input-base" value={form.subject_id} onChange={e => setForm(f=>({...f,subject_id:e.target.value}))}>
                <option value="">— Select Subject —</option>
                {formSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Assessment Type</label>
              <select className="input-base" value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                {TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Max Marks *</label>
              <input type="number" min={1} max={500} className="input-base" value={form.max_marks} onChange={e => setForm(f=>({...f,max_marks:+e.target.value}))} />
            </div>
            <div className="col-span-2">
              <label className="label-xs">Assessment Name *</label>
              <input className="input-base" placeholder="Quiz 3, Midterm Exam, Assignment 2…" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">Date (optional)</label>
              <input type="date" className="input-base" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del}
        title="Delete Assessment"
        message="Delete this assessment and ALL its marks? This cannot be undone."
        confirmLabel="Delete" danger />
    </div>
  )
}
