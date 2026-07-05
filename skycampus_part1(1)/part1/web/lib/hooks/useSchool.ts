import { useAuthStore } from '@/lib/store/authStore'

export function useSchool() {
  const user = useAuthStore(s => s.user)
  return {
    schoolId:    user?.school_id ?? null,
    schoolName:  user?.school_name ?? '',
    schoolSlug:  user?.school_slug ?? '',
    schoolLogo:  user?.school_logo ?? null,
    schoolColor: user?.school_color ?? '#1A8FE3',
  }
}
