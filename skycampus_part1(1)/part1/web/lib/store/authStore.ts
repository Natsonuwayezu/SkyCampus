import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Permission {
  module_key: string
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
}

interface AuthUser {
  id: string
  full_name: string
  username: string | null
  avatar_url: string | null
  role_name: string
  role_color: string
  school_id: string
  school_name: string
  school_slug: string
  school_logo: string | null
  school_color: string
  permissions: Permission[]
}

interface AuthStore {
  user: AuthUser | null
  isDark: boolean
  language: 'en' | 'fr' | 'rw'
  sidebarOpen: boolean
  setUser: (user: AuthUser | null) => void
  setDark: (v: boolean) => void
  setLanguage: (l: 'en' | 'fr' | 'rw') => void
  setSidebarOpen: (v: boolean) => void
  can: (module: string, action: 'view' | 'create' | 'edit' | 'delete' | 'export') => boolean
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isDark: false,
      language: 'en',
      sidebarOpen: true,

      setUser: (user) => set({ user }),
      setDark: (v) => set({ isDark: v }),
      setLanguage: (l) => set({ language: l }),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),

      can: (module, action) => {
        const { user } = get()
        if (!user) return false
        if (user.role_name === 'Admin') return true
        const perm = user.permissions.find(p => p.module_key === module)
        if (!perm) return false
        return perm[`can_${action}`] === true
      },

      signOut: () => set({ user: null }),
    }),
    {
      name: 'skycampus-auth',
      partialize: (state) => ({
        isDark: state.isDark,
        language: state.language,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
