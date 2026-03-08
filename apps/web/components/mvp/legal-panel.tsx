function LegalCard({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[24px] border border-mist bg-white p-6 shadow-panel">
      <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">Rechtsstatus</p>
      <h2 className="mt-3 font-display text-2xl text-ink">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate/80">{text}</p>
    </article>
  );
}

export function LegalPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Rechtliches</p>
        <h1 className="mt-3 font-display text-4xl text-ink">Lizenz, Referenz und offene Mitgestaltung</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          AION wird im aktuellen Projektstand als frei zugaengliches und gemeinschaftlich mitgestaltbares
          Projekt gefuehrt. Der Projektursprung ist im Projekt dokumentiert, waehrend Quellcode und Builds
          unter einer offenen Lizenz zur gemeinsamen Weiterentwicklung bereitstehen.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Kurzfassung</p>
        <h2 className="mt-3 font-display text-3xl">AION ist unter MIT freigegeben und offen fuer Mitgestaltung.</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">
          Referenz und urspruenglicher Projektbezug bleiben bei Patrick Wirth. Nutzung, Veraenderung,
          Weitergabe und gemeinschaftliche Weiterentwicklung sind gemaess MIT License erlaubt.
        </p>
      </article>
      <LegalCard
        title="Quellcode"
        text="Der Repository-Inhalt ist unter der MIT License freigegeben. Er darf kopiert, veraendert, veroeffentlicht und gemeinschaftlich weiterentwickelt werden, solange die Lizenzhinweise erhalten bleiben."
      />
      <LegalCard
        title="Build-Dateien"
        text="Windows-Builds und andere Release-Artefakte sind fuer freie Nutzung und Weitergabe gedacht. Die technische Nutzbarkeit einzelner Plattformen bleibt vom jeweiligen Build-Stand abhaengig."
      />
      <LegalCard
        title="Projektbezug"
        text="Als Referenz sind Patrick Wirth, 10.06.1993 und patrickwirth_93@icloud.com im Projekt hinterlegt. Dieser Bezug benennt den Ursprung, begrenzt aber nicht die offene Mitgestaltung gemaess MIT License."
      />
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Hinterlegte Dokumente</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <LegalCard
            title="LICENSE"
            text="Regelt die offene Freigabe des Quellcodes unter der MIT License."
          />
          <LegalCard
            title="COPYRIGHT.md und REFERENCE.md"
            text="Fassen Referenzdaten, Projektbezug und den gemeinsamen Leitgedanken fuer eine offene Zukunft zusammen."
          />
          <LegalCard
            title="Community Access Notice"
            text="Beschreibt die freie Nutzung, Weitergabe und Mitgestaltung der Release-Artefakte im aktuellen Build-Stand."
          />
        </div>
      </article>
    </section>
  );
}
