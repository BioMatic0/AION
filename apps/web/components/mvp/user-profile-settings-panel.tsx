"use client";

import { useEffect, useState } from "react";
import type { TwoFactorMethod, UserProfileSummary, UserSecuritySummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const twoFactorOptions: Array<{ value: TwoFactorMethod; label: string }> = [
  { value: "authenticator", label: "Authenticator-App" },
  { value: "email", label: "E-Mail-Code" },
  { value: "sms", label: "SMS-Hinweis" }
];

export function UserProfileSettingsPanel() {
  const [security, setSecurity] = useState<UserSecuritySummary | null>(null);
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    email: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [twoFactorForm, setTwoFactorForm] = useState<{
    enabled: boolean;
    method: TwoFactorMethod;
    phoneHint: string;
  }>({
    enabled: false,
    method: "authenticator",
    phoneHint: ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<"profile" | "password" | "two-factor" | null>(null);

  async function loadSecuritySummary() {
    setIsLoading(true);
    const result = await apiRequest<UserSecuritySummary>("/users/security");

    if (result.ok && result.data) {
      setSecurity(result.data);
      setProfileForm({
        displayName: result.data.profile.displayName,
        email: result.data.profile.email
      });
      setTwoFactorForm({
        enabled: result.data.twoFactor.enabled,
        method: result.data.twoFactor.method ?? "authenticator",
        phoneHint: result.data.twoFactor.phoneHint ?? ""
      });
      setStatus("Profil und Kontoschutz sind direkt mit der API verbunden.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "Benutzerprofil konnte nicht geladen werden.");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void loadSecuritySummary();
  }, []);

  function applyProfile(profile: UserProfileSummary) {
    setSecurity((current) =>
      current
        ? {
            ...current,
            profile
          }
        : null
    );
    setProfileForm({
      displayName: profile.displayName,
      email: profile.email
    });
  }

  async function handleProfileSave() {
    setActiveTask("profile");
    setError(null);

    const result = await apiRequest<UserProfileSummary>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify({
        displayName: profileForm.displayName,
        email: profileForm.email
      })
    });

    if (result.ok && result.data) {
      applyProfile(result.data);
      setStatus("Benutzerprofil wurde gespeichert.");
    } else {
      setError(result.error ?? "Benutzerprofil konnte nicht gespeichert werden.");
    }

    setActiveTask(null);
  }

  async function handlePasswordChange() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Neues Passwort und Bestaetigung muessen identisch sein.");
      return;
    }

    setActiveTask("password");
    setError(null);

    const result = await apiRequest<{ success: boolean; profile: UserProfileSummary }>("/users/change-password", {
      method: "POST",
      body: JSON.stringify(passwordForm)
    });

    if (result.ok && result.data?.profile) {
      applyProfile(result.data.profile);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setStatus("Passwort wurde geaendert.");
    } else {
      setError(result.error ?? "Passwort konnte nicht geaendert werden.");
    }

    setActiveTask(null);
  }

  async function handleTwoFactorSave() {
    if (twoFactorForm.enabled && twoFactorForm.method === "sms" && twoFactorForm.phoneHint.trim().length === 0) {
      setError("Fuer SMS muss ein Telefonhinweis hinterlegt werden.");
      return;
    }

    setActiveTask("two-factor");
    setError(null);

    const result = await apiRequest<{
      success: boolean;
      profile: UserProfileSummary;
      twoFactor: UserSecuritySummary["twoFactor"];
    }>("/users/two-factor", {
      method: "PUT",
      body: JSON.stringify({
        enabled: twoFactorForm.enabled,
        method: twoFactorForm.enabled ? twoFactorForm.method : undefined,
        phoneHint: twoFactorForm.enabled ? twoFactorForm.phoneHint : undefined
      })
    });

    if (result.ok && result.data?.profile && result.data.twoFactor) {
      applyProfile(result.data.profile);
      setSecurity((current) =>
        current
          ? {
              ...current,
              profile: result.data!.profile,
              twoFactor: result.data!.twoFactor
            }
          : null
      );
      setTwoFactorForm({
        enabled: result.data.twoFactor.enabled,
        method: result.data.twoFactor.method ?? "authenticator",
        phoneHint: result.data.twoFactor.phoneHint ?? ""
      });
      setStatus("2FA-Vorstruktur wurde aktualisiert.");
    } else {
      setError(result.error ?? "2FA-Vorstruktur konnte nicht gespeichert werden.");
    }

    setActiveTask(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Konto</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Benutzerprofil und Kontoschutz</h2>
          </div>
          {security ? (
            <div className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-slate">
              <div>Aktive Sitzungen: {security.activeSessionCount}</div>
              <div>Alle Sitzungen: {security.sessionCount}</div>
            </div>
          ) : null}
        </div>
        <div className="mt-4 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
          {isLoading ? <StatusNotice message="Benutzerprofil wird geladen..." /> : null}
        </div>
        <div className="mt-6 grid gap-6">
          <section className="rounded-3xl border border-mist bg-mist/35 p-5">
            <h3 className="text-lg font-semibold text-ink">Profil</h3>
            <p className="mt-2 text-sm leading-6 text-slate/75">
              Anzeigename und E-Mail werden pro Nutzer gespeichert und direkt fuer Sitzungen und Zuordnung verwendet.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Anzeigename</span>
                <input
                  value={profileForm.displayName}
                  onChange={(event) => setProfileForm((current) => ({ ...current, displayName: event.target.value }))}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                  placeholder="Patrick Wirth"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">E-Mail</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                  placeholder="patrick@example.com"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate/65">
              {security?.profile.createdAt ? (
                <span className="rounded-full bg-white px-3 py-1">
                  Erstellt: {new Date(security.profile.createdAt).toLocaleString("de-DE")}
                </span>
              ) : null}
              {security?.profile.updatedAt ? (
                <span className="rounded-full bg-white px-3 py-1">
                  Zuletzt aktualisiert: {new Date(security.profile.updatedAt).toLocaleString("de-DE")}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={activeTask !== null}
              className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeTask === "profile" ? "Speichert..." : "Profil speichern"}
            </button>
          </section>

          <section className="rounded-3xl border border-mist bg-mist/35 p-5">
            <h3 className="text-lg font-semibold text-ink">Passwortwechsel</h3>
            <p className="mt-2 text-sm leading-6 text-slate/75">
              Das aktuelle Passwort wird vor jeder Aenderung geprueft. Die Historie wird im Sicherheitsverlauf protokolliert.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Aktuelles Passwort</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Neues Passwort</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Bestaetigung</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                />
              </label>
            </div>
            <div className="mt-4 text-xs text-slate/65">
              {security?.profile.passwordUpdatedAt
                ? `Letzter Passwortwechsel: ${new Date(security.profile.passwordUpdatedAt).toLocaleString("de-DE")}`
                : "Bisher wurde noch kein Passwortwechsel protokolliert."}
            </div>
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={activeTask !== null}
              className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeTask === "password" ? "Aktualisiert..." : "Passwort aendern"}
            </button>
          </section>
        </div>
      </article>

      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">2FA-Vorstruktur</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Mehrstufige Anmeldung vorbereiten</h2>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          Dieser Bereich speichert die bevorzugte 2FA-Methode, ohne bereits echte Verifikationscodes auszuliefern.
          Damit bleibt der naechste Sicherheitsausbau kompatibel.
        </p>
        <div className="mt-6 rounded-3xl border border-mist bg-mist/35 p-5">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate">2FA-Vorstruktur aktivieren</span>
            <input
              type="checkbox"
              checked={twoFactorForm.enabled}
              onChange={(event) =>
                setTwoFactorForm((current) => ({
                  ...current,
                  enabled: event.target.checked
                }))
              }
            />
          </label>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate">Methode</span>
              <select
                value={twoFactorForm.method}
                onChange={(event) =>
                  setTwoFactorForm((current) => ({
                    ...current,
                    method: event.target.value as TwoFactorMethod
                  }))
                }
                disabled={!twoFactorForm.enabled}
                className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50 disabled:bg-mist/40"
              >
                {twoFactorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate">Telefonhinweis fuer SMS</span>
              <input
                value={twoFactorForm.phoneHint}
                onChange={(event) =>
                  setTwoFactorForm((current) => ({ ...current, phoneHint: event.target.value }))
                }
                disabled={!twoFactorForm.enabled || twoFactorForm.method !== "sms"}
                className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50 disabled:bg-mist/40"
                placeholder="z. B. ...1234"
              />
            </label>
          </div>
          <div className="mt-4 rounded-2xl border border-moss/20 bg-white px-4 py-3 text-sm text-slate">
            {security?.twoFactor.note ??
              "Die 2FA-Vorstruktur ist vorbereitet. Echte Challenge-Pruefung folgt spaeter."}
          </div>
          <button
            type="button"
            onClick={handleTwoFactorSave}
            disabled={activeTask !== null}
            className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {activeTask === "two-factor" ? "Speichert..." : "2FA-Vorstruktur speichern"}
          </button>
        </div>
      </article>
    </div>
  );
}
