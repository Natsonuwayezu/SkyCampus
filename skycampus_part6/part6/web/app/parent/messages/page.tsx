'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils/formatters'

export default function ParentMessagesPage() {
  const { user } = useAuthStore()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [staff, setStaff]       = useState<any[]>([])
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject]   = useState('')
  const [body, setBody]         = useState('')
  const [sending, setSending]   = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*, sender:users!messages_sender_id_fkey(full_name), recipient:users!messages_recipient_id_fkey(full_name)')
      .or(`sender_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
      .order('created_at', { ascending: false })
    setMessages(data ?? [])

    const { data: staffData } = await supabase.from('users').select('id, full_name, roles(name)').eq('school_id', user!.school_id).eq('is_active', true)
    setStaff((staffData ?? []).filter((s:any) => s.roles?.name !== 'Parent' && s.roles?.name !== 'Student'))
    setLoading(false)
  }

  async function send() {
    if (!recipient || !body) { toast.error('Select recipient and write a message'); return }
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      school_id: user!.school_id, sender_id: user!.id, recipient_id: recipient,
      subject: subject || null, body,
    })
    setSending(false)
    if (error) { toast.error(error.message); return }
    toast.success('Message sent!')
    setSubject(''); setBody(''); setRecipient('')
    load()
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-slate-800 dark:text-white">✉️ Messages</h1>

      {/* Compose */}
      <div className="card p-5 space-y-3">
        <h2 className="font-display font-bold text-sm text-slate-700 dark:text-white">New Message</h2>
        <select className="input-base" value={recipient} onChange={e => setRecipient(e.target.value)}>
          <option value="">— Select Staff Member —</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.roles?.name})</option>)}
        </select>
        <input className="input-base" placeholder="Subject (optional)" value={subject} onChange={e => setSubject(e.target.value)} />
        <textarea rows={3} className="input-base resize-none" placeholder="Write your message…" value={body} onChange={e => setBody(e.target.value)} />
        <button onClick={send} disabled={sending} className="btn-primary text-sm">{sending ? 'Sending…' : '📤 Send Message'}</button>
      </div>

      {/* Message list */}
      <div className="card divide-y divide-slate-50 dark:divide-slate-700">
        {loading ? (
          <p className="text-center py-12 text-slate-400">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-sm">No messages yet.</p>
        ) : messages.map(m => {
          const isSent = m.sender_id === user!.id
          return (
            <div key={m.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {isSent ? `To: ${m.recipient?.full_name}` : `From: ${m.sender?.full_name}`}
                </span>
                <span className="text-xs text-slate-400">{formatDate(m.created_at)}</span>
              </div>
              {m.subject && <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{m.subject}</p>}
              <p className="text-sm text-slate-500 mt-1">{m.body}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
