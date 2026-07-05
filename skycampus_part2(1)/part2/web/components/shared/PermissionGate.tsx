'use client'
import { useAuthStore } from '@/lib/store/authStore'

type Action = 'view' | 'create' | 'edit' | 'delete' | 'export'
interface PermissionGateProps {
  module: string; action?: Action; fallback?: React.ReactNode; children: React.ReactNode
}
export default function PermissionGate({ module, action = 'view', fallback = null, children }: PermissionGateProps) {
  const can = useAuthStore(s => s.can)
  const roleName = useAuthStore(s => s.user?.role_name)
  if (roleName === 'Admin' || can(module, action)) return <>{children}</>
  return <>{fallback}</>
}
