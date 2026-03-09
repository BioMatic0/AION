"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DiaryEntrySummary, GoalsResponse, JournalEntryRecord, NoteSummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

interface DashboardSnapshot {
  journalCount: number;
  diaryCount: number;
  notesCount: number;
  averageGoalProgress: number;
}

export function DashboardOverview() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>({
    journalCount: 0,
    diaryCount: 0,
    notesCount: 0,
    averageGoalProgress: 0
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      const [journalResult, diaryResult, notesResult, goalsResult] = await Promise.all([
        apiRequest<JournalEntryRecord[]>("/journal"),
        apiRequest<DiaryEntrySummary[]>("/diary"),
        apiRequest<NoteSummary[]>("/notes"),
        apiRequest<GoalsResponse>("/goals")
      ]);

      const failures: string[] = [];

      if (!journalResult.ok) {
        failures.push(journalResult.error ?? "Journal could not be loaded.");
      }
      if (!diaryResult.ok) {
        failures.push(diaryResult.error ?? "Diary could not be loaded.");
      }
      if (!notesResult.ok) {
        failures.push(notesResult.error ?? "Notes could not be loaded.");
      }
      if (!goalsResult.ok) {
        failures.push(goalsResult.error ?? "Goals could not be loaded.");
      }

      setSnapshot({
        journalCount: journalResult.data?.length ?? 0,
        diaryCount: diaryResult.data?.length ?? 0,
        notesCount: notesResult.data?.length ?? 0,
        averageGoalProgress: goalsResult.data?.stats.averageProgress ?? 0
      });

      setError(failures.length > 0 ? failures.join(" ") : null);
      setStatus(failures.length === 0 ? "Dashboard is showing live values from the API." : null);
      setIsLoading(false);
    })();
  }, []);

  const cards = [
    {
      title: "Journal",
      href: "/journal",
      value: snapshot.journalCount,
      description: "Active entries for analysis and mirror work"
    },
    {
      title: "Diary",
      href: "/diary",
      value: snapshot.diaryCount,
      description: "Daily reflection points with prompt structure"
    },
    {
      title: "Notes",
      href: "/notes",
      value: snapshot.notesCount,
      description: "Loose thoughts that can later become system knowledge"
    },
    {
      title: "Goals",
      href: "/goals",
      value: `${snapshot.averageGoalProgress}%`,
      description: "Average progress across active goals"
    }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Current MVP state</p>
        <h2 className="mt-3 font-display text-3xl text-ink">The system now runs on a real runtime foundation.</h2>
        <p className="mt-4 text-base leading-8 text-slate/80">
          Journal, diary, notes, goals, and the governance view are loaded through the API. Local demo data is no longer the runtime source.
        </p>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
          {isLoading ? <StatusNotice message="Dashboard metrics are loading..." /> : null}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              data-testid={`dashboard-card-${card.href.slice(1)}`}
              className="rounded-2xl border border-mist bg-mist/40 p-5 transition hover:border-moss/30 hover:bg-mist/70"
            >
              <div className="font-body text-xs uppercase tracking-[0.24em] text-moss">{card.title}</div>
              <div className="mt-3 text-3xl font-semibold text-ink">{card.value}</div>
              <p className="mt-3 text-sm leading-6 text-slate/75">{card.description}</p>
            </Link>
          ))}
        </div>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Connected areas</p>
        <h2 className="mt-3 font-display text-3xl text-ink">Work, AI, and governance paths are connected.</h2>
        <div className="mt-6 grid gap-4">
          <Link href="/analysis" className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-4 text-sm text-slate transition hover:border-moss/40">
            <span className="block font-semibold text-ink">Analysis and mirror</span>
            <span className="mt-1 block leading-6">Entries from the journal and diary connect directly to analysis, mirror work, and growth.</span>
          </Link>
          <Link href="/governance" className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-4 text-sm text-slate transition hover:border-moss/40">
            <span className="block font-semibold text-ink">Governance and ethics</span>
            <span className="mt-1 block leading-6">Policies, legal context, ethics, and privacy remain visible as independent control surfaces.</span>
          </Link>
          <Link href="/ethik" className="rounded-2xl border border-moss/20 bg-white/80 px-4 py-4 text-sm text-slate transition hover:border-moss/40">
            <span className="block font-semibold text-ink">Risk analysis</span>
            <span className="mt-1 block leading-6">Product areas are assessed through concrete risks, safeguards, and next-step planning.</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
