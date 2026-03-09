import { DashboardOverview } from "../../../components/mvp/dashboard-overview";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Dashboard"
        title="AION now runs on a real MVP foundation"
        description="This dashboard pulls its core metrics directly from the API and shows AION's actual runtime state instead of demo placeholders."
        badge="API active"
      />
      <DashboardOverview />
    </section>
  );
}
