import { notFound } from "next/navigation";
import { sectionMap, sections } from "../../../lib/navigation";

interface SectionPageProps {
  params: { section: string };
}

export function generateStaticParams() {
  return sections.map((section) => ({
    section: section.href.replace(/^\//, "")
  }));
}

export const dynamicParams = false;

export default function SectionPage({ params }: SectionPageProps) {
  const { section } = params;
  const definition = sectionMap[section];

  if (!definition) {
    notFound();
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{definition.label}</p>
        <h1 className="mt-3 font-display text-4xl text-ink">{definition.description}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          Dieser Bereich ist bereits im Monorepo verankert und wird in den naechsten Sessions funktional ausgebaut. Die UI ist absichtlich klar gehalten, damit Daten, Governance und echte Arbeitsablaeufe spaeter sauber andocken.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Bauzustand</p>
        <h2 className="mt-3 font-display text-3xl">{definition.status}</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">{definition.nextStep}</p>
      </article>
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">MVP-Fokus</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Die naechsten Produktpfeiler fuer {definition.label}</h2>
          </div>
          <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm text-slate">AION / Aufbauphase</div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {definition.pillars.map((pillar) => (
            <div key={pillar} className="rounded-2xl border border-mist bg-mist/40 p-5">
              <div className="font-body text-xs uppercase tracking-[0.24em] text-moss">Baustein</div>
              <div className="mt-2 text-lg font-semibold text-ink">{pillar}</div>
              <p className="mt-3 text-sm leading-6 text-slate/75">Diese Karte markiert den vorgesehenen Ausbaupfad innerhalb des AION-MVP.</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
