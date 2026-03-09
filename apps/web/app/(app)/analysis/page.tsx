import { AnalysisWorkspace } from "../../../components/mvp/analysis-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function AnalysisPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Analysis"
        title="Multi-layer analysis with memory integration"
        description="Analysis now generates real reports from input text and links them directly to the existing system memory instead of merely reserving the area."
        badge="AI module active"
      />
      <AnalysisWorkspace />
    </section>
  );
}
