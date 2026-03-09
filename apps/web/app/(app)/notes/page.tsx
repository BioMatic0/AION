import { NotesWorkspace } from "../../../components/mvp/notes-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function NotesPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Notes"
        title="Quick notes with categories and tags"
        description="This area acts as a lightweight capture system for ideas, architecture thoughts, and later conversion into goals or journal context, directly on top of the API."
        badge="MVP expanded"
      />
      <NotesWorkspace />
    </section>
  );
}
