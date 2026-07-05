'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { formatRWF, formatDate } from '@/lib/utils/formatters'

interface ChildSummary {
  id: string; full_name: string; class_name: string
  rank: number | null; total_students: number
  attendance_pct: number; balance_due: number
}

export default function ParentDashboard() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [children, setChildren] = useState<ChildSummary[]>([])
  const [notices, setNotices]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    // Get parent record linked to this user
    const { data: parentRec } = await supabase.from('parents').select('id').eq('user_id', user!.id).maybeSingle()
    if (!parentRec) { setLoading(false); return }

    const { data: links } = await supabase
      .from('student_parents')
      .select(`
        students(id, first_name, last_name,
          student_class_history!inner(is_current, classes(name)),
          student_fees(amount, amount_paid, amount_waived)
        )
      `)
      .eq('parent_id', parentRec.id)

    const summaries: ChildSummary[] = (links ?? []).map((l: any) => {
      const s = l.students
      const fees = s.student_fees ?? []
      const balance = fees.reduce((sum: number, f: any) => sum + f.amount - f.amount_paid - f.amount_waived, 0)
      return {
        id: s.id,
        full_name: `${s.last_name} ${s.first_name}`,
        class_name: s.student_class_history?.[0]?.classes?.name ?? '—',
        rank: null,
        total_students: 0,
        attendance_pct: 0,
        balance_due: balance,
      }
    })
    setChildren(summaries)

    const { data: noticeData } = await supabase
      .from('announcements')
      .select('*')
      .eq('school_id', user!.school_id)
      .in('audience', ['all', 'parents'])
      .order('published_at', { ascending: false })
      .limit(5)
    setNotices(noticeData ?? [])
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">Welcome, {user?.full_name}! 👋</h1>
      </div>

      {/* Children cards */}
      <div>
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">My Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.length === 0 && (
            <div className="card p-8 text-center text-slate-400 text-sm col-span-2">
              No children linked to your account. Contact the school administrator.
            </div>
          )}
          {children.map(c => (
            <Link key={c.id} href={`/parent/children/${c.id}`} className="card p-5 hover:border-brand-blue border border-transparent transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-2xl">👦</div>
                <div>
                  <p className="font-display font-bold text-slate-800 dark:text-white">{c.full_name}</p>
                  <span className="badge-blue text-xs">{c.class_name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={c.balance_due > 0 ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>
                  {c.balance_due > 0 ? `${formatRWF(c.balance_due)} due 🔴` : '✅ Fully paid'}
                </span>
                <span className="text-brand-blue text-xs">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Notices */}
      <div>
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-3">📌 Recent School Notices</h2>
        <div className="card divide-y divide-slate-50 dark:divide-slate-700">
          {notices.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No notices yet.</p>
          ) : notices.map(n => (
            <div key={n.id} className="px-5 py-3">
              <p className="font-medium text-sm text-slate-800 dark:text-white">{n.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(n.published_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
