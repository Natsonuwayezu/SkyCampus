import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import TermProgressBar from '@/components/layout/TermProgressBar'
import ToastContainer from '@/components/shared/Toast'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select(`
      id, full_name, school_id, is_active,
      roles ( name, color ),
      schools ( id, name, slug, logo_url, primary_color,
        terms ( id, name, start_date, midterm_date, end_date, is_current,
          academic_years ( name )
        )
      )
    `)
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_active) redirect('/login')

  const school   = profile.schools as any
  const currentTerm = school?.terms?.find((t: any) => t.is_current)

  const termData = currentTerm ? {
    name:         currentTerm.name,
    year:         currentTerm.academic_years?.name ?? '',
    start_date:   currentTerm.start_date,
    midterm_date: currentTerm.midterm_date,
    end_date:     currentTerm.end_date,
  } : undefined

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A]">
      <Sidebar schoolName={school?.name ?? 'SkyCampus'} schoolLogo={school?.logo_url} />

      <div id="main-content" className="transition-all duration-200 ml-[260px]">
        <Topbar title="SkyCampus" />
        <div className="mt-16">
          <TermProgressBar term={termData} />
          <main className="p-6">{children}</main>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
