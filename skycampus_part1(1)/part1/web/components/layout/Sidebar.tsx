'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils/formatters'

interface NavItem { label: string; href: string; icon: string; module?: string }
interface NavSection { title: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',     href: '/dashboard',      icon: '📊' },
      { label: 'Notifications', href: '/notifications',  icon: '🔔' },
      { label: 'Announcements', href: '/announcements',  icon: '📢' },
    ],
  },
  {
    title: 'Academics',
    items: [
      { label: 'Marks Entry',    href: '/academics/marks-entry',    icon: '✏️',  module: 'marks_entry' },
      { label: 'Marks Database', href: '/academics/marks-database', icon: '🗄️', module: 'marks_database' },
      { label: 'Assessments',    href: '/academics/assessments',    icon: '📝',  module: 'assessments' },
      { label: 'Class Register', href: '/academics/class-register', icon: '📋',  module: 'class_register' },
      { label: 'Statistics',     href: '/academics/statistics',     icon: '📈',  module: 'statistics' },
      { label: 'Timetable',      href: '/academics/timetable',      icon: '🕐',  module: 'timetable' },
      { label: 'Report Cards',   href: '/academics/report-cards',   icon: '📄',  module: 'report_cards' },
      { label: 'Promotion',      href: '/academics/promotion',      icon: '🎓',  module: 'students' },
    ],
  },
  {
    title: 'Students',
    items: [
      { label: 'Student List',  href: '/students',             icon: '📋', module: 'students' },
      { label: 'Enroll',        href: '/students/enroll',      icon: '➕', module: 'students' },
      { label: 'Student Fees',  href: '/students/fees',        icon: '💰', module: 'finance' },
      { label: 'Siblings',      href: '/students/siblings',    icon: '👨‍👩‍👧', module: 'students' },
      { label: 'Archive',       href: '/students/archive',     icon: '📦', module: 'students' },
      { label: 'Bulk Import',   href: '/students/bulk-import', icon: '📤', module: 'students' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Fee Structure',    href: '/finance/fee-structure',   icon: '🏷️', module: 'finance' },
      { label: 'Record Payment',   href: '/finance/record-payment',  icon: '💸', module: 'finance' },
      { label: 'Payment History',  href: '/finance/payment-history', icon: '📜', module: 'finance' },
      { label: 'Overdue',          href: '/finance/overdue',         icon: '⚠️', module: 'finance' },
      { label: 'Waivers',          href: '/finance/waivers',         icon: '🎁', module: 'finance' },
      { label: 'Receipts',         href: '/finance/receipts',        icon: '🧾', module: 'finance' },
      { label: 'Reports',          href: '/finance/reports',         icon: '📊', module: 'finance' },
    ],
  },
  {
    title: 'Staff',
    items: [
      { label: 'Teachers',    href: '/staff',                icon: '👩‍🏫', module: 'staff' },
      { label: 'Subjects',    href: '/staff/subjects',       icon: '📖', module: 'staff' },
      { label: 'Assignments', href: '/staff/assignments',    icon: '📌', module: 'staff' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'School Settings',  href: '/settings',                   icon: '🏫', module: 'settings' },
      { label: 'Academic Calendar',href: '/settings/academic-calendar', icon: '📅', module: 'settings' },
      { label: 'Classes',          href: '/settings/classes',           icon: '🏛️', module: 'settings' },
      { label: 'Grading Scale',    href: '/settings/grading',           icon: '📊', module: 'settings' },
      { label: 'User Management',  href: '/settings/users',             icon: '👥', module: 'settings' },
      { label: 'Roles & Perms',    href: '/settings/roles',             icon: '🔐', module: 'settings' },
      { label: 'Backup & Restore', href: '/settings/backup',            icon: '💾', module: 'settings' },
      { label: 'System Logs',      href: '/settings/logs',              icon: '📋', module: 'settings' },
      { label: 'Analytics',        href: '/settings/analytics',         icon: '📊', module: 'analytics' },
    ],
  },
]

interface SidebarProps { schoolName: string; schoolLogo?: string | null }

export default function Sidebar({ schoolName, schoolLogo }: SidebarProps) {
  const pathname = usePathname()
  const { can, roleName } = useAuthStore(s => ({
    can: s.can,
    roleName: s.user?.role_name ?? '',
  }))
  const isOpen = useAuthStore(s => s.sidebarOpen)

  function isVisible(item: NavItem): boolean {
    if (!item.module) return true
    if (roleName === 'Admin') return true
    return can(item.module, 'view')
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-white dark:bg-[#0D1B2A] border-r border-slate-100 dark:border-slate-800 z-40 flex flex-col transition-all duration-200 overflow-hidden',
      isOpen ? 'w-[260px]' : 'w-16'
    )}>
      {/* School logo + name */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-brand-blue flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-brand-blue/20">
          {schoolLogo
            ? <img src={schoolLogo} alt={schoolName} className="w-full h-full object-cover rounded-lg" />
            : schoolName.charAt(0)
          }
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-sm text-slate-800 dark:text-white truncate leading-tight">{schoolName}</p>
            <p className="text-[10px] text-brand-gold font-semibold">SkyCampus</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV.map(section => {
          const visibleItems = section.items.filter(isVisible)
          if (visibleItems.length === 0) return null
          return (
            <div key={section.title}>
              {isOpen && <div className="sidebar-section">{section.title}</div>}
              {visibleItems.map(item => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn('sidebar-link', active && 'active', !isOpen && 'justify-center px-0')}
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Bottom: profile */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <Link href="/profile" className={cn('sidebar-link', !isOpen && 'justify-center px-0')}>
          <span className="text-base">👤</span>
          {isOpen && <span className="truncate">My Profile</span>}
        </Link>
        <button
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            await createClient().auth.signOut()
            window.location.href = '/login'
          }}
          className={cn('sidebar-link w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10', !isOpen && 'justify-center px-0')}
        >
          <span className="text-base">🚪</span>
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
