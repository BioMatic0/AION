import { NotesWorkspace } from "../../../components/mvp/notes-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function NotesPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Notizen"
        title="Schnelle Notizen mit Kategorien und Tags"
        description="Dieser Bereich dient als loses Erfassungssystem fuer Ideen, Architekturgedanken und spaetere Umwandlung in Ziele oder Journal-Kontext, direkt auf API-Basis."
        badge="MVP erweitert"
      />
      <NotesWorkspace />
    </section>
  );
}
