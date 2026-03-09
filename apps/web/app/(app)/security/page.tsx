import { SectionHeader } from "../../../components/mvp/section-header";
import { SecurityOverviewPanel } from "../../../components/mvp/security-overview-panel";

export default function SecurityPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Security"
        title="Sessions and security events stay visible"
        description="The security view brings session and event state into the UI so the platform stays transparent for users instead of being logged only internally."
        badge="Visibility active"
      />
      <SecurityOverviewPanel />
    </section>
  );
}
