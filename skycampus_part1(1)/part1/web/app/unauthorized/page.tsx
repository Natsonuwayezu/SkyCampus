import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-3">
          Access Denied
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          You don't have permission to view this page. Contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/login" className="btn-secondary">
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  )
}
