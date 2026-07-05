'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { createClient } from '@/lib/supabase/client'
import StatCard from '@/components/shared/StatCard'
import PageHeader from '@/components/shared/PageHeader'
import { formatRWF } from '@/lib/utils/formatters'
import Link from 'next/link'

interface DashStats {
  totalStudents: number
  activeStudents: number
  assessmentsThisTerm: number
  marksInDB: number
  totalFees: number
  collectedFees: number
  pendingFees: number
  overdueFees: number
}

interface ClassFee { class_name: string; total: number; paid: number; pct: number }
interface RecentAction { id: string; title: string; body: string; created_at: string; type: string }
interface ClassPerf { class_name: string; students: number; avg: number; grade: string }

export default function DashboardPage() {
  const { user } = useAuthStore()
  const roleName = user?.role_name ?? ''
  const [stats, setStats] = useState<DashStats | null>(null)
  const [classFees, setClassFees] = useState<ClassFee[]>([])
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      // Students
      const { count: total } = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', user!.school_id)
      const { count: active } = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('school_id', user!.school_id).eq('status', 'active')

      // Marks
      const { count: marksCount } = await supabase.from('marks').select('*', { count: 'exact', head: true }).eq('school_id', user!.school_id)
      const { count: assessCount } = await supabase.from('assessments').select('*', { count: 'exact', head: true }).eq('school_id', user!.school_id)

      // Finance
      const { data: feeData } = await supabase.from('student_fees').select('amount, amount_paid, status').eq('school_id', user!.school_id)
      const totalFees = feeData?.reduce((s, r) => s + r.amount, 0) ?? 0
      const collectedFees = feeData?.reduce((s, r) => s + r.amount_paid, 0) ?? 0
      const pendingFees = totalFees - collectedFees
      const overdueFees = feeData?.filter(r => r.status === 'pending').reduce((s, r) => s + (r.amount - r.amount_paid), 0) ?? 0

      setStats({ totalStudents: total??0, activeStudents: active??0, assessmentsThisTerm: assessCount??0, marksInDB: marksCount??0, totalFees, collectedFees, pendingFees, overdueFees })

      // Recent actions (notifications)
      const { data: notifs } = await supabase.from('notifications').select('*').eq('school_id', user!.school_id).order('created_at', { ascending: false }).limit(8)
      setRecentActions(notifs ?? [])
    } catch(e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const QUICK = [
    { label: 'Enroll Student', href: '/students/enroll', icon: '➕' },
    { label: 'Record Payment', href: '/finance/record-payment', icon: '💸' },
    { label: 'Report Cards', href: '/academics/report-cards', icon: '📄' },
    { label: 'Mark Entry', href: '/academics/marks-entry', icon: '✏️' },
    { label: 'Fee Structure', href: '/finance/fee-structure', icon: '🏷️' },
    { label: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
    </div>
  )

  // Admin / general dashboard
  if (roleName === 'Admin') return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" icon="📊" subtitle={`Welcome back, ${user?.full_name}`} />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Total Students" value={stats?.totalStudents??0} sub={`${stats?.activeStudents} active`} color="#1A8FE3" />
        <StatCard icon="✅" label="Active Students" value={stats?.activeStudents??0} sub={`${stats?.totalStudents ? Math.round((stats.activeStudents/stats.totalStudents)*100) : 0}% active`} color="#10B981" />
        <StatCard icon="📝" label="Assessments" value={stats?.assessmentsThisTerm??0} sub="this term" color="#8B5CF6" />
        <StatCard icon="✏️" label="Marks in DB" value={(stats?.marksInDB??0).toLocaleString()} sub="all time" color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee collection */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-4">💰 Fee Collection Overview</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Total Billed</span><span className="font-semibold">{formatRWF(stats?.totalFees??0)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Collected</span><span className="font-semibold text-green-600">{formatRWF(stats?.collectedFees??0)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pending</span><span className="font-semibold text-amber-600">{formatRWF(stats?.pendingFees??0)}</span></div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${stats?.totalFees ? Math.round((stats.collectedFees/stats.totalFees)*100) : 0}%` }} />
            </div>
            <p className="text-xs text-slate-400">{stats?.totalFees ? Math.round((stats.collectedFees/stats.totalFees)*100) : 0}% collected</p>
          </div>
        </div>

        {/* Recent actions */}
        <div className="card p-5">
          <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-4">🔄 Recent Actions</h2>
          {recentActions.length === 0
            ? <p className="text-slate-400 text-sm text-center py-6">No recent activity</p>
            : <div className="space-y-3">
                {recentActions.slice(0,6).map(n => (
                  <div key={n.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex-shrink-0">
                      {n.type === 'marks' ? '✏️' : n.type === 'payment' ? '💰' : n.type === 'student' ? '👥' : '🔔'}
                    </span>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200 leading-tight">{n.title}</p>
                      <p className="text-slate-400 text-xs">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK.map(q => (
            <Link key={q.href} href={q.href}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition group text-center">
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-brand-blue leading-tight">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )

  // Accountant dashboard
  if (roleName === 'Accountant') return (
    <div className="space-y-6">
      <PageHeader title="Finance Dashboard" icon="💰" subtitle={`Welcome back, ${user?.full_name}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💵" label="Total Fees" value={formatRWF(stats?.totalFees??0)} color="#1A8FE3" />
        <StatCard icon="✅" label="Collected" value={formatRWF(stats?.collectedFees??0)} sub={`${stats?.totalFees ? Math.round((stats.collectedFees/stats.totalFees)*100) : 0}%`} color="#10B981" />
        <StatCard icon="⏳" label="Pending" value={formatRWF(stats?.pendingFees??0)} color="#F59E0B" />
        <StatCard icon="🔴" label="Overdue 7d+" value={formatRWF(stats?.overdueFees??0)} color="#EF4444" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {label:'Record Payment', href:'/finance/record-payment', icon:'💸'},
          {label:'Overdue List', href:'/finance/overdue', icon:'⚠️'},
          {label:'Fee Structure', href:'/finance/fee-structure', icon:'🏷️'},
          {label:'Reports', href:'/finance/reports', icon:'📊'},
        ].map(q=>(
          <Link key={q.href} href={q.href} className="card p-4 flex items-center gap-3 hover:border-brand-blue border border-transparent transition group">
            <span className="text-xl">{q.icon}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-blue">{q.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )

  // Teacher dashboard
  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Dashboard" icon="✏️" subtitle={`Welcome back, ${user?.full_name}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="✏️" label="Marks Entered" value={(stats?.marksInDB??0).toLocaleString()} color="#8B5CF6" />
        <StatCard icon="📝" label="Assessments" value={stats?.assessmentsThisTerm??0} color="#1A8FE3" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          {label:'Enter Marks', href:'/academics/marks-entry', icon:'✏️'},
          {label:'My Assessments', href:'/academics/assessments', icon:'📝'},
          {label:'Class Register', href:'/academics/class-register', icon:'📋'},
          {label:'Report Cards', href:'/academics/report-cards', icon:'📄'},
        ].map(q=>(
          <Link key={q.href} href={q.href} className="card p-4 flex items-center gap-3 hover:border-brand-blue border border-transparent transition group">
            <span className="text-xl">{q.icon}</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-blue">{q.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
