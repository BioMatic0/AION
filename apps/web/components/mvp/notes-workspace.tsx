"use client";

import { FormEvent, useEffect, useState } from "react";
import type { NoteSummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const initialForm = {
  title: "",
  content: "",
  category: "ideas",
  tags: ""
};

export function NotesWorkspace() {
  const [notes, setNotes] = useState<NoteSummary[]>([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadNotes() {
    setIsLoading(true);
    const result = await apiRequest<NoteSummary[]>("/notes");

    if (result.ok && result.data) {
      setNotes(result.data);
      setStatus("Notizen sind live mit der API verbunden.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Notizen konnten nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadNotes();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const result = await apiRequest<NoteSummary>("/notes", {
      method: "POST",
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isPinned: false,
        sourceType: "manual"
      })
    });

    if (result.ok && result.data) {
      setNotes((current) => [result.data as NoteSummary, ...current]);
      setForm(initialForm);
      setStatus("Notiz wurde gespeichert.");
    } else {
      setError(result.error ?? "Notiz konnte nicht gespeichert werden.");
    }

    setIsSubmitting(false);
  }

  const pinned = notes.filter((note) => note.isPinned);
  const remaining = notes.filter((note) => !note.isPinned);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Schnellerfassung</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Notiz erfassen</h2>
        <div className="mt-6 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
        </div>
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Titel" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Kategorie" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
          <input className="rounded-2xl border border-mist bg-mist/50 px-4 py-3 text-sm outline-none focus:border-moss" placeholder="Tags, komma-getrennt" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
          <textarea className="min-h-40 rounded-3xl border border-mist bg-mist/50 px-4 py-4 text-sm leading-7 outline-none focus:border-moss" placeholder="Lose Gedanken, Ideen oder Umsetzungsnotizen" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} required />
          <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Sichert..." : "Notiz sichern"}</button>
        </div>
      </form>
      <div className="space-y-6">
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Angepinnt</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Wichtige Notizen</h2>
            </div>
            <div className="rounded-full border border-moss/20 bg-moss/5 px-4 py-2 text-xs text-slate">{pinned.length} angepinnt</div>
          </div>
          <div className="mt-6 space-y-4">
            {isLoading ? <StatusNotice message="Notizen werden geladen..." /> : null}
            {!isLoading && pinned.length === 0 ? <StatusNotice message="Noch keine angepinnten Notizen vorhanden." /> : null}
            {pinned.map((note) => (
              <div key={note.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <h3 className="text-lg font-semibold text-ink">{note.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate/80">{note.content}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[28px] bg-white p-8 shadow-panel">
          <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Alle Notizen</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {!isLoading && remaining.length === 0 ? <StatusNotice message="Noch keine weiteren Notizen vorhanden." /> : null}
            {remaining.map((note) => (
              <div key={note.id} className="rounded-3xl border border-mist bg-mist/35 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">{note.title}</h3>
                  <span className="text-xs text-slate/60">{note.category}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate/80">{note.content}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate/65">
                  {note.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
