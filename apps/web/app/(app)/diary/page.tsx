import { SectionHeader } from "../../../components/mvp/section-header";
import { DiaryWorkspace } from "../../../components/mvp/diary-workspace";

export default function DiaryPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Tagebuch"
        title="Gefuehrte Tagesreflexion mit Prompt-Schicht"
        description="Das Tagebuch verbindet manuelle Eingabe, taegliche Impulsstruktur und vorbereitete Tageszusammenfassungen in einer Seite."
        badge="MVP erweitert"
      />
      <DiaryWorkspace />
    </section>
  );
}
