'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Student {
  id: string
  admission_number: string
  first_name: string
  last_name: string
  status: string
  photo_url: string | null
  gender: string | null
  enrolled_at: string
  current_class?: { name: string }
  primary_parent?: { first_name: string; last_name: string; phone: string }
}

interface ClassFilter { id: string; name: string }

export default function StudentListPage() {
  const { user } = useAuthStore()
  const supabase  = createClient()

  const [students, setStudents]   = useState<Student[]>([])
  const [classes, setClasses]     = useState<ClassFilter[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [classFilter, setClass]   = useState('')
  const [statusFilter, setStatus] = useState('active')
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archiveReason, setReason]= useState('')
  const [page, setPage]           = useState(1)
  const PER = 25

  useEffect(() => { loadClasses() }, [])
  useEffect(() => { load() }, [classFilter, statusFilter])

  async function loadClasses() {
    const { data } = await supabase
      .from('classes').select('id, name')
      .eq('school_id', user!.school_id).order('display_order')
    setClasses(data ?? [])
  }

  async function load() {
    setLoading(true)
    let q = supabase
      .from('students')
      .select(`
        id, admission_number, first_name, last_name, status,
        photo_url, gender, enrolled_at,
        student_class_history!inner(
          class_id, is_current,
          classes(name)
        ),
        student_parents(
          is_primary,
          parents(first_name, last_name, phone)
        )
      `)
      .eq('school_id', user!.school_id)
      .eq('status', statusFilter)
      .eq('student_class_history.is_current', true)

    if (classFilter) q = q.eq('student_class_history.class_id', classFilter)

    const { data, error } = await q.order('last_name')
    if (error) { toast.error('Failed to load students'); setLoading(false); return }

    const mapped = (data ?? []).map((s: any) => ({
      ...s,
      current_class: s.student_class_history?.[0]?.classes,
      primary_parent: s.student_parents?.find((p: any) => p.is_primary)?.parents,
    }))
    setStudents(mapped)
    setLoading(false)
    setPage(1)
  }

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return !q ||
      s.first_name.toLowerCase().includes(q) ||
      s.last_name.toLowerCase().includes(q) ||
      s.admission_number.toLowerCase().includes(q) ||
      (s.primary_parent?.last_name ?? '').toLowerCase().includes(q)
  })

  const totalPages = Math.ceil(filtered.length / PER)
  const paged      = filtered.slice((page - 1) * PER, page * PER)

  async function archiveStudent() {
    if (!archiveId) return
    const { error } = await supabase
      .from('students')
      .update({ status: 'archived', archived_at: new Date().toISOString(), archive_reason: archiveReason })
      .eq('id', archiveId)
    if (error) { toast.error(error.message); return }
    toast.success('Student archived')
    setArchiveId(null)
    setReason('')
    load()
  }

  async function exportExcel() {
    const { utils, writeFile } = await import('xlsx')
    const rows = filtered.map((s, i) => ({
      '#': i + 1,
      'Admission No': s.admission_number,
      'Last Name': s.last_name,
      'First Name': s.first_name,
      'Class': s.current_class?.name ?? '',
      'Gender': s.gender ?? '',
      'Parent Name': s.primary_parent ? `${s.primary_parent.last_name} ${s.primary_parent.first_name}` : '',
      'Parent Phone': s.primary_parent?.phone ?? '',
      'Status': s.status,
      'Enrolled': s.enrolled_at,
    }))
    const wb = utils.book_new()
    utils.book_append_sheet(wb, utils.json_to_sheet(rows), 'Students')
    writeFile(wb, `students_${new Date().toISOString().slice(0,10)}.xlsx`)
    toast.success('Exported successfully!')
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Student List" icon="📋"
        subtitle={`${filtered.length} students`}
        actions={
          <div className="flex gap-2">
            <button onClick={exportExcel} className="btn-secondary text-sm">📥 Export Excel</button>
            <Link href="/students/bulk-import" className="btn-secondary text-sm">📤 Bulk Import</Link>
            <Link href="/students/enroll" className="btn-primary text-sm">➕ Enroll Student</Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input-base max-w-xs"
          placeholder="🔍 Search name, ID, or parent…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select className="input-base w-44" value={classFilter} onChange={e => setClass(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-base w-36" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 text-sm text-slate-500">
        <span>Total: <strong className="text-slate-700 dark:text-white">{students.length}</strong></span>
        <span>Filtered: <strong className="text-slate-700 dark:text-white">{filtered.length}</strong></span>
        <span>Showing: <strong className="text-slate-700 dark:text-white">{paged.length}</strong></span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th className="w-12">Photo</th>
                <th>Full Name</th>
                <th>Adm. No.</th>
                <th>Class</th>
                <th>Parent</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-16">
                  <span className="inline-flex items-center gap-2 text-slate-400">
                    <span className="w-5 h-5 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"/>
                    Loading students…
                  </span>
                </td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                  No students found. {search && 'Try a different search.'}
                </td></tr>
              ) : paged.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{(page - 1) * PER + i + 1}</td>
                  <td>
                    {s.photo_url
                      ? <img src={s.photo_url} alt="" className="w-8 h-8 rounded-full object-cover"/>
                      : <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm">
                          {s.gender === 'female' ? '👧' : '👦'}
                        </div>
                    }
                  </td>
                  <td>
                    <Link href={`/students/${s.id}`} className="font-semibold text-slate-800 dark:text-white hover:text-brand-blue transition">
                      {s.last_name} {s.first_name}
                    </Link>
                  </td>
                  <td className="font-mono text-xs text-slate-500">{s.admission_number}</td>
                  <td>
                    {s.current_class
                      ? <span className="badge-blue">{s.current_class.name}</span>
                      : <span className="text-slate-400">—</span>
                    }
                  </td>
                  <td className="text-sm">
                    {s.primary_parent
                      ? `${s.primary_parent.last_name} ${s.primary_parent.first_name}`
                      : <span className="text-slate-400">—</span>
                    }
                  </td>
                  <td className="text-sm text-slate-500">{s.primary_parent?.phone ?? '—'}</td>
                  <td>
                    <span className={s.status === 'active' ? 'badge-green' : 'badge-gray'}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/students/${s.id}`} className="text-brand-blue hover:underline text-xs">👁️ View</Link>
                      <Link href={`/students/${s.id}?tab=edit`} className="text-slate-400 hover:text-slate-600 text-xs">✏️</Link>
                      {s.status === 'active' && (
                        <button onClick={() => setArchiveId(s.id)} className="text-red-400 hover:text-red-600 text-xs">📦</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {(page-1)*PER+1}–{Math.min(page*PER, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">‹</button>
              {Array.from({length: Math.min(7, totalPages)}, (_, i) => (
                <button key={i} onClick={() => setPage(i+1)}
                  className={`w-7 h-7 rounded text-xs font-medium ${page===i+1 ? 'bg-brand-blue text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-2 py-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600">›</button>
            </div>
          </div>
        )}
      </div>

      {/* Archive confirm */}
      <ConfirmDialog
        open={!!archiveId}
        onClose={() => { setArchiveId(null); setReason('') }}
        onConfirm={archiveStudent}
        title="Archive Student"
        message="This student will be moved to the archive and lose active status. You can restore them later."
        confirmLabel="Archive"
        danger
      />
    </div>
  )
}
