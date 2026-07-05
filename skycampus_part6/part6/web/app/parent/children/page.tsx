'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { formatRWF } from '@/lib/utils/formatters'

export default function ChildrenListPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: parentRec } = await supabase.from('parents').select('id').eq('user_id', user!.id).maybeSingle()
    if (!parentRec) { setLoading(false); return }

    const { data: links } = await supabase
      .from('student_parents')
      .select(`
        students(id, first_name, last_name, photo_url, admission_number,
          student_class_history!inner(is_current, classes(name)),
          student_fees(amount, amount_paid, amount_waived)
        )
      `)
      .eq('parent_id', parentRec.id)

    setChildren((links ?? []).map((l: any) => l.students))
    setLoading(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/></div>

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">👶 My Children</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((c: any) => {
          const fees = c.student_fees ?? []
          const balance = fees.reduce((s:number,f:any) => s + f.amount - f.amount_paid - f.amount_waived, 0)
          return (
            <Link key={c.id} href={`/parent/children/${c.id}`} className="card p-5 hover:border-brand-blue border border-transparent transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                  {c.photo_url ? <img src={c.photo_url} className="w-full h-full object-cover"/> : '👦'}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-slate-800 dark:text-white">{c.last_name} {c.first_name}</p>
                  <p className="text-xs text-slate-400">{c.admission_number}</p>
                  <span className="badge-blue text-xs mt-1 inline-block">{c.student_class_history?.[0]?.classes?.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {balance > 0 ? formatRWF(balance) : '✅'}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
        {children.length === 0 && <div className="card p-8 text-center text-slate-400 text-sm col-span-2">No children linked.</div>}
      </div>
    </div>
  )
}
