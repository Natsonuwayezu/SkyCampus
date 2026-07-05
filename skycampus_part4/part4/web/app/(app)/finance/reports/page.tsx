'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatRWF } from '@/lib/utils/formatters'

interface CategorySummary { name:string; billed:number; collected:number; outstanding:number; pct:number }
interface ClassSummary    { class_name:string; billed:number; collected:number; pct:number }

export default function FinancialReportsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [catSummary, setCat]   = useState<CategorySummary[]>([])
  const [clsSummary, setCls]   = useState<ClassSummary[]>([])
  const [totals, setTotals]    = useState({ billed:0, collected:0, outstanding:0, waivers:0 })
  const [loading, setLoading]  = useState(true)
  const [activeTab, setTab]    = useState<'summary'|'category'|'class'>('summary')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    // All student fees with categories and class info
    const { data } = await supabase
      .from('student_fees')
      .select(`
        amount, amount_paid, amount_waived,
        fee_categories(name),
        students(
          student_class_history!inner(is_current, classes(name))
        )
      `)
      .eq('school_id', user!.school_id)
      .eq('students.student_class_history.is_current', true)

    if (!data) { setLoading(false); return }

    let billed=0, collected=0, waivers=0
    const catMap: Record<string,{billed:number;collected:number}> = {}
    const clsMap: Record<string,{billed:number;collected:number}> = {}

    data.forEach((r: any) => {
      const cat  = r.fee_categories?.name ?? 'Unknown'
      const cls  = r.students?.student_class_history?.[0]?.classes?.name ?? 'Unknown'
      billed    += r.amount
      collected += r.amount_paid
      waivers   += r.amount_waived

      catMap[cat] = catMap[cat] ?? { billed:0, collected:0 }
      catMap[cat].billed    += r.amount
      catMap[cat].collected += r.amount_paid

      clsMap[cls] = clsMap[cls] ?? { billed:0, collected:0 }
      clsMap[cls].billed    += r.amount
      clsMap[cls].collected += r.amount_paid
    })

    setTotals({ billed, collected, outstanding: billed - collected, waivers })
    setCat(Object.entries(catMap).map(([name,v]) => ({
      name, ...v, outstanding: v.billed - v.collected,
      pct: v.billed > 0 ? Math.round((v.collected/v.billed)*100) : 0,
    })).sort((a,b) => b.billed - a.billed))
    setCls(Object.entries(clsMap).map(([class_name,v]) => ({
      class_name, ...v, pct: v.billed > 0 ? Math.round((v.collected/v.billed)*100) : 0,
    })).sort((a,b) => b.billed - a.billed))
    setLoading(false)
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const wb = utils.book_new()
    // Summary sheet
    utils.book_append_sheet(wb, utils.json_to_sheet([
      { Metric:'Total Billed', 'Amount (RWF)': totals.billed },
      { Metric:'Total Collected', 'Amount (RWF)': totals.collected },
      { Metric:'Outstanding', 'Amount (RWF)': totals.outstanding },
      { Metric:'Total Waivers', 'Amount (RWF)': totals.waivers },
    ]), 'Summary')
    // Category sheet
    utils.book_append_sheet(wb, utils.json_to_sheet(catSummary.map(c => ({
      Category: c.name, Billed: c.billed, Collected: c.collected, Outstanding: c.outstanding, '%': c.pct,
    }))), 'By Category')
    // Class sheet
    utils.book_append_sheet(wb, utils.json_to_sheet(clsSummary.map(c => ({
      Class: c.class_name, Billed: c.billed, Collected: c.collected, '%': c.pct,
    }))), 'By Class')
    writeFile(wb, `financial_report_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Report exported!')
  }

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="Financial Reports" icon="📊"
        actions={<button onClick={exportExcel} className="btn-secondary text-sm">📥 Export Excel</button>}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Billed',   value: totals.billed,       color:'#1A8FE3' },
          { label:'Collected',      value: totals.collected,    color:'#10B981' },
          { label:'Outstanding',    value: totals.outstanding,  color:'#EF4444' },
          { label:'Total Waivers',  value: totals.waivers,      color:'#8B5CF6' },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="w-1.5 h-6 rounded-full mb-3" style={{backgroundColor:k.color}}/>
            <p className="font-display font-bold text-xl text-slate-800 dark:text-white">{formatRWF(k.value)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Overall collection rate */}
      {totals.billed > 0 && (
        <div className="card p-5">
          <div className="flex justify-between mb-2">
            <span className="font-display font-bold text-sm text-slate-700 dark:text-white">Overall Collection Rate</span>
            <span className="font-bold text-brand-blue">{Math.round((totals.collected/totals.billed)*100)}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue rounded-full transition-all" style={{width:`${Math.round((totals.collected/totals.billed)*100)}%`}}/>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1">
        {(['summary','category','class'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab===t?'bg-brand-blue text-white':'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
            {t === 'summary' ? '📋' : t === 'category' ? '🏷️' : '🏛️'} {t}
          </button>
        ))}
      </div>

      {/* Summary tab */}
      {activeTab === 'summary' && (
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Metric</th><th className="text-right">Amount (RWF)</th><th className="text-right">%</th></tr></thead>
            <tbody>
              <tr><td className="font-medium">Total Billed</td><td className="text-right">{formatRWF(totals.billed)}</td><td className="text-right">100%</td></tr>
              <tr><td className="font-medium text-green-600">Collected</td><td className="text-right text-green-600 font-semibold">{formatRWF(totals.collected)}</td><td className="text-right text-green-600">{totals.billed>0?Math.round((totals.collected/totals.billed)*100):0}%</td></tr>
              <tr><td className="font-medium text-red-600">Outstanding</td><td className="text-right text-red-600 font-semibold">{formatRWF(totals.outstanding)}</td><td className="text-right text-red-600">{totals.billed>0?Math.round((totals.outstanding/totals.billed)*100):0}%</td></tr>
              <tr><td className="font-medium text-purple-600">Waivers</td><td className="text-right text-purple-600">{formatRWF(totals.waivers)}</td><td className="text-right">—</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Category tab */}
      {activeTab === 'category' && (
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Category</th><th>Billed</th><th>Collected</th><th>Outstanding</th><th>Rate</th></tr></thead>
            <tbody>
              {catSummary.map(c => (
                <tr key={c.name}>
                  <td className="font-medium">{c.name}</td>
                  <td>{formatRWF(c.billed)}</td>
                  <td className="text-green-600 font-semibold">{formatRWF(c.collected)}</td>
                  <td className="text-red-500">{formatRWF(c.outstanding)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue rounded-full" style={{width:`${c.pct}%`}}/>
                      </div>
                      <span className="text-xs">{c.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Class tab */}
      {activeTab === 'class' && (
        <div className="card overflow-hidden">
          <table className="table-base">
            <thead><tr><th>Class</th><th>Billed</th><th>Collected</th><th>Rate</th></tr></thead>
            <tbody>
              {clsSummary.map(c => (
                <tr key={c.class_name}>
                  <td><span className="badge-blue">{c.class_name}</span></td>
                  <td>{formatRWF(c.billed)}</td>
                  <td className="text-green-600 font-semibold">{formatRWF(c.collected)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.pct>=80?'bg-green-500':c.pct>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${c.pct}%`}}/>
                      </div>
                      <span className={`text-sm font-semibold ${c.pct>=80?'text-green-600':c.pct>=50?'text-amber-600':'text-red-600'}`}>{c.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
