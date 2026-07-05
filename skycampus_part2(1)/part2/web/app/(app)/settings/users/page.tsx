'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface UserRow { id:string; full_name:string; username:string|null; is_active:boolean; roles?:{name:string;color:string}; created_at:string }
interface RoleRow { id:string; name:string; color:string }

export default function UserManagementPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [users, setUsers] = useState<UserRow[]>([])
  const [roles, setRoles] = useState<RoleRow[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deactivateId, setDeactivateId] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name:'', email:'', username:'', password:'', role_id:'', phone:'' })
  const [search, setSearch] = useState('')

  useEffect(() => { load(); loadRoles() }, [])

  async function load() {
    const { data } = await supabase.from('users').select('id, full_name, username, is_active, created_at, roles(name, color)').eq('school_id', user!.school_id).order('full_name')
    setUsers(data as any ?? [])
  }
  async function loadRoles() {
    const { data } = await supabase.from('roles').select('id, name, color').eq('school_id', user!.school_id)
    setRoles(data ?? [])
  }

  async function createUser() {
    setSaving(true)
    // Create auth user via admin API (requires edge function in production)
    // For now, create with signUp (user will get email)
    const { data: authData, error: authErr } = await supabase.auth.admin?.createUser({
      email: form.email, password: form.password, email_confirm: true
    }) as any
    if (authErr || !authData?.user) {
      toast.error('Failed to create account: ' + (authErr?.message ?? 'Unknown error'))
      setSaving(false); return
    }
    const { error } = await supabase.from('users').insert({
      id: authData.user.id, school_id: user!.school_id, full_name: form.full_name,
      username: form.username || null, phone: form.phone || null, role_id: form.role_id, is_active: true,
    })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('User created!')
    setShowModal(false)
    setForm({ full_name:'', email:'', username:'', password:'', role_id:'', phone:'' })
    load()
  }

  async function deactivate() {
    if (!deactivateId) return
    await supabase.from('users').update({ is_active: false }).eq('id', deactivateId)
    toast.success('User deactivated')
    setDeactivateId(null)
    load()
  }

  const filtered = users.filter(u => u.full_name.toLowerCase().includes(search.toLowerCase()) || (u.username ?? '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="User Management" icon="👥"
        actions={<button onClick={() => setShowModal(true)} className="btn-primary text-sm">➕ Add User</button>}
      />

      <div className="flex gap-3">
        <input className="input-base max-w-sm" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead><tr><th>#</th><th>Full Name</th><th>Role</th><th>Username</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td className="text-slate-400">{i+1}</td>
                <td className="font-medium">{u.full_name}</td>
                <td>
                  <span className="badge text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: (u.roles as any)?.color ?? '#94A3B8' }}>
                    {(u.roles as any)?.name ?? '—'}
                  </span>
                </td>
                <td className="text-slate-500">{u.username ?? '—'}</td>
                <td>{u.is_active ? <span className="badge-green">Active</span> : <span className="badge-gray">Inactive</span>}</td>
                <td>
                  {u.id !== user!.id && u.is_active && (
                    <button onClick={() => setDeactivateId(u.id)} className="text-xs text-red-400 hover:text-red-600">🗑️ Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Staff Member" size="lg"
        footer={<><button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button onClick={createUser} disabled={saving} className="btn-primary">{saving?'Creating…':'✅ Create User'}</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Full Name</label><input className="input-base" value={form.full_name} onChange={e => setForm(f=>({...f,full_name:e.target.value}))} /></div>
            <div><label className="label-xs">Role</label>
              <select className="input-base" value={form.role_id} onChange={e => setForm(f=>({...f,role_id:e.target.value}))}>
                <option value="">— Select Role —</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div><label className="label-xs">Email (login)</label><input type="email" className="input-base" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
            <div><label className="label-xs">Username (optional)</label><input className="input-base" placeholder="jean.mukesa" value={form.username} onChange={e => setForm(f=>({...f,username:e.target.value}))} /></div>
            <div><label className="label-xs">Phone</label><input className="input-base" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} /></div>
            <div><label className="label-xs">Temporary Password</label><input type="password" className="input-base" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} /></div>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deactivateId} onClose={() => setDeactivateId(null)} onConfirm={deactivate} title="Deactivate User" message="This user will lose access immediately." confirmLabel="Deactivate" danger />
    </div>
  )
}
