import { NotificationSettingsPanel } from "../../../components/mvp/notification-settings-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Einstellungen"
        title="Agent, Benachrichtigungen und Steuerlogik an einem Ort"
        description="Die Einstellungen bleiben die Steuerzentrale des MVP. Aktuell ist hier vor allem die Benachrichtigungs- und Erinnerungslogik eingebunden; Agentenprofile folgen im naechsten Ausbau."
        badge="Steuerzentrale"
      />
      <NotificationSettingsPanel />
    </section>
  );
}
