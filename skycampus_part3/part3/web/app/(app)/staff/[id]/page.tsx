'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import { formatDate } from '@/lib/utils/formatters'

export default function StaffDetailPage() {
  const { id }   = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [id])

  async function load() {
    setLoading(true)
    const [profRes, assignRes] = await Promise.all([
      supabase.from('users').select(`
        id, full_name, username, phone, is_active, avatar_url, created_at,
        roles(name, color, role_permissions(module_key, can_view, can_create, can_edit, can_delete, can_export))
      `).eq('id', id).single(),
      supabase.from('teacher_subject_assignments').select(`
        classes(name), subjects(name), terms(name)
      `).eq('teacher_id', id).eq('school_id', user!.school_id),
    ])
    setProfile(profRes.data)
    setAssignments(assignRes.data ?? [])
    setLoading(false)
  }

  async function resetPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(profile?.email ?? '')
    if (error) toast.error(error.message)
    else toast.success('Password reset email sent!')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/></div>
  if (!profile) return <div className="text-center py-16 text-slate-400">Staff member not found.</div>

  const role = profile.roles as any
  const perms = role?.role_permissions ?? []

  return (
    <div className="max-w-3xl space-y-5">
      <Link href="/staff" className="text-sm text-slate-400 hover:text-brand-blue">← Staff List</Link>

      {/* Header */}
      <div className="card p-5 flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
          style={{ backgroundColor: role?.color ?? '#94A3B8' }}>
          {profile.full_name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">{profile.full_name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {role && <span className="badge text-white text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: role.color }}>{role.name}</span>}
            <span className={profile.is_active ? 'badge-green' : 'badge-gray'}>{profile.is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            {profile.username && <span>@{profile.username}</span>}
            {profile.phone    && <span>📞 {profile.phone}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={resetPassword} className="btn-secondary text-xs">🔑 Reset Password</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Assignments */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">📌 Subject Assignments ({assignments.length})</h2>
          {assignments.length === 0
            ? <p className="text-slate-400 text-sm">No assignments this term.</p>
            : <div className="space-y-2">
                {assignments.map((a: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{a.subjects?.name}</span>
                    <span className="badge-blue text-xs">{a.classes?.name}</span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Permissions */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">🔐 Permissions</h2>
          {perms.length === 0
            ? <p className="text-slate-400 text-sm">No permissions configured.</p>
            : <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {perms.filter((p: any) => p.can_view).map((p: any) => (
                  <div key={p.module_key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 capitalize">{p.module_key.replace('_',' ')}</span>
                    <span className="flex gap-0.5">
                      {p.can_view   && <span title="View"   className="badge-blue text-[9px] px-1">V</span>}
                      {p.can_create && <span title="Create" className="badge-green text-[9px] px-1">C</span>}
                      {p.can_edit   && <span title="Edit"   className="badge-amber text-[9px] px-1">E</span>}
                      {p.can_delete && <span title="Delete" className="badge-red text-[9px] px-1">D</span>}
                      {p.can_export && <span title="Export" className="badge-purple text-[9px] px-1">X</span>}
                    </span>
                  </div>
                ))}
              </div>
          }
          <Link href="/settings/roles" className="text-xs text-brand-blue hover:underline mt-3 inline-block">Configure Roles →</Link>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">Account Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-400">Member since</span><span>{formatDate(profile.created_at)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Status</span><span className={profile.is_active ? 'text-green-600' : 'text-red-500'}>{profile.is_active ? 'Active' : 'Inactive'}</span></div>
        </div>
      </div>
    </div>
  )
}
