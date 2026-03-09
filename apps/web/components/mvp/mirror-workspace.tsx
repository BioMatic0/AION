"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MirrorReport } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { ReportCard } from "./report-card";
import { StatusNotice } from "./status-notice";

export function MirrorWorkspace() {
  const [reports, setReports] = useState<MirrorReport[]>([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadReports() {
    setIsLoading(true);
    const result = await apiRequest<MirrorReport[]>("/mirror");

    if (result.ok && result.data) {
      setReports(result.data);
      setStatus("Mirror reports are loading live from the API.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Mirror reports could not be loaded.");
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

    const result = await apiRequest<MirrorReport>("/mirror/run", {
      method: "POST",
      body: JSON.stringify({ content, context: reports.slice(0, 2).map((report) => report.summary) })
    });

    if (result.ok && result.data) {
      setReports((current) => [result.data as MirrorReport, ...current]);
      setContent("");
      setStatus("Mirror report was generated.");
    } else {
      setError(result.error ?? "Mirror mode could not be executed.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Mirror mode</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Force a counter-perspective</h2>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <textarea
          className="mt-6 min-h-44 w-full rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss"
          placeholder="Describe the situation that should be tested rather than confirmed."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Reviewing..." : "Run mirror mode"}
        </button>
      </form>
      {isLoading ? <StatusNotice message="Mirror reports are loading..." /> : null}
      {!isLoading && reports.length === 0 ? <StatusNotice message="No mirror reports are available yet." /> : null}
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
