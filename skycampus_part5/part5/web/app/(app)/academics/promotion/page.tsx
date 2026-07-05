'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { computeAnnualRegister } from '@/lib/academics/computeRegister'
import { formatPercent } from '@/lib/utils/formatters'

interface PromotionRow {
  student_id: string
  full_name: string
  admission_number: string
  class_id: string
  class_name: string
  annual_percent: number
  decision: 'promote' | 'repeat' | 'graduate'
  next_class_id: string | null
  next_class_name: string
  confirmed: boolean
}

export default function PromotionPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [classes, setClasses]   = useState<any[]>([])
  const [yearId, setYearId]     = useState('')
  const [years, setYears]       = useState<any[]>([])
  const [classFilter, setClassFilter] = useState('')
  const [promotionMin, setMin]  = useState(50)
  const [rows, setRows]         = useState<PromotionRow[]>([])
  const [loading, setLoading]   = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => { loadInit() }, [])

  async function loadInit() {
    const [clsRes, yrRes, schRes] = await Promise.all([
      supabase.from('classes').select('id,name,level,display_order').eq('school_id', user!.school_id).order('display_order'),
      supabase.from('academic_years').select('id,name').eq('school_id', user!.school_id).order('start_date', { ascending: false }),
      supabase.from('schools').select('promotion_min').eq('id', user!.school_id).single(),
    ])
    setClasses(clsRes.data ?? [])
    setYears(yrRes.data ?? [])
    if (schRes.data) setMin(schRes.data.promotion_min ?? 50)
    const current = yrRes.data?.find((y:any) => true) // most recent
    if (yrRes.data?.[0]) setYearId(yrRes.data[0].id)
  }

  function getNextClass(currentClassId: string): { id: string|null; name: string } {
    const sorted = [...classes].sort((a,b) => a.display_order - b.display_order)
    const idx = sorted.findIndex(c => c.id === currentClassId)
    if (idx === -1 || idx === sorted.length - 1) return { id: null, name: 'Graduated' }
    return { id: sorted[idx+1].id, name: sorted[idx+1].name }
  }

  async function loadResults() {
    if (!yearId) { toast.error('Select an academic year'); return }
    setLoading(true)
    try {
      const targetClasses = classFilter ? classes.filter(c => c.id === classFilter) : classes
      const allRows: PromotionRow[] = []

      for (const cls of targetClasses) {
        const reg = await computeAnnualRegister(user!.school_id, cls.id, yearId)
        const next = getNextClass(cls.id)

        reg.students.forEach(s => {
          const passed = s.percent >= promotionMin
          allRows.push({
            student_id: s.student_id,
            full_name: s.full_name,
            admission_number: s.admission_number,
            class_id: cls.id,
            class_name: cls.name,
            annual_percent: s.percent,
            decision: passed ? (next.id ? 'promote' : 'graduate') : 'repeat',
            next_class_id: passed ? next.id : cls.id,
            next_class_name: passed ? next.name : cls.name,
            confirmed: false,
          })
        })
      }

      setRows(allRows)
      toast.success(`Loaded ${allRows.length} students`)
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to compute results')
    } finally {
      setLoading(false)
    }
  }

  function overrideDecision(studentId: string, decision: 'promote'|'repeat') {
    setRows(prev => prev.map(r => {
      if (r.student_id !== studentId) return r
      if (decision === 'repeat') {
        return { ...r, decision: 'repeat', next_class_id: r.class_id, next_class_name: r.class_name }
      }
      const next = getNextClass(r.class_id)
      return { ...r, decision: next.id ? 'promote' : 'graduate', next_class_id: next.id, next_class_name: next.name }
    }))
  }

  async function confirmAll() {
    setConfirming(true)

    // Find next academic year (or create reference to "next year" conceptually)
    const currentYearIdx = years.findIndex(y => y.id === yearId)
    const nextYear = years[currentYearIdx - 1] // years sorted desc, so idx-1 is more recent

    let success = 0
    for (const row of rows) {
      try {
        if (row.decision === 'graduate') {
          await supabase.from('students').update({ status: 'graduated' }).eq('id', row.student_id)
        } else if (row.next_class_id) {
          // Mark old class history as not current
          await supabase.from('student_class_history')
            .update({ is_current: false })
            .eq('student_id', row.student_id).eq('class_id', row.class_id)

          // Insert new class history row if next year exists
          if (nextYear) {
            await supabase.from('student_class_history').insert({
              school_id: user!.school_id,
              student_id: row.student_id,
              class_id: row.next_class_id,
              academic_year_id: nextYear.id,
              is_current: true,
              promoted_from: row.decision === 'promote' ? row.class_id : null,
              promoted_at: new Date().toISOString(),
            })
          }
        }
        success++
      } catch { /* continue */ }
    }

    setConfirming(false)
    setShowConfirm(false)
    toast.success(`${success} students processed!`)
    setRows(prev => prev.map(r => ({ ...r, confirmed: true })))
  }

  const promoteCount  = rows.filter(r => r.decision === 'promote').length
  const repeatCount   = rows.filter(r => r.decision === 'repeat').length
  const graduateCount = rows.filter(r => r.decision === 'graduate').length

  async function exportList() {
    const { utils, writeFile } = await import('xlsx')
    const data = rows.map((r,i) => ({
      '#': i+1, Student: r.full_name, 'Adm #': r.admission_number,
      Class: r.class_name, 'Annual %': r.annual_percent.toFixed(1),
      Decision: r.decision.toUpperCase(), 'Next Class': r.next_class_name,
    }))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(data), 'Promotion')
    writeFile(wb, `promotion_list_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported!')
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Student Promotion" icon="🎓"
        actions={rows.length > 0 && <button onClick={exportList} className="btn-secondary text-sm">📥 Export List</button>}
      />

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
        ⚠️ Promotion requires Annual Average ≥ <strong>{promotionMin}%</strong>. Review decisions before confirming — this action updates student class records.
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <select className="input-base w-48" value={yearId} onChange={e => setYearId(e.target.value)}>
          {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
        </select>
        <select className="input-base w-48" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={loadResults} disabled={loading} className="btn-primary text-sm">
          {loading ? '⏳ Computing…' : '📊 Load Annual Results'}
        </button>
      </div>

      {rows.length > 0 && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-green-600">{promoteCount}</p>
              <p className="text-sm text-slate-500">🎓 Will Promote</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-amber-600">{repeatCount}</p>
              <p className="text-sm text-slate-500">🔄 Will Repeat</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-brand-blue">{graduateCount}</p>
              <p className="text-sm text-slate-500">🏆 Graduating</p>
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <table className="table-base">
              <thead>
                <tr><th>#</th><th>Student</th><th>Class</th><th>Annual %</th><th>Decision</th><th>Next Class</th><th>Override</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.student_id} className={r.confirmed ? 'opacity-50' : ''}>
                    <td className="text-slate-400 text-xs">{i+1}</td>
                    <td>
                      <p className="font-medium text-sm">{r.full_name}</p>
                      <p className="text-xs text-slate-400">{r.admission_number}</p>
                    </td>
                    <td><span className="badge-blue text-xs">{r.class_name}</span></td>
                    <td className={`font-bold ${r.annual_percent >= promotionMin ? 'text-green-600' : 'text-red-500'}`}>
                      {formatPercent(r.annual_percent)}
                    </td>
                    <td>
                      {r.decision === 'promote' && <span className="badge-green">🎓 PASS</span>}
                      {r.decision === 'repeat'  && <span className="badge-red">🔄 REPEAT</span>}
                      {r.decision === 'graduate'&& <span className="badge-blue">🏆 GRADUATE</span>}
                    </td>
                    <td className="text-sm text-slate-600 dark:text-slate-300">{r.next_class_name}</td>
                    <td>
                      {!r.confirmed && (
                        <div className="flex gap-1">
                          <button onClick={() => overrideDecision(r.student_id, 'promote')}
                            className={`text-xs px-2 py-0.5 rounded ${r.decision!=='repeat' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                            Promote
                          </button>
                          <button onClick={() => overrideDecision(r.student_id, 'repeat')}
                            className={`text-xs px-2 py-0.5 rounded ${r.decision==='repeat' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}>
                            Repeat
                          </button>
                        </div>
                      )}
                      {r.confirmed && <span className="text-xs text-green-600">✓ Done</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirm */}
          <div className="flex justify-end">
            <button onClick={() => setShowConfirm(true)} disabled={rows.every(r=>r.confirmed)} className="btn-primary">
              🎓 Confirm All Promotions
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmAll}
        title="Confirm Promotion"
        message={`This will update class records for ${rows.length} students (${promoteCount} promoted, ${repeatCount} repeating, ${graduateCount} graduating). This action cannot be easily undone.`}
        confirmLabel="Yes, Confirm All"
        loading={confirming}
        danger
      />
    </div>
  )
}
