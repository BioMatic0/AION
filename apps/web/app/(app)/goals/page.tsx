import { GoalsWorkspace } from "../../../components/mvp/goals-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GoalsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Goals"
        title="Goals, progress, and visible execution"
        description="The goals area is now implemented as a real MVP surface with status model, progress values, milestones, and API-ready actions instead of placeholders."
        badge="MVP core"
      />
      <GoalsWorkspace />
    </section>
  );
}
