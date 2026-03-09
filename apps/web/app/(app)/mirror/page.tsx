import { MirrorWorkspace } from "../../../components/mvp/mirror-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function MirrorPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Mirror"
        title="Mirror work with counter-perspective instead of confirmation"
        description="Mirror mode is now its own workspace: direct counter-reading, disconfirming perspective, and a deliberately more uncomfortable guiding question."
        badge="Mirror active"
      />
      <MirrorWorkspace />
    </section>
  );
}
