'use client'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/formatters'
type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
interface ModalProps { open: boolean; onClose: () => void; title: string; size?: ModalSize; children: React.ReactNode; footer?: React.ReactNode }
const SIZE: Record<ModalSize, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
export default function Modal({ open, onClose, title, size = 'md', children, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, onClose])
  if (!open) return null
  return (
    <div ref={ref} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === ref.current) onClose() }}>
      <div className={cn('card w-full', SIZE[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-display font-bold text-base text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">✕</button>
        </div>
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
