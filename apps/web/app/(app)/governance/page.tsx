import { GovernanceCenterPanel } from "../../../components/mvp/governance-center-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GovernancePage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Governance"
        title="Gebundene Intelligenz statt unsichtbarer Systemmacht"
        description="Die Governance-Seite macht Charta, Policies, Integritaetschecks und Safe-Halt-Zustaende sichtbar. Damit bleibt AION nachvollziehbar statt nur gut gemeint."
        badge="Charta aktiv"
      />
      <GovernanceCenterPanel />
    </section>
  );
}
