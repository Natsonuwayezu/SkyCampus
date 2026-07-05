'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { computeClassRegister, type Phase } from '@/lib/academics/computeRegister'
import { formatPercent } from '@/lib/utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const GRADE_COLORS: Record<string,string> = {
  'A+':'#10B981','A':'#34D399','A-':'#6EE7B7','B+':'#1A8FE3','B':'#60A5FA',
  'B-':'#93C5FD','C':'#F59E0B','D':'#EF4444',
}

export default function StatisticsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses] = useState<any[]>([])
  const [terms, setTerms]     = useState<any[]>([])
  const [termId, setTermId]   = useState('')
  const [loading, setLoading] = useState(false)
  const [classAverages, setClassAverages] = useState<{name:string; average:number}[]>([])
  const [gradeDist, setGradeDist] = useState<{name:string; value:number}[]>([])
  const [subjectPerf, setSubjectPerf] = useState<any[]>([])

  useEffect(() => { loadInit() }, [])
  useEffect(() => { if (termId && classes.length) loadStats() }, [termId, classes])

  async function loadInit() {
    const [clsRes, yrRes] = await Promise.all([
      supabase.from('classes').select('id,name,level').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('academic_years').select('id').eq('school_id', user!.school_id).eq('is_current', true).single(),
    ])
    setClasses(clsRes.data ?? [])
    if (yrRes.data) {
      const { data: termData } = await supabase.from('terms').select('id,name,is_current').eq('academic_year_id', yrRes.data.id).order('term_number')
      setTerms(termData ?? [])
      const current = termData?.find(t => t.is_current)
      if (current) setTermId(current.id)
    }
  }

  async function loadStats() {
    setLoading(true)
    try {
      const allGrades: Record<string, number> = {}
      const classAvgs: {name:string; average:number}[] = []
      const subjectMap: Record<string, { total:number; count:number; max:number; min:number; pass:number }> = {}

      for (const cls of classes) {
        const reg = await computeClassRegister(user!.school_id, cls.id, termId, 'post_mid')
        if (reg.students.length === 0) continue

        classAvgs.push({ name: cls.name, average: reg.class_average })

        reg.students.forEach(s => {
          allGrades[s.grade] = (allGrades[s.grade] ?? 0) + 1
          s.subjects.forEach(sub => {
            if (!subjectMap[sub.subject_name]) {
              subjectMap[sub.subject_name] = { total:0, count:0, max:0, min:100, pass:0 }
            }
            const m = subjectMap[sub.subject_name]
            m.total += sub.percent
            m.count += 1
            m.max = Math.max(m.max, sub.percent)
            m.min = Math.min(m.min, sub.percent)
            if (sub.percent >= 50) m.pass += 1
          })
        })
      }

      setClassAverages(classAvgs)
      setGradeDist(Object.entries(allGrades).map(([name, value]) => ({ name, value })))
      setSubjectPerf(Object.entries(subjectMap).map(([name, m]) => ({
        subject: name,
        avg: (m.total / m.count).toFixed(1),
        highest: m.max.toFixed(0),
        lowest: m.min.toFixed(0),
        passRate: Math.round((m.pass / m.count) * 100),
      })))
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  async function exportReport() {
    const { utils, writeFile } = await import('xlsx')
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(classAverages.map(c => ({ Class: c.name, 'Average %': c.average.toFixed(1) }))), 'Class Averages')
    utils.book_append_sheet(wb, utils.json_to_sheet(subjectPerf), 'Subject Performance')
    utils.book_append_sheet(wb, utils.json_to_sheet(gradeDist), 'Grade Distribution')
    writeFile(wb, `statistics_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported!')
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Statistics" icon="📈"
        actions={<button onClick={exportReport} disabled={loading} className="btn-secondary text-sm">📥 Export Report</button>}
      />

      <div className="card p-4 flex gap-3">
        <select className="input-base w-48" value={termId} onChange={e => setTermId(e.target.value)}>
          {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Grade distribution */}
            <div className="card p-5">
              <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-4">📊 Grade Distribution</h2>
              {gradeDist.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No data yet.</p> : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={gradeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e:any) => `${e.name}: ${e.value}`}>
                      {gradeDist.map((g, i) => <Cell key={i} fill={GRADE_COLORS[g.name] ?? '#94A3B8'} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Class averages */}
            <div className="card p-5">
              <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-4">📈 Class Averages</h2>
              {classAverages.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No data yet.</p> : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={classAverages} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0,100]} tick={{fontSize:11}} />
                    <YAxis type="category" dataKey="name" tick={{fontSize:11}} width={80} />
                    <Tooltip formatter={(v:any) => `${Number(v).toFixed(1)}%`} />
                    <Bar dataKey="average" fill="#1A8FE3" radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Subject performance table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 font-display font-bold text-sm text-slate-700 dark:text-white">
              Subject Performance
            </div>
            <table className="table-base">
              <thead><tr><th>Subject</th><th>Average</th><th>Highest</th><th>Lowest</th><th>Pass Rate</th></tr></thead>
              <tbody>
                {subjectPerf.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No data for this term yet.</td></tr>
                ) : subjectPerf.map((s, i) => (
                  <tr key={i}>
                    <td className="font-medium">{s.subject}</td>
                    <td className="font-semibold text-brand-blue">{s.avg}%</td>
                    <td className="text-green-600">{s.highest}%</td>
                    <td className="text-red-500">{s.lowest}%</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-blue rounded-full" style={{width:`${s.passRate}%`}}/>
                        </div>
                        <span className="text-xs">{s.passRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
