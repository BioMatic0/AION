import type { JournalEntrySummary } from "@aion/shared-types";

export interface SessionSummary {
  id: string;
  label: string;
  lastSeenAt: string;
}

export interface DashboardSnapshot {
  entries: JournalEntrySummary[];
  activeSessions: SessionSummary[];
}
