'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import PageHeader from '@/components/shared/PageHeader'

const TYPES = ['All','Academic','Finance','System','Alerts'] as const
interface Notif { id:string; type:string; title:string; body:string|null; is_read:boolean; created_at:string }

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50)
    setNotifs(data ?? [])
    setLoading(false)
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('user_id', user!.id).eq('is_read', false)
    setNotifs(n => n.map(x => ({ ...x, is_read: true })))
  }

  async function markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x))
  }

  const filtered = filter === 'All' ? notifs : notifs.filter(n => n.type.toLowerCase().includes(filter.toLowerCase()))
  const unread = notifs.filter(n => !n.is_read).length

  const ICON: Record<string,string> = { marks:'✏️', payment:'💰', student:'👥', system:'⚙️', alert:'⚠️' }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Notifications" icon="🔔" subtitle={`${unread} unread`}
        actions={unread > 0 && <button onClick={markAllRead} className="btn-secondary text-sm">✅ Mark all read</button>}
      />

      {/* Filter tabs */}
      <div className="flex gap-1">
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter===t ? 'bg-brand-blue text-white' : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="card divide-y divide-slate-50 dark:divide-slate-700">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No notifications</div>
        ) : filtered.map(n => (
          <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${!n.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
            <span className="text-lg mt-0.5 flex-shrink-0">{ICON[n.type] ?? '🔔'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${!n.is_read ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{n.title}</p>
              {n.body && <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>}
              <p className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            {!n.is_read && (
              <button onClick={() => markRead(n.id)} className="flex-shrink-0 text-xs text-brand-blue hover:underline">✓ Read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
