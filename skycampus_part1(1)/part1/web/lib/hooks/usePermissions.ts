import { useAuthStore } from '@/lib/store/authStore'

type Action = 'view' | 'create' | 'edit' | 'delete' | 'export'

export function usePermissions() {
  const can = useAuthStore(s => s.can)
  const user = useAuthStore(s => s.user)
  return {
    can,
    isAdmin: user?.role_name === 'Admin',
    isTeacher: user?.role_name === 'Teacher',
    isAccountant: user?.role_name === 'Accountant',
    roleName: user?.role_name ?? '',
  }
}
