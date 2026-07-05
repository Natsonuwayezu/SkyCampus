'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function PlatformLogsPage() {
  const supabase = createClient()
  const [logs, setLogs]     = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(1)
  const PER = 50

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('audit_logs')
      .select('*, users(full_name, schools(name))')
      .order('created_at', { ascending: false })
      .limit(500)
    setLogs(data as any ?? [])
    setLoading(false)
  }

  const filtered = search
    ? logs.filter(l => l.action?.toLowerCase().includes(search.toLowerCase()) || (l.users as any)?.full_name?.toLowerCase().includes(search.toLowerCase()))
    : logs

  const totalPages = Math.ceil(filtered.length / PER)
  const paged = filtered.slice((page-1)*PER, page*PER)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl text-white">📋 Platform Logs</h1>
        <button onClick={load} className="text-xs text-slate-400 hover:text-white">🔄 Refresh</button>
      </div>
      <div className="flex gap-3">
        <input className="input-base max-w-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500" placeholder="🔍 Search action, user…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        <span className="text-sm text-slate-400 self-center">{filtered.length} entries</span>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="text-left px-5 py-3">Timestamp</th>
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">School</th>
              <th className="text-left px-5 py-3">Action</th>
              <th className="text-left px-5 py-3">Table</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">No logs found.</td></tr>
            ) : paged.map(l => (
              <tr key={l.id} className="border-b border-white/5 text-slate-200 hover:bg-white/5">
                <td className="px-5 py-3 font-mono text-xs text-slate-400">{new Date(l.created_at).toLocaleString()}</td>
                <td className="px-5 py-3">{(l.users as any)?.full_name ?? <span className="text-slate-500">system</span>}</td>
                <td className="px-5 py-3 text-xs text-slate-400">{(l.users as any)?.schools?.name ?? '—'}</td>
                <td className="px-5 py-3"><span className="badge-blue text-xs">{l.action}</span></td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{l.table_name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-sm text-slate-400">
            <span>{(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40">‹</button>
              {Array.from({length:Math.min(5,totalPages)},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-brand-blue text-white':'bg-white/5 hover:bg-white/10'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-40">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
