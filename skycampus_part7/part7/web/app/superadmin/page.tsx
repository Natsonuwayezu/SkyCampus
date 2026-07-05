'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/formatters'

export default function SuperAdminDashboard() {
  const supabase = createClient()
  const [schools, setSchools] = useState<any[]>([])
  const [stats, setStats]     = useState({ totalSchools:0, totalUsers:0, activeSchools:0, mrr:0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: schoolData } = await supabase
      .from('schools')
      .select('id, name, slug, plan, status, created_at')
      .order('created_at', { ascending: false })

    const schoolsWithCounts = await Promise.all((schoolData ?? []).map(async (s: any) => {
      const { count } = await supabase.from('students').select('*', { count:'exact', head:true }).eq('school_id', s.id).eq('status', 'active')
      return { ...s, student_count: count ?? 0 }
    }))
    setSchools(schoolsWithCounts)

    const { count: userCount } = await supabase.from('users').select('*', { count:'exact', head:true })
    const activeCount = schoolsWithCounts.filter(s => s.status === 'active').length

    setStats({
      totalSchools: schoolsWithCounts.length,
      totalUsers: userCount ?? 0,
      activeSchools: activeCount,
      mrr: schoolsWithCounts.length * 150, // placeholder estimate
    })
    setLoading(false)
  }

  const STATUS_BADGE: Record<string,string> = {
    active: 'badge-green', trial: 'badge-amber', suspended: 'badge-red',
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl text-white">📊 Platform Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon:'🏫', label:'Schools', value: stats.totalSchools, sub:`${stats.activeSchools} active` },
          { icon:'👥', label:'Total Users', value: stats.totalUsers, sub:'across all schools' },
          { icon:'💰', label:'Est. MRR', value: `$${stats.mrr}`, sub:'monthly recurring' },
          { icon:'📊', label:'Active Rate', value: stats.totalSchools ? `${Math.round((stats.activeSchools/stats.totalSchools)*100)}%` : '0%', sub:`${stats.activeSchools}/${stats.totalSchools} online` },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <span className="text-2xl">{s.icon}</span>
            <p className="font-display font-bold text-2xl text-white mt-2">{s.value}</p>
            <p className="text-sm text-slate-300 mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display font-bold text-white">All Schools</h2>
          <Link href="/superadmin/schools/new" className="btn-primary text-sm">➕ Add School</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left px-5 py-3 font-medium">#</th>
              <th className="text-left px-5 py-3 font-medium">School</th>
              <th className="text-left px-5 py-3 font-medium">Students</th>
              <th className="text-left px-5 py-3 font-medium">Plan</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : schools.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">No schools yet.</td></tr>
            ) : schools.slice(0,10).map((s, i) => (
              <tr key={s.id} className="border-b border-white/5 text-slate-200">
                <td className="px-5 py-3 text-slate-500">{i+1}</td>
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3">{s.student_count}</td>
                <td className="px-5 py-3 capitalize">{s.plan}</td>
                <td className="px-5 py-3"><span className={STATUS_BADGE[s.status] ?? 'badge-gray'}>{s.status}</span></td>
                <td className="px-5 py-3">
                  <Link href={`/superadmin/schools/${s.id}`} className="text-brand-blue hover:underline text-xs">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
