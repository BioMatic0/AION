import { MirrorWorkspace } from "../../../components/mvp/mirror-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function MirrorPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Mirror"
        title="Spiegelung mit Gegenperspektive statt Zustimmung"
        description="Der Spiegelmodus ist jetzt ein eigener Arbeitsmodus: direkte Gegenlesart, widerlegende Sicht und eine bewusst unbequemere Leitfrage."
        badge="Spiegel aktiv"
      />
      <MirrorWorkspace />
    </section>
  );
}
