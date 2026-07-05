'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatDate } from '@/lib/utils/formatters'

interface MarkRecord {
  id: string; score: number; grade: string|null; entered_at: string
  students: { first_name:string; last_name:string; admission_number:string }
  assessments: {
    id:string; name:string; type:string; max_marks:number; is_locked:boolean
    classes:{name:string}; subjects:{name:string}
  }
}

export default function MarksDBPage() {
  const { user }  = useAuthStore()
  const supabase  = createClient()

  const [marks, setMarks]         = useState<MarkRecord[]>([])
  const [classes, setClasses]     = useState<any[]>([])
  const [subjects, setSubjects]   = useState<any[]>([])
  const [classFilter, setClassF]  = useState('')
  const [subjectFilter, setSubjF] = useState('')
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const PER = 50

  useEffect(() => { loadFilters(); load() }, [])
  useEffect(() => { load() }, [classFilter, subjectFilter])

  async function loadFilters() {
    const [cls, sub] = await Promise.all([
      supabase.from('classes').select('id,name').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('subjects').select('id,name').eq('school_id', user!.school_id).order('display_order'),
    ])
    setClasses(cls.data ?? [])
    setSubjects(sub.data ?? [])
  }

  async function load() {
    setLoading(true)
    let q = supabase
      .from('marks')
      .select(`
        id, score, grade, entered_at,
        students(first_name, last_name, admission_number),
        assessments(id, name, type, max_marks, is_locked,
          classes(name), subjects(name)
        )
      `)
      .eq('school_id', user!.school_id)
      .order('entered_at', { ascending: false })
      .limit(500)

    if (classFilter) q = q.eq('assessments.class_id', classFilter)
    const { data } = await q
    setMarks(data as any ?? [])
    setLoading(false)
    setPage(1)
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = filtered.map(m => ({
      'Student':     `${m.students.last_name} ${m.students.first_name}`,
      'Adm #':       m.students.admission_number,
      'Class':       m.assessments.classes.name,
      'Subject':     m.assessments.subjects.name,
      'Assessment':  m.assessments.name,
      'Type':        m.assessments.type,
      'Score':       m.score,
      'Max Marks':   m.assessments.max_marks,
      '%':           m.assessments.max_marks > 0 ? ((m.score/m.assessments.max_marks)*100).toFixed(1) : '',
      'Grade':       m.grade ?? '',
      'Entered':     m.entered_at,
    }))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(rows), 'Marks')
    writeFile(wb, `marks_database_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported!')
  }

  const filtered = marks.filter(m => {
    if (subjectFilter && m.assessments.subjects.name !== subjects.find(s=>s.id===subjectFilter)?.name) return false
    if (!search) return true
    const q = search.toLowerCase()
    return `${m.students.last_name} ${m.students.first_name}`.toLowerCase().includes(q) ||
      m.students.admission_number.toLowerCase().includes(q) ||
      m.assessments.name.toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PER)
  const paged = filtered.slice((page-1)*PER, page*PER)

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Marks Database" icon="🗄️"
        subtitle={`${filtered.length} mark records`}
        actions={<button onClick={exportExcel} className="btn-secondary text-sm">📥 Export Excel</button>}
      />

      <div className="flex flex-wrap gap-3">
        <input className="input-base max-w-xs" placeholder="🔍 Student, ID, assessment name…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select className="input-base w-40" value={classFilter} onChange={e => setClassF(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-base w-44" value={subjectFilter} onChange={e => setSubjF(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th><th>Student</th><th>Class</th><th>Subject</th>
                <th>Assessment</th><th>Type</th><th className="text-center">Score</th>
                <th className="text-center">%</th><th className="text-center">Grade</th>
                <th>Status</th><th>Entered</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} className="text-center py-12 text-slate-400">Loading…</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-12 text-slate-400 text-sm">No marks found.</td></tr>
              ) : paged.map((m, i) => {
                const pct = m.assessments.max_marks > 0 ? (m.score/m.assessments.max_marks)*100 : 0
                return (
                  <tr key={m.id}>
                    <td className="text-slate-400 text-xs">{(page-1)*PER+i+1}</td>
                    <td>
                      <p className="font-medium text-sm">{m.students.last_name} {m.students.first_name}</p>
                      <p className="text-xs text-slate-400">{m.students.admission_number}</p>
                    </td>
                    <td><span className="badge-blue text-xs">{m.assessments.classes.name}</span></td>
                    <td className="text-sm text-slate-600 dark:text-slate-300">{m.assessments.subjects.name}</td>
                    <td className="font-medium text-sm">{m.assessments.name}</td>
                    <td><span className="badge-gray text-xs capitalize">{m.assessments.type}</span></td>
                    <td className="text-center font-bold">{m.score} / {m.assessments.max_marks}</td>
                    <td className={`text-center text-sm font-medium ${pct < 50 ? 'text-red-600' : pct >= 80 ? 'text-green-600' : 'text-slate-600'}`}>{pct.toFixed(1)}%</td>
                    <td className="text-center">
                      {m.grade
                        ? <span className={`badge text-xs ${m.grade==='D'?'badge-red':m.grade.startsWith('A')?'badge-green':'badge-blue'}`}>{m.grade}</span>
                        : <span className="text-slate-300">—</span>
                      }
                    </td>
                    <td>
                      {m.assessments.is_locked
                        ? <span className="badge-gray text-xs">🔒 Locked</span>
                        : <span className="badge-green text-xs">✏️ Open</span>
                      }
                    </td>
                    <td className="text-xs text-slate-400">{formatDate(m.entered_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-400">{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">‹</button>
              {Array.from({length:Math.min(5,totalPages)},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-brand-blue text-white':'hover:bg-slate-100 text-slate-600'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
