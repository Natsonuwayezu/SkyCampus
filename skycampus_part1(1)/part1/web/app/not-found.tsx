import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
