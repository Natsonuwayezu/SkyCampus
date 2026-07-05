'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import PageHeader from '@/components/shared/PageHeader'
import Modal from '@/components/shared/Modal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils/formatters'

interface Ann { id:string; title:string; body:string; audience:string; is_pinned:boolean; published_at:string; created_by:string|null }

export default function AnnouncementsPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [anns, setAnns] = useState<Ann[]>([])
  const [showModal, setShowModal] = useState(false)
  const [delId, setDelId] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title:'', body:'', audience:'all', is_pinned:false })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('announcements').select('*').eq('school_id', user!.school_id).order('is_pinned', { ascending: false }).order('published_at', { ascending: false })
    setAnns(data ?? [])
  }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('announcements').insert({ ...form, school_id: user!.school_id, created_by: user!.id })
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success('Announcement published!')
    setShowModal(false)
    setForm({ title:'', body:'', audience:'all', is_pinned:false })
    load()
  }

  async function togglePin(id: string, current: boolean) {
    await supabase.from('announcements').update({ is_pinned: !current }).eq('id', id)
    load()
  }

  async function del() {
    if (!delId) return
    await supabase.from('announcements').delete().eq('id', delId)
    toast.success('Deleted')
    setDelId(null)
    load()
  }

  const AUDIENCE_LABELS: Record<string,string> = { all:'All', teachers:'Teachers', parents:'Parents', students:'Students' }

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Announcements" icon="📢"
        actions={<button onClick={() => setShowModal(true)} className="btn-primary text-sm">➕ New Announcement</button>}
      />

      <div className="space-y-3">
        {anns.length === 0 && <div className="card p-8 text-center text-slate-400 text-sm">No announcements yet.</div>}
        {anns.map(a => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {a.is_pinned && <span className="badge-blue text-[10px]">📌 Pinned</span>}
                  <span className="badge-gray text-[10px]">{AUDIENCE_LABELS[a.audience]}</span>
                </div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white">{a.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{a.body}</p>
                <p className="text-xs text-slate-400 mt-2">{formatDate(a.published_at)}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => togglePin(a.id, a.is_pinned)} className="text-xs text-slate-400 hover:text-brand-blue">{a.is_pinned ? '📌 Unpin' : '📌 Pin'}</button>
                <button onClick={() => setDelId(a.id)} className="text-xs text-red-400 hover:text-red-600">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Announcement" size="lg"
        footer={<><button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button><button onClick={save} disabled={saving} className="btn-primary">{saving?'Publishing…':'📢 Publish'}</button></>}>
        <div className="space-y-4">
          <div><label className="label-xs">Title</label><input className="input-base" placeholder="End of Term Dates" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} /></div>
          <div><label className="label-xs">Message</label><textarea rows={4} className="input-base resize-none" placeholder="Write your announcement here…" value={form.body} onChange={e => setForm(f=>({...f,body:e.target.value}))} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-xs">Audience</label>
              <select className="input-base" value={form.audience} onChange={e => setForm(f=>({...f,audience:e.target.value}))}>
                <option value="all">All Staff & Parents</option>
                <option value="teachers">Teachers Only</option>
                <option value="parents">Parents Only</option>
                <option value="students">Students Only</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f=>({...f,is_pinned:e.target.checked}))} className="rounded border-slate-300 text-brand-blue" />
                📌 Pin to top
              </label>
            </div>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={del} title="Delete Announcement" message="Delete this announcement? This cannot be undone." confirmLabel="Delete" danger />
    </div>
  )
}
