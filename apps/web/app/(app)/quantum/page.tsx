import { QuantumWorkspace } from "../../../components/mvp/quantum-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function QuantumPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Quantenlinse"
        title="Quantenlinse als klar deklarierter Denkmodus"
        description="Die Quantenlinse bleibt ein strukturierender Perspektivwechsel. Die Seite liefert jetzt echte Ausgaben mit Zustandsraum, Kollapsmuster und Feldfrage, ohne falsche Tatsachen zu behaupten."
        badge="Symbolischer Modus"
      />
      <QuantumWorkspace />
    </section>
  );
}
