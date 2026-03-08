"use client";

import { useEffect, useState } from "react";
import type { GovernanceOverview, IntegrityCheckRecord } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

function formatEnforcementMode(value: GovernanceOverview["policies"][number]["enforcementMode"]) {
  const map: Record<GovernanceOverview["policies"][number]["enforcementMode"], string> = {
    log: "Protokoll",
    warn: "Warnung",
    block: "Blockieren",
    halt: "Sicherer Halt"
  };

  return map[value];
}

function formatIntegrityStatus(value: GovernanceOverview["integrityChecks"][number]["status"]) {
  const map: Record<GovernanceOverview["integrityChecks"][number]["status"], string> = {
    pass: "Bestanden",
    warn: "Warnung",
    block: "Blockiert",
    halt: "Sicherer Halt"
  };

  return map[value];
}

function formatSafeHaltStatus(value: GovernanceOverview["safeHaltEvents"][number]["status"]) {
  return value === "armed" ? "Aktiviert" : "Geloest";
}

export function GovernanceCenterPanel() {
  const [overview, setOverview] = useState<GovernanceOverview | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSweeping, setIsSweeping] = useState(false);

  async function loadOverview(options?: { silentSuccess?: boolean }) {
    setIsLoading(true);
    const result = await apiRequest<GovernanceOverview>("/governance/overview");

    if (result.ok && result.data) {
      setOverview(result.data);
      if (!options?.silentSuccess) {
        setStatus("Governance-Uebersicht wird live aus der API geladen.");
      }
      setError(null);
    } else {
      if (!options?.silentSuccess) {
        setStatus(null);
      }
      setError(result.error ?? "Governance-Uebersicht konnte nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  async function runIntegritySweep() {
    setIsSweeping(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<IntegrityCheckRecord>("/governance/integrity/sweep", {
      method: "POST"
    });

    if (result.ok && result.data) {
      await loadOverview({ silentSuccess: true });
      setStatus("Integritaetspruefung wurde ausgefuehrt.");
    } else {
      setError(result.error ?? "Integritaetspruefung konnte nicht ausgefuehrt werden.");
    }

    setIsSweeping(false);
  }

  if (!overview) {
    return (
      <div className="space-y-3">
        {isLoading ? <StatusNotice message="Governance-Uebersicht wird geladen..." /> : null}
        {error ? <StatusNotice message={error} variant="error" /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Governance-Charta</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{overview.charter.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate/80">{overview.charter.summary}</p>
          </div>
          <button
            type="button"
            onClick={runIntegritySweep}
            disabled={isSweeping}
            className="rounded-full border border-moss/20 bg-moss px-5 py-3 text-sm font-semibold text-white transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSweeping ? "Pruefung laeuft..." : "Integritaetspruefung ausfuehren"}
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {overview.charter.principles.map((principle) => (
            <div key={principle} className="rounded-3xl border border-mist bg-mist/35 p-5 text-sm text-slate/80">
              {principle}
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-mist bg-mist/35 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate/55">Beziehungsmodell</p>
            <p className="mt-3 text-sm leading-7 text-slate/80">{overview.charter.relationshipModel}</p>
          </div>
          <div className="rounded-3xl border border-mist bg-mist/35 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate/55">Eskalationsregel</p>
            <p className="mt-3 text-sm leading-7 text-slate/80">{overview.charter.escalationRule}</p>
          </div>
        </div>
      </article>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Richtlinien</p>
          <div className="mt-6 space-y-4">
            {overview.policies.map((policy) => (
              <div key={policy.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-ink">{policy.title}</h3>
                  <span className="text-xs text-slate/60">{formatEnforcementMode(policy.enforcementMode)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{policy.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Integritaetspruefungen</p>
          <div className="mt-6 space-y-4">
            {overview.integrityChecks.map((check) => (
              <div key={check.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink">{check.policyId}</h3>
                  <span className="text-xs text-slate/60">{formatIntegrityStatus(check.status)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{check.summary}</p>
                <div className="mt-3 text-xs text-slate/60">{new Date(check.createdAt).toLocaleString("de-DE")}</div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Eingeschraenkte Nutzung</p>
          <div className="mt-6 space-y-4">
            {overview.restrictedUses.map((item) => (
              <div key={item.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <h3 className="text-base font-semibold text-ink">{item.domain}</h3>
                <p className="mt-3 text-sm leading-7 text-slate/80">{item.rationale}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Sicherer Halt</p>
          <div className="mt-6 space-y-4">
            {overview.safeHaltEvents.map((event) => (
              <div key={event.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <h3 className="text-base font-semibold text-ink">{event.module}</h3>
                <p className="mt-3 text-sm leading-7 text-slate/80">{event.reason}</p>
                <div className="mt-3 text-xs text-slate/60">{formatSafeHaltStatus(event.status)}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Audit-Vorschau</p>
          <div className="mt-6 space-y-4">
            {overview.auditTrailPreview.map((entry) => (
              <div key={entry.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <h3 className="text-base font-semibold text-ink">{entry.action}</h3>
                <p className="mt-3 text-sm leading-7 text-slate/80">{entry.detail}</p>
                <div className="mt-3 text-xs text-slate/60">{new Date(entry.createdAt).toLocaleString("de-DE")}</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
