function ImprintBlock({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[24px] border border-mist bg-white p-6 shadow-panel">
      <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">Imprint</p>
      <h2 className="mt-3 font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate/80">{children}</div>
    </article>
  );
}

export function ImprintPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Imprint</p>
        <h1 className="mt-3 font-display text-4xl text-ink">Project and reference notice</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          This page documents the current project, contact, and reference notice inside the application.
          It does not replace a full external legal review for public or commercial publication.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Current status</p>
        <h2 className="mt-3 font-display text-3xl">Project reference: Patrick Wirth</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">
          In its current project state, AION is maintained as a freely accessible and openly collaborative project.
          The current release is distributed under the AION Community Fairness License 1.0.
        </p>
      </article>
      <ImprintBlock title="Reference data">
        <p>Name: Patrick Wirth</p>
        <p>Date of birth: 10.06.1993</p>
        <p>Email: patrickwirth_93@icloud.com</p>
      </ImprintBlock>
      <ImprintBlock title="Project status">
        <p>Project name: AION</p>
        <p>License: AION Community Fairness License 1.0</p>
        <p>Software type: open AI and development platform</p>
      </ImprintBlock>
      <ImprintBlock title="Legal and project documents">
        <p>Governing project files: LICENSE, COPYRIGHT.md, REFERENCE.md, FAIR-COMMERCE.md, FREE-USE-NOTICE.txt</p>
        <p>Builds and source code are intended to remain broadly accessible and open to contribution without exploitative distribution models.</p>
      </ImprintBlock>
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Guiding idea</p>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          For our shared future, toward the purpose of common connection, in enduring connection.
        </p>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          This page is also shipped with the exported web, desktop, and mobile packages. In the Windows desktop build it is additionally available through the native application menu.
        </p>
      </article>
    </section>
  );
}
