'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils/formatters'

interface AcademicYear { id:string; name:string; start_date:string; end_date:string; is_current:boolean }
interface Term { id:string; academic_year_id:string; name:string; term_number:number; start_date:string; midterm_date:string|null; end_date:string; is_current:boolean }
interface Holiday { id:string; name:string; date:string; type:string }

export default function AcademicCalendarPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [years, setYears] = useState<AcademicYear[]>([])
  const [terms, setTerms] = useState<Term[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [showYearModal, setShowYearModal] = useState(false)
  const [showTermModal, setShowTermModal] = useState(false)
  const [showHolidayModal, setShowHolidayModal] = useState(false)
  const [delTarget, setDelTarget] = useState<{type:string;id:string}|null>(null)
  const [saving, setSaving] = useState(false)
  const [yForm, setYForm] = useState({ name:'', start_date:'', end_date:'' })
  const [tForm, setTForm] = useState({ name:'', term_number:1, start_date:'', midterm_date:'', end_date:'' })
  const [hForm, setHForm] = useState({ name:'', date:'', type:'holiday' })

  useEffect(() => { loadYears() }, [])
  useEffect(() => { if (selectedYear) { loadTerms(); loadHolidays() } }, [selectedYear])

  async function loadYears() {
    const { data } = await supabase.from('academic_years').select('*').eq('school_id', user!.school_id).order('start_date', { ascending: false })
    setYears(data ?? [])
    const current = data?.find(y => y.is_current)
    if (current) setSelectedYear(current.id)
    else if (data?.[0]) setSelectedYear(data[0].id)
  }
  async function loadTerms() {
    const { data } = await supabase.from('terms').select('*').eq('school_id', user!.school_id).eq('academic_year_id', selectedYear).order('term_number')
    setTerms(data ?? [])
  }
  async function loadHolidays() {
    const { data } = await supabase.from('holidays').select('*').eq('school_id', user!.school_id).order('date')
    setHolidays(data ?? [])
  }

  async function saveYear() {
    setSaving(true)
    const { error } = await supabase.from('academic_years').insert({ ...yForm, school_id: user!.school_id, is_current: false })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Academic year created!')
    setShowYearModal(false)
    setYForm({ name:'', start_date:'', end_date:'' })
    loadYears()
  }

  async function saveTerm() {
    setSaving(true)
    const payload = { ...tForm, academic_year_id: selectedYear, school_id: user!.school_id, is_current: false, midterm_date: tForm.midterm_date || null }
    const { error } = await supabase.from('terms').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Term created!')
    setShowTermModal(false)
    setTForm({ name:'', term_number:1, start_date:'', midterm_date:'', end_date:'' })
    loadTerms()
  }

  async function saveHoliday() {
    setSaving(true)
    const { error } = await supabase.from('holidays').insert({ ...hForm, school_id: user!.school_id })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Holiday added!')
    setShowHolidayModal(false)
    setHForm({ name:'', date:'', type:'holiday' })
    loadHolidays()
  }

  async function setCurrentTerm(termId: string) {
    await supabase.from('terms').update({ is_current: true }).eq('id', termId)
    toast.success('Current term updated!')
    loadTerms()
  }

  async function confirmDelete() {
    if (!delTarget) return
    const { type, id } = delTarget
    if (type === 'year') await supabase.from('academic_years').delete().eq('id', id)
    if (type === 'term') await supabase.from('terms').delete().eq('id', id)
    if (type === 'holiday') await supabase.from('holidays').delete().eq('id', id)
    toast.success('Deleted')
    setDelTarget(null)
    loadYears(); loadTerms(); loadHolidays()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Academic Calendar" icon="📅"
        actions={<>
          <button onClick={() => setShowYearModal(true)} className="btn-secondary text-sm">➕ Add Year</button>
          <button onClick={() => setShowTermModal(true)} className="btn-secondary text-sm">➕ Add Term</button>
          <button onClick={() => setShowHolidayModal(true)} className="btn-primary text-sm">➕ Holiday/Event</button>
        </>}
      />

      {/* Year selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Academic Year:</label>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="input-base max-w-[200px]">
          {years.map(y => <option key={y.id} value={y.id}>{y.name}{y.is_current ? ' 📍' : ''}</option>)}
        </select>
      </div>

      {/* Terms */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 font-display font-bold text-sm text-slate-700 dark:text-white">Terms</div>
        <table className="table-base">
          <thead><tr>
            <th>Term</th><th>Start</th><th>Midterm</th><th>End</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {terms.map(t => (
              <tr key={t.id}>
                <td className="font-medium">{t.name}</td>
                <td>{formatDate(t.start_date)}</td>
                <td>{t.midterm_date ? formatDate(t.midterm_date) : '—'}</td>
                <td>{formatDate(t.end_date)}</td>
                <td>{t.is_current ? <span className="badge-blue">📍 Current</span> : <button onClick={() => setCurrentTerm(t.id)} className="text-xs text-brand-blue hover:underline">Set Current</button>}</td>
                <td><button onClick={() => setDelTarget({type:'term', id:t.id})} className="text-red-400 hover:text-red-600 text-xs">🗑️</button></td>
              </tr>
            ))}
            {terms.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No terms yet. Add one above.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Holidays */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 font-display font-bold text-sm text-slate-700 dark:text-white">Holidays & Events</div>
        <table className="table-base">
          <thead><tr><th>Name</th><th>Date</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {holidays.map(h => (
              <tr key={h.id}>
                <td className="font-medium">{h.name}</td>
                <td>{formatDate(h.date)}</td>
                <td><span className={h.type === 'holiday' ? 'badge-amber' : 'badge-blue'}>{h.type}</span></td>
                <td><button onClick={() => setDelTarget({type:'holiday', id:h.id})} className="text-red-400 hover:text-red-600 text-xs">🗑️</button></td>
              </tr>
            ))}
            {holidays.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No holidays added.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal open={showYearModal} onClose={() => setShowYearModal(false)} title="Add Academic Year"
        footer={<><button onClick={() => setShowYearModal(false)} className="btn-secondary">Cancel</button><button onClick={saveYear} disabled={saving} className="btn-primary">{saving?'Saving…':'Create Year'}</button></>}>
        <div className="space-y-4">
          <div><label className="label-xs">Year Name (e.g. 2025-2026)</label><input className="input-base" value={yForm.name} onChange={e => setYForm(f=>({...f,name:e.target.value}))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Start Date</label><input type="date" className="input-base" value={yForm.start_date} onChange={e => setYForm(f=>({...f,start_date:e.target.value}))} /></div>
            <div><label className="label-xs">End Date</label><input type="date" className="input-base" value={yForm.end_date} onChange={e => setYForm(f=>({...f,end_date:e.target.value}))} /></div>
          </div>
        </div>
      </Modal>

      <Modal open={showTermModal} onClose={() => setShowTermModal(false)} title="Add Term"
        footer={<><button onClick={() => setShowTermModal(false)} className="btn-secondary">Cancel</button><button onClick={saveTerm} disabled={saving} className="btn-primary">{saving?'Saving…':'Create Term'}</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Term Name</label><input className="input-base" placeholder="Term 1" value={tForm.name} onChange={e => setTForm(f=>({...f,name:e.target.value}))} /></div>
            <div><label className="label-xs">Term Number</label><input type="number" min={1} max={4} className="input-base" value={tForm.term_number} onChange={e => setTForm(f=>({...f,term_number:+e.target.value}))} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-xs">Start Date</label><input type="date" className="input-base" value={tForm.start_date} onChange={e => setTForm(f=>({...f,start_date:e.target.value}))} /></div>
            <div><label className="label-xs">Midterm Date</label><input type="date" className="input-base" value={tForm.midterm_date} onChange={e => setTForm(f=>({...f,midterm_date:e.target.value}))} /></div>
            <div><label className="label-xs">End Date</label><input type="date" className="input-base" value={tForm.end_date} onChange={e => setTForm(f=>({...f,end_date:e.target.value}))} /></div>
          </div>
        </div>
      </Modal>

      <Modal open={showHolidayModal} onClose={() => setShowHolidayModal(false)} title="Add Holiday / Event"
        footer={<><button onClick={() => setShowHolidayModal(false)} className="btn-secondary">Cancel</button><button onClick={saveHoliday} disabled={saving} className="btn-primary">{saving?'Saving…':'Add'}</button></>}>
        <div className="space-y-4">
          <div><label className="label-xs">Name</label><input className="input-base" placeholder="Liberation Day" value={hForm.name} onChange={e => setHForm(f=>({...f,name:e.target.value}))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Date</label><input type="date" className="input-base" value={hForm.date} onChange={e => setHForm(f=>({...f,date:e.target.value}))} /></div>
            <div><label className="label-xs">Type</label>
              <select className="input-base" value={hForm.type} onChange={e => setHForm(f=>({...f,type:e.target.value}))}>
                <option value="holiday">Holiday</option>
                <option value="event">School Event</option>
                <option value="break">Break</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={confirmDelete}
        title="Confirm Delete" message="Are you sure you want to delete this? This action cannot be undone." confirmLabel="Delete" danger />
    </div>
  )
}
