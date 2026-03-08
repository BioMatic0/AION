import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-6 py-12">
      <div className="max-w-xl rounded-[28px] bg-white p-10 text-center shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">AION</p>
        <h1 className="mt-4 font-display text-4xl text-ink">Bereich nicht gefunden</h1>
        <p className="mt-4 text-sm leading-7 text-slate/80">Die Route existiert noch nicht oder ist in dieser Session noch nicht implementiert.</p>
        <Link href="/dashboard" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Zurueck zum Dashboard
        </Link>
      </div>
    </main>
  );
}