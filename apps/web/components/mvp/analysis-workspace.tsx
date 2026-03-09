"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AnalysisReport, MemorySearchResult } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { ReportCard } from "./report-card";
import { StatusNotice } from "./status-notice";

const initialForm = {
  title: "",
  content: ""
};

const emptyMemorySearch: MemorySearchResult = {
  query: "",
  items: [],
  total: 0,
  generatedAt: ""
};

export function AnalysisWorkspace() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [memorySearch, setMemorySearch] = useState<MemorySearchResult>(emptyMemorySearch);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadReports() {
    setIsLoading(true);
    const result = await apiRequest<AnalysisReport[]>("/analysis");

    if (result.ok && result.data) {
      setReports(result.data);
      setStatus("Analyseberichte werden live aus der API geladen.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Analyseberichte konnten nicht geladen werden.");
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

    const payload = {
      title: form.title,
      content: form.content,
      context: reports.slice(0, 2).map((report) => report.summary)
    };

    const [reportResult, searchResult] = await Promise.all([
      apiRequest<AnalysisReport>("/analysis/run", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
      apiRequest<MemorySearchResult>("/memory/search", {
        method: "POST",
        body: JSON.stringify({ query: `${form.title} ${form.content}`.trim() })
      })
    ]);

    if (reportResult.ok && reportResult.data) {
      setReports((current) => [reportResult.data as AnalysisReport, ...current]);
      setForm(initialForm);
      setStatus("Analysebericht wurde erzeugt.");
    } else {
      setError(reportResult.error ?? "Analyse konnte nicht ausgefuehrt werden.");
    }

    if (searchResult.ok && searchResult.data) {
      setMemorySearch(searchResult.data);
    } else if (reportResult.ok) {
      setError(searchResult.error ?? "Analyse wurde erzeugt, aber die Speichersuche ist fehlgeschlagen.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Analyse starten</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Beobachtung in Struktur uebersetzen</h2>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Titel oder Fallkontext" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          <textarea className="min-h-56 rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Beschreibe den Fall so, dass Beobachtung und Interpretation sichtbar bleiben." value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} required />
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Analysiert..." : "Analyse ausfuehren"}</button>
        </div>
        <article className="mt-6 rounded-[28px] bg-slate p-6 text-mist">
          <p className="text-xs uppercase tracking-[0.22em] text-mist/60">Speichersuche</p>
          <div className="mt-4 space-y-3">
            {memorySearch.items.length === 0 ? <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-mist/75">Noch keine verknuepften Speicher-Treffer.</div> : null}
            {memorySearch.items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs text-mist/65">{item.sourceType}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-mist/75">{item.content}</p>
              </div>
            ))}
          </div>
        </article>
      </form>
      <div className="space-y-6">
        {isLoading ? <StatusNotice message="Analyseberichte werden geladen..." /> : null}
        {!isLoading && reports.length === 0 ? <StatusNotice message="Noch keine Analyseberichte vorhanden." /> : null}
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
