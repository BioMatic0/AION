"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GrowthIntervention, GrowthState } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

interface GrowthEvaluationResponse {
  state: GrowthState;
  intervention: GrowthIntervention;
  history: GrowthState[];
}

function formatGrowthStage(value: string) {
  const map: Record<string, string> = {
    orientation: "Orientierung",
    integration: "Integration"
  };

  return map[value] ?? value;
}

function formatGrowthFocus(value: string) {
  const map: Record<string, string> = {
    clarity: "Klarheit",
    coherence: "Kohaerenz",
    pressure: "Druck",
    choice: "Wahl"
  };

  return map[value] ?? value;
}

export function GrowthWorkspace() {
  const [state, setState] = useState<GrowthState | null>(null);
  const [history, setHistory] = useState<GrowthState[]>([]);
  const [interventions, setInterventions] = useState<GrowthIntervention[]>([]);
  const [reflection, setReflection] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadGrowthData() {
    setIsLoading(true);
    const [stateResult, historyResult, interventionsResult] = await Promise.all([
      apiRequest<GrowthState>("/growth/state"),
      apiRequest<GrowthState[]>("/growth/history"),
      apiRequest<GrowthIntervention[]>("/growth/interventions")
    ]);

    const failures: string[] = [];

    if (stateResult.ok && stateResult.data) {
      setState(stateResult.data);
    } else {
      failures.push(stateResult.error ?? "Wachstumsstatus konnte nicht geladen werden.");
    }

    if (historyResult.ok && historyResult.data) {
      setHistory(historyResult.data);
    } else {
      failures.push(historyResult.error ?? "Wachstumsverlauf konnte nicht geladen werden.");
    }

    if (interventionsResult.ok && interventionsResult.data) {
      setInterventions(interventionsResult.data);
    } else {
      failures.push(interventionsResult.error ?? "Wachstumsinterventionen konnten nicht geladen werden.");
    }

    setError(failures.length > 0 ? failures.join(" ") : null);
    setStatus(failures.length === 0 ? "Wachstumsdaten werden live aus der API geladen." : null);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadGrowthData();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<GrowthEvaluationResponse>("/growth/evaluate", {
      method: "POST",
      body: JSON.stringify({ reflection })
    });

    if (result.ok && result.data) {
      const payload = result.data;
      setState(payload.state);
      setHistory(payload.history);
      setInterventions((current) => [payload.intervention, ...current]);
      setReflection("");
      setStatus("Wachstumsauswertung wurde aktualisiert.");
    } else {
      setError(result.error ?? "Wachstumsauswertung konnte nicht erzeugt werden.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Phase</div><div className="mt-3 text-2xl font-semibold text-ink">{state ? formatGrowthStage(state.currentStage) : "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Fokus</div><div className="mt-3 text-2xl font-semibold text-ink">{state ? formatGrowthFocus(state.focusArea) : "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Momentum</div><div className="mt-3 text-2xl font-semibold text-ink">{state?.momentumScore ?? "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Koharenz</div><div className="mt-3 text-2xl font-semibold text-ink">{state?.coherenceScore ?? "--"}</div></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Wachstum auswerten</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Naechsten ehrlichen Schritt bestimmen</h2>
          <p className="mt-4 text-sm leading-7 text-slate/80">{state?.nextStep ?? "Wachstumsdaten werden geladen oder sind noch nicht verfuegbar."}</p>
          <div className="mt-6 space-y-3">
            {status ? <StatusNotice message={status} variant="success" /> : null}
            {error ? <StatusNotice message={error} variant="error" /> : null}
            {isLoading ? <StatusNotice message="Wachstumsdaten werden geladen..." /> : null}
          </div>
          <textarea className="mt-6 min-h-40 w-full rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Welche Entwicklungskante soll geprueft werden?" value={reflection} onChange={(event) => setReflection(event.target.value)} required />
          <button type="submit" disabled={isSubmitting} className="mt-4 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Wertet aus..." : "Wachstum auswerten"}</button>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Staerken</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate/80">{(state?.strengths ?? []).map((item) => <li key={item}>{item}</li>)}</ul>{state && state.strengths.length === 0 ? <p className="mt-3 text-sm text-slate/70">Noch keine Staerken vermerkt.</p> : null}</div>
            <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Risiken</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate/80">{(state?.risks ?? []).map((item) => <li key={item}>{item}</li>)}</ul>{state && state.risks.length === 0 ? <p className="mt-3 text-sm text-slate/70">Noch keine Risiken vermerkt.</p> : null}</div>
          </div>
        </form>
        <div className="space-y-6">
          <article className="rounded-[28px] bg-white p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Interventionen</p>
            <div className="mt-6 space-y-4">
              {!isLoading && interventions.length === 0 ? <StatusNotice message="Noch keine Wachstumsinterventionen vorhanden." /> : null}
              {interventions.map((intervention) => (
                <div key={intervention.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                  <h3 className="text-lg font-semibold text-ink">{intervention.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate/80">{intervention.rationale}</p>
                  <p className="mt-3 text-sm font-semibold text-slate">{intervention.action}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-[28px] bg-white p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Verlauf</p>
            <div className="mt-6 space-y-3">
              {!isLoading && history.length === 0 ? <StatusNotice message="Noch kein Wachstumsverlauf vorhanden." /> : null}
              {history.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-mist bg-mist/35 px-4 py-3 text-sm text-slate/80">
                  {formatGrowthStage(entry.currentStage)} - {formatGrowthFocus(entry.focusArea)} - {entry.momentumScore}/{entry.coherenceScore}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
