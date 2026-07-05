'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatDate } from '@/lib/utils/formatters'

export default function StudentArchivePage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [restoring, setRestoring] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('students')
      .select('id, admission_number, first_name, last_name, archived_at, archive_reason')
      .eq('school_id', user!.school_id)
      .eq('status', 'archived')
      .order('archived_at', { ascending: false })
    setStudents(data ?? [])
    setLoading(false)
  }

  async function restore(id: string, name: string) {
    setRestoring(id)
    const { error } = await supabase
      .from('students')
      .update({ status: 'active', archived_at: null, archive_reason: null })
      .eq('id', id)
    setRestoring(null)
    if (error) toast.error(error.message)
    else { toast.success(`${name} restored to active`); load() }
  }

  const filtered = students.filter(s =>
    !search || `${s.last_name} ${s.first_name} ${s.admission_number}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="Student Archive" icon="📦" subtitle={`${students.length} archived students`} />
      <input className="input-base max-w-sm" placeholder="🔍 Search archived students…" value={search} onChange={e => setSearch(e.target.value)} />
      <div className="card overflow-hidden">
        <table className="table-base">
          <thead><tr><th>#</th><th>Name</th><th>Adm. No.</th><th>Archived On</th><th>Reason</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No archived students.</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id}>
                <td className="text-slate-400 text-xs">{i + 1}</td>
                <td className="font-medium">{s.last_name} {s.first_name}</td>
                <td className="font-mono text-xs text-slate-500">{s.admission_number}</td>
                <td className="text-slate-500 text-sm">{s.archived_at ? formatDate(s.archived_at) : '—'}</td>
                <td className="text-xs text-slate-400">{s.archive_reason ?? '—'}</td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/students/${s.id}`} className="text-brand-blue hover:underline text-xs">👁️ View</Link>
                    <button
                      onClick={() => restore(s.id, `${s.last_name} ${s.first_name}`)}
                      disabled={restoring === s.id}
                      className="text-green-600 hover:text-green-700 text-xs disabled:opacity-50"
                    >
                      {restoring === s.id ? '⏳' : '♻️ Restore'}
                    </button>
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
