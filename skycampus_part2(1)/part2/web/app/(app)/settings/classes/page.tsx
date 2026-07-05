'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface ClassRow { id:string; name:string; level:string; stream:string|null; room:string|null; capacity:number; display_order:number; is_active:boolean; class_teacher?: { full_name:string } }
interface Teacher { id:string; full_name:string }

export default function ClassManagementPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [yearId, setYearId] = useState<string>('')
  const [years, setYears] = useState<{id:string;name:string}[]>([])
  const [showModal, setShowModal] = useState(false)
  const [delId, setDelId] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', level:'primary', stream:'', room:'', capacity:40, class_teacher_id:'' })

  useEffect(() => { loadYears(); loadTeachers() }, [])
  useEffect(() => { if (yearId) loadClasses() }, [yearId])

  async function loadYears() {
    const { data } = await supabase.from('academic_years').select('id,name').eq('school_id', user!.school_id).order('start_date', { ascending: false })
    setYears(data ?? [])
    const cur = data?.find((y:any) => y.is_current) ?? data?.[0]
    if (cur) setYearId(cur.id)
  }
  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*, class_teacher:users(full_name)').eq('school_id', user!.school_id).eq('academic_year_id', yearId).order('display_order')
    setClasses(data as any ?? [])
  }
  async function loadTeachers() {
    const { data } = await supabase.from('users').select('id, full_name').eq('school_id', user!.school_id).eq('is_active', true)
    setTeachers(data ?? [])
  }
  async function save() {
    setSaving(true)
    const payload = { ...form, school_id: user!.school_id, academic_year_id: yearId, stream: form.stream || null, class_teacher_id: form.class_teacher_id || null }
    const { error } = await supabase.from('classes').insert(payload)
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Class created!')
    setShowModal(false)
    setForm({ name:'', level:'primary', stream:'', room:'', capacity:40, class_teacher_id:'' })
    loadClasses()
  }
  async function del() {
    if (!delId) return
    await supabase.from('classes').delete().eq('id', delId)
    toast.success('Class deleted')
    setDelId(null)
    loadClasses()
  }

  const nursery = classes.filter(c => c.level === 'nursery')
  const primary = classes.filter(c => c.level === 'primary')

  const ClassTable = ({ rows, title }: { rows: ClassRow[]; title: string }) => (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 font-display font-bold text-sm text-slate-700 dark:text-white">{title}</div>
      <table className="table-base">
        <thead><tr><th>#</th><th>Class Name</th><th>Students</th><th>Class Teacher</th><th>Room</th><th>Actions</th></tr></thead>
        <tbody>
          {rows.map((c,i) => (
            <tr key={c.id}>
              <td className="text-slate-400">{i+1}</td>
              <td className="font-semibold">{c.name}{c.stream ? ` (${c.stream})` : ''}</td>
              <td>{c.capacity}</td>
              <td>{(c.class_teacher as any)?.full_name ?? <span className="text-slate-400">—</span>}</td>
              <td>{c.room ?? <span className="text-slate-400">—</span>}</td>
              <td><button onClick={() => setDelId(c.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️ Delete</button></td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No classes. Add one.</td></tr>}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Class Management" icon="🏛️"
        actions={<>
          <select value={yearId} onChange={e => setYearId(e.target.value)} className="input-base max-w-[180px]">
            {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">➕ Add Class</button>
        </>}
      />
      <ClassTable rows={nursery} title="🎒 Nursery Classes" />
      <ClassTable rows={primary} title="📚 Primary Classes" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Class"
        footer={<><button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button onClick={save} disabled={saving} className="btn-primary">{saving?'Saving…':'Create Class'}</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Class Name</label><input className="input-base" placeholder="PRIMARY 4" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></div>
            <div><label className="label-xs">Level</label>
              <select className="input-base" value={form.level} onChange={e => setForm(f=>({...f,level:e.target.value}))}>
                <option value="nursery">Nursery</option><option value="primary">Primary</option>
              </select>
            </div>
            <div><label className="label-xs">Stream (optional)</label><input className="input-base" placeholder="A or B" value={form.stream} onChange={e => setForm(f=>({...f,stream:e.target.value}))} /></div>
            <div><label className="label-xs">Room</label><input className="input-base" placeholder="Room 7" value={form.room} onChange={e => setForm(f=>({...f,room:e.target.value}))} /></div>
            <div><label className="label-xs">Capacity</label><input type="number" className="input-base" value={form.capacity} onChange={e => setForm(f=>({...f,capacity:+e.target.value}))} /></div>
            <div><label className="label-xs">Class Teacher</label>
              <select className="input-base" value={form.class_teacher_id} onChange={e => setForm(f=>({...f,class_teacher_id:e.target.value}))}>
                <option value="">— None —</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del} title="Delete Class" message="Are you sure? Students in this class must be moved first." confirmLabel="Delete" danger />
    </div>
  )
}
