import Link from "next/link";
import { SectionHeader } from "./section-header";

const risks = [
  {
    title: "Komplexitaet ohne Orientierung",
    risk:
      "Wenn zu viele Bereiche parallel wachsen, verliert die Oberflaeche Lesbarkeit und Nutzer verlieren den roten Faden.",
    action:
      "Bereiche in Arbeitslinien gruppieren, verwandte Module sichtbar verknuepfen und neue Funktionen nur nach einer Governance-Pruefung freigeben."
  },
  {
    title: "Psychologische Uebergriffigkeit",
    risk:
      "Reflexions- und Wachstumsfunktionen koennen zu viel Autoritaet ausstrahlen, wenn Unsicherheit und Grenzen nicht klar sichtbar bleiben.",
    action:
      "Analyse, Spiegel und Wachstum mit sichtbaren Unsicherheitsmarkern, klarer Sprache und ohne therapeutische Absolutheit halten."
  },
  {
    title: "Ethik bleibt nur Text",
    risk:
      "Wenn Ethik nur im README steht, aber in den Arbeitsflaechen nicht sichtbar ist, verliert sie in der Praxis an Wirkung.",
    action:
      "Ethik, Rechtliches, Datenschutz und Governance als eigene Navigationsbereiche fuehren und bei Releases aktiv mitpruefen."
  },
  {
    title: "Ausbeuterische Monetarisierung",
    risk:
      "Ein spaeteres Vertriebsmodell koennte die offene Ausrichtung des Projekts unterlaufen, wenn Fairness nicht vorab operationalisiert wird.",
    action:
      "Jeden umsatzbasierten Betrieb an die Fair-Commerce-Regeln koppeln: offenlegen, was verkauft wird, warum es fair ist und was frei bleibt."
  },
  {
    title: "Datennaehe ohne genug Schutz",
    risk:
      "Je persoenlicher Journal, Ziele, Verlauf und Sicherheitsdaten werden, desto hoeher ist die moralische Pflicht zur Zurueckhaltung.",
    action:
      "Datensparsamkeit, Export- und Loeschpfade, sichtbare Datenschutzprotokolle und lokale Laufzeitmodi weiter priorisieren."
  },
  {
    title: "Design ohne Arbeitsklarheit",
    risk:
      "Eine rein aeusserlich wirkende Oberflaeche kann professionell aussehen, aber die eigentliche Arbeit verlangsamen.",
    action:
      "Lesbarkeit, Kontrast, Navigationsgruppen, Statusanzeigen und kurze Entscheidungspfade vor dekorative Komplexitaet stellen."
  }
];

const guarantees = [
  "Navigation in klaren Arbeitslinien statt ungeordneter Modulliste",
  "helle, kontrastreiche Arbeitsflaechen fuer laengere Nutzung",
  "sichtbare Verknuepfung zwischen Arbeitsbasis, Reflexion, KI und Governance",
  "Fairness- und Lizenzhinweise direkt in der Software verankert",
  "Risiken nicht verstecken, sondern als Bestandteil der Produktsteuerung zeigen"
];

export function EthicalPillarsPanel() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Ethik und Risiko"
        title="Risikopunkte, Gegenmassnahmen und produktive Leitplanken"
        description="Diese Uebersicht verbindet die ethischen Grundpfeiler von AION mit konkreten Produkt- und Oberflaechenrisiken. Ziel ist keine perfekte Behauptung, sondern eine sichtbare, kontrollierbare und menschenzentrierte Vorgehensweise."
        badge="Aktive Pruefung"
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Risikofelder</p>
          <div className="mt-6 grid gap-4">
            {risks.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-mist bg-mist/40 p-5">
                <h2 className="font-display text-2xl text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate/80">{item.risk}</p>
                <p className="mt-4 rounded-2xl border border-moss/20 bg-white/80 px-4 py-3 text-sm leading-6 text-slate">
                  <span className="font-semibold text-ink">Vorgehensweise:</span> {item.action}
                </p>
              </div>
            ))}
          </div>
        </article>
        <div className="space-y-6">
          <article className="rounded-[28px] bg-slate p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Aktuelle Einschaetzung</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Stark ausgerichtet, aber nicht absolut garantiert.</h2>
            <p className="mt-5 text-sm leading-7 text-slate/80">
              AION kann aktuell glaubwuerdig als menschenzentriert, fairheitsgebunden und transparent beschrieben
              werden. Eine absolute 100-Prozent-Garantie waere jedoch unehrlich, weil Ethik immer auch von zukuenftigen
              Entscheidungen, Betreibern und Ausbaupfaden abhaengt.
            </p>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Leitplanken</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate/80">
              {guarantees.map((item) => (
                <li key={item} className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[28px] border border-white/10 bg-white/90 p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Vertiefung</p>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              Die ausfuehrliche Analyse liegt im Projektdokument und sollte vor groesseren Produkt- oder
              Vertriebsentscheidungen erneut geprueft werden.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/governance" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Governance
              </Link>
              <Link href="/rechtliches" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Rechtliches
              </Link>
              <Link href="/privacy" className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-sm font-semibold text-slate transition hover:border-moss/40 hover:bg-mist/70">
                Datenschutz
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
