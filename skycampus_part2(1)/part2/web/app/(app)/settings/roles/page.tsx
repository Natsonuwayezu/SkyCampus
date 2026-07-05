'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const MODULES = [
  { key:'dashboard',       label:'📊 Dashboard' },
  { key:'marks_entry',     label:'✏️ Marks Entry' },
  { key:'marks_database',  label:'🗄️ Marks Database' },
  { key:'class_register',  label:'📋 Class Register' },
  { key:'statistics',      label:'📈 Statistics' },
  { key:'timetable',       label:'🕐 Timetable' },
  { key:'report_cards',    label:'📄 Report Cards' },
  { key:'assessments',     label:'📝 Assessments' },
  { key:'students',        label:'👥 Students' },
  { key:'finance',         label:'💰 Finance' },
  { key:'staff',           label:'👩‍🏫 Staff' },
  { key:'settings',        label:'⚙️ Settings' },
  { key:'notifications',   label:'🔔 Notifications' },
  { key:'announcements',   label:'📢 Announcements' },
  { key:'system_logs',     label:'📋 System Logs' },
  { key:'backup',          label:'💾 Backup' },
  { key:'analytics',       label:'📊 Analytics' },
]

const ACTIONS = ['view','create','edit','delete','export'] as const
type Action = typeof ACTIONS[number]

interface Role { id:string; name:string; description:string|null; is_system_role:boolean; color:string }
interface Perm { module_key:string; can_view:boolean; can_create:boolean; can_edit:boolean; can_delete:boolean; can_export:boolean }

