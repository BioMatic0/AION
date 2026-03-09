import { PrivacyLedgerPanel } from "../../../components/mvp/privacy-ledger-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function PrivacyPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Privacy"
        title="Privacy made visible instead of merely claimed"
        description="The privacy area already shows the core product lines for data visibility, deletion paths, and truthfulness in handling quantum-inspired models."
        badge="Privacy by design"
      />
      <PrivacyLedgerPanel />
    </section>
  );
}
