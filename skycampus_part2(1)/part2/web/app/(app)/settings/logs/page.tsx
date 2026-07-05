'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import PageHeader from '@/components/shared/PageHeader'

interface LogRow { id:string; user_id:string|null; action:string; table_name:string|null; created_at:string; users?:{full_name:string} }

const ACTION_COLORS: Record<string, string> = {
  INSERT: 'badge-green', UPDATE: 'badge-blue', DELETE: 'badge-red', MARKS_ADD: 'badge-purple',
}

export default function SystemLogsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER = 25

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('audit_logs')
      .select('id, user_id, action, table_name, created_at, users(full_name)')
      .eq('school_id', user!.school_id)
      .order('created_at', { ascending: false })
      .limit(200)
    setLogs(data as any ?? [])
    setLoading(false)
  }

  const filtered = search
    ? logs.filter(l =>
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        (l.table_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        ((l.users as any)?.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : logs

  const totalPages = Math.ceil(filtered.length / PER)
  const paged = filtered.slice((page-1)*PER, page*PER)

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="System Logs" icon="📋"
        actions={<button onClick={load} className="btn-secondary text-sm">🔄 Refresh</button>}
      />

      <div className="flex gap-3">
        <input className="input-base max-w-sm" placeholder="Search action, table, user…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <span className="text-sm text-slate-400 self-center">{filtered.length} entries</span>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading logs…</div>
        ) : (
          <table className="table-base">
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Table</th></tr></thead>
            <tbody>
              {paged.map(l => (
                <tr key={l.id}>
                  <td className="font-mono text-xs text-slate-500">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="text-sm">{(l.users as any)?.full_name ?? <span className="text-slate-400">system</span>}</td>
                  <td><span className={`badge ${ACTION_COLORS[l.action] ?? 'badge-gray'}`}>{l.action}</span></td>
                  <td className="text-xs text-slate-500 font-mono">{l.table_name ?? '—'}</td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No log entries found.</td></tr>}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-400">{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">‹</button>
              {Array.from({length:Math.min(7,totalPages)},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-brand-blue text-white':'hover:bg-slate-100'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
