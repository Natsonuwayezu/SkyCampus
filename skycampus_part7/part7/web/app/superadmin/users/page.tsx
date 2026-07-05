'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/formatters'

export default function PlatformUsersPage() {
  const supabase = createClient()
  const [users, setUsers]   = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('id, full_name, username, is_active, last_login, created_at, roles(name), schools(name, slug)')
      .order('created_at', { ascending: false })
      .limit(200)
    setUsers(data as any ?? [])
    setLoading(false)
  }

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.full_name.toLowerCase().includes(q) || (u.username ?? '').toLowerCase().includes(q) || (u.schools as any)?.name?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-white">👥 Platform Users</h1>
      <div className="flex gap-3">
        <input className="input-base max-w-xs bg-white/5 border-white/10 text-white placeholder:text-slate-500" placeholder="🔍 Search users…" value={search} onChange={e => setSearch(e.target.value)} />
        <span className="text-sm text-slate-400 self-center">{filtered.length} users</span>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">School</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Last Login</th>
              <th className="text-left px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="border-b border-white/5 text-slate-200 hover:bg-white/5">
                <td className="px-5 py-3 font-medium">{u.full_name}</td>
                <td className="px-5 py-3">
                  {u.schools
                    ? <Link href={`/superadmin/schools/${u.school_id}`} className="text-brand-blue hover:underline">{(u.schools as any).name}</Link>
                    : <span className="text-red-400 text-xs">Super Admin</span>
                  }
                </td>
                <td className="px-5 py-3 text-slate-400">{(u.roles as any)?.name ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={u.is_active ? 'badge-green' : 'badge-gray'}>{u.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">{u.last_login ? formatDate(u.last_login) : 'Never'}</td>
                <td className="px-5 py-3 text-xs text-slate-400">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
