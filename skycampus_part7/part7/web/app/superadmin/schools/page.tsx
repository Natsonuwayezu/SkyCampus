'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils/formatters'

export default function SchoolsListPage() {
  const supabase = createClient()
  const [schools, setSchools] = useState<any[]>([])
  const [search, setSearch]   = useState('')
  const [statusFilter, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('schools').select('*').order('created_at', { ascending: false })
    const withCounts = await Promise.all((data ?? []).map(async (s: any) => {
      const { count } = await supabase.from('students').select('*', { count:'exact', head:true }).eq('school_id', s.id).eq('status', 'active')
      return { ...s, student_count: count ?? 0 }
    }))
    setSchools(withCounts)
    setLoading(false)
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = filtered.map((s,i) => ({
      '#': i+1, Name: s.name, Slug: s.slug, Country: s.country,
      Students: s.student_count, Plan: s.plan, Status: s.status, Created: s.created_at,
    }))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(rows), 'Schools')
    writeFile(wb, `schools_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported!')
  }

  const filtered = schools.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
    const matchStatus = !statusFilter || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const STATUS_BADGE: Record<string,string> = { active:'badge-green', trial:'badge-amber', suspended:'badge-red' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-white">🏫 All Schools</h1>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="btn-secondary text-sm">📥 Export</button>
          <Link href="/superadmin/schools/new" className="btn-primary text-sm">➕ Add School</Link>
        </div>
      </div>

      <div className="flex gap-3">
        <input className="input-base max-w-xs bg-white/5 border-white/10 text-white placeholder:text-slate-500" placeholder="🔍 Search schools…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input-base w-44 bg-white/5 border-white/10 text-white" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left px-5 py-3 font-medium">#</th>
              <th className="text-left px-5 py-3 font-medium">School</th>
              <th className="text-left px-5 py-3 font-medium">Country</th>
              <th className="text-left px-5 py-3 font-medium">Students</th>
              <th className="text-left px-5 py-3 font-medium">Plan</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Created</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">No schools found.</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} className="border-b border-white/5 text-slate-200 hover:bg-white/5">
                <td className="px-5 py-3 text-slate-500">{i+1}</td>
                <td className="px-5 py-3">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.slug}.skycampus.com</p>
                </td>
                <td className="px-5 py-3">{s.country}</td>
                <td className="px-5 py-3">{s.student_count}</td>
                <td className="px-5 py-3 capitalize">{s.plan}</td>
                <td className="px-5 py-3"><span className={STATUS_BADGE[s.status] ?? 'badge-gray'}>{s.status}</span></td>
                <td className="px-5 py-3 text-xs text-slate-500">{formatDate(s.created_at)}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <Link href={`/superadmin/schools/${s.id}`} className="text-brand-blue hover:underline text-xs">👁️ View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
