import { SectionHeader } from "../../../components/mvp/section-header";
import { SecurityOverviewPanel } from "../../../components/mvp/security-overview-panel";

export default function SecurityPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Sicherheit"
        title="Sitzungen und Sicherheitsereignisse bleiben sichtbar"
        description="Die Sicherheitsansicht bindet die Sitzungs- und Ereignislage in die UI ein. Damit bleibt die Plattform auf Nutzerebene transparent statt nur intern protokolliert."
        badge="Sichtbarkeit aktiv"
      />
      <SecurityOverviewPanel />
    </section>
  );
}
