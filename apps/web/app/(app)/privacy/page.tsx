import { PrivacyLedgerPanel } from "../../../components/mvp/privacy-ledger-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function PrivacyPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Datenschutz"
        title="Datenschutz sichtbar statt nur behauptet"
        description="Der Datenschutzbereich zeigt bereits die zentralen Produktlinien fuer Datensichtbarkeit, Loeschpfade und Wahrhaftigkeit im Umgang mit quanteninspirierten Modellen."
        badge="Datenschutz ab Werk"
      />
      <PrivacyLedgerPanel />
    </section>
  );
}
