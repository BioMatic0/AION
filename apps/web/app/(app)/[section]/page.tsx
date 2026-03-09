import { notFound } from "next/navigation";
import Link from "next/link";
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

  const relatedDefinitions = definition.related
    .map((href) => sections.find((item) => item.href === href))
    .filter((item): item is (typeof sections)[number] => Boolean(item));

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{definition.label}</p>
        <h1 className="mt-3 font-display text-4xl text-ink">{definition.description}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          This area is already anchored in the monorepo and will be expanded functionally in upcoming sessions.
          The surface stays intentionally clear so data, governance, and real workflows can connect cleanly later.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Build status</p>
        <h2 className="mt-3 font-display text-3xl text-ink">{definition.status}</h2>
        <p className="mt-5 text-sm leading-7 text-slate/80">{definition.nextStep}</p>
      </article>
      <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel lg:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">MVP focus</p>
            <h2 className="mt-2 font-display text-3xl text-ink">The next product pillars for {definition.label}</h2>
          </div>
          <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm text-slate">AION / build phase</div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {definition.pillars.map((pillar) => (
            <div key={pillar} className="rounded-2xl border border-mist bg-mist/40 p-5">
              <div className="font-body text-xs uppercase tracking-[0.24em] text-moss">Pillar</div>
              <div className="mt-2 text-lg font-semibold text-ink">{pillar}</div>
              <p className="mt-3 text-sm leading-6 text-slate/75">This card marks the intended implementation path inside the AION MVP.</p>
            </div>
          ))}
        </div>
        {relatedDefinitions.length > 0 ? (
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Connected to</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedDefinitions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
