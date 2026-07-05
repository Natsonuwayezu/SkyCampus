'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface StaffMember {
  id: string
  full_name: string
  username: string | null
  phone: string | null
  is_active: boolean
  avatar_url: string | null
  created_at: string
  roles: { name: string; color: string } | null
}
interface Role { id: string; name: string; color: string }

export default function StaffListPage() {
  const { user } = useAuthStore()
  const supabase = createClient()

  const [staff, setStaff]     = useState<StaffMember[]>([])
  const [roles, setRoles]     = useState<Role[]>([])
  const [search, setSearch]   = useState('')
  const [roleFilter, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deactivateId, setDeact]  = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [form, setForm] = useState({
    full_name: '', email: '', username: '', password: '',
    phone: '', role_id: '',
  })

  useEffect(() => { load(); loadRoles() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('id, full_name, username, phone, is_active, avatar_url, created_at, roles(name, color)')
      .eq('school_id', user!.school_id)
      .order('full_name')
    setStaff(data as any ?? [])
    setLoading(false)
  }

  async function loadRoles() {
    const { data } = await supabase.from('roles').select('id,name,color').eq('school_id', user!.school_id)
    setRoles(data ?? [])
  }

  async function createStaff() {
    if (!form.full_name || !form.email || !form.password || !form.role_id) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    // Create auth user
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email, password: form.password,
    })
    if (authErr || !authData.user) {
      toast.error('Failed to create account: ' + (authErr?.message ?? 'error'))
      setSaving(false); return
    }
    // Insert user profile
    const { error } = await supabase.from('users').insert({
      id:        authData.user.id,
      school_id: user!.school_id,
      full_name: form.full_name,
      username:  form.username || null,
      phone:     form.phone    || null,
      role_id:   form.role_id,
      is_active: true,
    })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Staff member created!')
    setShowModal(false)
    setForm({ full_name:'', email:'', username:'', password:'', phone:'', role_id:'' })
    load()
  }

  async function deactivate() {
    if (!deactivateId) return
    await supabase.from('users').update({ is_active: false }).eq('id', deactivateId)
    toast.success('Staff member deactivated')
    setDeact(null)
    load()
  }

  const filtered = staff.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.full_name.toLowerCase().includes(q) || (s.username ?? '').toLowerCase().includes(q)
    const matchRole   = !roleFilter || (s.roles as any)?.name === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-5">
      <PageHeader title="Teachers & Staff" icon="👩‍🏫"
        subtitle={`${filtered.length} staff members`}
        actions={
          <div className="flex gap-2">
            <Link href="/staff/subjects"    className="btn-secondary text-sm">📖 Subjects</Link>
            <Link href="/staff/assignments" className="btn-secondary text-sm">📌 Assignments</Link>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm">➕ Add Staff</button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input className="input-base max-w-xs" placeholder="🔍 Search name or username…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input-base w-44" value={roleFilter} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option>
          {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map(r => {
          const count = staff.filter(s => (s.roles as any)?.name === r.name && s.is_active).length
          return (
            <div key={r.id} className="card p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }}/>
              <div>
                <p className="font-bold text-lg text-slate-800 dark:text-white leading-none">{count}</p>
                <p className="text-xs text-slate-500">{r.name}</p>
              </div>
            </div>
          )
        })}
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
                <th>Role</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Status</th>
                <th className="w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16">
                  <span className="inline-flex items-center gap-2 text-slate-400">
                    <span className="w-5 h-5 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin"/>
                    Loading staff…
                  </span>
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td>
                    {s.avatar_url
                      ? <img src={s.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover"/>
                      : <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: (s.roles as any)?.color ?? '#94A3B8' }}>
                          {s.full_name.charAt(0)}
                        </div>
                    }
                  </td>
                  <td>
                    <Link href={`/staff/${s.id}`} className="font-semibold text-slate-800 dark:text-white hover:text-brand-blue transition">
                      {s.full_name}
                    </Link>
                  </td>
                  <td>
                    {s.roles
                      ? <span className="badge text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: (s.roles as any).color }}>
                          {(s.roles as any).name}
                        </span>
                      : <span className="badge-gray">No Role</span>
                    }
                  </td>
                  <td className="text-slate-500 font-mono text-xs">{s.username ?? '—'}</td>
                  <td className="text-slate-500 text-sm">{s.phone ?? '—'}</td>
                  <td>
                    <span className={s.is_active ? 'badge-green' : 'badge-gray'}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/staff/${s.id}`} className="text-brand-blue hover:underline text-xs">👁️ View</Link>
                      {s.id !== user!.id && s.is_active && (
                        <button onClick={() => setDeact(s.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No staff members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add staff modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Staff Member" size="lg"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={createStaff} disabled={saving} className="btn-primary">
              {saving ? '⏳ Creating…' : '✅ Create Staff Member'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-xs">Full Name *</label>
              <input className="input-base" placeholder="Jean MUKESA" value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">Role *</label>
              <select className="input-base" value={form.role_id} onChange={e => setForm(f => ({...f, role_id: e.target.value}))}>
                <option value="">— Select Role —</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-xs">Phone</label>
              <input className="input-base" placeholder="+250788…" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">Email (login) *</label>
              <input type="email" className="input-base" placeholder="jean@school.rw" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">Username (optional)</label>
              <input className="input-base" placeholder="jean.mukesa" value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))} />
            </div>
            <div className="col-span-2">
              <label className="label-xs">Temporary Password *</label>
              <input type="password" className="input-base" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
              <p className="text-xs text-slate-400 mt-1">Staff member should change this on first login.</p>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deactivateId} onClose={() => setDeact(null)} onConfirm={deactivate}
        title="Deactivate Staff Member"
        message="This user will immediately lose access to SkyCampus. Their data is preserved."
        confirmLabel="Deactivate" danger />
    </div>
  )
}
