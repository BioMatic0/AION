import { GoalsWorkspace } from "../../../components/mvp/goals-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GoalsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Ziele"
        title="Ziele, Fortschritt und sichtbare Umsetzung"
        description="Der Zielbereich ist jetzt als echter MVP-Bereich umgesetzt: Statusmodell, Fortschrittswerte, Meilensteine und API-geeignete Aktionen statt reiner Platzhalter."
        badge="MVP-Kern"
      />
      <GoalsWorkspace />
    </section>
  );
}
