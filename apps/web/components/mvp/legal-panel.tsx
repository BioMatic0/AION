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
          unter einer fairnessgebundenen Quelllizenz zur gemeinsamen Weiterentwicklung bereitstehen.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Kurzfassung</p>
        <h2 className="mt-3 font-display text-3xl">AION ist offen zugaenglich, fair ausgerichtet und offen fuer Mitgestaltung.</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">
          Referenz und urspruenglicher Projektbezug bleiben bei Patrick Wirth. Nutzung, Veraenderung,
          Weitergabe und gemeinschaftliche Weiterentwicklung sind gemaess AION Community Fairness License 1.0
          erlaubt, solange Ursprungsschutz und Fairnessbedingungen eingehalten werden.
        </p>
        <p className="mt-4 text-xs leading-6 text-mist/65">
          Die Lizenz ist oeffentlich und kollaborativ ausgerichtet, aber nicht als unbeschraenkte MIT-Freigabe formuliert.
        </p>
      </article>
      <LegalCard
        title="Quellcode"
        text="Der Repository-Inhalt steht unter der AION Community Fairness License 1.0. Er darf genutzt, kopiert, veraendert, veroeffentlicht und gemeinschaftlich weiterentwickelt werden, solange die Ursprungs- und Lizenzhinweise erhalten bleiben."
      />
      <LegalCard
        title="Build-Dateien"
        text="Windows-Builds und andere Release-Artefakte sind fuer eine breite Nutzung und Weitergabe gedacht. Ein umsatzbasierter Betrieb ist nur mit einem fairen, plausiblen und nicht ausbeuterischen Modell zulaessig."
      />
      <LegalCard
        title="Projektbezug"
        text="Als Referenz sind Patrick Wirth, 10.06.1993 und patrickwirth_93@icloud.com im Projekt hinterlegt. Dieser Bezug benennt den Ursprung und darf bei Weitergabe, Forks oder Vertrieb nicht entfernt werden."
      />
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Hinterlegte Dokumente</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <LegalCard
            title="LICENSE"
            text="Regelt die Nutzung des Quellcodes unter der AION Community Fairness License 1.0."
          />
          <LegalCard
            title="COPYRIGHT.md und REFERENCE.md"
            text="Fassen Referenzdaten, Projektbezug und den gemeinsamen Leitgedanken fuer eine offene Zukunft zusammen."
          />
          <LegalCard
            title="FAIR-COMMERCE.md"
            text="Beschreibt, wie ein fairer und ethisch vertretbarer Vertrieb oder ein umsatzbasierter Betrieb von AION aussehen muss."
          />
        </div>
      </article>
    </section>
  );
}
