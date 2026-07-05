import { cn } from '@/lib/utils/formatters'
interface StatCardProps { icon: string; label: string; value: string | number; sub?: string; color?: string; className?: string }
export default function StatCard({ icon, label, value, sub, color = '#1A8FE3', className }: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="font-display font-bold text-2xl text-slate-800 dark:text-white leading-none">{value}</div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  )
}
