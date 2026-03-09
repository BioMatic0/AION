"use client";

import { useEffect, useState } from "react";
import type { TwoFactorMethod, UserProfileSummary, UserSecuritySummary } from "@aion/shared-types";
import { apiRequest } from "../../lib/api";
import { StatusNotice } from "./status-notice";

const twoFactorOptions: Array<{ value: TwoFactorMethod; label: string }> = [
  { value: "authenticator", label: "Authenticator-App" },
  { value: "email", label: "Email code" },
  { value: "sms", label: "SMS hint" }
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
      setStatus("Profile and account protection are connected directly to the API.");
      setError(null);
    } else {
      setStatus(null);
      setError(result.error ?? "User profile could not be loaded.");
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
      setStatus("User profile was saved.");
    } else {
      setError(result.error ?? "User profile could not be saved.");
    }

    setActiveTask(null);
  }

  async function handlePasswordChange() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirmation must match.");
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
      setStatus("Password was changed.");
    } else {
      setError(result.error ?? "Password could not be changed.");
    }

    setActiveTask(null);
  }

  async function handleTwoFactorSave() {
    if (twoFactorForm.enabled && twoFactorForm.method === "sms" && twoFactorForm.phoneHint.trim().length === 0) {
      setError("A phone hint is required for SMS.");
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
      setStatus("The 2FA scaffold was updated.");
    } else {
      setError(result.error ?? "The 2FA scaffold could not be saved.");
    }

    setActiveTask(null);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">Account</p>
            <h2 className="mt-2 font-display text-3xl text-ink">User profile and account protection</h2>
          </div>
          {security ? (
            <div className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-slate">
              <div>Active sessions: {security.activeSessionCount}</div>
              <div>All sessions: {security.sessionCount}</div>
            </div>
          ) : null}
        </div>
        <div className="mt-4 space-y-3">
          {status ? <StatusNotice message={status} variant="success" /> : null}
          {error ? <StatusNotice message={error} variant="error" /> : null}
          {isLoading ? <StatusNotice message="User profile is loading..." /> : null}
        </div>
        <div className="mt-6 grid gap-6">
          <section className="rounded-3xl border border-mist bg-mist/35 p-5">
            <h3 className="text-lg font-semibold text-ink">Profile</h3>
            <p className="mt-2 text-sm leading-6 text-slate/75">
              Display name and email are stored per user and used directly for sessions and data ownership.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Display name</span>
                <input
                  value={profileForm.displayName}
                  onChange={(event) => setProfileForm((current) => ({ ...current, displayName: event.target.value }))}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                  placeholder="Patrick Wirth"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Email</span>
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
                  Created: {new Date(security.profile.createdAt).toLocaleString("en-GB")}
                </span>
              ) : null}
              {security?.profile.updatedAt ? (
                <span className="rounded-full bg-white px-3 py-1">
                  Last updated: {new Date(security.profile.updatedAt).toLocaleString("en-GB")}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleProfileSave}
              disabled={activeTask !== null}
              className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeTask === "profile" ? "Saving..." : "Save profile"}
            </button>
          </section>

          <section className="rounded-3xl border border-mist bg-mist/35 p-5">
            <h3 className="text-lg font-semibold text-ink">Password change</h3>
            <p className="mt-2 text-sm leading-6 text-slate/75">
              The current password is verified before every change. The history is logged in the security timeline.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Current password</span>
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
                <span className="mb-2 block text-sm font-semibold text-slate">New password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Confirmation</span>
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
                ? `Last password change: ${new Date(security.profile.passwordUpdatedAt).toLocaleString("en-GB")}`
                : "No password change has been recorded yet."}
            </div>
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={activeTask !== null}
              className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {activeTask === "password" ? "Updating..." : "Change password"}
            </button>
          </section>
        </div>
      </article>

      <article className="rounded-[28px] bg-white p-8 shadow-panel">
        <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">2FA scaffold</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Prepare multi-step sign-in</h2>
        <p className="mt-4 text-sm leading-7 text-slate/80">
          This area stores the preferred 2FA method without providing real verification codes yet.
          That keeps the next security expansion compatible.
        </p>
        <div className="mt-6 rounded-3xl border border-mist bg-mist/35 p-5">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate">Enable 2FA scaffold</span>
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
              <span className="mb-2 block text-sm font-semibold text-slate">Method</span>
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
              <span className="mb-2 block text-sm font-semibold text-slate">Phone hint for SMS</span>
              <input
                value={twoFactorForm.phoneHint}
                onChange={(event) =>
                  setTwoFactorForm((current) => ({ ...current, phoneHint: event.target.value }))
                }
                disabled={!twoFactorForm.enabled || twoFactorForm.method !== "sms"}
                className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50 disabled:bg-mist/40"
                placeholder="e.g. ...1234"
              />
            </label>
          </div>
          <div className="mt-4 rounded-2xl border border-moss/20 bg-white px-4 py-3 text-sm text-slate">
            {security?.twoFactor.note ??
              "The 2FA scaffold is ready. Real challenge verification will follow later."}
          </div>
          <button
            type="button"
            onClick={handleTwoFactorSave}
            disabled={activeTask !== null}
            className="mt-5 rounded-2xl bg-slate px-5 py-3 text-sm font-semibold text-mist transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {activeTask === "two-factor" ? "Saving..." : "Save 2FA scaffold"}
          </button>
        </div>
      </article>
    </div>
  );
}
