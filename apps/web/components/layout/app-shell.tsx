"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AuthSessionPayload } from "@aion/shared-types";
import { brand } from "@aion/ui";
import { apiRequest } from "../../lib/api";
import { groupMeta, groupedSections, type SectionDefinition } from "../../lib/navigation";

interface AppShellProps {
  children: React.ReactNode;
  navigation: SectionDefinition[];
}

export function AppShell({ children, navigation }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState<AuthSessionPayload | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "ready" | "redirecting">("loading");
  const [logoutPending, startLogoutTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const result = await apiRequest<AuthSessionPayload>("/auth/me");
      if (!active) {
        return;
      }

      if (result.ok && result.data) {
        setAuth(result.data);
        setAuthStatus("ready");
        return;
      }

      setAuth(null);
      setAuthStatus("redirecting");
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  function handleLogout() {
    startLogoutTransition(async () => {
      await apiRequest("/auth/logout", { method: "POST" });
      setAuth(null);
      setAuthStatus("redirecting");
      router.replace("/login");
      router.refresh();
    });
  }

  if (authStatus !== "ready" || !auth) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,139,157,0.18),_transparent_32%),linear-gradient(180deg,_#f1f4f7_0%,_#e8edf2_50%,_#e3e8ee_100%)] px-6 py-8 text-ink sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[32px] bg-white/90 p-10 text-center shadow-panel">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{brand.name}</p>
            <h1 className="mt-4 font-display text-4xl">Checking session</h1>
            <p className="mt-4 text-sm leading-7 text-slate/80">
              The workspace only opens with a valid sign-in. If no session is present, you will be redirected
              to the sign-in screen automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeSection = navigation.find((item) => item.href === pathname);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,139,157,0.16),_transparent_24%),linear-gradient(180deg,_#f1f4f7_0%,_#e8edf2_45%,_#e3e8ee_100%)] text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1640px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-96 shrink-0 rounded-[32px] border border-white/10 bg-white/90 p-6 text-mist shadow-panel lg:block">
          <div className="space-y-3 border-b border-white/10 pb-6">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">{brand.name}</p>
            <h1 className="font-display text-3xl leading-tight text-ink">Workspace for structure, reflection, and accountable AI.</h1>
            <p className="font-body text-sm leading-6 text-slate/80">
              A bright, clear workspace for productive use, visible governance, and traceable decisions.
            </p>
          </div>
          <div className="mt-6 rounded-[24px] border border-moss/20 bg-moss/5 p-5">
            <p className="font-body text-xs uppercase tracking-[0.24em] text-moss">Active track</p>
            <h2 className="mt-2 font-display text-2xl text-ink">{activeSection?.label ?? "Workspace"}</h2>
            <p className="mt-3 text-sm leading-6 text-slate/80">{activeSection?.description ?? "Loaded from the navigation."}</p>
          </div>
          <nav className="mt-8 space-y-6">
            {Object.entries(groupMeta).map(([groupKey, meta]) => (
              <div key={groupKey} className="space-y-3">
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.26em] text-moss">{meta.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate/75">{meta.description}</p>
                </div>
                <div className="space-y-2">
                  {groupedSections[groupKey as keyof typeof groupedSections].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? "border-ember/20 bg-ember/10 text-ink"
                            : "border-white/10 bg-mist/40 text-mist/80 hover:border-moss/30 hover:bg-mist/70"
                        }`}
                      >
                        <div className="font-body text-sm font-semibold">{item.label}</div>
                        <div className="mt-1 text-xs leading-5 text-slate/75">{item.description}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="rounded-[32px] border border-white/10 bg-white/90 px-6 py-5 shadow-panel backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">AION workspace</p>
                <h2 className="font-display text-3xl text-ink">Connected product areas with visible accountability</h2>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-slate">
                  <div className="font-semibold text-ink">{auth.user.displayName}</div>
                  <div className="text-xs text-slate/75">{auth.user.email}</div>
                </div>
                <div className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-slate">
                  Active area: <span className="font-semibold">{activeSection?.label ?? pathname}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutPending}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate disabled:cursor-not-allowed disabled:bg-slate/70"
                >
                  {logoutPending ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="rounded-[28px] border border-white/10 bg-white/90 px-6 py-4 text-sm text-slate shadow-panel">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>Copyright (c) 2026 Patrick Wirth. Released under the AION Community Fairness License 1.0 and open to collaborative stewardship.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contribute" className="font-semibold text-moss hover:text-ink">
                  Contribute
                </Link>
                <Link href="/ethik" className="font-semibold text-moss hover:text-ink">
                  Ethics
                </Link>
                <Link href="/authenticity" className="font-semibold text-moss hover:text-ink">
                  Authenticity &amp; Sources
                </Link>
                <Link href="/rechtliches" className="font-semibold text-moss hover:text-ink">
                  Legal
                </Link>
                <Link href="/impressum" className="font-semibold text-moss hover:text-ink">
                  Impressum
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