export default function RolesPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [roles, setRoles] = useState<Role[]>([])
  const [selected, setSelected] = useState<Role|null>(null)
  const [perms, setPerms] = useState<Record<string, Record<Action, boolean>>>({})
  const [showNewModal, setShowNewModal] = useState(false)
  const [delId, setDelId] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', description:'', color:'#94A3B8' })

  useEffect(() => { loadRoles() }, [])
  useEffect(() => { if (selected) loadPerms(selected.id) }, [selected])

  async function loadRoles() {
    const { data } = await supabase.from('roles').select('*').eq('school_id', user!.school_id).order('name')
    setRoles(data ?? [])
    if (data?.[0] && !selected) setSelected(data[0])
  }

  async function loadPerms(roleId: string) {
    const { data } = await supabase.from('role_permissions').select('*').eq('role_id', roleId)
    const map: Record<string, Record<Action, boolean>> = {}
    MODULES.forEach(m => {
      const found = data?.find(p => p.module_key === m.key)
      map[m.key] = {
        view:   found?.can_view   ?? false,
        create: found?.can_create ?? false,
        edit:   found?.can_edit   ?? false,
        delete: found?.can_delete ?? false,
        export: found?.can_export ?? false,
      }
    })
    setPerms(map)
  }

  function toggle(moduleKey: string, action: Action) {
    setPerms(p => ({
      ...p,
      [moduleKey]: { ...p[moduleKey], [action]: !p[moduleKey][action] }
    }))
  }

  function toggleAll(moduleKey: string) {
    const current = perms[moduleKey]
    const allOn = ACTIONS.every(a => current[a])
    setPerms(p => ({
      ...p,
      [moduleKey]: { view: !allOn, create: !allOn, edit: !allOn, delete: !allOn, export: !allOn }
    }))
  }

  async function savePerms() {
    if (!selected) return
    setSaving(true)
    // Delete existing perms for this role
    await supabase.from('role_permissions').delete().eq('role_id', selected.id)
    // Insert new perms
    const rows = MODULES.map(m => ({
      role_id:    selected.id,
      module_key: m.key,
      can_view:   perms[m.key]?.view   ?? false,
      can_create: perms[m.key]?.create ?? false,
      can_edit:   perms[m.key]?.edit   ?? false,
      can_delete: perms[m.key]?.delete ?? false,
      can_export: perms[m.key]?.export ?? false,
    }))
    const { error } = await supabase.from('role_permissions').insert(rows)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success(`Permissions saved for ${selected.name}!`)
  }

  async function createRole() {
    setSaving(true)
    const { data, error } = await supabase.from('roles').insert({ ...form, school_id: user!.school_id, is_system_role: false }).select().single()
    setSaving(false)
    if (error || !data) { toast.error(error?.message ?? 'Failed'); return }
    toast.success('Role created!')
    setShowNewModal(false)
    setForm({ name:'', description:'', color:'#94A3B8' })
    await loadRoles()
    setSelected(data as Role)
  }

  async function delRole() {
    if (!delId) return
    await supabase.from('roles').delete().eq('id', delId)
    toast.success('Role deleted')
    setDelId(null)
    setSelected(null)
    loadRoles()
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Roles & Permissions" icon="🔐"
        actions={<button onClick={() => setShowNewModal(true)} className="btn-primary text-sm">➕ Create New Role</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Roles list */}
        <div className="card p-3 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Roles</p>
          {roles.map(r => (
            <button key={r.id} onClick={() => setSelected(r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition text-left ${selected?.id === r.id ? 'bg-blue-50 dark:bg-blue-900/20 text-brand-blue font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
              <span className="truncate">{r.name}</span>
              {r.is_system_role && <span className="ml-auto text-[9px] text-slate-400 flex-shrink-0">system</span>}
            </button>
          ))}
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-3 card overflow-hidden">
          {!selected ? (
            <div className="p-8 text-center text-slate-400">Select a role to configure permissions.</div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selected.color }} />
                  <h2 className="font-display font-bold text-slate-800 dark:text-white">{selected.name}</h2>
                  {selected.is_system_role && <span className="badge-gray text-[10px]">System Role</span>}
                </div>
                {!selected.is_system_role && (
                  <button onClick={() => setDelId(selected.id)} className="text-xs text-red-400 hover:text-red-600">🗑️ Delete Role</button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th className="w-48">Module</th>
                      {ACTIONS.map(a => <th key={a} className="text-center capitalize w-20">{a}</th>)}
                      <th className="text-center w-20">All</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map(m => {
                      const p = perms[m.key] ?? { view:false, create:false, edit:false, delete:false, export:false }
                      const allOn = ACTIONS.every(a => p[a])
                      return (
                        <tr key={m.key}>
                          <td className="font-medium text-slate-700 dark:text-slate-200">{m.label}</td>
                          {ACTIONS.map(a => (
                            <td key={a} className="text-center">
                              <input type="checkbox" checked={p[a]} onChange={() => !selected.is_system_role && toggle(m.key, a)}
                                disabled={selected.is_system_role}
                                className="rounded border-slate-300 text-brand-blue disabled:opacity-50" />
                            </td>
                          ))}
                          <td className="text-center">
                            <button onClick={() => !selected.is_system_role && toggleAll(m.key)}
                              disabled={selected.is_system_role}
                              className={`text-xs px-2 py-0.5 rounded transition disabled:opacity-40 ${allOn ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                              {allOn ? 'None' : 'All'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {!selected.is_system_role && (
                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                  <button onClick={savePerms} disabled={saving} className="btn-primary">
                    {saving ? '⏳ Saving…' : '💾 Save Permissions'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* New role modal */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Create New Role"
        footer={<><button onClick={() => setShowNewModal(false)} className="btn-secondary">Cancel</button><button onClick={createRole} disabled={saving} className="btn-primary">{saving?'Creating…':'✅ Create Role'}</button></>}>
        <div className="space-y-4">
          <div><label className="label-xs">Role Name</label><input className="input-base" placeholder="Deputy Head" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></div>
          <div><label className="label-xs">Description</label><input className="input-base" placeholder="What this role can do" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} /></div>
          <div><label className="label-xs">Role Color</label>
            <div className="flex items-center gap-3 mt-1">
              <input type="color" value={form.color} onChange={e => setForm(f=>({...f,color:e.target.value}))} className="w-10 h-10 rounded cursor-pointer border border-slate-200" />
              <input className="input-base" value={form.color} onChange={e => setForm(f=>({...f,color:e.target.value}))} />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={delRole}
        title="Delete Role" message="All users with this role will lose their permissions. Proceed?" confirmLabel="Delete Role" danger />
    </div>
  )
}
