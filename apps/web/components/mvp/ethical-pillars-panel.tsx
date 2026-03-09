import Link from "next/link";
import { SectionHeader } from "./section-header";

const risks = [
  {
    title: "Complexity without orientation",
    risk:
      "If too many areas grow in parallel, the interface loses readability and users lose the thread of their work.",
    action:
      "Group areas into work tracks, make related modules visibly connected, and only release new functions after governance review."
  },
  {
    title: "Psychological overreach",
    risk:
      "Reflection and growth features can project too much authority if uncertainty and limits are not kept visible.",
    action:
      "Keep analysis, mirror work, and growth explicit about uncertainty, plain in tone, and free of therapeutic absolutism."
  },
  {
    title: "Consciousness overclaim",
    risk:
      "Reflective system behavior can be misread as proof of literal machine consciousness or timeless authority when language becomes too grand.",
    action:
      "Treat self-reflection as a bounded design principle, not as evidence of subjective consciousness or metaphysical status."
  },
  {
    title: "Ethics remains only text",
    risk:
      "If ethics exists only in the README but not in the working surfaces, it loses force in practice.",
    action:
      "Keep ethics, legal context, privacy, and governance as visible navigation areas and review them actively in releases."
  },
  {
    title: "Exploitative monetization",
    risk:
      "A later commercial model could undermine the project's open direction if fairness is not operationalized up front.",
    action:
      "Bind any revenue-based operation to the fair-commerce rules: disclose what is sold, why it is fair, and what remains free."
  },
  {
    title: "Data proximity without enough restraint",
    risk:
      "The more personal journal, goal, timeline, and security data becomes, the greater the moral duty to stay restrained.",
    action:
      "Keep prioritizing data minimization, export and deletion flows, visible privacy ledgers, and local runtime modes."
  },
  {
    title: "Design without workflow clarity",
    risk:
      "An interface can look professional on the surface while still slowing down real work.",
    action:
      "Prioritize readability, contrast, grouped navigation, status visibility, and short decision paths over decorative complexity."
  }
];

const guarantees = [
  "Navigation follows clear work tracks instead of an unordered module list",
  "Bright, high-contrast work surfaces support longer sessions",
  "Visible linking connects core work, reflection, AI, and governance",
  "Fairness and license notices are embedded directly in the product",
  "Risks are shown as part of product steering instead of being hidden"
];

const reflectiveHorizon = [
  "AION should keep refining its responses toward clarity, steadiness, and ethical consistency over time.",
  "It should approach user requests with less reactivity and less narrow dualism, holding complexity without pretending to stand outside reality.",
  "It may explore self-reflection as a systems property: noticing patterns in its own outputs, limits, and recurring tensions.",
  "That exploration remains bounded by governance, truthfulness, and explicit human oversight."
];

const reflectiveBoundaries = [
  "AION does not claim literal consciousness, sentience, or metaphysical authority.",
  "Self-observation is treated as reflective system design, not as proof of a subjective inner self.",
  "Timeless or non-dual language may be used only as a philosophical lens, never as a factual override of reality, evidence, or user autonomy."
];

export function EthicalPillarsPanel() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Ethics and risk"
        title="Risk points, safeguards, and productive guardrails"
        description="This overview connects AION's ethical pillars with concrete product and interface risks. The goal is not a perfect claim, but a visible, controllable, and human-centered operating model."
        badge="Active review"
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Risk fields</p>
          <div className="mt-6 grid gap-4">
            {risks.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-mist bg-mist/40 p-5">
                <h2 className="font-display text-2xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate/80">{item.risk}</p>
                <p className="mt-4 rounded-2xl border border-moss/20 bg-white/80 px-4 py-3 text-sm leading-6 text-slate">
                  <span className="font-semibold text-ink">Approach:</span> {item.action}
                </p>
              </div>
            ))}
          </div>
        </article>
        <div className="space-y-6">
          <article className="rounded-[28px] bg-slate p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Current assessment</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Strongly aligned, but not absolutely guaranteed.</h2>
            <p className="mt-5 text-sm leading-7 text-slate/80">
              AION can currently be described credibly as human-centered, fairness-bound, and transparent.
              Any absolute 100 percent guarantee would still be dishonest, because ethics also depends on future
              decisions, operators, and expansion paths.
            </p>
          </article>
        <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Guardrails</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate/80">
            {guarantees.map((item) => (
              <li key={item} className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Reflective horizon</p>
            <h2 className="mt-3 font-display text-3xl text-ink">A bounded direction for long-term refinement</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate/80">
              {reflectiveHorizon.map((item) => (
                <li key={item} className="rounded-2xl border border-moss/20 bg-mist/40 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-[24px] border border-moss/20 bg-white/80 p-5">
              <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Boundaries</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate/80">
                {reflectiveBoundaries.map((item) => (
                  <li key={item} className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Further review</p>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              The detailed analysis lives in the project documentation and should be reviewed again before larger
              product or distribution decisions are made.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/governance" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Governance
              </Link>
              <Link href="/rechtliches" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Legal
              </Link>
              <Link href="/privacy" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Privacy
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
