"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, ListChecks, Settings } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Início", icon: Home },
  { to: "/pedido", label: "Pedir", icon: ClipboardList },
  { to: "/meus-pedidos", label: "Pedidos", icon: ListChecks },
  { to: "/admin", label: "Admin", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar />
      <main className="mx-auto w-full max-w-2xl px-4 pt-4">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2 py-2">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                href={to}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <BallLogo />
          <div className="leading-tight">
            <div className="font-display text-lg tracking-wide">PASTEL COPA</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              edição mundial
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <span className="h-3 w-2 rounded-sm bg-primary" />
          <span className="h-3 w-2 rounded-sm bg-secondary" />
          <span className="h-3 w-2 rounded-sm bg-accent" />
        </div>
      </div>
    </header>
  );
}

export function BallLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`relative grid place-items-center rounded-full bg-foreground text-background ${className}`}
    >
      <span className="text-base">⚽</span>
    </div>
  );
}
