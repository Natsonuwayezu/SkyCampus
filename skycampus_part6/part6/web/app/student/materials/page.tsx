'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { formatDate } from '@/lib/utils/formatters'

export default function StudentMaterialsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('school_id', user!.school_id)
      .in('audience', ['all', 'students'])
      .order('published_at', { ascending: false })
    setAnnouncements(data ?? [])
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">📂 Learning Materials & Notices</h1>

      <div className="card p-8 text-center text-slate-400 text-sm">
        📚 Homework and learning materials uploaded by teachers will appear here.
        <br/>This feature connects to assignments once teachers begin uploading files.
      </div>

      <div>
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">📢 Notices for Students</h2>
        <div className="card divide-y divide-slate-50 dark:divide-slate-700">
          {loading ? (
            <p className="text-center py-8 text-slate-400 text-sm">Loading…</p>
          ) : announcements.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">No notices yet.</p>
          ) : announcements.map(a => (
            <div key={a.id} className="px-5 py-3">
              <p className="font-medium text-sm text-slate-800 dark:text-white">{a.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(a.published_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
