"use client";

import { FormEvent, useEffect, useState } from "react";
import type { QuantumLensReport } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { ReportCard } from "./report-card";
import { StatusNotice } from "./status-notice";

export function QuantumWorkspace() {
  const [reports, setReports] = useState<QuantumLensReport[]>([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadReports() {
    setIsLoading(true);
    const result = await apiRequest<QuantumLensReport[]>("/analysis/quantum-lens");

    if (result.ok && result.data) {
      setReports(result.data);
      setStatus("Quantenlinsen-Berichte werden live aus der API geladen.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Quantenlinsen-Berichte konnten nicht geladen werden.");
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
      body: JSON.stringify({ content, context: reports.slice(0, 2).map((report) => report.summary) })
    });

    if (result.ok && result.data) {
      setReports((current) => [result.data as QuantumLensReport, ...current]);
      setContent("");
      setStatus("Quantenlinsen-Bericht wurde erzeugt.");
    } else {
      setError(result.error ?? "Quantenlinsen-Modus konnte nicht ausgefuehrt werden.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Quantenlinse</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Muster als Zustandsraum lesen</h2>
        <p className="mt-4 text-sm leading-7 text-slate/80">Dieser Modus bleibt bewusst metaphorisch. Er erweitert die Sicht, er behauptet keine Physik.</p>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <textarea className="mt-6 min-h-44 w-full rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Welche Frage soll durch die Quantenlinse gelesen werden?" value={content} onChange={(event) => setContent(event.target.value)} required />
        <button type="submit" disabled={isSubmitting} className="mt-4 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Analysiert..." : "Quantenlinse anwenden"}</button>
      </form>
      {isLoading ? <StatusNotice message="Quantenlinsen-Berichte werden geladen..." /> : null}
      {!isLoading && reports.length === 0 ? <StatusNotice message="Noch keine Quantenlinsen-Berichte vorhanden." /> : null}
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
