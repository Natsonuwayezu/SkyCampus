'use client'
import Modal from './Modal'
interface ConfirmDialogProps { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; loading?: boolean; danger?: boolean }
export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading = false, danger = false }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <button onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger' : 'btn-primary'}>
          {loading ? '⏳ Please wait…' : confirmLabel}
        </button>
      </>}>
      <p className="text-slate-600 dark:text-slate-300 text-sm">{message}</p>
    </Modal>
  )
}
