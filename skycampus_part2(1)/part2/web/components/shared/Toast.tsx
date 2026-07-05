'use client'
import { useEffect, useState } from 'react'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export interface ToastMessage { id: string; type: ToastType; message: string }
const listeners: Set<(t: ToastMessage[]) => void> = new Set()
let toasts: ToastMessage[] = []
export const toast = {
  show(type: ToastType, message: string) {
    const id = Date.now().toString()
    toasts = [...toasts, { id, type, message }]
    listeners.forEach(l => l(toasts))
    setTimeout(() => { toasts = toasts.filter(t => t.id !== id); listeners.forEach(l => l(toasts)) }, 4000)
  },
  success: (m: string) => toast.show('success', m),
  error:   (m: string) => toast.show('error', m),
  warning: (m: string) => toast.show('warning', m),
  info:    (m: string) => toast.show('info', m),
}
const ICONS: Record<ToastType, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
const COLORS: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
}
export default function ToastContainer() {
  const [items, setItems] = useState<ToastMessage[]>([])
  useEffect(() => { listeners.add(setItems); return () => { listeners.delete(setItems) } }, [])
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.map(t => (
        <div key={t.id} className={\`flex items-center gap-3 px-4 py-3 rounded-card border shadow-lg text-sm font-medium pointer-events-auto \${COLORS[t.type]}\`}>
          <span>{ICONS[t.type]}</span><span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
