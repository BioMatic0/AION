import Link from "next/link";
import { brand } from "@aion/ui";

const pillars = [
  {
    title: "Reflexion mit Struktur",
    description: "Journal, Tagebuch, Ziele und Notizen bilden den alltagstauglichen Kern von AION."
  },
  {
    title: "KI mit Bindung",
    description: "Governance, Ethics Router und Incident Transparency halten die Plattform menschenzentriert."
  },
  {
    title: "Modularer Ausbau",
    description: "Recherche, Sprache, Medien und weitere Bereiche sind von Anfang an sauber in der Architektur vorgesehen."
  }
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1e7,_#e8ede8_55%,_#dce4de)] px-6 py-10 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <section className="grid gap-10 rounded-[36px] bg-white/90 p-8 shadow-panel lg:grid-cols-[1.4fr_0.9fr] lg:p-12">
          <div className="space-y-6">
            <p className="font-body text-sm uppercase tracking-[0.32em] text-moss">{brand.name}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-tight sm:text-6xl">Die Architektur fuer deine KI-gestuetzte Erkenntnis- und Entwicklungsplattform.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate/80">
              AION verbindet Journal, Analyse, Wachstum, Governance und Sicherheitslogik in einer produktionsnahen Full-Stack-Struktur.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate">
                Zum Arbeitsbereich
              </Link>
              <Link href="/impressum" className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm font-semibold text-slate transition hover:border-moss/40">
                Impressum
              </Link>
              <span className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm text-slate">Patrick Wirth / MIT / offen fuer Mitgestaltung</span>
            </div>
          </div>
          <div className="rounded-[28px] bg-slate p-6 text-mist">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Status</p>
            <div className="mt-4 space-y-5">
              <div>
                <h2 className="font-display text-2xl">Die technische Aufbauphase laeuft.</h2>
                <p className="mt-2 text-sm leading-6 text-mist/75">Dieses Repo enthaelt das Monorepo-Fundament mit Web, API, Worker, Packages, Infrastruktur und Governance-Startpunkt.</p>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-mist/80">
                <li>Web-App Shell mit den AION-Hauptbereichen</li>
                <li>NestJS API mit Auth-, Journal-, Sicherheits- und Governance-Basis</li>
                <li>Prisma-Schema fuer den ersten Datenkern</li>
                <li>Dokumentation fuer Architektur, MVP und Vorfallreaktion</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[28px] bg-white p-8 shadow-panel">
              <h2 className="font-display text-2xl text-ink">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate/80">{pillar.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
