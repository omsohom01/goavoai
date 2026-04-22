import Link from "next/link";

export default function Home() {
  return (
    <main className="gradient-shell flex min-h-screen items-center justify-center p-6">
      <section className="panel w-full max-w-4xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Event Management SaaS</p>
        <h1 className="kpi mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
          Run high-conversion events without a separate backend.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          EventForge includes organizer auth, event publishing, attendee workflows,
          capacity automation, WhatsApp-ready logging, and public event pages in one
          Next.js codebase.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Organizer Login
          </Link>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900">JWT auth with HTTP-only cookies</div>
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Event + registration APIs in App Router</div>
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Capacity and attendee approvals built-in</div>
        </div>
      </section>
    </main>
  );
}
