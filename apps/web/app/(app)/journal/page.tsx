import { SectionHeader } from "../../../components/mvp/section-header";
import { JournalWorkspace } from "../../../components/mvp/journal-workspace";

export default function JournalPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Journal"
        title="Free-form entries with a real capture surface"
        description="The journal area now writes to and reads from the API directly. Errors stay visible instead of being hidden behind local placeholder state."
        badge="Live area"
      />
      <JournalWorkspace />
    </section>
  );
}
