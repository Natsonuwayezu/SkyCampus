'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'

type RoleOption = { value: string; label: string; icon: string }

const ROLES: RoleOption[] = [
  { value: 'admin',      label: 'Administrator', icon: '👨‍💼' },
  { value: 'accountant', label: 'Accountant',    icon: '💰' },
  { value: 'teacher',    label: 'Teacher',       icon: '👩‍🏫' },
  { value: 'parent',     label: 'Parent',        icon: '👨‍👩‍👧' },
  { value: 'student',    label: 'Student',       icon: '🎒' },
]

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setUser = useAuthStore(s => s.setUser)
  const language = useAuthStore(s => s.language)
  const setLanguage = useAuthStore(s => s.setLanguage)

  const [role, setRole]         = useState('admin')
  const [credential, setCred]   = useState('')  // email or username or student ID
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const supabase = createClient()

  async function resolveEmail(cred: string, roleName: string): Promise<string> {
    // Admin and Parent login with email directly
    if (roleName === 'admin' || roleName === 'parent') return cred

    // Teacher and Accountant use username → resolve to email
    if (roleName === 'teacher' || roleName === 'accountant') {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('username', cred)
        .maybeSingle()
      if (!data) throw new Error('Username not found')
      // Get auth email from auth.users via service (not available client-side)
      // In practice, store email in users table too
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('username', cred)
        .maybeSingle()
      if (!userData) throw new Error('User not found')
      // fallback: use cred as email (admin sets email = username@school.sc)
      return cred.includes('@') ? cred : `${cred}@skycampus.internal`
    }

    // Student uses admission number
    if (roleName === 'student') {
      return `${cred}@student.skycampus.internal`
    }

    return cred
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const email = await resolveEmail(credential.trim(), role)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError
      if (!data.user) throw new Error('Login failed')

      // Fetch user profile + permissions
      const { data: profile } = await supabase
        .from('users')
        .select(`
          id, full_name, username, avatar_url, school_id, is_active,
          roles (id, name, color,
            role_permissions (module_key, can_view, can_create, can_edit, can_delete, can_export)
          ),
          schools (id, name, slug, logo_url, primary_color)
        `)
        .eq('id', data.user.id)
        .single()

      if (!profile) throw new Error('User profile not found')
      if (!profile.is_active) throw new Error('Account is deactivated. Contact your administrator.')

      const roleData = profile.roles as any
      const schoolData = profile.schools as any

      setUser({
        id:          profile.id,
        full_name:   profile.full_name,
        username:    profile.username,
        avatar_url:  profile.avatar_url,
        role_name:   roleData?.name ?? 'Unknown',
        role_color:  roleData?.color ?? '#94A3B8',
        school_id:   profile.school_id ?? '',
        school_name: schoolData?.name ?? '',
        school_slug: schoolData?.slug ?? '',
        school_logo: schoolData?.logo_url ?? null,
        school_color:schoolData?.primary_color ?? '#1A8FE3',
        permissions: roleData?.role_permissions ?? [],
      })

      const redirect = params.get('redirect') || '/dashboard'
      router.push(redirect)
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const usesEmail    = role === 'admin' || role === 'parent'
  const usesUsername = role === 'teacher' || role === 'accountant'
  const usesId       = role === 'student'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex flex-col items-center justify-center p-4">
      {/* Language switcher */}
      <div className="absolute top-5 right-6 flex gap-1">
        {(['en','fr','rw'] as const).map(l => (
          <button
            key={l}
            onClick={() => setLanguage(l)}
            className={`px-2.5 py-1 rounded text-xs font-semibold uppercase transition ${
              language === l
                ? 'bg-brand-blue text-white'
                : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8">
          {/* Logo area */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-blue/30">
              <span className="font-display font-bold text-white text-xl">SC</span>
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">
              SkyCampus
            </h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-base"
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.icon} {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Credential field */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                {usesEmail ? 'Email Address' : usesUsername ? 'Username' : 'Student ID'}
              </label>
              <input
                type={usesEmail ? 'email' : 'text'}
                value={credential}
                onChange={e => setCred(e.target.value)}
                placeholder={
                  usesEmail ? 'admin@school.rw' :
                  usesUsername ? 'jean.mukesa' :
                  'SC-2026-001'
                }
                required
                autoComplete={usesEmail ? 'email' : 'username'}
                className="input-base"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="rounded border-slate-300 text-brand-blue"
              />
              <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-300">
                Remember me
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-input px-4 py-3">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !credential || !password}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <a href="/forgot-password" className="text-sm text-brand-blue hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by SkyCampus — Premium Academic Management
        </p>
      </div>
    </div>
  )
}
