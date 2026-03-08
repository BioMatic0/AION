import { NotificationSettingsPanel } from "../../../components/mvp/notification-settings-panel";
import { SectionHeader } from "../../../components/mvp/section-header";
import { UserProfileSettingsPanel } from "../../../components/mvp/user-profile-settings-panel";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Einstellungen"
        title="Agent, Benachrichtigungen und Steuerlogik an einem Ort"
        description="Die Einstellungen bleiben die Steuerzentrale des MVP. Profil, Passwortwechsel, 2FA-Vorstruktur und Benachrichtigungslogik sind hier zusammengezogen; weitere Agentenprofile folgen spaeter."
        badge="Steuerzentrale"
      />
      <UserProfileSettingsPanel />
      <NotificationSettingsPanel />
    </section>
  );
}
