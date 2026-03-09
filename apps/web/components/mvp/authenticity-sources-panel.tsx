import Link from "next/link";

const principles = [
  {
    title: "Source-backed factual output",
    text:
      "When AION presents factual claims, users should be able to understand where those claims come from. Facts should be sourced where applicable, and uncertainty should remain visible instead of being hidden behind confident language."
  },
  {
    title: "Clear synthetic-media disclosure",
    text:
      "If audio, images, or video are generated or materially altered by AI, that status should be disclosed clearly. The product direction does not allow deceptive media that pretends to be human-made, documentary, or naturally captured when it is not."
  },
  {
    title: "Traceable provenance",
    text:
      "Generated media and release artifacts should carry provenance and integrity signals whenever they exist. In AION, this includes signatures, release manifests, and visible verification guidance."
  }
];

const requirements = [
  "Do not present fabricated sources, invented citations, or fake educational material as real.",
  "Do not hide that content was generated when that fact changes how the content should be interpreted.",
  "Prefer direct sources, reviewable evidence, and language that separates fact, interpretation, and uncertainty.",
  "Treat provenance as part of product trust, not as an optional marketing detail."
];

const contributorChecks = [
  "Label generated content in demos, docs, and releases when it could otherwise be mistaken for organic material.",
  "Add sources when introducing factual claims, benchmark claims, or externally grounded statements.",
  "Do not remove, weaken, or bypass provenance and disclosure rules for convenience.",
  "Escalate unclear media-authenticity questions through governance review instead of improvising."
];

export function AuthenticitySourcesPanel() {
  return (
    <div className="space-y-6">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Authenticity baseline</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Authenticity, sources, and media provenance stay visible.</h2>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              This section documents the practical standard behind AION&apos;s anti-deception policy: factual output
              should be source-aware, generated media should be labeled, and provenance should stay reviewable for
              users, contributors, and operators.
            </p>
          </div>
          <div className="rounded-[24px] border border-moss/20 bg-mist/35 p-6">
            <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">What this protects</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate/80">
              <li className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-3">Users from misleading confidence and hidden synthetic output</li>
              <li className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-3">Contributors from unclear sourcing expectations</li>
              <li className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-3">The product from drifting into fake news, deepfakes, or unverifiable claims</li>
            </ul>
          </div>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-3">
        {principles.map((item) => (
          <article key={item.title} className="rounded-[28px] border border-mist bg-white p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Principle</p>
            <h3 className="mt-3 font-display text-2xl text-ink">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate/80">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[28px] border border-mist bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Non-negotiable requirements</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate/80">
            {requirements.map((item) => (
              <li key={item} className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[28px] border border-mist bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Contributor checklist</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate/80">
            {contributorChecks.map((item) => (
              <li key={item} className="rounded-2xl border border-moss/20 bg-mist/35 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="rounded-[28px] border border-mist bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Connected areas</p>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          Authenticity is enforced through governance, made visible through legal and security surfaces, and should
          remain part of release engineering and contributor review.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/governance"
            className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
          >
            Governance
          </Link>
          <Link
            href="/security"
            className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
          >
            Security
          </Link>
          <Link
            href="/rechtliches"
            className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
          >
            Legal
          </Link>
          <Link
            href="/contribute"
            className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70"
          >
            Contributor guide
          </Link>
        </div>
      </article>
    </div>
  );
}
