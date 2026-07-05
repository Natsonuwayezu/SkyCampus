import { cn } from '@/lib/utils/formatters'
interface PageHeaderProps { title: string; subtitle?: string; icon?: string; actions?: React.ReactNode; className?: string }
export default function PageHeader({ title, subtitle, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-6', className)}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
