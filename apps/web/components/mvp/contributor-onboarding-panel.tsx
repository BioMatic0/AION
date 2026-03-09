import Link from "next/link";
import { SectionHeader } from "./section-header";

const contributionTracks = [
  {
    title: "Public website and docs",
    description: "Polish the public pages, onboarding copy, release communication, and contributor guidance.",
    level: "Good first issue",
    href: "https://github.com/BioMatic0/AION/issues/4"
  },
  {
    title: "Auth and per-user separation",
    description: "Harden session boundaries, make user-specific persistence explicit, and remove shared-state assumptions.",
    level: "Trust and security",
    href: "https://github.com/BioMatic0/AION/issues/3"
  },
  {
    title: "Desktop and mobile distribution",
    description: "Improve packaging, release polish, install experience, and platform-specific verification flows.",
    level: "Release engineering",
    href: "https://github.com/BioMatic0/AION/issues/2"
  },
  {
    title: "Embeddings and semantic retrieval",
    description: "Move from placeholders toward retrieval-aware context, background jobs, and stronger memory search.",
    level: "AI core",
    href: "https://github.com/BioMatic0/AION/issues/1"
  }
];

const firstSteps = [
  "Fork the repository or create a topic branch from main.",
  "Install dependencies with pnpm and copy the local environment file.",
  "Run typecheck, test, and build before opening a pull request.",
  "Keep changes small, explain the why, and update docs when behavior changes."
];

const verificationSteps = [
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
  "pnpm --filter @aion/web test",
  "pnpm --filter @aion/api verify:persistence"
];

export function ContributorOnboardingPanel() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Contribute"
        title="A clear path for public contributors"
        description="AION is open to shared work, but the best contributions are understandable, verifiable, and aligned with the project's governance, fairness, and privacy boundaries."
        badge="Open to contributors"
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Start here</p>
          <h2 className="mt-3 font-display text-3xl text-ink">The fastest safe route into the project</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate/80">
            {firstSteps.map((step, index) => (
              <li key={step} className="rounded-[24px] border border-mist bg-mist/35 px-5 py-4">
                <span className="font-semibold text-ink">{index + 1}.</span> {step}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://github.com/BioMatic0/AION"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate"
            >
              Repository
            </Link>
            <Link
              href="https://github.com/BioMatic0/AION/discussions"
              className="rounded-full border border-moss/20 bg-moss/5 px-5 py-3 text-sm font-semibold text-slate transition hover:border-moss/40"
            >
              Discussions
            </Link>
            <Link
              href="https://github.com/BioMatic0/AION/issues"
              className="rounded-full border border-moss/20 bg-moss/5 px-5 py-3 text-sm font-semibold text-slate transition hover:border-moss/40"
            >
              Issues
            </Link>
          </div>
        </article>

        <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Verification baseline</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Every contribution should stay buildable.</h2>
          <p className="mt-4 text-sm leading-7 text-slate/80">
            AION is easier to review when contributors show exactly how a change was checked. These commands are the minimum baseline for public pull requests.
          </p>
          <div className="mt-6 space-y-3">
            {verificationSteps.map((command) => (
              <code key={command} className="block rounded-2xl border border-moss/20 bg-white/90 px-4 py-3 text-xs text-ink">
                {command}
              </code>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Current contribution tracks</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {contributionTracks.map((track) => (
            <Link
              key={track.title}
              href={track.href}
              className="rounded-[24px] border border-mist bg-mist/35 p-6 transition hover:border-moss/30 hover:bg-mist/60"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-moss">{track.level}</p>
              <h3 className="mt-3 font-display text-2xl text-ink">{track.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate/80">{track.description}</p>
            </Link>
          ))}
        </div>
      </article>

      <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Ground rules</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <div className="rounded-[24px] border border-mist bg-mist/35 p-5 text-sm leading-7 text-slate/80">
            Preserve origin, fairness notices, and documented project reference.
          </div>
          <div className="rounded-[24px] border border-mist bg-mist/35 p-5 text-sm leading-7 text-slate/80">
            Keep contributors free to disagree, review hard, and challenge ideas without suppressive moderation.
          </div>
          <div className="rounded-[24px] border border-mist bg-mist/35 p-5 text-sm leading-7 text-slate/80">
            Treat privacy, security, and governance surfaces as product features, not secondary cleanup.
          </div>
        </div>
      </article>
    </section>
  );
}
