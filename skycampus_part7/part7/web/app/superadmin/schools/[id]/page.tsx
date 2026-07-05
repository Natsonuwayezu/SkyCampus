'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils/formatters'

type Tab = 'overview' | 'modules' | 'users' | 'billing' | 'logs' | 'backup'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key:'overview', label:'Overview', icon:'📋' },
  { key:'modules',  label:'Modules',  icon:'⚙️' },
  { key:'users',    label:'Users',    icon:'👥' },
  { key:'billing',  label:'Billing',  icon:'💰' },
  { key:'logs',     label:'Logs',     icon:'📋' },
  { key:'backup',   label:'Backup',   icon:'💾' },
]

const MODULE_LABELS: Record<string,string> = {
  academics:'📚 Academics', finance:'💰 Finance', students:'👥 Students', staff:'👩‍🏫 Staff',
  transport:'🚌 Transport', hostel:'🏨 Hostel', library:'📚 Library', ai_comments:'🤖 AI Comments',
}

export default function SchoolDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const supabase = createClient()

  const [tab, setTab]         = useState<Tab>('overview')
  const [school, setSchool]   = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [users, setUsers]     = useState<any[]>([])
  const [subscriptions, setSubs] = useState<any[]>([])
  const [auditLogs, setLogs]  = useState<any[]>([])
  const [backups, setBackups] = useState<any[]>([])
  const [studentCount, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => { load() }, [id])

  async function load() {
    setLoading(true)
    const [schRes, modRes, userRes, subRes, logRes, backupRes, countRes] = await Promise.all([
      supabase.from('schools').select('*').eq('id', id).single(),
      supabase.from('school_modules').select('*').eq('school_id', id),
      supabase.from('users').select('id, full_name, username, is_active, roles(name)').eq('school_id', id).order('full_name'),
      supabase.from('subscriptions').select('*').eq('school_id', id).order('created_at', { ascending: false }),
      supabase.from('audit_logs').select('*, users(full_name)').eq('school_id', id).order('created_at', { ascending: false }).limit(50),
      supabase.from('backup_logs').select('*').eq('school_id', id).order('created_at', { ascending: false }).limit(10),
      supabase.from('students').select('*', { count:'exact', head:true }).eq('school_id', id).eq('status', 'active'),
    ])
    setSchool(schRes.data)
    setModules(modRes.data ?? [])
    setUsers(userRes.data as any ?? [])
    setSubs(subRes.data ?? [])
    setLogs(logRes.data as any ?? [])
    setBackups(backupRes.data ?? [])
    setCount(countRes.count ?? 0)
    setLoading(false)
  }

  async function toggleModule(moduleKey: string, currentlyEnabled: boolean) {
    setSaving(true)
    const existing = modules.find(m => m.module_key === moduleKey)
    if (existing) {
      await supabase.from('school_modules').update({ is_enabled: !currentlyEnabled, enabled_at: !currentlyEnabled ? new Date().toISOString() : null }).eq('id', existing.id)
    } else {
      await supabase.from('school_modules').insert({ school_id: id, module_key: moduleKey, is_enabled: true, enabled_at: new Date().toISOString() })
    }
    setSaving(false)
    toast.success(`${MODULE_LABELS[moduleKey]} ${!currentlyEnabled ? 'enabled' : 'disabled'}`)
    load()
  }

  async function updateStatus(newStatus: string) {
    setSaving(true)
    await supabase.from('schools').update({ status: newStatus }).eq('id', id)
    setSaving(false)
    toast.success(`School status updated to ${newStatus}`)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/></div>
  if (!school) return <div className="text-center py-16 text-slate-400">School not found.</div>

  const STATUS_BADGE: Record<string,string> = { active:'badge-green', trial:'badge-amber', suspended:'badge-red' }

  return (
    <div className="space-y-5">
      <Link href="/superadmin/schools" className="text-sm text-slate-400 hover:text-white">← Back to Schools</Link>

      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold text-xl">
            {school.logo_url ? <img src={school.logo_url} className="w-full h-full object-cover rounded-xl"/> : school.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white">{school.name}</h1>
            <p className="text-sm text-slate-400">{school.slug}.skycampus.com · {studentCount} active students</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={STATUS_BADGE[school.status] ?? 'badge-gray'}>{school.status}</span>
          {school.status !== 'suspended' ? (
            <button onClick={() => updateStatus('suspended')} disabled={saving} className="btn-secondary text-xs text-red-400 border-red-800">🚫 Suspend</button>
          ) : (
            <button onClick={() => updateStatus('active')} disabled={saving} className="btn-secondary text-xs text-green-400 border-green-800">✅ Reactivate</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition ${tab===t.key?'border-brand-blue text-white':'border-transparent text-slate-400'}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 grid grid-cols-2 gap-4 text-sm text-slate-200">
          {[
            ['Slug', `${school.slug}.skycampus.com`],
            ['Country', school.country],
            ['City', school.city ?? '—'],
            ['Phone', school.phone ?? '—'],
            ['Email', school.email ?? '—'],
            ['Director', school.director_name ?? '—'],
            ['Plan', school.plan],
            ['Status', school.status],
            ['Levels', [school.has_nursery&&'Nursery',school.has_primary&&'Primary',school.has_secondary&&'Secondary'].filter(Boolean).join(', ')],
            ['Created', formatDate(school.created_at)],
          ].map(([k,v]) => (
            <div key={k as string} className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* MODULES */}
      {tab === 'modules' && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="text-left px-5 py-3">Module</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Action</th></tr></thead>
            <tbody>
              {Object.keys(MODULE_LABELS).map(key => {
                const mod = modules.find(m => m.module_key === key)
                const enabled = mod?.is_enabled ?? false
                return (
                  <tr key={key} className="border-b border-white/5 text-slate-200">
                    <td className="px-5 py-3">{MODULE_LABELS[key]}</td>
                    <td className="px-5 py-3">{enabled ? <span className="badge-green">✅ Enabled</span> : <span className="badge-gray">❌ Disabled</span>}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleModule(key, enabled)} disabled={saving}
                        className={`text-xs px-3 py-1 rounded-lg ${enabled ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="text-left px-5 py-3">Name</th><th className="text-left px-5 py-3">Role</th><th className="text-left px-5 py-3">Username</th><th className="text-left px-5 py-3">Status</th></tr></thead>
            <tbody>
              {users.map((u:any) => (
                <tr key={u.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-5 py-3 font-medium">{u.full_name}</td>
                  <td className="px-5 py-3">{u.roles?.name ?? '—'}</td>
                  <td className="px-5 py-3 text-slate-400">{u.username ?? '—'}</td>
                  <td className="px-5 py-3">{u.is_active ? <span className="badge-green">Active</span> : <span className="badge-gray">Inactive</span>}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* BILLING */}
      {tab === 'billing' && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="text-left px-5 py-3">Plan</th><th className="text-left px-5 py-3">Amount</th><th className="text-left px-5 py-3">Cycle</th><th className="text-left px-5 py-3">Status</th><th className="text-left px-5 py-3">Started</th></tr></thead>
            <tbody>
              {subscriptions.map((s:any) => (
                <tr key={s.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-5 py-3 capitalize">{s.plan}</td>
                  <td className="px-5 py-3">${s.amount}</td>
                  <td className="px-5 py-3 capitalize">{s.billing_cycle}</td>
                  <td className="px-5 py-3"><span className={s.status==='active'?'badge-green':'badge-gray'}>{s.status}</span></td>
                  <td className="px-5 py-3 text-slate-400">{formatDate(s.started_at)}</td>
                </tr>
              ))}
              {subscriptions.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-400">No billing history.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* LOGS */}
      {tab === 'logs' && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="text-left px-5 py-3">Time</th><th className="text-left px-5 py-3">User</th><th className="text-left px-5 py-3">Action</th></tr></thead>
            <tbody>
              {auditLogs.map((l:any) => (
                <tr key={l.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3">{l.users?.full_name ?? 'system'}</td>
                  <td className="px-5 py-3"><span className="badge-blue text-xs">{l.action}</span></td>
                </tr>
              ))}
              {auditLogs.length === 0 && <tr><td colSpan={3} className="text-center py-8 text-slate-400">No logs yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* BACKUP */}
      {tab === 'backup' && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10 text-slate-400"><th className="text-left px-5 py-3">Date</th><th className="text-left px-5 py-3">Size</th><th className="text-left px-5 py-3">Type</th><th className="text-left px-5 py-3">Status</th></tr></thead>
            <tbody>
              {backups.map((b:any) => (
                <tr key={b.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-5 py-3 font-mono text-xs">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="px-5 py-3">{b.file_size_mb ? `${b.file_size_mb} MB` : '—'}</td>
                  <td className="px-5 py-3 capitalize">{b.type}</td>
                  <td className="px-5 py-3"><span className={b.status==='success'?'badge-green':'badge-red'}>{b.status}</span></td>
                </tr>
              ))}
              {backups.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400">No backups yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
