import { AuthenticitySourcesPanel } from "../../../components/mvp/authenticity-sources-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function AuthenticityPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Authenticity & Sources"
        title="Visible source discipline and media provenance"
        description="This page makes AION's source expectations, synthetic-media labeling rules, and provenance duties explicit for users, contributors, and future operators."
        badge="Disclosure active"
      />
      <AuthenticitySourcesPanel />
    </section>
  );
}
