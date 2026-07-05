'use client'
import { useEffect, useState } from 'react'

interface TermData {
  name: string
  year: string
  start_date: string
  midterm_date: string | null
  end_date: string
}

interface TermProgressBarProps { term?: TermData }

export default function TermProgressBar({ term }: TermProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [daysLeft, setDaysLeft] = useState(0)
  const [phase, setPhase] = useState('')

  useEffect(() => {
    if (!term) return
    const now     = new Date()
    const start   = new Date(term.start_date)
    const end     = new Date(term.end_date)
    const midterm = term.midterm_date ? new Date(term.midterm_date) : null

    const total   = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    const pct     = Math.min(100, Math.max(0, (elapsed / total) * 100))
    const days    = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000))

    setProgress(Math.round(pct))
    setDaysLeft(days)

    if (midterm && now < midterm) setPhase('Pre-Midterm')
    else if (midterm && now >= midterm) setPhase('Post-Midterm')
    else setPhase('')
  }, [term])

  if (!term) return null

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-2 flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm flex-shrink-0">
        <span className="text-slate-400">📅</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{term.name} — {term.year}</span>
        {phase && (
          <span className="badge-blue text-[10px]">{phase}</span>
        )}
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{progress}% · {daysLeft} days left</span>
      </div>
    </div>
  )
}
