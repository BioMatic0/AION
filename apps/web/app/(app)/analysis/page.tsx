import { AnalysisWorkspace } from "../../../components/mvp/analysis-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function AnalysisPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Analyse"
        title="Mehrschichtige Analyse mit Memory-Anbindung"
        description="Die Analyse erzeugt jetzt echte Berichte aus Eingabetexten und koppelt sie direkt an das vorhandene Systemgedaechtnis, statt nur den Bereich zu reservieren."
        badge="KI-Modul aktiv"
      />
      <AnalysisWorkspace />
    </section>
  );
}
