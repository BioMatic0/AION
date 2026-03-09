import { NotificationSettingsPanel } from "../../../components/mvp/notification-settings-panel";
import { SectionHeader } from "../../../components/mvp/section-header";

export default function NotificationsPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Notifications"
        title="Motivation and goal reminders with consent logic"
        description="The notification layer is implemented as a configurable MVP area: preferences, preview, jobs, and history run directly through the API."
        badge="Opt-in active"
      />
      <NotificationSettingsPanel />
    </section>
  );
}
