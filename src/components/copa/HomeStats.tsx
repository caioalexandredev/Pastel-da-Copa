"use client";

import { getOrders, getScoreboard, getSides, useStore } from "@/lib/orders-store";
import { Flame, Timer, Trophy } from "lucide-react";

export function HomeStats() {
  useStore();
  const sides = getSides().filter((side) => side.active);
  const delivered = getOrders().filter((order) => order.status === "Entregue").length;
  const scoreboard = getScoreboard();

  return (
    <section className="mt-6 grid grid-cols-3 gap-3">
      {[
        { icon: Flame, label: "Recheios", value: String(sides.length) },
        { icon: Timer, label: "Tempo médio", value: scoreboard.prepTimeLabel },
        { icon: Trophy, label: "Entregues", value: String(delivered) },
      ].map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)]"
        >
          <Icon className="mx-auto h-5 w-5 text-primary" />
          <div className="mt-1 font-display text-2xl">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      ))}
    </section>
  );
}
