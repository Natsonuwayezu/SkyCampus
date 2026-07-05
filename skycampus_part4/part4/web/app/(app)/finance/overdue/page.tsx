'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import PageHeader from '@/components/shared/PageHeader'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface OverdueRow {
  student_id: string; student_name: string; admission_number: string
  class_name: string; fee_name: string; amount: number
  amount_paid: number; remaining: number; due_date: string; days_overdue: number
}

export default function OverduePage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [rows, setRows]     = useState<OverdueRow[]>([])
  const [loading, setLoading] = useState(true)
  const [daysFilter, setDays] = useState(0)
  const [classFilter, setClass] = useState('')
  const [classes, setClasses]   = useState<{id:string;name:string}[]>([])

  useEffect(() => { loadClasses(); load() }, [])

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('id,name').eq('school_id', user!.school_id).order('display_order')
    setClasses(data ?? [])
  }

  async function load() {
    setLoading(true)
    const today = new Date().toISOString().slice(0,10)
    const { data } = await supabase
      .from('student_fees')
      .select(`
        student_id, amount, amount_paid, amount_waived, due_date,
        fee_categories(name),
        students(first_name, last_name, admission_number,
          student_class_history!inner(is_current, classes(id, name))
        )
      `)
      .eq('school_id', user!.school_id)
      .in('status', ['pending','partial'])
      .lt('due_date', today)
      .not('due_date', 'is', null)

    const now = new Date()
    const mapped: OverdueRow[] = (data ?? []).map((r: any) => {
      const due  = new Date(r.due_date)
      const days = Math.floor((now.getTime() - due.getTime()) / 86400000)
      const stu  = r.students
      const cls  = stu?.student_class_history?.[0]?.classes
      return {
        student_id:       stu?.id ?? r.student_id,
        student_name:     `${stu?.last_name} ${stu?.first_name}`,
        admission_number: stu?.admission_number ?? '',
        class_name:       cls?.name ?? '',
        class_id:         cls?.id ?? '',
        fee_name:         r.fee_categories?.name ?? '',
        amount:           r.amount,
        amount_paid:      r.amount_paid,
        remaining:        r.amount - r.amount_paid - r.amount_waived,
        due_date:         r.due_date,
        days_overdue:     days,
      }
    }).sort((a,b) => b.days_overdue - a.days_overdue)

    setRows(mapped)
    setLoading(false)
  }

  const filtered = rows.filter(r => {
    if (daysFilter && r.days_overdue < daysFilter) return false
    if (classFilter && (r as any).class_id !== classFilter) return false
    return true
  })

  const totalOverdue = filtered.reduce((s,r) => s + r.remaining, 0)

  function daysColor(days: number) {
    if (days >= 90) return 'text-red-700 font-bold'
    if (days >= 30) return 'text-red-500 font-semibold'
    if (days >= 14) return 'text-amber-600'
    return 'text-slate-500'
  }

  function daysBadge(days: number) {
    if (days >= 90) return 'badge-red'
    if (days >= 30) return 'bg-orange-100 text-orange-700 badge'
    if (days >= 14) return 'badge-amber'
    return 'badge-gray'
  }

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Overdue Payments" icon="⚠️"
        subtitle={`${filtered.length} overdue · ${formatRWF(totalOverdue)} total outstanding`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select className="input-base w-44" value={daysFilter} onChange={e => setDays(+e.target.value)}>
          <option value={0}>All Overdue</option>
          <option value={7}>7+ days</option>
          <option value={14}>14+ days</option>
          <option value={30}>30+ days</option>
          <option value={60}>60+ days</option>
          <option value={90}>90+ days</option>
        </select>
        <select className="input-base w-44" value={classFilter} onChange={e => setClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '7–29 days', count: rows.filter(r=>r.days_overdue>=7&&r.days_overdue<30).length, color: 'text-amber-600' },
          { label: '30–89 days', count: rows.filter(r=>r.days_overdue>=30&&r.days_overdue<90).length, color: 'text-orange-600' },
          { label: '90+ days', count: rows.filter(r=>r.days_overdue>=90).length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.count}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th><th>Student</th><th>Class</th><th>Fee Category</th>
                <th>Amount Due</th><th>Due Date</th><th>Days Overdue</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No overdue payments! 🎉</td></tr>
              ) : filtered.map((r,i) => (
                <tr key={`${r.student_id}-${r.fee_name}`}>
                  <td className="text-slate-400 text-xs">{i+1}</td>
                  <td>
                    <p className="font-semibold text-sm">{r.student_name}</p>
                    <p className="text-xs text-slate-400">{r.admission_number}</p>
                  </td>
                  <td><span className="badge-blue text-xs">{r.class_name}</span></td>
                  <td className="text-sm text-slate-600 dark:text-slate-300">{r.fee_name}</td>
                  <td className="font-bold text-red-600">{formatRWF(r.remaining)}</td>
                  <td className="text-sm text-slate-500">{formatDate(r.due_date)}</td>
                  <td>
                    <span className={`badge ${daysBadge(r.days_overdue)}`}>{r.days_overdue}d</span>
                  </td>
                  <td>
                    <Link href={`/finance/record-payment?student=${r.student_id}`} className="btn-primary text-xs py-1 px-2">
                      💸 Pay Now
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
