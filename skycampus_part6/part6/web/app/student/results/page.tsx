'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { computeClassRegister, type Phase } from '@/lib/academics/computeRegister'
import { formatPercent } from '@/lib/utils/formatters'

export default function StudentResultsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [terms, setTerms]     = useState<any[]>([])
  const [termId, setTermId]   = useState('')
  const [phase, setPhase]     = useState<Phase>('post_mid')
  const [result, setResult]   = useState<any>(null)
  const [totalStudents, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadInit() }, [])
  useEffect(() => { if (termId) load() }, [termId, phase])

  async function loadInit() {
    const { data: yr } = await supabase.from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single()
    if (yr) {
      const { data: termData } = await supabase.from('terms').select('id,name,is_current').eq('academic_year_id', yr.id).order('term_number')
      setTerms(termData ?? [])
      const current = termData?.find(t => t.is_current)
      if (current) setTermId(current.id)
    }
  }

  async function load() {
    setLoading(true)
    const { data: stu } = await supabase
      .from('students')
      .select(`id, student_class_history!inner(is_current, class_id)`)
      .eq('school_id', user!.school_id)
      .eq('student_class_history.is_current', true)
      .ilike('admission_number', user!.username ?? '')
      .maybeSingle()

    if (!stu) { setLoading(false); return }
    const classId = (stu as any).student_class_history?.[0]?.class_id
    if (!classId) { setLoading(false); return }

    const reg = await computeClassRegister(user!.school_id, classId, termId, phase)
    const mine = reg.students.find(s => s.student_id === stu.id)
    setResult(mine ?? null)
    setTotal(reg.students.length)
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">📚 My Results</h1>

      <div className="flex flex-wrap gap-3">
        <select className="input-base w-44" value={termId} onChange={e => setTermId(e.target.value)}>
          {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex gap-1">
          {(['pre_mid','post_mid'] as Phase[]).map(p => (
            <button key={p} onClick={() => setPhase(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${phase===p?'bg-brand-blue text-white':'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {p === 'pre_mid' ? 'Pre-Midterm' : 'Post-Midterm'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"/></div>
      ) : result ? (
        <>
          <div className="card overflow-hidden">
            <table className="table-base">
              <thead><tr><th>Subject</th>{phase==='post_mid'&&<><th>MG</th><th>EX</th></>}<th>Total</th><th>%</th><th>Grade</th></tr></thead>
              <tbody>
                {result.subjects.map((s: any) => (
                  <tr key={s.subject_id}>
                    <td className="font-medium">{s.subject_name}</td>
                    {phase==='post_mid' && <><td>{s.mg}</td><td>{s.ex}</td></>}
                    <td className="font-semibold">{s.total}</td>
                    <td>{formatPercent(s.percent)}</td>
                    <td><span className={`badge ${s.grade==='D'?'badge-red':s.grade.startsWith('A')?'badge-green':'badge-blue'}`}>{s.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center"><p className="font-display font-bold text-xl text-brand-blue">{result.rank} / {totalStudents}</p><p className="text-xs text-slate-500">Rank</p></div>
            <div className="card p-4 text-center"><p className="font-display font-bold text-xl">{formatPercent(result.percent)}</p><p className="text-xs text-slate-500">Average</p></div>
            <div className="card p-4 text-center"><p className="font-display font-bold text-xl">{result.grade}</p><p className="text-xs text-slate-500">Grade</p></div>
          </div>
          <button onClick={() => window.print()} className="btn-secondary text-sm">📄 Download / Print Report Card</button>
        </>
      ) : (
        <div className="card p-8 text-center text-slate-400 text-sm">No results available for this term yet.</div>
      )}
    </div>
  )
}
