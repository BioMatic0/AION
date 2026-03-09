import { SectionHeader } from "../../../components/mvp/section-header";
import { DiaryWorkspace } from "../../../components/mvp/diary-workspace";

export default function DiaryPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Diary"
        title="Guided daily reflection with a prompt layer"
        description="The diary combines manual input, daily prompt structure, and prepared daily summaries on one page."
        badge="MVP expanded"
      />
      <DiaryWorkspace />
    </section>
  );
}
