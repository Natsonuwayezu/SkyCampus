import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Super admins have school_id = NULL
  const { data: profile } = await supabase
    .from('users')
    .select('id, full_name, school_id, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active || profile.school_id !== null) redirect('/login')

  const NAV = [
    { label: 'Dashboard', href: '/superadmin',          icon: '📊' },
    { label: 'Schools',   href: '/superadmin/schools',  icon: '🏫' },
    { label: 'Billing',   href: '/superadmin/billing',  icon: '💰' },
    { label: 'Users',     href: '/superadmin/users',    icon: '👥' },
    { label: 'Logs',      href: '/superadmin/logs',     icon: '📋' },
    { label: 'Settings',  href: '/superadmin/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      <header className="bg-[#0D1B2A] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold text-sm">SC</div>
            <div>
              <p className="font-display font-bold text-sm text-white leading-tight">SKYCAMPUS</p>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition">
                <span>{n.icon}</span><span>{n.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">{profile.full_name}</span>
            <form action="/auth/signout" method="post">
              <button className="text-sm text-red-400 hover:text-red-300">Sign Out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  )
}
