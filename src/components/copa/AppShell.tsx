"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, ListChecks } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Início", icon: Home },
  { to: "/pedido", label: "Pedir", icon: ClipboardList },
  { to: "/meus-pedidos", label: "Pedidos", icon: ListChecks },
] as const;

export function AppShell({ children, locked = false }: { children: ReactNode; locked?: boolean }) {
  const pathname = usePathname();
  return (
    <div className={`min-h-screen bg-background ${locked ? "pb-6" : "pb-24"}`}>
      <TopBar locked={locked} />
      <main className="mx-auto w-full max-w-2xl px-4 pt-4">{children}</main>
      {!locked && (
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
      )}
    </div>
  );
}

function TopBar({ locked }: { locked: boolean }) {
  const brand = (
    <>
      <BallLogo />
      <div className="leading-tight">
        <div className="font-display text-lg tracking-wide">PASTEL COPA</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          edição mundial
        </div>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {locked ? (
          <div className="flex items-center gap-2">{brand}</div>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            {brand}
          </Link>
        )}
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
