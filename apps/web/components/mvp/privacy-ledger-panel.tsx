"use client";

import { useEffect, useState } from "react";
import type { DataDeletionRequestSummary, DataExportRequestSummary, PrivacyOverview } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

function formatPrivacyMode(value: PrivacyOverview["preferences"]["privacyMode"]) {
  return value === "privacy-max" ? "Privacy Max" : "Standard";
}

function formatExportFormat(value: DataExportRequestSummary["format"]) {
  return value.toUpperCase();
}

function formatConsentStatus(value: PrivacyOverview["consents"][number]["status"]) {
  return value === "granted" ? "Erteilt" : "Widerrufen";
}

function formatRequestStatus(value: DataExportRequestSummary["status"] | DataDeletionRequestSummary["status"]) {
  return value === "queued" ? "In Warteschlange" : "Abgeschlossen";
}

export function PrivacyLedgerPanel() {
  const [overview, setOverview] = useState<PrivacyOverview | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestingExport, setIsRequestingExport] = useState(false);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);

  async function loadOverview(options?: { silentSuccess?: boolean }) {
    setIsLoading(true);
    const result = await apiRequest<PrivacyOverview>("/privacy/overview");

    if (result.ok && result.data) {
      setOverview(result.data);
      if (!options?.silentSuccess) {
        setStatus("Datenschutzuebersicht wird live aus der API geladen.");
      }
      setError(null);
    } else {
      if (!options?.silentSuccess) {
        setStatus(null);
      }
      setError(result.error ?? "Datenschutzuebersicht konnte nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  async function requestExport() {
    if (!overview) {
      return;
    }

    setIsRequestingExport(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<DataExportRequestSummary>("/privacy/export", {
      method: "POST",
      body: JSON.stringify({ format: overview.preferences.exportFormat })
    });

    if (result.ok && result.data) {
      await loadOverview({ silentSuccess: true });
      setStatus("Exportanfrage wurde angelegt.");
    } else {
      setError(result.error ?? "Exportanfrage konnte nicht angelegt werden.");
    }

    setIsRequestingExport(false);
  }

  async function requestDeletion() {
    setIsRequestingDeletion(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<DataDeletionRequestSummary>("/privacy/deletion", {
      method: "POST",
      body: JSON.stringify({ scope: "memory" })
    });

    if (result.ok && result.data) {
      await loadOverview({ silentSuccess: true });
      setStatus("Loeschanfrage wurde angelegt.");
    } else {
      setError(result.error ?? "Loeschanfrage konnte nicht angelegt werden.");
    }

    setIsRequestingDeletion(false);
  }

  if (!overview) {
    return (
      <div className="space-y-3">
        {isLoading ? <StatusNotice message="Datenschutzuebersicht wird geladen..." /> : null}
        {error ? <StatusNotice message={error} variant="error" /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Datenschutzprofil</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{formatPrivacyMode(overview.preferences.privacyMode)}</h2>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              Aufbewahrung: {overview.preferences.retentionProfile}. Exportstandard: {formatExportFormat(overview.preferences.exportFormat)}. Analytik: {overview.preferences.analyticsEnabled ? "aktiv" : "aus"}.
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={requestExport} disabled={isRequestingExport} className="rounded-full border border-moss/20 bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60">
              {isRequestingExport ? "Fordert an..." : "Export anfordern"}
            </button>
            <button type="button" onClick={requestDeletion} disabled={isRequestingDeletion} className="rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/20 hover:bg-mist/40 disabled:cursor-not-allowed disabled:opacity-60">
              {isRequestingDeletion ? "Fordert an..." : "Loeschpfad testen"}
            </button>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Einwilligungen</p>
          <div className="mt-6 space-y-4">
            {overview.consents.map((consent) => (
              <div key={consent.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink">{consent.scope}</h3>
                  <span className="text-xs text-slate/60">{formatConsentStatus(consent.status)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{consent.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Datenschutzprotokoll</p>
          <div className="mt-6 space-y-4">
            {overview.ledger.map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <h3 className="text-base font-semibold text-ink">{entry.category}</h3>
                <p className="mt-3 text-sm leading-7 text-slate/80">{entry.activeUsageSummary}</p>
                <div className="mt-3 text-xs text-slate/60">{entry.retentionRule}</div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Anfragen</p>
          <div className="mt-6 space-y-4">
            {[...overview.exportRequests, ...overview.deletionRequests].length === 0 ? (
              <p className="text-sm leading-7 text-slate/70">Noch keine Export- oder Loeschanfragen ausgelost.</p>
            ) : (
              <>
                {overview.exportRequests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                    <h3 className="text-base font-semibold text-ink">Export {formatExportFormat(request.format)}</h3>
                    <div className="mt-3 text-sm text-slate/80">Status: {formatRequestStatus(request.status)}</div>
                  </div>
                ))}
                {overview.deletionRequests.map((request) => (
                  <div key={request.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                    <h3 className="text-base font-semibold text-ink">Loeschung {request.scope}</h3>
                    <div className="mt-3 text-sm text-slate/80">Status: {formatRequestStatus(request.status)}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Hinweise</p>
          <div className="mt-6 space-y-4">
            {overview.guidance.map((item) => (
              <div key={item} className="rounded-3xl border border-mist bg-mist/35 p-5 text-sm leading-7 text-slate/80">
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
