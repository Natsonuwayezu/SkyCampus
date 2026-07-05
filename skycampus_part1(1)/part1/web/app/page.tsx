import Link from 'next/link'

export default function PlatformLanding() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center font-display font-bold text-white text-sm">SC</div>
          <span className="font-display font-bold text-lg tracking-tight">SKYCAMPUS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition">Login</Link>
          <Link href="/register-school" className="btn-primary text-sm">Register School</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-8 py-28">
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 text-sm text-brand-blue mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
          Premium Academic Management
        </div>
        <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight mb-6">
          Manage your school <span className="text-brand-blue">smarter.</span>
        </h1>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
          All-in-one platform for modern African schools. Students, marks, fees, reports — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register-school" className="btn-primary px-8 py-3 text-base">
            Get Started Free
          </Link>
          <Link href="#features" className="btn-secondary px-8 py-3 text-base border-white/20 text-white hover:bg-white/10">
            See Features
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: '📚', title: 'Academics', desc: 'Marks, registers, 6 report card formats, rankings, timetable' },
          { icon: '💰', title: 'Finance', desc: 'Fees, payments, auto-receipts, waivers, financial reports' },
          { icon: '👥', title: 'Students', desc: 'Full SIS, enrollment, parent portal, sibling linking' },
          { icon: '📱', title: 'Mobile', desc: 'iOS & Android app with offline marks sync and push notifications' },
        ].map(f => (
          <div key={f.title} className="card bg-white/5 border-white/10 p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-8 pb-32">
        <h2 className="font-display font-bold text-3xl text-center mb-12">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Starter', students: 'Up to 200 students', price: 'Contact us', highlight: false },
            { name: 'Professional', students: 'Up to 500 students', price: 'Contact us', highlight: true },
            { name: 'Enterprise', students: 'Unlimited students', price: 'Contact us', highlight: false },
          ].map(p => (
            <div key={p.name} className={`rounded-card p-7 border ${p.highlight ? 'bg-brand-blue border-brand-blue' : 'bg-white/5 border-white/10'}`}>
              {p.highlight && <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Most Popular</div>}
              <h3 className="font-display font-bold text-xl mb-1">{p.name}</h3>
              <p className="text-sm text-white/60 mb-4">{p.students}</p>
              <div className="font-bold text-2xl mb-6">{p.price}</div>
              <Link href="/register-school" className={`block text-center py-2 rounded-input text-sm font-semibold ${p.highlight ? 'bg-white text-brand-blue' : 'bg-white/10 text-white hover:bg-white/20'} transition`}>
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-8 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} SkyCampus — Premium Academic Management
      </footer>
    </main>
  )
}
