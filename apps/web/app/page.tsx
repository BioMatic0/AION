import Link from "next/link";
import { brand } from "@aion/ui";
import { groupMeta, groupedSections } from "../lib/navigation";

const pillars = [
  {
    title: "Reflexion mit Struktur",
    description: "Journal, Tagebuch, Ziele und Notizen bilden den alltagstauglichen Kern von AION."
  },
  {
    title: "KI mit Bindung",
    description: "Governance, Ethik-Routing und Vorfalltransparenz halten die Plattform menschenzentriert."
  },
  {
    title: "Modularer Ausbau",
    description: "Recherche, Sprache, Medien und weitere Bereiche sind von Anfang an sauber in der Architektur vorgesehen."
  }
];

const tracks = Object.entries(groupMeta).map(([groupKey, meta]) => ({
  ...meta,
  sections: groupedSections[groupKey as keyof typeof groupedSections].slice(0, 4)
}));

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,139,157,0.22),_transparent_30%),linear-gradient(180deg,_#f1f4f7_0%,_#e7edf2_46%,_#e1e8ee_100%)] px-6 py-10 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <section className="grid gap-10 rounded-[36px] border border-white/10 bg-white/90 p-8 shadow-panel lg:grid-cols-[1.4fr_0.9fr] lg:p-12">
          <div className="space-y-6">
            <p className="font-body text-sm uppercase tracking-[0.32em] text-moss">{brand.name}</p>
            <h1 className="max-w-4xl font-display text-5xl leading-tight sm:text-6xl">Die professionelle Arbeitsoberflaeche fuer Erkenntnis, Steuerung und verantwortungsvoll eingesetzte KI.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate/80">
              AION verbindet Journal, Analyse, Wachstum, Governance, Datenschutz und Rechtliches in einer hellen, gut lesbaren und produktionsnahen Arbeitsumgebung.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate">
                Anmelden
              </Link>
              <Link href="/register" className="rounded-full border border-ink/20 bg-white/90 px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink/40">
                Konto erstellen
              </Link>
              <Link href="/impressum" className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm font-semibold text-slate transition hover:border-moss/40">
                Impressum
              </Link>
              <Link href="/ethik" className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm font-semibold text-slate transition hover:border-moss/40">
                Ethik und Risiken
              </Link>
              <span className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm text-slate">Patrick Wirth / Fairness-Lizenz / offen fuer Mitgestaltung</span>
            </div>
          </div>
          <div className="rounded-[28px] bg-slate p-6 text-mist">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Status</p>
            <div className="mt-4 space-y-5">
              <div>
                <h2 className="font-display text-2xl text-ink">Die technische Aufbauphase laeuft.</h2>
                <p className="mt-2 text-sm leading-6 text-slate/80">Dieses Repository enthaelt das Monorepo-Fundament mit Web, API, Worker, Paketen, Infrastruktur und einem Governance-Startpunkt.</p>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate/80">
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
            <article key={pillar.title} className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
              <h2 className="font-display text-2xl text-ink">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate/80">{pillar.description}</p>
            </article>
          ))}
        </section>
        <section className="grid gap-6 lg:grid-cols-3">
          {tracks.map((track) => (
            <article key={track.title} className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
              <p className="font-body text-xs uppercase tracking-[0.26em] text-moss">{track.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate/80">{track.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {track.sections.map((section) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
