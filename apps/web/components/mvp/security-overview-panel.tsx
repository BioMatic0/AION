"use client";

import { useEffect, useState } from "react";
import type { SecurityCenterOverview, SecurityIncidentSummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

function formatSeverity(value: SecurityCenterOverview["events"][number]["severity"]) {
  const map: Record<SecurityCenterOverview["events"][number]["severity"], string> = {
    info: "Info",
    warning: "Warning",
    critical: "Critical"
  };

  return map[value];
}

function formatIncidentStatus(value: SecurityCenterOverview["incidents"][number]["status"]) {
  const map: Record<SecurityCenterOverview["incidents"][number]["status"], string> = {
    open: "Open",
    investigating: "Investigating",
    resolved: "Resolved"
  };

  return map[value];
}

export function SecurityOverviewPanel() {
  const [overview, setOverview] = useState<SecurityCenterOverview | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  async function loadOverview(options?: { silentSuccess?: boolean }) {
    setIsLoading(true);
    const result = await apiRequest<SecurityCenterOverview>("/security/overview");

    if (result.ok && result.data) {
      setOverview(result.data);
      if (!options?.silentSuccess) {
        setStatus("Security center is loading live from the API.");
      }
      setError(null);
    } else {
      if (!options?.silentSuccess) {
        setStatus(null);
      }
      setError(result.error ?? "Security center could not be loaded.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  async function simulateIncident() {
    setIsSimulating(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<SecurityIncidentSummary>("/security/simulate/suspicious-login", {
      method: "POST"
    });

    if (result.ok && result.data) {
      await loadOverview({ silentSuccess: true });
      setStatus("The incident was simulated and added to the security overview.");
    } else {
      setError(result.error ?? "The incident could not be simulated.");
    }

    setIsSimulating(false);
  }

  if (!overview) {
    return (
      <div className="space-y-3">
        {isLoading ? <StatusNotice message="Security center is loading..." /> : null}
        {error ? <StatusNotice message={error} variant="error" /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Security center</p>
            <h2 className="mt-3 font-display text-3xl text-ink">Sessions, incidents, and user alerts</h2>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              External access, security events, and incident notifications remain visible inside AION instead of existing only in the background.
            </p>
          </div>
          <button
            type="button"
            onClick={simulateIncident}
            disabled={isSimulating}
            className="rounded-full border border-moss/20 bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSimulating ? "Simulating..." : "Simulate incident"}
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Sessions</p>
          <div className="mt-6 space-y-4">
            {overview.sessions.map((session) => (
              <div key={session.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{session.label}</h3>
                  <span className="text-xs text-slate/60">{session.revokedAt ? "revoked" : "active"}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/75">Created: {new Date(session.createdAt).toLocaleString("en-GB")}</p>
                <p className="mt-1 text-sm leading-7 text-slate/75">Last seen: {new Date(session.lastSeenAt).toLocaleString("en-GB")}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Current events</p>
          <div className="mt-6 space-y-4">
            {overview.events.map((event) => (
              <div key={event.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{event.type}</h3>
                  <span className="text-xs text-slate/60">{formatSeverity(event.severity)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{event.summary}</p>
                <div className="mt-3 text-xs text-slate/60">{new Date(event.createdAt).toLocaleString("en-GB")}</div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Incidents</p>
          <div className="mt-6 space-y-4">
            {overview.incidents.map((incident) => (
              <div key={incident.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink">{incident.incidentType}</h3>
                  <span className="text-xs text-slate/60">{formatIncidentStatus(incident.status)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{incident.summary}</p>
                <div className="mt-3 text-xs text-slate/60">{incident.recommendedAction}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Notifications</p>
          <div className="mt-6 space-y-4">
            {overview.notifications.map((notification) => (
              <div key={notification.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink">{notification.title}</h3>
                  <span className="text-xs text-slate/60">{formatSeverity(notification.severity)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{notification.description}</p>
                <div className="mt-3 text-xs text-slate/60">{notification.deliveredVia.join(" + ")}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
