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
    pending: "Pending",
    in_progress: "In progress",
    completed: "Completed"
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
        setStatus("Goals are connected live to the API.");
      }
      setError(null);
    } else {
      if (!options?.silentSuccess) {
        setStatus(null);
      }
      setError(result.error ?? "Goals could not be loaded.");
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
      setStatus("Goal was created.");
    } else {
      setError(result.error ?? "Goal could not be created.");
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
      setStatus(`Goal "${goal.title}" was marked as achieved.`);
    } else {
      setError(result.error ?? `Goal "${goal.title}" could not be updated.`);
    }

    setActiveGoalId(null);
  }

  const columns: Array<{ title: string; status: GoalSummary["status"] }> = [
    { title: "Open", status: "open" },
    { title: "Active", status: "active" },
    { title: "Achieved", status: "achieved" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Total</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.total}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Active</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.active}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Completed</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.completed}</div></div>
        <div className="rounded-[28px] bg-white p-6 shadow-panel"><div className="text-xs uppercase tracking-[0.22em] text-moss">Average</div><div className="mt-3 text-3xl font-semibold text-ink">{data.stats.averageProgress}%</div></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Create goal</p>
          <h2 className="mt-2 font-display text-3xl text-ink">New goal</h2>
          <div className="mt-6 space-y-3">
            {status ? <StatusNotice message={status} variant="success" /> : null}
            {error ? <StatusNotice message={error} variant="error" /> : null}
          </div>
          <div className="mt-6 grid gap-4">
            <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            <textarea className="min-h-32 rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="What should really be achieved?" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Life area" value={form.lifeArea} onChange={(event) => setForm((current) => ({ ...current, lifeArea: event.target.value }))} required />
              <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
            </div>
            <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Creating..." : "Create goal"}</button>
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
                {isLoading ? <StatusNotice message="Goals are loading..." /> : null}
                {!isLoading && data.items.filter((goal) => goal.status === column.status).length === 0 ? <StatusNotice message={`No goals are in the ${column.title} state yet.`} /> : null}
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
                        <span>{goal.progressPercent}% progress</span>
                        {goal.status !== "achieved" ? (
                          <button
                            type="button"
                            onClick={() => markAchieved(goal)}
                            disabled={activeGoalId === goal.id}
                            className="rounded-full bg-white px-3 py-1 text-slate transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {activeGoalId === goal.id ? "Updating..." : "Mark as achieved"}
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
