import { DashboardOverview } from "../../../components/mvp/dashboard-overview";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Dashboard"
        title="AION laeuft jetzt als echtes MVP-Fundament"
        description="Dieses Dashboard zieht seine Kernzahlen direkt aus der API und zeigt den aktuellen Runtime-Stand von AION statt bloe Demo-Zustande."
        badge="API aktiv"
      />
      <DashboardOverview />
    </section>
  );
}
