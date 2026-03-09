import { QuantumWorkspace } from "../../../components/mvp/quantum-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function QuantumPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Quantum lens"
        title="Quantum lens as an explicitly declared thinking mode"
        description="The quantum lens remains a structuring change of perspective. The page now returns real outputs with state space, collapse pattern, and field question without making false factual claims."
        badge="Symbolic mode"
      />
      <QuantumWorkspace />
    </section>
  );
}
