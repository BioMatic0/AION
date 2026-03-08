"use client";

import { FormEvent, useEffect, useState } from "react";
import type { JournalEntryRecord } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const initialForm: {
  title: string;
  content: string;
  entryType: JournalEntryRecord["entryType"];
  mood: string;
} = {
  title: "",
  content: "",
  entryType: "journal",
  mood: ""
};

export function JournalWorkspace() {
  const [entries, setEntries] = useState<JournalEntryRecord[]>([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadEntries() {
    setIsLoading(true);
    const result = await apiRequest<JournalEntryRecord[]>("/journal");

    if (result.ok && result.data) {
      setEntries(result.data);
      setStatus("Journal ist live mit der API verbunden.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Journal konnte nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<JournalEntryRecord>("/journal", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        entryType: form.entryType,
        mood: form.mood || undefined,
        intensity: 6
      })
    });

    if (result.ok && result.data) {
      setEntries((current) => [result.data as JournalEntryRecord, ...current]);
      setForm(initialForm);
      setStatus("Neuer Journal-Eintrag wurde gespeichert.");
    } else {
      setError(result.error ?? "Journal-Eintrag konnte nicht gespeichert werden.");
    }

    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Capture</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Neuer Journal-Eintrag</h2>
          </div>
          <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-xs text-slate">{entries.length} Eintraege</div>
        </div>
        <div className="mt-4 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <div className="mt-6 grid gap-4">
          <input
            className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss"
            placeholder="Titel"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
          <div className="grid gap-4 md:grid-cols-[0.7fr_0.3fr]">
            <input
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss"
              placeholder="Stimmung"
              value={form.mood}
              onChange={(event) => setForm((current) => ({ ...current, mood: event.target.value }))}
            />
            <select
              className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss"
              value={form.entryType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  entryType: event.target.value as JournalEntryRecord["entryType"]
                }))
              }
            >
              <option value="journal">Journal</option>
              <option value="diary">Diary</option>
              <option value="note">Note</option>
            </select>
          </div>
          <textarea
            className="min-h-48 rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss"
            placeholder="Was ist beobachtbar, was ist Deutung und was braucht spaeter die Spiegelung?"
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Speichert..." : "Eintrag erfassen"}
          </button>
        </div>
      </form>
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Recent entries</p>
        <div className="mt-6 space-y-4">
          {isLoading ? <StatusNotice message="Journal-Eintraege werden geladen..." /> : null}
          {!isLoading && entries.length === 0 ? <StatusNotice message="Noch keine Journal-Eintraege vorhanden." /> : null}
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{entry.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-moss">{entry.entryType}</p>
                </div>
                <div className="text-xs text-slate/60">{new Date(entry.createdAt).toLocaleString("de-DE")}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate/80">{entry.content}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate/65">
                {entry.mood ? <span className="rounded-full bg-white px-3 py-1">Mood: {entry.mood}</span> : null}
                {entry.intensity ? <span className="rounded-full bg-white px-3 py-1">Intensity: {entry.intensity}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
