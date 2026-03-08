import { NotificationSettingsPanel } from "../../../components/mvp/notification-settings-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function NotificationsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Benachrichtigungen"
        title="Motivation und Zielerinnerungen mit Zustimmungslogik"
        description="Die Benachrichtigungsschicht ist als konfigurierbarer MVP-Bereich umgesetzt: Praeferenzen, Vorschau, Jobs und Verlauf laufen direkt ueber die API."
        badge="Opt-in aktiv"
      />
      <NotificationSettingsPanel />
    </section>
  );
}
