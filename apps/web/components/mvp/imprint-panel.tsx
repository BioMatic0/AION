function ImprintBlock({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[24px] border border-mist bg-white p-6 shadow-panel">
      <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">Impressum</p>
      <h2 className="mt-3 font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate/80">{children}</div>
    </article>
  );
}

export function ImprintPanel() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Impressum</p>
        <h1 className="mt-3 font-display text-4xl text-ink">Projekt- und Referenzhinweis</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate/80">
          Diese Seite dokumentiert den aktuellen Projekt-, Kontakt- und Referenzhinweis innerhalb der
          Anwendung. Sie ersetzt keine vollstaendige externe Rechtspruefung fuer eine oeffentliche oder
          kommerzielle Veroeffentlichung.
        </p>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Aktueller Stand</p>
        <h2 className="mt-3 font-display text-3xl">Projektreferenz: Patrick Wirth</h2>
        <p className="mt-5 text-sm leading-7 text-mist/80">
          AION wird im Projektstand als frei zugaengliches und offen mitgestaltbares Projekt gefuehrt.
          Die aktuelle Freigabe erfolgt unter der AION Community Fairness License 1.0.
        </p>
      </article>
      <ImprintBlock title="Referenzdaten">
        <p>Name: Patrick Wirth</p>
        <p>Geburtsdatum: 10.06.1993</p>
        <p>E-Mail: patrickwirth_93@icloud.com</p>
      </ImprintBlock>
      <ImprintBlock title="Projektstatus">
        <p>Projektname: AION</p>
        <p>Lizenz: AION Community Fairness License 1.0</p>
        <p>Softwaretyp: offene KI- und Entwicklungsplattform</p>
      </ImprintBlock>
      <ImprintBlock title="Rechts- und Projektdokumente">
        <p>Massgebliche Projektdateien: LICENSE, COPYRIGHT.md, REFERENCE.md, FAIR-COMMERCE.md, FREE-USE-NOTICE.txt</p>
        <p>Builds und Quellcode sollen fuer alle breit zugaenglich und mitgestaltbar sein, ohne ausbeuterischen Vertrieb.</p>
      </ImprintBlock>
      <article className="rounded-[28px] bg-white p-8 shadow-panel lg:col-span-2">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Leitgedanke</p>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          Fuer unsere Zukunft, dem Zweck der gemeinsamen Verbindung, in ewiglicher Verbindung.
        </p>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          Diese Seite wird auch in den exportierten Web-, Desktop- und mobilen Paketen mit ausgeliefert. Im
          Windows-Desktop-Build ist sie zusaetzlich ueber das native Anwendungsmenue erreichbar.
        </p>
      </article>
    </section>
  );
}
