"use client";

import { getScoreboard, useStore } from "@/lib/orders-store";

export function LiveScoreboard() {
  useStore();
  const scoreboard = getScoreboard();

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-2xl">Placar da noite</h2>
        <span
          className={`chip ${
            scoreboard.live
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {scoreboard.live ? "AO VIVO" : "PAUSADO"}
        </span>
      </div>
      <div className="grid grid-cols-3 items-center gap-2 rounded-2xl bg-foreground p-4 text-background">
        <div className="text-center">
          <div className="text-3xl">{scoreboard.homeFlag}</div>
          <div className="mt-1 text-xs opacity-80">{scoreboard.homeLabel}</div>
        </div>
        <div className="text-center font-display text-4xl tracking-widest">
          {scoreboard.homeScore} - {scoreboard.awayScore}
        </div>
        <div className="text-center">
          <div className="text-3xl">{scoreboard.awayFlag}</div>
          <div className="mt-1 text-xs opacity-80">{scoreboard.awayLabel}</div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {scoreboard.minute} — {scoreboard.period} · {scoreboard.venue}
      </p>
    </section>
  );
}
