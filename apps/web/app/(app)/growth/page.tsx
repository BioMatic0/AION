import { GrowthWorkspace } from "../../../components/mvp/growth-workspace";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function GrowthPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Wachstum"
        title="Wachstumszustand und Interventionen ueber Zeit"
        description="Der Wachstumsbereich arbeitet jetzt nicht mehr nur als Idee. Er berechnet einen sichtbaren Zustand, speichert Verlauf und erzeugt Interventionen fuer den naechsten realen Schritt."
        badge="Wachstum aktiv"
      />
      <GrowthWorkspace />
    </section>
  );
}
