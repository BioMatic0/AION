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
        failures.push(journalResult.error ?? "Journal konnte nicht geladen werden.");
      }
      if (!diaryResult.ok) {
        failures.push(diaryResult.error ?? "Tagebuch konnte nicht geladen werden.");
      }
      if (!notesResult.ok) {
        failures.push(notesResult.error ?? "Notizen konnten nicht geladen werden.");
      }
      if (!goalsResult.ok) {
        failures.push(goalsResult.error ?? "Ziele konnten nicht geladen werden.");
      }

      setSnapshot({
        journalCount: journalResult.data?.length ?? 0,
        diaryCount: diaryResult.data?.length ?? 0,
        notesCount: notesResult.data?.length ?? 0,
        averageGoalProgress: goalsResult.data?.stats.averageProgress ?? 0
      });

      setError(failures.length > 0 ? failures.join(" ") : null);
      setStatus(failures.length === 0 ? "Dashboard zeigt Live-Zahlen aus der API." : null);
      setIsLoading(false);
    })();
  }, []);

  const cards = [
    {
      title: "Journal",
      href: "/journal",
      value: snapshot.journalCount,
      description: "aktive Eintraege fuer Analyse und Spiegelung"
    },
    {
      title: "Tagebuch",
      href: "/diary",
      value: snapshot.diaryCount,
      description: "taegliche Reflexionspunkte mit Prompt-Struktur"
    },
    {
      title: "Notizen",
      href: "/notes",
      value: snapshot.notesCount,
      description: "lose Gedanken, die spaeter zu Systemwissen werden"
    },
    {
      title: "Ziele",
      href: "/goals",
      value: `${snapshot.averageGoalProgress}%`,
      description: "durchschnittlicher Fortschritt ueber aktive Ziele"
    }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Aktueller MVP-Stand</p>
        <h2 className="mt-3 font-display text-3xl text-ink">Das System arbeitet jetzt auf echter Runtime-Basis.</h2>
        <p className="mt-4 text-base leading-8 text-slate/80">
          Journal, Tagebuch, Notizen, Ziele und die Governance-Sicht werden ueber die API geladen. Lokale Demo-Daten sind nicht mehr die Laufzeitquelle.
        </p>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
          {isLoading ? <StatusNotice message="Dashboard-Zahlen werden geladen..." /> : null}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="rounded-2xl border border-mist bg-mist/40 p-5 transition hover:border-moss/30 hover:bg-mist/70">
              <div className="font-body text-xs uppercase tracking-[0.24em] text-moss">{card.title}</div>
              <div className="mt-3 text-3xl font-semibold text-ink">{card.value}</div>
              <p className="mt-3 text-sm leading-6 text-slate/75">{card.description}</p>
            </Link>
          ))}
        </div>
      </article>
      <article className="rounded-[28px] bg-slate p-8 text-mist shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">Aktueller Fokus</p>
        <h2 className="mt-3 font-display text-3xl">API-first und echte Produktpfade</h2>
        <ul className="mt-6 space-y-4 text-sm leading-7 text-mist/80">
          <li>Die Kernbereiche laufen nicht mehr auf lokale UI-Scheinzustande zurueck.</li>
          <li>Frontend-Fehler und API-Fehler sind jetzt sichtbar statt versteckt.</li>
          <li>Der naechste Schritt ist semantische Suche mit echter Embeddings-Pipeline.</li>
        </ul>
      </article>
    </div>
  );
}
