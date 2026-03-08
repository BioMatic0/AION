"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@aion/ui";
import type { SectionDefinition } from "../../lib/navigation";

interface AppShellProps {
  children: React.ReactNode;
  navigation: SectionDefinition[];
}

export function AppShell({ children, navigation }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-80 shrink-0 rounded-[28px] bg-slate p-6 text-mist shadow-panel lg:block">
          <div className="space-y-3">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-mist/60">{brand.name}</p>
            <h1 className="font-display text-3xl leading-tight">Adaptive Intelligenz fuer Ordnung, Navigation und Bewusstseinsmuster.</h1>
            <p className="font-body text-sm leading-6 text-mist/75">MVP-Fundament fuer die AION-Plattform mit klarer Governance, Datenschutz by Design und modularen Ausbaupfaden.</p>
          </div>
          <nav className="mt-10 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl border px-4 py-3 transition ${
                    isActive
                      ? "border-ember bg-ember/10 text-white"
                      : "border-white/10 bg-white/5 text-mist/80 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="font-body text-sm font-semibold">{item.label}</div>
                  <div className="mt-1 text-xs leading-5 text-inherit/75">{item.description}</div>
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="rounded-[28px] bg-white px-6 py-5 shadow-panel">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.28em] text-moss">AION Aufbauphase</p>
                <h2 className="font-display text-3xl text-ink">Monorepo-Fundament im Ausbau</h2>
              </div>
              <div className="rounded-2xl border border-moss/20 bg-moss/5 px-4 py-3 text-sm text-slate">
                Aktiver Bereich: <span className="font-semibold">{pathname}</span>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="rounded-[28px] bg-white px-6 py-4 text-sm text-slate shadow-panel">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>Copyright (c) 2026 Patrick Wirth. Veroeffentlicht unter der MIT License und offen fuer Mitgestaltung.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/rechtliches" className="font-semibold text-moss hover:text-ink">
                  Rechtliches
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
