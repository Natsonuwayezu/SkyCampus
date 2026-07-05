'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { computeClassRegister, computeAnnualRegister, type ClassRegisterData, type Phase } from '@/lib/academics/computeRegister'
import { formatPercent } from '@/lib/utils/formatters'

export default function ClassRegisterPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms]     = useState<any[]>([])
  const [yearId, setYearId]   = useState('')
  const [classId, setClassId] = useState('')
  const [termId, setTermId]   = useState('')
  const [phase, setPhase]     = useState<Phase>('post_mid')
  const [data, setData]       = useState<ClassRegisterData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadInit() }, [])

  async function loadInit() {
    const [clsRes, yrRes] = await Promise.all([
      supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single(),
    ])
    setClasses(clsRes.data ?? [])
    if (yrRes.data) {
      setYearId(yrRes.data.id)
      const { data: termData } = await supabase.from('terms').select('id,name,term_number,is_current').eq('academic_year_id', yrRes.data.id).order('term_number')
      setTerms(termData ?? [])
      const current = termData?.find(t => t.is_current)
      if (current) setTermId(current.id)
    }
    if (clsRes.data?.[0]) setClassId(clsRes.data[0].id)
  }

  async function load() {
    if (!classId) { toast.error('Select a class'); return }
    if (phase !== 'annual' && !termId) { toast.error('Select a term'); return }
    setLoading(true)
    try {
      const result = phase === 'annual'
        ? await computeAnnualRegister(user!.school_id, classId, yearId)
        : await computeClassRegister(user!.school_id, classId, termId, phase)
      setData(result)
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to compute register')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (classId && (termId || phase === 'annual')) load() }, [classId, termId, phase])

  const isNursery = data?.level === 'nursery'
  const isFrench  = isNursery // French labels for nursery per blueprint

  async function exportExcel() {
    if (!data) return
    const { utils, writeFile } = await import('xlsx')
    const headerRow1: any[] = ['#', isFrench ? 'Élève' : 'Student']
    const headerRow2: any[] = ['', '']
    data.subjects.forEach(s => {
      if (phase === 'pre_mid') {
        headerRow1.push(s.name, '')
        headerRow2.push(isFrench ? 'NOTE' : 'SCORE', isFrench ? 'COTE' : 'GRADE')
      } else {
        headerRow1.push(s.name, '', '')
        headerRow2.push('MG', 'EX', 'TOT')
      }
    })
    headerRow1.push(isFrench ? 'TOTAL' : 'TOTAL', isFrench ? 'RANG' : 'RANK')
    headerRow2.push('', '')

    const rows = data.students.map((s, i) => {
      const row: any[] = [i+1, s.full_name]
      s.subjects.forEach(sub => {
        if (phase === 'pre_mid') row.push(sub.total, sub.grade)
        else row.push(sub.mg, sub.ex, sub.total)
      })
      row.push(s.total_score, s.rank)
      return row
    })

    const ws = utils.aoa_to_sheet([headerRow1, headerRow2, ...rows])
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, data.class_name)
    writeFile(wb, `register_${data.class_name}_${phase}.xlsx`)
    toast.success('Exported!')
  }

  function printRegister() { window.print() }

  return (
    <div className="space-y-5">
      <PageHeader title="Class Register" icon="📋"
        actions={
          <div className="flex gap-2">
            <button onClick={exportExcel} disabled={!data} className="btn-secondary text-sm">📤 Export Excel</button>
            <button onClick={printRegister} disabled={!data} className="btn-secondary text-sm">🖨️ Print</button>
          </div>
        }
      />

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <select className="input-base w-48" value={classId} onChange={e => setClassId(e.target.value)}>
          <optgroup label="🎒 Nursery">{classes.filter(c=>c.level==='nursery').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
          <optgroup label="📚 Primary">{classes.filter(c=>c.level==='primary').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
        </select>

        <div className="flex gap-1">
          {terms.map(t => (
            <button key={t.id} onClick={() => { setTermId(t.id); setPhase('pre_mid') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${termId===t.id && phase!=='annual' ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {t.name}
            </button>
          ))}
          <button onClick={() => setPhase('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${phase==='annual' ? 'bg-brand-gold text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
            Annual
          </button>
        </div>

        {phase !== 'annual' && (
          <div className="flex gap-1 ml-auto">
            {(['pre_mid','post_mid'] as Phase[]).map(p => (
              <button key={p} onClick={() => setPhase(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${phase===p ? 'bg-slate-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {p === 'pre_mid' ? 'Pre-Midterm' : 'Post-Midterm'}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
        </div>
      ) : data && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-display font-bold text-slate-800 dark:text-white">
              {isFrench ? 'REGISTRE DE CLASSE' : 'CLASS REGISTER'} — {data.class_name} — {data.term_name}
              {phase !== 'annual' && ` (${phase === 'pre_mid' ? (isFrench ? 'PRÉ-INTERMÉDIAIRE' : 'PRE-MIDTERM') : (isFrench ? 'FIN DE TRIMESTRE' : 'POST-MIDTERM')})`}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {data.students.length} {isFrench ? 'élèves' : 'students'} · {isFrench ? 'Moyenne' : 'Average'}: {formatPercent(data.class_average)}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="text-sm min-w-max">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th rowSpan={2} className="sticky left-0 bg-white dark:bg-slate-800 px-3 py-2 text-left text-xs font-semibold text-slate-500 w-8 z-10">#</th>
                  <th rowSpan={2} className="sticky left-8 bg-white dark:bg-slate-800 px-3 py-2 text-left text-xs font-semibold text-slate-500 min-w-[160px] z-10">
                    {isFrench ? 'Élève' : 'Student'}
                  </th>
                  {data.subjects.map(s => (
                    <th key={s.id} colSpan={phase === 'pre_mid' ? 2 : 3} className="px-2 py-1 text-center text-xs font-semibold text-slate-500 border-l border-slate-100 dark:border-slate-700">
                      {s.name}
                    </th>
                  ))}
                  <th colSpan={2} className="px-2 py-1 text-center text-xs font-semibold text-slate-500 border-l-2 border-slate-200 dark:border-slate-600">
                    {isFrench ? 'TOTAL' : 'TOTAL'}
                  </th>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {data.subjects.map(s => (
                    phase === 'pre_mid' ? (
                      <>
                        <th key={s.id+'n'} className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400 border-l border-slate-100 dark:border-slate-700">{isFrench?'NOTE':'SCORE'}</th>
                        <th key={s.id+'c'} className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400">{isFrench?'COTE':'GRADE'}</th>
                      </>
                    ) : (
                      <>
                        <th key={s.id+'mg'} className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400 border-l border-slate-100 dark:border-slate-700">MG</th>
                        <th key={s.id+'ex'} className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400">EX</th>
                        <th key={s.id+'tot'} className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400">TOT</th>
                      </>
                    )
                  ))}
                  <th className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400 border-l-2 border-slate-200 dark:border-slate-600">
                    {isFrench ? 'NOTE' : 'SCORE'}
                  </th>
                  <th className="px-2 py-1 text-center text-[10px] font-semibold text-slate-400">{isFrench?'RANG':'RANK'}</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s, i) => (
                  <tr key={s.student_id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20">
                    <td className="sticky left-0 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-400">{i+1}</td>
                    <td className="sticky left-8 bg-white dark:bg-slate-800 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{s.full_name}</td>
                    {s.subjects.map((sub, idx) => (
                      phase === 'pre_mid' ? (
                        <>
                          <td key={idx+'n'} className="px-2 py-1.5 text-center border-l border-slate-50 dark:border-slate-700/50">{sub.total}</td>
                          <td key={idx+'c'} className="px-2 py-1.5 text-center">
                            <span className={`badge text-[10px] ${sub.grade==='D'?'badge-red':sub.grade.startsWith('A')?'badge-green':'badge-blue'}`}>{sub.grade}</span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td key={idx+'mg'} className="px-2 py-1.5 text-center border-l border-slate-50 dark:border-slate-700/50">{sub.mg}</td>
                          <td key={idx+'ex'} className="px-2 py-1.5 text-center">{sub.ex}</td>
                          <td key={idx+'tot'} className="px-2 py-1.5 text-center font-semibold">{sub.total}</td>
                        </>
                      )
                    ))}
                    <td className="px-2 py-1.5 text-center font-bold text-brand-blue border-l-2 border-slate-200 dark:border-slate-600">{s.total_score}</td>
                    <td className="px-2 py-1.5 text-center font-bold">{s.rank}{s.rank===1?'st':s.rank===2?'nd':s.rank===3?'rd':'th'}</td>
                  </tr>
                ))}
                {/* Class average row */}
                <tr className="bg-slate-50 dark:bg-slate-700/30 font-semibold">
                  <td colSpan={2} className="sticky left-0 bg-slate-50 dark:bg-slate-700/30 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    {isFrench ? 'MOYENNE CLASSE' : 'CLASS AVERAGE'}
                  </td>
                  {data.subjects.map((s, idx) => {
                    const subjAvg = data.students.length > 0
                      ? data.students.reduce((sum, st) => sum + (st.subjects[idx]?.total ?? 0), 0) / data.students.length
                      : 0
                    return phase === 'pre_mid'
                      ? <td key={idx} colSpan={2} className="text-center text-xs">{subjAvg.toFixed(1)}</td>
                      : <td key={idx} colSpan={3} className="text-center text-xs">{subjAvg.toFixed(1)}</td>
                  })}
                  <td colSpan={2} className="text-center border-l-2 border-slate-200 dark:border-slate-600 text-xs">
                    {formatPercent(data.class_average)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.subjects.some(s => s.is_post_mid_only) && phase === 'post_mid' && (
        <p className="text-xs text-slate-400 px-1">
          ⚠️ Post-Mid Only subjects (Reading, Creative Arts, Sports): MG column auto-copied from EX marks.
        </p>
      )}
    </div>
  )
}
