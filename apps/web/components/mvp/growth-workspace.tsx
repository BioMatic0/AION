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
    orientation: "Orientation",
    integration: "Integration"
  };

  return map[value] ?? value;
}

function formatGrowthFocus(value: string) {
  const map: Record<string, string> = {
    clarity: "Clarity",
    coherence: "Coherence",
    pressure: "Pressure",
    choice: "Choice"
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
      failures.push(stateResult.error ?? "Growth state could not be loaded.");
    }

    if (historyResult.ok && historyResult.data) {
      setHistory(historyResult.data);
    } else {
      failures.push(historyResult.error ?? "Growth history could not be loaded.");
    }

    if (interventionsResult.ok && interventionsResult.data) {
      setInterventions(interventionsResult.data);
    } else {
      failures.push(interventionsResult.error ?? "Growth interventions could not be loaded.");
    }

    setError(failures.length > 0 ? failures.join(" ") : null);
    setStatus(failures.length === 0 ? "Growth data is loading live from the API." : null);
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
      setStatus("Growth evaluation was updated.");
    } else {
      setError(result.error ?? "Growth evaluation could not be generated.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Stage</div><div className="mt-3 text-2xl font-semibold text-ink">{state ? formatGrowthStage(state.currentStage) : "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Focus</div><div className="mt-3 text-2xl font-semibold text-ink">{state ? formatGrowthFocus(state.focusArea) : "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Momentum</div><div className="mt-3 text-2xl font-semibold text-ink">{state?.momentumScore ?? "--"}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Coherence</div><div className="mt-3 text-2xl font-semibold text-ink">{state?.coherenceScore ?? "--"}</div></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Evaluate growth</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Define the next honest step</h2>
          <p className="mt-4 text-sm leading-7 text-slate/80">{state?.nextStep ?? "Growth data is loading or not available yet."}</p>
          <div className="mt-6 space-y-3">
            {status ? <StatusNotice message={status} variant="success" /> : null}
            {error ? <StatusNotice message={error} variant="error" /> : null}
            {isLoading ? <StatusNotice message="Growth data is loading..." /> : null}
          </div>
          <textarea className="mt-6 min-h-40 w-full rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Which growth edge should be reviewed?" value={reflection} onChange={(event) => setReflection(event.target.value)} required />
          <button type="submit" disabled={isSubmitting} className="mt-4 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Evaluating..." : "Evaluate growth"}</button>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Strengths</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate/80">{(state?.strengths ?? []).map((item) => <li key={item}>{item}</li>)}</ul>{state && state.strengths.length === 0 ? <p className="mt-3 text-sm text-slate/70">No strengths have been recorded yet.</p> : null}</div>
            <div className="rounded-3xl border border-mist bg-mist/35 p-5"><div className="text-xs uppercase tracking-[0.22em] text-moss">Risks</div><ul className="mt-3 space-y-2 text-sm leading-6 text-slate/80">{(state?.risks ?? []).map((item) => <li key={item}>{item}</li>)}</ul>{state && state.risks.length === 0 ? <p className="mt-3 text-sm text-slate/70">No risks have been recorded yet.</p> : null}</div>
          </div>
        </form>
        <div className="space-y-6">
          <article className="rounded-[28px] bg-white p-8 shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Interventions</p>
            <div className="mt-6 space-y-4">
              {!isLoading && interventions.length === 0 ? <StatusNotice message="No growth interventions are available yet." /> : null}
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
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">History</p>
            <div className="mt-6 space-y-3">
              {!isLoading && history.length === 0 ? <StatusNotice message="No growth history is available yet." /> : null}
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
