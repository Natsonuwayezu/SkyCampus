'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface Payment {
  id: string; receipt_number: string; total_amount: number
  payment_method: string; payment_date: string
  notes: string|null; is_reversed: boolean; created_at: string
  students: { first_name:string; last_name:string; admission_number:string }
  users: { full_name:string } | null
}

export default function PaymentHistoryPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [method, setMethod]     = useState('')
  const [dateFrom, setFrom]     = useState('')
  const [dateTo, setTo]         = useState('')
  const [reverseId, setReverse] = useState<string|null>(null)
  const [reverseReason, setReason] = useState('')
  const [page, setPage]         = useState(1)
  const PER = 25

  useEffect(() => { load() }, [method, dateFrom, dateTo])

  async function load() {
    setLoading(true)
    let q = supabase
      .from('payments')
      .select(`
        id, receipt_number, total_amount, payment_method,
        payment_date, notes, is_reversed, created_at,
        students(first_name, last_name, admission_number),
        users(full_name)
      `)
      .eq('school_id', user!.school_id)
      .order('payment_date', { ascending: false })
      .limit(500)

    if (method)   q = q.eq('payment_method', method)
    if (dateFrom) q = q.gte('payment_date', dateFrom)
    if (dateTo)   q = q.lte('payment_date', dateTo)

    const { data } = await q
    setPayments(data as any ?? [])
    setLoading(false)
    setPage(1)
  }

  async function reversePayment() {
    if (!reverseId) return
    await supabase.from('payments').update({
      is_reversed: true, reversed_at: new Date().toISOString(),
      reversed_by: user!.id, reversal_reason: reverseReason,
    }).eq('id', reverseId)
    toast.success('Payment reversed')
    setReverse(null); setReason(''); load()
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = filtered.map(p => ({
      'Receipt #': p.receipt_number,
      'Date': p.payment_date,
      'Student': `${p.students.last_name} ${p.students.first_name}`,
      'Adm.#': p.students.admission_number,
      'Amount (RWF)': p.total_amount,
      'Method': p.payment_method,
      'Recorded By': p.users?.full_name ?? '',
      'Notes': p.notes ?? '',
      'Reversed': p.is_reversed ? 'Yes' : 'No',
    }))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(rows), 'Payments')
    writeFile(wb, `payments_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported!')
  }

  const filtered = payments.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    const s = p.students
    return p.receipt_number.toLowerCase().includes(q) ||
      `${s.last_name} ${s.first_name}`.toLowerCase().includes(q) ||
      s.admission_number.toLowerCase().includes(q)
  })

  const totalAmount = filtered.filter(p => !p.is_reversed).reduce((s,p) => s + p.total_amount, 0)
  const totalPages  = Math.ceil(filtered.length / PER)
  const paged       = filtered.slice((page-1)*PER, page*PER)

  const METHOD_ICON: Record<string,string> = {
    cash:'💵', bank_transfer:'🏦', mobile_money:'📱', cheque:'📄'
  }

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Payment History" icon="📜"
        subtitle={`${filtered.length} payments · ${formatRWF(totalAmount)} total`}
        actions={<button onClick={exportExcel} className="btn-secondary text-sm">📥 Export Excel</button>}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input className="input-base max-w-xs" placeholder="🔍 Receipt #, student name, ID…"
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <select className="input-base w-40" value={method} onChange={e => { setMethod(e.target.value); setPage(1) }}>
          <option value="">All Methods</option>
          <option value="cash">💵 Cash</option>
          <option value="bank_transfer">🏦 Bank Transfer</option>
          <option value="mobile_money">📱 Mobile Money</option>
          <option value="cheque">📄 Cheque</option>
        </select>
        <input type="date" className="input-base w-40" placeholder="From" value={dateFrom} onChange={e => setFrom(e.target.value)} />
        <input type="date" className="input-base w-40" placeholder="To"   value={dateTo}   onChange={e => setTo(e.target.value)} />
        {(dateFrom||dateTo||method) && (
          <button onClick={() => { setFrom(''); setTo(''); setMethod('') }} className="text-sm text-slate-400 hover:text-slate-600">✕ Clear</button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Receipt #</th><th>Date</th><th>Student</th>
                <th>Amount</th><th>Method</th><th>Recorded By</th>
                <th>Status</th><th className="w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"/>Loading…
                  </span>
                </td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No payments found.</td></tr>
              ) : paged.map(p => (
                <tr key={p.id} className={p.is_reversed ? 'opacity-50' : ''}>
                  <td className="font-mono text-xs text-slate-600 dark:text-slate-300">{p.receipt_number}</td>
                  <td className="text-sm text-slate-500">{formatDate(p.payment_date)}</td>
                  <td>
                    <p className="font-medium text-slate-800 dark:text-white text-sm">
                      {p.students.last_name} {p.students.first_name}
                    </p>
                    <p className="text-xs text-slate-400">{p.students.admission_number}</p>
                  </td>
                  <td className="font-bold text-green-600">{formatRWF(p.total_amount)}</td>
                  <td>
                    <span className="text-sm capitalize">
                      {METHOD_ICON[p.payment_method] ?? '💳'} {p.payment_method.replace('_',' ')}
                    </span>
                  </td>
                  <td className="text-sm text-slate-500">{p.users?.full_name ?? '—'}</td>
                  <td>
                    {p.is_reversed
                      ? <span className="badge-red">Reversed</span>
                      : <span className="badge-green">Valid</span>
                    }
                  </td>
                  <td>
                    {!p.is_reversed && (
                      <button onClick={() => setReverse(p.id)} className="text-red-400 hover:text-red-600 text-xs">↩️ Reverse</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-400">{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">‹</button>
              {Array.from({length:Math.min(7,totalPages)},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs font-medium ${page===i+1?'bg-brand-blue text-white':'hover:bg-slate-100 text-slate-600'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Reverse confirm */}
      {reverseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setReverse(null)}>
          <div className="card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="font-display font-bold text-slate-800 dark:text-white mb-3">↩️ Reverse Payment</h2>
            <p className="text-sm text-slate-500 mb-4">This action will mark the payment as reversed. Please provide a reason.</p>
            <textarea rows={3} className="input-base resize-none mb-4" placeholder="Reason for reversal…"
              value={reverseReason} onChange={e => setReason(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setReverse(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={reversePayment} className="btn-danger flex-1">↩️ Reverse Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
