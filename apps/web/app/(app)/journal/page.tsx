import { SectionHeader } from "../../../components/mvp/section-header";
import { JournalWorkspace } from "../../../components/mvp/journal-workspace";

export default function JournalPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Journal"
        title="Freie Eintraege mit echter Erfassungsflaeche"
        description="Der Journal-Bereich schreibt und liest jetzt direkt gegen die API. Fehler bleiben sichtbar, statt lokal mit Scheinzustand kaschiert zu werden."
        badge="Live-Bereich"
      />
      <JournalWorkspace />
    </section>
  );
}
