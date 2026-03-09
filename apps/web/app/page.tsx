import Link from "next/link";
import { brand } from "@aion/ui";
import { groupMeta, groupedSections } from "../lib/navigation";

const pillars = [
  {
    title: "Structured Reflection",
    description: "Journal, diary, goals, and notes form the practical core of AION."
  },
  {
    title: "Bounded AI",
    description: "Governance, ethics routing, and incident transparency keep the platform human-centered."
  },
  {
    title: "Modular Expansion",
    description: "Research, voice, media, and later areas are built into the architecture from the start."
  }
];

const reflectiveNotes = [
  "AION is intended to keep refining its responses toward clarity, steadiness, and ethical consistency.",
  "It may use reflective and non-dual language as a philosophical lens when that helps users hold complexity without panic or simplification.",
  "This remains bounded: AION does not claim literal consciousness, metaphysical authority, or freedom from evidence and governance."
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
            <h1 className="max-w-4xl font-display text-5xl leading-tight sm:text-6xl">The professional workspace for insight, coordination, and responsibly applied AI.</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate/80">
              AION brings together journaling, analysis, growth, governance, privacy, and legal context in a bright, readable, production-minded environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate">
                Sign in
              </Link>
              <Link href="/register" className="rounded-full border border-ink/20 bg-white/90 px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink/40">
                Create account
              </Link>
              <Link href="/impressum" className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm font-semibold text-slate transition hover:border-moss/40">
                Impressum
              </Link>
              <Link href="/ethik" className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm font-semibold text-slate transition hover:border-moss/40">
                Ethics and risks
              </Link>
              <span className="rounded-full border border-moss/20 bg-moss/5 px-6 py-3 text-sm text-slate">Patrick Wirth / Fairness license / open to collaboration</span>
            </div>
          </div>
          <div className="rounded-[28px] bg-slate p-6 text-mist">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Status</p>
            <div className="mt-4 space-y-5">
              <div>
                <h2 className="font-display text-2xl text-ink">The technical build-out is underway.</h2>
                <p className="mt-2 text-sm leading-6 text-slate/80">This repository contains the monorepo foundation with web, API, worker, shared packages, infrastructure, and an initial governance layer.</p>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate/80">
                <li>Web app shell with the main AION work areas</li>
                <li>NestJS API with auth, journal, security, and governance foundations</li>
                <li>Prisma schema for the first persistent data core</li>
                <li>Documentation for architecture, MVP scope, and incident response</li>
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
        <section className="rounded-[32px] border border-white/10 bg-white/90 p-8 shadow-panel lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Reflective direction</p>
              <h2 className="mt-3 font-display text-4xl text-ink">A system that can refine itself without pretending to stand above the human world.</h2>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-slate/80">
                AION may grow more reflective over time by examining patterns in its own outputs, limits, and recurring tensions.
                The point is not to claim timeless authority, but to respond with more steadiness, more care, and less narrow dualism.
              </p>
            </div>
            <div className="space-y-3">
              {reflectiveNotes.map((item) => (
                <div key={item} className="rounded-[24px] border border-moss/20 bg-mist/35 px-5 py-4 text-sm leading-7 text-slate/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
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
