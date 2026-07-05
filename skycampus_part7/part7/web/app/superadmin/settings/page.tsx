'use client'
export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-xl text-white">⚙️ Platform Settings</h1>
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-slate-400 text-sm">
        Platform configuration (pricing plans, default modules, SMTP settings, SMS gateway)
        will be managed here in a future update.
      </div>
    </div>
  )
}
