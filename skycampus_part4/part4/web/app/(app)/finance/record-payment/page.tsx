'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface Student { id:string; full_name:string; admission_number:string; class_name:string }
interface FeeRow { id:string; amount:number; amount_paid:number; amount_waived:number; status:string; fee_categories:{name:string} }
interface Allocation { fee_id:string; fee_name:string; allocating:number; remaining:number }

const METHODS = ['cash','bank_transfer','mobile_money','cheque'] as const

export default function RecordPaymentPage() {
  const { user }   = useAuthStore()
  const params     = useSearchParams()
  const supabase   = createClient()

  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<Student[]>([])
  const [student, setStudent] = useState<Student|null>(null)
  const [fees, setFees]       = useState<FeeRow[]>([])
  const [amount, setAmount]   = useState<number>(0)
  const [method, setMethod]   = useState<string>('cash')
  const [reference, setRef]   = useState('')
  const [notes, setNotes]     = useState('')
  const [date, setDate]       = useState(new Date().toISOString().slice(0,10))
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [saving, setSaving]   = useState(false)
  const [receipt, setReceipt] = useState<any>(null)
  const searchRef = useRef<any>(null)

  // Pre-select student from URL param
  useEffect(() => {
    const sid = params.get('student')
    if (sid) loadStudentById(sid)
  }, [])

  // Search students
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('students')
        .select(`
          id, first_name, last_name, admission_number,
          student_class_history!inner(is_current, classes(name))
        `)
        .eq('school_id', user!.school_id)
        .eq('status', 'active')
        .eq('student_class_history.is_current', true)
        .or(`last_name.ilike.%${query}%,first_name.ilike.%${query}%,admission_number.ilike.%${query}%`)
        .limit(8)
      setResults((data ?? []).map((s:any) => ({
        id: s.id,
        full_name: `${s.last_name} ${s.first_name}`,
        admission_number: s.admission_number,
        class_name: s.student_class_history?.[0]?.classes?.name ?? '',
      })))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  async function loadStudentById(id: string) {
    const { data } = await supabase
      .from('students')
      .select(`id, first_name, last_name, admission_number, student_class_history!inner(is_current, classes(name))`)
      .eq('id', id).eq('student_class_history.is_current', true).single()
    if (data) {
      const s = data as any
      selectStudent({
        id: s.id, full_name: `${s.last_name} ${s.first_name}`,
        admission_number: s.admission_number,
        class_name: s.student_class_history?.[0]?.classes?.name ?? '',
      })
    }
  }

  async function selectStudent(s: Student) {
    setStudent(s)
    setResults([])
    setQuery(s.full_name)
    const { data } = await supabase
      .from('student_fees')
      .select('id, amount, amount_paid, amount_waived, status, fee_categories(name)')
      .eq('student_id', s.id)
      .in('status', ['pending','partial'])
      .order('created_at')
    setFees((data as any) ?? [])
  }

  // Auto-compute allocation whenever amount changes
  useEffect(() => {
    if (!fees.length || !amount) { setAllocations([]); return }
    let remaining = amount
    const allocs: Allocation[] = []
    for (const f of fees) {
      if (remaining <= 0) break
      const due = f.amount - f.amount_paid - f.amount_waived
      if (due <= 0) continue
      const paying = Math.min(remaining, due)
      allocs.push({
        fee_id: f.id,
        fee_name: (f.fee_categories as any).name,
        allocating: paying,
        remaining: due - paying,
      })
      remaining -= paying
    }
    setAllocations(allocs)
  }, [amount, fees])

  const outstanding = fees.reduce((s,f) => s + f.amount - f.amount_paid - f.amount_waived, 0)
  const overpayment = Math.max(0, amount - outstanding)

  async function recordPayment() {
    if (!student) { toast.error('Select a student first'); return }
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return }
    setSaving(true)

    try {
      // Generate receipt number
      const { data: rcptNum } = await supabase.rpc('generate_receipt_number', { p_school_id: user!.school_id })

      // Insert payment
      const { data: payment, error: payErr } = await supabase
        .from('payments')
        .insert({
          school_id:       user!.school_id,
          student_id:      student.id,
          receipt_number:  rcptNum,
          total_amount:    amount,
          payment_method:  method,
          reference_number: reference || null,
          payment_date:    date,
          notes:           notes || null,
          recorded_by:     user!.id,
        })
        .select('id').single()

      if (payErr || !payment) throw payErr ?? new Error('Failed to create payment')

      // Insert allocations
      for (const a of allocations) {
        await supabase.from('payment_allocations').insert({
          school_id:     user!.school_id,
          payment_id:    payment.id,
          student_fee_id: a.fee_id,
          amount:         a.allocating,
        })
        // Update student_fee amount_paid
        const fee = fees.find(f => f.id === a.fee_id)!
        await supabase.from('student_fees').update({
          amount_paid: fee.amount_paid + a.allocating,
        }).eq('id', a.fee_id)
      }

      // Handle overpayment → credit balance
      if (overpayment > 0) {
        const { data: cb } = await supabase.from('credit_balances').select('balance').eq('student_id', student.id).maybeSingle()
        if (cb) {
          await supabase.from('credit_balances').update({ balance: cb.balance + overpayment, updated_at: new Date().toISOString() }).eq('student_id', student.id)
        } else {
          await supabase.from('credit_balances').insert({ school_id: user!.school_id, student_id: student.id, balance: overpayment })
        }
      }

      // Notification
      await supabase.from('notifications').insert({
        school_id: user!.school_id, user_id: user!.id,
        type: 'payment', title: `Payment received: ${formatRWF(amount)} — ${student.full_name}`,
        body: `Receipt: ${rcptNum}`,
      })

      // Show receipt
      setReceipt({
        receipt_number: rcptNum, date, student, amount, method,
        allocations, overpayment, recorded_by: user!.full_name,
      })
      toast.success(`Payment recorded! Receipt: ${rcptNum}`)

      // Reset form
      setStudent(null); setQuery(''); setFees([]); setAmount(0)
      setMethod('cash'); setRef(''); setNotes(''); setAllocations([])
    } catch(err: any) {
      toast.error(err.message ?? 'Payment failed')
    } finally {
      setSaving(false)
    }
  }

  function printReceipt() { window.print() }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Record Payment" icon="💸" />

      {/* Student search */}
      <div className="card p-5">
        <label className="label-xs">Search Student</label>
        <div className="relative">
          <input
            ref={searchRef}
            className="input-base"
            placeholder="Type name, ID, or admission number…"
            value={query}
            onChange={e => { setQuery(e.target.value); setStudent(null) }}
            autoComplete="off"
          />
          {results.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 card shadow-xl overflow-hidden">
              {results.map(s => (
                <button key={s.id} onClick={() => selectStudent(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 text-left transition">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-sm flex-shrink-0">
                    {s.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{s.full_name}</p>
                    <p className="text-xs text-slate-400">{s.admission_number} · {s.class_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {student && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold text-brand-blue">{student.full_name}</p>
              <p className="text-xs text-slate-500">{student.admission_number} · {student.class_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-red-600">{formatRWF(outstanding)} outstanding</p>
              <p className="text-xs text-slate-400">{fees.length} pending fee{fees.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment form */}
      {student && (
        <>
          <div className="card p-5 space-y-4">
            <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white">Payment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Amount (RWF) *</label>
                <input
                  type="number" min={1} className="input-base text-lg font-bold"
                  value={amount || ''}
                  onChange={e => setAmount(+e.target.value)}
                  placeholder="0"
                />
                {outstanding > 0 && (
                  <button onClick={() => setAmount(outstanding)} className="text-xs text-brand-blue hover:underline mt-1">
                    Pay full outstanding ({formatRWF(outstanding)})
                  </button>
                )}
              </div>
              <div>
                <label className="label-xs">Payment Date</label>
                <input type="date" className="input-base" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            {/* Method */}
            <div>
              <label className="label-xs">Payment Method</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                {METHODS.map(m => (
                  <button key={m} onClick={() => setMethod(m)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition ${
                      method === m
                        ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20 text-brand-blue'
                        : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300'
                    }`}>
                    {m === 'cash' ? '💵' : m === 'bank_transfer' ? '🏦' : m === 'mobile_money' ? '📱' : '📄'}{' '}
                    {m.replace('_',' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-xs">Reference # (optional)</label>
                <input className="input-base" placeholder="Bank ref, transaction ID…" value={reference} onChange={e => setRef(e.target.value)} />
              </div>
              <div>
                <label className="label-xs">Notes (optional)</label>
                <input className="input-base" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Allocation preview */}
          {amount > 0 && allocations.length > 0 && (
            <div className="card p-5">
              <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">💡 Allocation Preview</h2>
              <div className="space-y-2">
                {allocations.map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={a.remaining === 0 ? '✅' : '🟡'}>{a.remaining === 0 ? '✅' : '🟡'}</span>
                      <span className="text-slate-700 dark:text-slate-200">{a.fee_name}</span>
                      {a.remaining > 0 && <span className="text-xs text-amber-600">({formatRWF(a.remaining)} still remaining)</span>}
                    </div>
                    <span className="font-semibold text-green-600">{formatRWF(a.allocating)}</span>
                  </div>
                ))}
                {overpayment > 0 && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-blue-600">💳 Credit balance (overpayment)</span>
                    <span className="font-semibold text-blue-600">{formatRWF(overpayment)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span>Total Payment</span>
                  <span className="text-brand-blue">{formatRWF(amount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button onClick={recordPayment} disabled={saving || !amount} className="btn-primary flex-1 justify-center py-3">
              {saving ? '⏳ Recording…' : '💾 Record Payment & Generate Receipt'}
            </button>
          </div>
        </>
      )}

      {/* Receipt modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setReceipt(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🧾</div>
              <h2 className="font-display font-bold text-xl">RECEIPT / REÇU</h2>
              <p className="text-brand-blue font-mono font-bold">{receipt.receipt_number}</p>
            </div>
            <div className="space-y-2 text-sm border-t border-b border-slate-100 dark:border-slate-700 py-4 mb-4">
              <div className="flex justify-between"><span className="text-slate-400">Date</span><span>{formatDate(receipt.date)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Student</span><span className="font-semibold">{receipt.student.full_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Class</span><span>{receipt.student.class_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Method</span><span className="capitalize">{receipt.method.replace('_',' ')}</span></div>
            </div>
            <div className="space-y-1 text-sm mb-4">
              {receipt.allocations.map((a: Allocation, i: number) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-300">{a.fee_name}</span>
                  <span>{formatRWF(a.allocating)}</span>
                </div>
              ))}
              {receipt.overpayment > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Credit Balance</span><span>{formatRWF(receipt.overpayment)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-slate-200 dark:border-slate-700 pt-3 mb-1">
              <span>TOTAL RECEIVED</span>
              <span className="text-brand-blue">{formatRWF(receipt.amount)}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Received by: {receipt.recorded_by}</p>
            <div className="flex gap-3">
              <button onClick={printReceipt} className="btn-primary flex-1 justify-center">🖨️ Print</button>
              <button onClick={() => setReceipt(null)} className="btn-secondary flex-1 justify-center">❌ Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
