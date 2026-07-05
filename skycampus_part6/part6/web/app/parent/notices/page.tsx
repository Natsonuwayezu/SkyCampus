'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { formatDate } from '@/lib/utils/formatters'

export default function ParentNoticesPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('school_id', user!.school_id)
      .in('audience', ['all', 'parents'])
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
    setNotices(data ?? [])
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">📢 School Notices</h1>
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-12 text-slate-400">Loading…</p>
        ) : notices.length === 0 ? (
          <div className="card p-8 text-center text-slate-400 text-sm">No notices yet.</div>
        ) : notices.map(n => (
          <div key={n.id} className="card p-5">
            {n.is_pinned && <span className="badge-blue text-[10px] mb-2 inline-block">📌 Pinned</span>}
            <h3 className="font-display font-bold text-slate-800 dark:text-white">{n.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{n.body}</p>
            <p className="text-xs text-slate-400 mt-2">{formatDate(n.published_at)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
