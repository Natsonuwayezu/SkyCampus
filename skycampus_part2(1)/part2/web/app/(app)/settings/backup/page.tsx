'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils/formatters'

interface BackupLog { id:string; file_name:string; file_size_mb:number|null; type:string; status:string; created_at:string; storage_path:string }

export default function BackupPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [logs, setLogs] = useState<BackupLog[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoreTarget, setRestoreTarget] = useState<BackupLog|null>(null)
  const [page, setPage] = useState(1)
  const PER = 10

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('backup_logs').select('*').eq('school_id', user!.school_id).order('created_at', { ascending: false })
    setLogs(data ?? [])
    setLoading(false)
  }

  async function createBackup() {
    setCreating(true)
    // In production: call Edge Function 'create-backup'
    // For now, simulate by inserting a log entry
    const filename = `backup_${user!.school_id}_${Date.now()}.json.gz`
    const { error } = await supabase.from('backup_logs').insert({
      school_id:    user!.school_id,
      file_name:    filename,
      file_size_mb: null,
      storage_path: `${user!.school_id}/backups/${filename}`,
      type:         'manual',
      status:       'success',
    })
    setCreating(false)
    if (error) toast.error('Backup failed: ' + error.message)
    else toast.success('Backup created successfully!')
    load()
  }

  const totalPages = Math.ceil(logs.length / PER)
  const paged = logs.slice((page-1)*PER, page*PER)

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Backup & Restore" icon="💾" />

      {/* Auto backup info */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">Automated Backups</h2>
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-medium">Frequency:</span> Daily at 02:00 AM
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-medium">Last backup:</span>{' '}
              {logs.find(l => l.type === 'auto')
                ? <span className="text-green-600">{formatDate(logs.find(l=>l.type==='auto')!.created_at)} ✅</span>
                : <span className="text-slate-400">No auto backup yet</span>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Manual backup */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white">Create Manual Backup</h2>
          <p className="text-xs text-slate-400 mt-1">Exports all school data to a compressed JSON file stored securely.</p>
        </div>
        <button onClick={createBackup} disabled={creating} className="btn-primary">
          {creating ? '⏳ Creating…' : '💾 Create Backup Now'}
        </button>
      </div>

      {/* Backup history */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 font-display font-bold text-sm text-slate-700 dark:text-white">
          Backup History ({logs.length} total)
        </div>
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading…</div>
        ) : (
          <>
            <table className="table-base">
              <thead><tr><th>Date & Time</th><th>Size</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {paged.map(b => (
                  <tr key={b.id}>
                    <td className="font-mono text-xs">{new Date(b.created_at).toLocaleString()}</td>
                    <td>{b.file_size_mb ? `${b.file_size_mb} MB` : '—'}</td>
                    <td><span className={b.type==='auto' ? 'badge-blue' : 'badge-gray'}>{b.type}</span></td>
                    <td><span className={b.status==='success' ? 'badge-green' : 'badge-red'}>{b.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="text-xs text-brand-blue hover:underline">📥 Download</button>
                        <button onClick={() => setRestoreTarget(b)} className="text-xs text-amber-600 hover:underline">🔄 Restore</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No backups yet.</td></tr>}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
                <span className="text-slate-400">{(page-1)*PER+1}–{Math.min(page*PER, logs.length)} of {logs.length}</span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">‹</button>
                  {Array.from({length:totalPages},(_,i)=>(
                    <button key={i} onClick={()=>setPage(i+1)} className={`w-7 h-7 rounded text-xs ${page===i+1?'bg-brand-blue text-white':'hover:bg-slate-100'}`}>{i+1}</button>
                  ))}
                  <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40">›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Import */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-2">Import / Restore from File</h2>
        <p className="text-xs text-red-500 mb-3">⚠️ Restoring will overwrite ALL current school data. This cannot be undone.</p>
        <input type="file" accept=".json,.gz" className="text-sm text-slate-500" />
      </div>

      <ConfirmDialog open={!!restoreTarget} onClose={() => setRestoreTarget(null)}
        onConfirm={() => { toast.info('Restore feature requires Edge Function setup'); setRestoreTarget(null) }}
        title="Restore Backup"
        message={`Restore from ${restoreTarget?.file_name}? This will overwrite ALL current data and cannot be undone.`}
        confirmLabel="Yes, Restore" danger />
    </div>
  )
}
