function LegalCard({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[24px] border border-mist bg-white p-6 shadow-panel">
      <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">Legal status</p>
      <h2 className="mt-3 font-display text-2xl text-ink">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate/80">{text}</p>
    </article>
  );
}

export function LegalPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Legal</p>
        <h1 className="mt-3 font-display text-4xl text-ink">License, reference, and open collaboration</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          In its current state, AION is maintained as a freely accessible and collaboratively stewarded project.
          The project origin is documented inside the repository, while source code and builds are provided for
          shared development under a fairness-bound source license.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Summary</p>
        <h2 className="mt-3 font-display text-3xl">AION is openly accessible, fairness-oriented, and open to contribution.</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">
          Reference and original project attribution remain with Patrick Wirth. Use, modification, redistribution,
          and collaborative development are allowed under the AION Community Fairness License 1.0 as long as origin
          protection and fairness conditions are respected.
        </p>
        <p className="mt-4 text-xs leading-6 text-mist/65">
          The license is public and collaboration-friendly, but it is not written as an unrestricted MIT-style grant.
        </p>
      </article>
      <LegalCard
        title="Source code"
        text="The repository content is released under the AION Community Fairness License 1.0. It may be used, copied, modified, published, and collaboratively developed as long as origin and license notices remain intact."
      />
      <LegalCard
        title="Build artifacts"
        text="Windows builds and other release artifacts are intended for broad use and redistribution. Revenue-based operation is only acceptable with a fair, plausible, and non-exploitative model."
      />
      <LegalCard
        title="Project reference"
        text="Patrick Wirth, 10.06.1993, and patrickwirth_93@icloud.com are stored in the project as reference data. This attribution identifies the origin and may not be removed in redistribution, forks, or commercial distribution."
      />
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Included documents</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <LegalCard
            title="LICENSE"
            text="Defines source code use under the AION Community Fairness License 1.0."
          />
          <LegalCard
            title="COPYRIGHT.md und REFERENCE.md"
            text="Summarize reference data, project attribution, and the shared guiding idea for an open future."
          />
          <LegalCard
            title="FAIR-COMMERCE.md"
            text="Describes what a fair and ethically defensible commercial or revenue-based operation of AION must look like."
          />
        </div>
      </article>
    </section>
  );
}
