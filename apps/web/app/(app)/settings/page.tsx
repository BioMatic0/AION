import { NotificationSettingsPanel } from "../../../components/mvp/notification-settings-panel";
import { SectionHeader } from "../../../components/mvp/section-header";
import { UserProfileSettingsPanel } from "../../../components/mvp/user-profile-settings-panel";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Settings"
        title="Agent, notifications, and control logic in one place"
        description="Settings remain the control center of the MVP. Profile, password change, 2FA scaffold, and notification logic are consolidated here; more agent profiles will follow later."
        badge="Control center"
      />
      <UserProfileSettingsPanel />
      <NotificationSettingsPanel />
    </section>
  );
}
