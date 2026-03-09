"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { AuthSessionPayload } from "@aion/shared-types";
import { brand } from "@aion/ui";
import { apiRequest } from "../../lib/api";

interface AuthScreenProps {
  mode: "login" | "register";
}

function sanitizeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  if (
    nextPath === "/login" ||
    nextPath.startsWith("/login?") ||
    nextPath === "/register" ||
    nextPath.startsWith("/register?")
  ) {
    return "/dashboard";
  }

  return nextPath;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const next = sanitizeNextPath(searchParams.get("next"));

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const result = await apiRequest<AuthSessionPayload>("/auth/me");
      if (!active || !result.ok || !result.data) {
        return;
      }

      router.replace(next);
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [next, router]);
  const isRegister = mode === "register";

  function submit() {
    setError(null);
    startTransition(async () => {
      const payload = isRegister
        ? { displayName, email, password }
        : { email, password };

      const result = await apiRequest<AuthSessionPayload>(isRegister ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!result.ok || !result.data) {
        setError(result.error ?? "Die Anmeldung konnte nicht abgeschlossen werden.");
        return;
      }

      router.replace(next);
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,139,157,0.2),_transparent_30%),linear-gradient(180deg,_#f1f4f7_0%,_#e8edf2_45%,_#e2e8ee_100%)] px-6 py-10 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <section className="grid w-full gap-10 rounded-[36px] border border-white/10 bg-white/90 p-8 shadow-panel lg:grid-cols-[1.2fr_0.9fr] lg:p-12">
          <div className="space-y-6">
            <p className="font-body text-sm uppercase tracking-[0.32em] text-moss">{brand.name}</p>
            <h1 className="max-w-3xl font-display text-5xl leading-tight sm:text-6xl">
              {isRegister ? "Offenes Konto fuer deinen AION-Arbeitsbereich." : "Anmeldung fuer deinen geschuetzten AION-Arbeitsbereich."}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate/80">
              {isRegister
                ? "Lege ein eigenes Konto an, damit Journal, Ziele, Notizen, Datenschutz und KI-Ausgaben sauber deinem Nutzerprofil zugeordnet werden."
                : "Melde dich mit deinem Konto an, damit deine Daten, Sitzungen und Auswertungen nur in deinem eigenen Kontext geladen werden."}
            </p>
            <div className="rounded-[28px] bg-slate p-6 text-mist">
              <h2 className="font-display text-2xl text-ink">Warum dieser Schritt jetzt wichtig ist</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate/80">
                <li>Eigene Sitzungen statt geteilter lokaler Standardnutzer</li>
                <li>Journal, Tagebuch, Ziele und Notizen werden pro Nutzer getrennt geladen</li>
                <li>Privacy- und Security-Center spiegeln nur deinen eigenen Verlauf</li>
              </ul>
            </div>
          </div>
          <div className="rounded-[28px] bg-white/90 p-6 shadow-panel ring-1 ring-moss/10">
            <div className="space-y-2">
              <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">
                {isRegister ? "Registrierung" : "Anmeldung"}
              </p>
              <h2 className="font-display text-3xl text-ink">
                {isRegister ? "Konto erstellen" : "Anmelden"}
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              {isRegister ? (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate">Anzeigename</span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                    placeholder="Patrick Wirth"
                  />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">E-Mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                  placeholder="patrickwirth_93@icloud.com"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate">Passwort</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-moss/20 px-4 py-3 text-sm outline-none transition focus:border-moss/50"
                  placeholder="Mindestens 12 Zeichen"
                />
              </label>
              {error ? <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ink">{error}</div> : null}
              <button
                type="button"
                onClick={submit}
                disabled={
                  isPending ||
                  email.trim().length === 0 ||
                  password.trim().length < 12 ||
                  (isRegister && displayName.trim().length < 2)
                }
                className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate disabled:cursor-not-allowed disabled:bg-slate/70"
              >
                {isPending ? "Bitte warten..." : isRegister ? "Konto erstellen" : "Anmelden"}
              </button>
            </div>
            <div className="mt-6 text-sm text-slate/80">
              {isRegister ? (
                <p>
                  Bereits registriert?{" "}
                  <Link href="/login" className="font-semibold text-moss hover:text-ink">
                    Zur Anmeldung
                  </Link>
                </p>
              ) : (
                <p>
                  Noch kein Konto?{" "}
                  <Link href="/register" className="font-semibold text-moss hover:text-ink">
                    Jetzt registrieren
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
