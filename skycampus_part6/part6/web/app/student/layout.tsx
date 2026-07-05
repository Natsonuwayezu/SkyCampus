import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select(`id, full_name, school_id, is_active, roles(name), schools(name, logo_url)`)
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) redirect('/login')
  const role = (profile.roles as any)?.name
  if (role !== 'Student') redirect('/dashboard')

  const school = profile.schools as any

  const NAV = [
    { label: 'Home',       href: '/student',            icon: '🏠' },
    { label: 'Results',    href: '/student/results',    icon: '📚' },
    { label: 'Timetable',  href: '/student/timetable',  icon: '📅' },
    { label: 'Attendance', href: '/student/attendance', icon: '📋' },
    { label: 'Materials',  href: '/student/materials',  icon: '📂' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A]">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {school?.logo_url ? <img src={school.logo_url} alt="" className="w-full h-full object-cover rounded-lg"/> : school?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-white leading-tight">{school?.name}</p>
              <p className="text-[10px] text-cyan-600 font-semibold">Student Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-cyan-600 transition">
                <span>{n.icon}</span><span>{n.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">{profile.full_name}</span>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-red-500 hover:underline">Sign Out</button>
            </form>
          </div>
        </div>
        <nav className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-700 py-2">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="flex flex-col items-center gap-0.5 px-2 text-slate-500">
              <span className="text-lg">{n.icon}</span>
              <span className="text-[10px]">{n.label}</span>
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
