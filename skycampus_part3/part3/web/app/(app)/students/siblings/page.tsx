'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'

interface FamilyGroup {
  parent_id: string
  parent_name: string
  parent_phone: string
  children: { id: string; full_name: string; class_name: string; status: string }[]
}

export default function SiblingsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [groups, setGroups] = useState<FamilyGroup[]>([])
  const [unlinked, setUnlinked] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)

    // Get all parents with their children
    const { data: spData } = await supabase
      .from('student_parents')
      .select(`
        parent_id, is_primary,
        parents(id, first_name, last_name, phone),
        students(id, first_name, last_name, status,
          student_class_history!inner(is_current, classes(name))
        )
      `)
      .eq('school_id', user!.school_id)
      .eq('student_class_history.is_current', true)

    // Group by parent
    const parentMap: Record<string, FamilyGroup> = {}
    const linkedStudentIds = new Set<string>()

    spData?.forEach((sp: any) => {
      const p = sp.parents
      const s = sp.students
      if (!p || !s) return
      if (!parentMap[p.id]) {
        parentMap[p.id] = {
          parent_id:    p.id,
          parent_name:  `${p.last_name} ${p.first_name}`,
          parent_phone: p.phone ?? '—',
          children:     [],
        }
      }
      parentMap[p.id].children.push({
        id:         s.id,
        full_name:  `${s.last_name} ${s.first_name}`,
        class_name: s.student_class_history?.[0]?.classes?.name ?? '—',
        status:     s.status,
      })
      linkedStudentIds.add(s.id)
    })

    // Filter only multi-child families
    const familyGroups = Object.values(parentMap).filter(g => g.children.length > 1)
    setGroups(familyGroups)

    // Unlinked students
    const { data: allStudents } = await supabase
      .from('students')
      .select(`id, first_name, last_name, status, student_class_history!inner(is_current, classes(name))`)
      .eq('school_id', user!.school_id)
      .eq('status', 'active')
      .eq('student_class_history.is_current', true)

    setUnlinked((allStudents ?? []).filter((s: any) => !linkedStudentIds.has(s.id)).map((s: any) => ({
      id:         s.id,
      full_name:  `${s.last_name} ${s.first_name}`,
      class_name: s.student_class_history?.[0]?.classes?.name ?? '—',
    })))

    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Sibling Linking" icon="👨‍👩‍👧"
        subtitle={`${groups.length} family groups · ${unlinked.length} unlinked students`}
      />

      {/* Family groups */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-slate-700 dark:text-white text-sm">Family Groups ({groups.length})</h2>
        {groups.length === 0 && (
          <div className="card p-8 text-center text-slate-400 text-sm">
            No families with multiple children yet. Link parents to students first.
          </div>
        )}
        {groups.map(g => (
          <div key={g.parent_id} className="card p-5">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xl">👨‍👩‍👧</span>
              <div>
                <p className="font-display font-bold text-slate-800 dark:text-white">{g.parent_name}</p>
                <p className="text-xs text-slate-400">{g.parent_phone}</p>
              </div>
              <span className="ml-auto badge-blue">{g.children.length} children</span>
            </div>
            <div className="space-y-2">
              {g.children.map(c => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span>{c.status === 'active' ? '👦' : '📦'}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{c.full_name}</span>
                  <span className="badge-blue text-xs">{c.class_name}</span>
                  {c.status !== 'active' && <span className="badge-gray text-xs">{c.status}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Unlinked students */}
      {unlinked.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white">
              Unlinked Students ({unlinked.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">These students have no parent linked. Edit the student to add a parent.</p>
          </div>
          <table className="table-base">
            <thead><tr><th>#</th><th>Student Name</th><th>Class</th><th>Action</th></tr></thead>
            <tbody>
              {unlinked.slice(0, 20).map((s, i) => (
                <tr key={s.id}>
                  <td className="text-slate-400 text-xs">{i + 1}</td>
                  <td className="font-medium">{s.full_name}</td>
                  <td><span className="badge-gray">{s.class_name}</span></td>
                  <td>
                    <a href={`/students/${s.id}?tab=family`} className="text-brand-blue hover:underline text-xs">
                      👨‍👩‍👧 Link Parent
                    </a>
                  </td>
                </tr>
              ))}
              {unlinked.length > 20 && (
                <tr><td colSpan={4} className="text-center py-3 text-slate-400 text-xs">
                  +{unlinked.length - 20} more unlinked students…
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
