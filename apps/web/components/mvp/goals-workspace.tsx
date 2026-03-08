"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GoalsResponse, GoalSummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const initialForm = {
  title: "",
  description: "",
  lifeArea: "development",
  dueDate: ""
};

const emptyGoalsResponse: GoalsResponse = {
  items: [],
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    averageProgress: 0,
    completionRate: 0
  }
};

function formatMilestoneStatus(status: GoalSummary["milestones"][number]["status"]) {
  const map: Record<GoalSummary["milestones"][number]["status"], string> = {
    pending: "Ausstehend",
    in_progress: "In Bearbeitung",
    completed: "Abgeschlossen"
  };

  return map[status];
}

export function GoalsWorkspace() {
  const [data, setData] = useState<GoalsResponse>(emptyGoalsResponse);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  async function loadGoals(options?: { silentSuccess?: boolean }) {
    setIsLoading(true);
    const result = await apiRequest<GoalsResponse>("/goals");

    if (result.ok && result.data) {
      setData(result.data);
      if (!options?.silentSuccess) {
        setStatus("Ziele sind live mit der API verbunden.");
      }
      setError(null);
    } else {
      if (!options?.silentSuccess) {
        setStatus(null);
      }
      setError(result.error ?? "Ziele konnten nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadGoals();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<GoalSummary>("/goals", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        lifeArea: form.lifeArea,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        goalType: "project",
        priority: "high",
        status: "open",
        progressPercent: 0
      })
    });

    if (result.ok && result.data) {
      setForm(initialForm);
      await loadGoals({ silentSuccess: true });
      setStatus("Ziel wurde angelegt.");
    } else {
      setError(result.error ?? "Ziel konnte nicht angelegt werden.");
    }

    setIsSubmitting(false);
  }

  async function markAchieved(goal: GoalSummary) {
    setActiveGoalId(goal.id);
    setError(null);
    setStatus(null);

    const result = await apiRequest<GoalSummary>(`/goals/${goal.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "achieved", progressPercent: 100 })
    });

    if (result.ok && result.data) {
      await loadGoals({ silentSuccess: true });
      setStatus(`Ziel "${goal.title}" wurde als erreicht markiert.`);
    } else {
      setError(result.error ?? `Ziel "${goal.title}" konnte nicht aktualisiert werden.`);
    }

    setActiveGoalId(null);
  }

  const columns: Array<{ title: string; status: GoalSummary["status"] }> = [
    { title: "Offen", status: "open" },
    { title: "Aktiv", status: "active" },
    { title: "Erreicht", status: "achieved" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Gesamt</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.total}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Aktiv</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.active}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Abgeschlossen</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.completed}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Durchschnitt</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.averageProgress}%</div></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Ziel anlegen</p>
          <h2 className="mt-2 font-display text-3xl text-ink">Neues Ziel</h2>
          <div className="mt-6 space-y-3">
            {status ? <StatusNotice message={status} variant="success" /> : null}
            {error ? <StatusNotice message={error} variant="error" /> : null}
          </div>
          <div className="mt-6 grid gap-4">
            <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Titel" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            <textarea className="min-h-32 rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Was soll wirklich erreicht werden?" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Lebensbereich" value={form.lifeArea} onChange={(event) => setForm((current) => ({ ...current, lifeArea: event.target.value }))} required />
              <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
            </div>
            <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Legt an..." : "Ziel anlegen"}</button>
          </div>
        </form>
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <article key={column.title} className="rounded-[28px] bg-white p-6 shadow-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-moss">{column.title}</p>
                  <h2 className="mt-2 font-display text-2xl text-ink">{data.items.filter((goal) => goal.status === column.status).length}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {isLoading ? <StatusNotice message="Ziele werden geladen..." /> : null}
                {!isLoading && data.items.filter((goal) => goal.status === column.status).length === 0 ? <StatusNotice message={`Noch keine Ziele im Status ${column.title}.`} /> : null}
                {data.items
                  .filter((goal) => goal.status === column.status)
                  .map((goal) => (
                    <div key={goal.id} className="rounded-3xl border border-mist bg-mist/35 p-4">
                      <h3 className="text-lg font-semibold text-ink">{goal.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate/80">{goal.description}</p>
                      <div className="mt-4 h-2 rounded-full bg-white">
                        <div className="h-2 rounded-full bg-ember" style={{ width: `${goal.progressPercent}%` }} />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate/65">
                        <span>{goal.progressPercent}% Fortschritt</span>
                        {goal.status !== "achieved" ? (
                          <button
                            type="button"
                            onClick={() => markAchieved(goal)}
                            disabled={activeGoalId === goal.id}
                            className="rounded-full bg-white px-3 py-1 text-slate transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {activeGoalId === goal.id ? "Aktualisiert..." : "Als erreicht markieren"}
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-4 space-y-2">
                        {goal.milestones.map((milestone) => (
                          <div key={milestone.id} className="rounded-2xl bg-white px-3 py-2 text-xs text-slate/70">
                            {milestone.title} - {formatMilestoneStatus(milestone.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
