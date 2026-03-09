import { GovernanceCenterPanel } from "../../../components/mvp/governance-center-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GovernancePage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Governance"
        title="Bounded intelligence instead of invisible system power"
        description="The governance page makes the charter, policies, integrity checks, and safe-halt states visible so AION remains reviewable instead of merely well intentioned."
        badge="Charter active"
      />
      <GovernanceCenterPanel />
    </section>
  );
}
