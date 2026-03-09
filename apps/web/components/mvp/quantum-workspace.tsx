"use client";

import { FormEvent, useEffect, useState } from "react";
import type { QuantumLensReport } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { ReportCard } from "./report-card";
import { StatusNotice } from "./status-notice";

export function QuantumWorkspace() {
  const [reports, setReports] = useState<QuantumLensReport[]>([]);
  const [content, setContent] = useState("");
  const [hasBeen, setHasBeen] = useState("0.72");
  const [canBe, setCanBe] = useState("0.40");
  const [tendsToBe, setTendsToBe] = useState("0.22");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadReports() {
    setIsLoading(true);
    const result = await apiRequest<QuantumLensReport[]>("/analysis/quantum-lens");

    if (result.ok && result.data) {
      setReports(result.data);
      setStatus("Quantum lens reports are loading live from the API.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Quantum lens reports could not be loaded.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadReports();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<QuantumLensReport>("/analysis/quantum-lens", {
      method: "POST",
      body: JSON.stringify({
        content,
        context: reports.slice(0, 2).map((report) => report.summary),
        manualPotentialTruth: {
          hasBeen: Number(hasBeen),
          canBe: Number(canBe),
          tendsToBe: Number(tendsToBe)
        }
      })
    });

    if (result.ok && result.data) {
      setReports((current) => [result.data as QuantumLensReport, ...current]);
      setContent("");
      setStatus("Quantum lens report was generated.");
    } else {
      setError(result.error ?? "Quantum lens mode could not be executed.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Quantum lens</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Read patterns as a state space</h2>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          This mode remains explicitly metaphorical. It now uses a symbolic pure-potential engine to read latent, emerging, manifest, and hidden states without claiming physics.
        </p>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <textarea
          className="mt-6 min-h-44 w-full rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss"
          placeholder="Which question should be read through the quantum lens?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate/80">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-moss">Has been</span>
            <input
              className="w-full rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              inputMode="decimal"
              value={hasBeen}
              onChange={(event) => setHasBeen(event.target.value)}
            />
          </label>
          <label className="text-sm text-slate/80">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-moss">Can be</span>
            <input
              className="w-full rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              inputMode="decimal"
              value={canBe}
              onChange={(event) => setCanBe(event.target.value)}
            />
          </label>
          <label className="text-sm text-slate/80">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-moss">Tends to be</span>
            <input
              className="w-full rounded-2xl border border-mist bg-mist/50 px-4 py-3 outline-none focus:border-moss"
              inputMode="decimal"
              value={tendsToBe}
              onChange={(event) => setTendsToBe(event.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Analyzing..." : "Apply quantum lens"}
        </button>
      </form>
      {isLoading ? <StatusNotice message="Quantum lens reports are loading..." /> : null}
      {!isLoading && reports.length === 0 ? <StatusNotice message="No quantum lens reports are available yet." /> : null}
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
