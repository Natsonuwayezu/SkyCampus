'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { computeClassRegister, computeAnnualRegister, type ClassRegisterData, type Phase, type StudentResult } from '@/lib/academics/computeRegister'
import { formatDate, formatPercent } from '@/lib/utils/formatters'

export default function ReportCardsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms]     = useState<any[]>([])
  const [school, setSchool]   = useState<any>(null)
  const [yearId, setYearId]   = useState('')
  const [yearName, setYearName] = useState('')
  const [classId, setClassId] = useState('')
  const [termId, setTermId]   = useState('')
  const [phase, setPhase]     = useState<Phase>('post_mid')
  const [data, setData]       = useState<ClassRegisterData | null>(null)
  const [studentIdx, setIdx]  = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadInit() }, [])

  async function loadInit() {
    const [clsRes, yrRes, schRes] = await Promise.all([
      supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('academic_years').select('id,name').eq('school_id', user!.school_id).eq('is_current', true).single(),
      supabase.from('schools').select('name, city, director_name, logo_url, promotion_min').eq('id', user!.school_id).single(),
    ])
    setClasses(clsRes.data ?? [])
    setSchool(schRes.data)
    if (yrRes.data) {
      setYearId(yrRes.data.id)
      setYearName(yrRes.data.name)
      const { data: termData } = await supabase.from('terms').select('id,name,term_number,is_current').eq('academic_year_id', yrRes.data.id).order('term_number')
      setTerms(termData ?? [])
      const current = termData?.find(t => t.is_current)
      if (current) setTermId(current.id)
    }
    if (clsRes.data?.[0]) setClassId(clsRes.data[0].id)
  }

  async function load() {
    if (!classId) return
    if (phase !== 'annual' && !termId) return
    setLoading(true)
    try {
      const result = phase === 'annual'
        ? await computeAnnualRegister(user!.school_id, classId, yearId)
        : await computeClassRegister(user!.school_id, classId, termId, phase)
      setData(result)
      setIdx(0)
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to compute')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (classId && (termId || phase === 'annual')) load() }, [classId, termId, phase])

  const isNursery = data?.level === 'nursery'
  const isFrench  = isNursery
  const student = data?.students[studentIdx]
  const totalStudents = data?.students.length ?? 0

  function printCard() { window.print() }

  const promoMin = school?.promotion_min ?? 50
  const isPromoted = student && phase === 'annual' && student.percent >= promoMin

  return (
    <div className="space-y-5">
      <PageHeader title="Report Cards" icon="📄"
        actions={
          <div className="flex gap-2">
            <button onClick={printCard} disabled={!student} className="btn-secondary text-sm">🖨️ Print</button>
            <button onClick={() => window.print()} disabled={!data} className="btn-primary text-sm">📥 Print All</button>
          </div>
        }
      />

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3 print:hidden">
        <select className="input-base w-48" value={classId} onChange={e => setClassId(e.target.value)}>
          <optgroup label="🎒 Nursery">{classes.filter(c=>c.level==='nursery').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
          <optgroup label="📚 Primary">{classes.filter(c=>c.level==='primary').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>
        </select>
        <div className="flex gap-1">
          {terms.map(t => (
            <button key={t.id} onClick={() => { setTermId(t.id); setPhase('post_mid') }}
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
          <div className="flex gap-1">
            {(['pre_mid','post_mid'] as Phase[]).map(p => (
              <button key={p} onClick={() => setPhase(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${phase===p ? 'bg-slate-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                {p === 'pre_mid' ? 'Pre-Mid' : 'Post-Mid'}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
        </div>
      ) : student && (
        <>
          {/* Navigator */}
          <div className="flex items-center justify-between print:hidden">
            <button onClick={() => setIdx(i => Math.max(0, i-1))} disabled={studentIdx===0} className="btn-secondary text-sm disabled:opacity-40">
              ◀ Previous
            </button>
            <span className="text-sm text-slate-500">Student {studentIdx+1} of {totalStudents}</span>
            <button onClick={() => setIdx(i => Math.min(totalStudents-1, i+1))} disabled={studentIdx===totalStudents-1} className="btn-secondary text-sm disabled:opacity-40">
              Next ▶
            </button>
          </div>

          {/* Report card document */}
          <div className="card p-10 max-w-2xl mx-auto print:shadow-none print:border-none" id="report-card">
            <div className="text-center mb-6">
              {school?.logo_url && <img src={school.logo_url} alt="" className="w-14 h-14 mx-auto mb-2 object-contain"/>}
              <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">{school?.name ?? 'SCHOOL NAME'}</h1>
              <p className="text-sm text-slate-500">{school?.city ?? ''}</p>
            </div>

            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-base text-brand-blue uppercase tracking-wide">
                {isFrench
                  ? (phase === 'pre_mid' ? 'Résultats des Tests Demi-Trimestre' : phase === 'post_mid' ? 'Bulletin de Fin de Trimestre' : 'Rapport Annuel')
                  : (phase === 'pre_mid' ? 'Mid-Term Test Results' : phase === 'post_mid' ? 'End of Term Report' : 'Annual Academic Report')
                }
              </h2>
              <p className="text-sm text-slate-500">{phase === 'annual' ? yearName : `${data!.term_name} — ${yearName}`}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-6 border-y border-slate-100 dark:border-slate-700 py-3">
              <div><span className="text-slate-400">{isFrench?'CLASSE':'CLASS'}:</span> <strong>{data!.class_name}</strong></div>
              <div><span className="text-slate-400">{isFrench?'DATE':'DATE'}:</span> <strong>{formatDate(new Date())}</strong></div>
              <div className="col-span-2"><span className="text-slate-400">{isFrench?"NOM DE L'ÉLÈVE":'STUDENT NAME'}:</span> <strong>{student.full_name}</strong></div>
            </div>

            {/* Subjects table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                  <th className="text-left py-2">{isFrench ? 'MATIÈRES' : 'SUBJECT'}</th>
                  {phase !== 'annual' ? (
                    phase === 'pre_mid' ? <>
                      <th className="text-center py-2 w-16">MAX</th>
                      <th className="text-center py-2 w-16">{isFrench?'NOTE':'SCORE'}</th>
                      <th className="text-center py-2 w-16">{isFrench?'COTE':'GRADE'}</th>
                    </> : <>
                      <th className="text-center py-2 w-14">MG</th>
                      <th className="text-center py-2 w-14">EX</th>
                      <th className="text-center py-2 w-16">TOT</th>
                      <th className="text-center py-2 w-14">MAX</th>
                      <th className="text-center py-2 w-16">%</th>
                      <th className="text-center py-2 w-14">{isFrench?'COTE':'GRD'}</th>
                    </>
                  ) : <>
                    <th className="text-center py-2 w-16">TOT-MG</th>
                    <th className="text-center py-2 w-16">TOT-EX</th>
                    <th className="text-center py-2 w-16">G-TOT</th>
                    <th className="text-center py-2 w-14">MAX</th>
                    <th className="text-center py-2 w-16">%</th>
                    <th className="text-center py-2 w-14">GRD</th>
                  </>}
                </tr>
              </thead>
              <tbody>
                {student.subjects.map(sub => (
                  <tr key={sub.subject_id} className="border-b border-slate-50 dark:border-slate-700/50">
                    <td className="py-1.5 font-medium">{sub.subject_name.toUpperCase()}</td>
                    {phase === 'pre_mid' ? <>
                      <td className="text-center py-1.5">{sub.max}</td>
                      <td className="text-center py-1.5 font-semibold">{sub.total}</td>
                      <td className="text-center py-1.5">{sub.grade}</td>
                    </> : <>
                      <td className="text-center py-1.5">{sub.mg}</td>
                      <td className="text-center py-1.5">{sub.ex}</td>
                      <td className="text-center py-1.5 font-semibold">{sub.total}</td>
                      <td className="text-center py-1.5 text-slate-400">{sub.max}</td>
                      <td className="text-center py-1.5">{formatPercent(sub.percent)}</td>
                      <td className="text-center py-1.5">{sub.grade}</td>
                    </>}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 space-y-1 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">{isFrench ? 'TOTAL DES POINTS' : 'TOTAL'}:</span>
                <strong>{student.total_score} / {student.total_max}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isFrench ? 'MOYENNE' : 'AVERAGE'}:</span>
                <strong className="text-brand-blue">{formatPercent(student.percent)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isFrench ? 'COTE' : 'GRADE'}:</span>
                <strong>{student.grade}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isFrench ? 'RANG' : 'RANK'}:</span>
                <strong>{student.rank} {isFrench ? 'sur' : 'of'} {totalStudents}</strong>
              </div>
            </div>

            {phase === 'annual' && (
              <div className={`text-center p-4 rounded-lg mb-6 ${isPromoted ? 'bg-green-50 dark:bg-green-900/10 text-green-700' : 'bg-red-50 dark:bg-red-900/10 text-red-700'}`}>
                {isPromoted
                  ? <>🎉 {isFrench ? 'FÉLICITATIONS! Promu(e) à la classe suivante.' : 'CONGRATULATIONS! Promoted to next class.'}</>
                  : <>⚠️ {isFrench ? `Moyenne inférieure à ${promoMin}%. Redouble la classe.` : `Average below ${promoMin}%. Will repeat this class.`}</>
                }
              </div>
            )}

            <div className="text-center text-sm text-slate-500 mt-8">
              <p>{isFrench ? 'Fait à' : 'Done at'} {school?.name}, {formatDate(new Date())}</p>
              <p className="font-semibold mt-1">{school?.director_name ?? ''}</p>
              <p className="text-xs">{isFrench ? 'DIRECTION' : 'Head of School'}</p>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #report-card, #report-card * { visibility: visible; }
          #report-card { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
