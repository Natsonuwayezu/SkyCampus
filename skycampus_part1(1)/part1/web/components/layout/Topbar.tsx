'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/formatters'

interface TopbarProps { title: string }

export default function Topbar({ title }: TopbarProps) {
  const { user, isDark, setDark, language, setLanguage, sidebarOpen, setSidebarOpen } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUser, setShowUser]     = useState(false)
  const notifsRef = useRef<HTMLDivElement>(null)
  const supabase  = createClient()

  useEffect(() => {
    if (!user?.id) return
    loadNotifications()
    // Realtime subscription
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, payload => {
        setNotifications(prev => [payload.new as any, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(10)
    setNotifications(data ?? [])
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user!.id)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-[#1E293B] border-b border-slate-100 dark:border-slate-700 z-30 flex items-center px-4 gap-4"
      style={{ left: sidebarOpen ? '260px' : '64px', transition: 'left 0.2s' }}
    >
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 text-lg"
      >
        ☰
      </button>

      {/* Page title */}
      <h1 className="font-display font-bold text-slate-800 dark:text-white text-base flex-1 truncate">
        {title}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <div className="flex gap-0.5">
          {(['en','fr','rw'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-2 py-1 rounded text-xs font-semibold uppercase transition ${
                language === l
                  ? 'bg-brand-blue text-white'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Dark mode */}
        <button
          onClick={() => {
            setDark(!isDark)
            document.documentElement.classList.toggle('dark', !isDark)
          }}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 text-base"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 text-base relative"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 card shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-sm text-slate-700 dark:text-white">
                  Notifications {unreadCount > 0 && <span className="badge-red ml-1">{unreadCount}</span>}
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-blue hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm py-8">No notifications</p>
                ) : notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 text-sm ${!n.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{n.title}</p>
                    {n.body && <p className="text-slate-500 text-xs mt-0.5">{n.body}</p>}
                    <p className="text-slate-400 text-xs mt-1">{formatDate(n.created_at)}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                <a href="/notifications" className="text-xs text-brand-blue hover:underline">
                  View all notifications →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUser(!showUser)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: user?.role_color ?? '#1A8FE3' }}>
              {user?.full_name?.charAt(0) ?? 'U'}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden md:block max-w-[120px] truncate">
              {user?.full_name}
            </span>
            <span className="text-slate-400 text-xs">▾</span>
          </button>

          {showUser && (
            <div className="absolute right-0 top-12 w-52 card shadow-xl z-50 py-1">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="font-semibold text-sm text-slate-800 dark:text-white">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{user?.role_name}</p>
              </div>
              <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                👤 My Profile
              </a>
              <a href="/profile?tab=password" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                🔑 Change Password
              </a>
              <hr className="my-1 border-slate-100 dark:border-slate-700" />
              <button
                onClick={async () => {
                  const { createClient } = await import('@/lib/supabase/client')
                  await createClient().auth.signOut()
                  window.location.href = '/login'
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full text-left"
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
