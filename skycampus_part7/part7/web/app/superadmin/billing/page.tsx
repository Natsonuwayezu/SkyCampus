'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils/formatters'

export default function BillingPage() {
  const supabase = createClient()
  const [subs, setSubs]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('subscriptions')
      .select('*, schools(name, slug, status)')
      .order('started_at', { ascending: false })
    setSubs(data ?? [])
    setLoading(false)
  }

  const totalMRR = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.amount ?? 0), 0)

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-white">💰 Platform Billing</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-display font-bold text-2xl text-white">${totalMRR.toFixed(0)}</p>
          <p className="text-sm text-slate-400 mt-1">Monthly Recurring Revenue</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-display font-bold text-2xl text-white">{subs.filter(s=>s.status==='active').length}</p>
          <p className="text-sm text-slate-400 mt-1">Active Subscriptions</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="font-display font-bold text-2xl text-amber-400">{subs.filter(s=>s.status==='expired').length}</p>
          <p className="text-sm text-slate-400 mt-1">Expired Subscriptions</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 font-display font-bold text-white">All Subscriptions</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left px-5 py-3">School</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Cycle</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Started</th>
              <th className="text-left px-5 py-3">Expires</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : subs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">No subscriptions yet.</td></tr>
            ) : subs.map((s:any) => (
              <tr key={s.id} className="border-b border-white/5 text-slate-200 hover:bg-white/5">
                <td className="px-5 py-3">
                  <Link href={`/superadmin/schools/${s.school_id}`} className="hover:text-brand-blue">
                    {s.schools?.name}
                  </Link>
                </td>
                <td className="px-5 py-3 capitalize">{s.plan}</td>
                <td className="px-5 py-3">${s.amount ?? '—'}</td>
                <td className="px-5 py-3 capitalize">{s.billing_cycle}</td>
                <td className="px-5 py-3">
                  <span className={s.status==='active'?'badge-green':s.status==='expired'?'badge-red':'badge-gray'}>{s.status}</span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">{formatDate(s.started_at)}</td>
                <td className="px-5 py-3 text-xs text-slate-400">{s.expires_at ? formatDate(s.expires_at) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
