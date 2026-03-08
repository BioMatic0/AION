"use client";

import { useEffect, useState } from "react";
import type {
  NotificationHistoryItem,
  NotificationJobRecord,
  NotificationPreference
} from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const defaultPreferences: NotificationPreference = {
  developmentEnabled: true,
  goalRemindersEnabled: true,
  frequency: "daily",
  preferredTime: "08:30",
  preferredWeekday: "monday",
  tone: "mixed"
};

const weekdayOptions = [
  { value: "monday", label: "Montag" },
  { value: "tuesday", label: "Dienstag" },
  { value: "wednesday", label: "Mittwoch" },
  { value: "thursday", label: "Donnerstag" },
  { value: "friday", label: "Freitag" },
  { value: "saturday", label: "Samstag" },
  { value: "sunday", label: "Sonntag" }
];

function formatJobType(value: NotificationJobRecord["jobType"]) {
  return value === "growth" ? "Wachstum" : "Ziel";
}

function formatJobStatus(value: NotificationJobRecord["status"]) {
  return value === "scheduled" ? "Geplant" : "Pausiert";
}

function formatChannel(value: NotificationHistoryItem["channel"]) {
  return value === "email" ? "E-Mail" : "In-App";
}

function formatNotificationStatus(value: NotificationHistoryItem["status"]) {
  const map: Record<NotificationHistoryItem["status"], string> = {
    queued: "In Warteschlange",
    sent: "Versendet",
    failed: "Fehlgeschlagen"
  };

  return map[value];
}

export function NotificationSettingsPanel() {
  const [preferences, setPreferences] = useState<NotificationPreference>(defaultPreferences);
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [jobs, setJobs] = useState<NotificationJobRecord[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  async function loadNotificationData(options?: { silentSuccess?: boolean }) {
    setIsLoading(true);

    const [preferencesResult, historyResult, jobsResult] = await Promise.all([
      apiRequest<NotificationPreference>("/notifications/preferences"),
      apiRequest<NotificationHistoryItem[]>("/notifications/history"),
      apiRequest<NotificationJobRecord[]>("/notifications/jobs")
    ]);

    const failures: string[] = [];

    if (preferencesResult.ok && preferencesResult.data) {
      setPreferences(preferencesResult.data);
    } else {
      failures.push(preferencesResult.error ?? "Benachrichtigungs-Praeferenzen konnten nicht geladen werden.");
    }

    if (historyResult.ok && historyResult.data) {
      setHistory(historyResult.data);
    } else {
      failures.push(historyResult.error ?? "Benachrichtigungsverlauf konnte nicht geladen werden.");
    }

    if (jobsResult.ok && jobsResult.data) {
      setJobs(jobsResult.data);
    } else {
      failures.push(jobsResult.error ?? "Benachrichtigungsjobs konnten nicht geladen werden.");
    }

    setError(failures.length > 0 ? failures.join(" ") : null);
    if (!options?.silentSuccess) {
      setStatus(failures.length === 0 ? "Benachrichtigungen sind direkt mit der API verbunden." : null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void loadNotificationData();
  }, []);

  async function savePreferences() {
    setIsSaving(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<NotificationPreference>("/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences)
    });

    if (result.ok && result.data) {
      setPreferences(result.data);
      await loadNotificationData({ silentSuccess: true });
      setStatus("Benachrichtigungs-Praeferenzen wurden gespeichert.");
    } else {
      setError(result.error ?? "Benachrichtigungs-Praeferenzen konnten nicht gespeichert werden.");
    }

    setIsSaving(false);
  }

  async function previewNotification() {
    setIsPreviewing(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<NotificationHistoryItem>("/notifications/preview", {
      method: "POST"
    });

    if (result.ok && result.data) {
      setHistory((current) => [result.data as NotificationHistoryItem, ...current]);
      setStatus("Benachrichtigungsvorschau wurde erzeugt.");
    } else {
      setError(result.error ?? "Benachrichtigungsvorschau konnte nicht erzeugt werden.");
    }

    setIsPreviewing(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Benachrichtigungen</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Entwicklungsimpulse steuern</h2>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
          {isLoading ? <StatusNotice message="Benachrichtigungsdaten werden geladen..." /> : null}
        </div>
        <div className="mt-6 space-y-4 text-sm text-slate/85">
          <label className="flex items-center justify-between rounded-2xl border border-mist bg-mist/35 px-4 py-3">
            <span>Entwicklungsimpulse</span>
            <input
              type="checkbox"
              checked={preferences.developmentEnabled}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  developmentEnabled: event.target.checked
                }))
              }
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-mist bg-mist/35 px-4 py-3">
            <span>Zielerinnerungen</span>
            <input
              type="checkbox"
              checked={preferences.goalRemindersEnabled}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  goalRemindersEnabled: event.target.checked
                }))
              }
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <select
              aria-label="Benachrichtigungsfrequenz"
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              value={preferences.frequency}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  frequency: event.target.value as NotificationPreference["frequency"]
                }))
              }
            >
              <option value="daily">Taeglich</option>
              <option value="every_2_days">Alle 2 Tage</option>
              <option value="weekly">Woechentlich</option>
            </select>
            <select
              aria-label="Tonfall"
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              value={preferences.tone}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  tone: event.target.value as NotificationPreference["tone"]
                }))
              }
            >
              <option value="motivational">Motivierend</option>
              <option value="reflective">Reflektierend</option>
              <option value="mixed">Gemischt</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              aria-label="Bevorzugte Uhrzeit"
              placeholder="Uhrzeit"
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              type="time"
              value={preferences.preferredTime}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  preferredTime: event.target.value
                }))
              }
            />
            <select
              aria-label="Bevorzugter Wochentag"
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              value={preferences.preferredWeekday}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  preferredWeekday: event.target.value
                }))
              }
            >
              {weekdayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={savePreferences}
              disabled={isSaving}
              className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Speichert..." : "Praeferenzen speichern"}
            </button>
            <button
              type="button"
              onClick={previewNotification}
              disabled={isPreviewing}
              className="rounded-2xl border border-moss/20 bg-moss/5 px-5 py-3 text-sm font-semibold text-slate disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPreviewing ? "Erzeugt..." : "Vorschau erzeugen"}
            </button>
          </div>
        </div>
      </article>
      <div className="space-y-6">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Geplante Jobs</p>
          <div className="mt-6 space-y-3">
            {!isLoading && jobs.length === 0 ? <StatusNotice message="Aktuell keine geplanten Jobs vorhanden." /> : null}
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-mist bg-mist/35 px-4 py-3 text-sm text-slate/80">
                {formatJobType(job.jobType)} {" - "} {new Date(job.scheduledFor).toLocaleString("de-DE")} {" - "} {formatJobStatus(job.status)}
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Verlauf</p>
          <div className="mt-6 space-y-4">
            {!isLoading && history.length === 0 ? <StatusNotice message="Noch kein Benachrichtigungsverlauf vorhanden." /> : null}
            {history.map((item) => (
              <div key={item.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <span className="text-xs text-slate/60">{formatChannel(item.channel)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{item.message}</p>
                <div className="mt-3 text-xs text-slate/60">
                  {new Date(item.deliveredAt).toLocaleString("de-DE")} {" - "} {formatNotificationStatus(item.status)}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
