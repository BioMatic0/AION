import { GrowthWorkspace } from "../../../components/mvp/growth-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GrowthPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Growth"
        title="Growth state and interventions over time"
        description="The growth area is no longer just an idea. It calculates a visible state, stores history, and produces interventions for the next real step."
        badge="Growth active"
      />
      <GrowthWorkspace />
    </section>
  );
}
