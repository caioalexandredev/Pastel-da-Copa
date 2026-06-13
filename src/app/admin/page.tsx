"use client";

import { useState } from "react";
import { AppShell } from "@/components/copa/AppShell";
import { StatusBadge, StatusBar } from "@/components/copa/StatusBadge";
import {
  STATUS_FLOW,
  addSide,
  getOrders,
  getSides,
  toggleSide,
  updateOrderStatus,
  useStore,
  type Order,
  type OrderStatus,
} from "@/lib/orders-store";
import { Check, ChevronRight, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  useStore();
  const [tab, setTab] = useState<"fila" | "acomps">("fila");
  const orders = getOrders()
    .filter((order) => order.status !== "Entregue")
    .sort((a, b) => a.createdAt - b.createdAt);
  const delivered = getOrders().filter((order) => order.status === "Entregue").length;

  return (
    <AppShell>
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Cozinha · ao vivo
        </div>
        <h1 className="font-display text-4xl">Painel Admin</h1>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Na fila" value={orders.length} tone="primary" />
        <Stat label="Entregues" value={delivered} tone="accent" />
        <Stat label="Total" value={orders.length + delivered} tone="secondary" />
      </div>

      <div className="mt-5 inline-flex w-full rounded-2xl border border-border bg-card p-1">
        {(["fila", "acomps"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              tab === item ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            }`}
          >
            {item === "fila" ? "Fila de Pedidos" : "Acompanhamentos"}
          </button>
        ))}
      </div>

      <div className="mt-5">{tab === "fila" ? <Queue orders={orders} /> : <SidesAdmin />}</div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "accent" | "secondary";
}) {
  const map = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };
  return (
    <div className={`rounded-2xl ${map[tone]} p-3 text-center`}>
      <div className="font-display text-3xl">{value}</div>
      <div className="text-[10px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

function Queue({ orders }: { orders: Order[] }) {
  if (orders.length === 0)
    return (
      <div className="rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Sem pedidos na fila. Tudo entregue! 🏆
      </div>
    );

  return (
    <ul className="space-y-3">
      {orders.map((order, index) => {
        const nextStatus =
          STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(order.status) + 1, STATUS_FLOW.length - 1)];
        const isFirst = index === 0;
        return (
          <li
            key={order.id}
            className={`rounded-3xl border bg-card p-4 shadow-[var(--shadow-card)] ${
              isFirst ? "border-primary ring-2 ring-primary/30" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {isFirst && (
                  <span className="chip bg-primary text-primary-foreground">PRÓXIMO</span>
                )}
                <div>
                  <div className="font-display text-2xl leading-none">#{order.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-2 text-sm font-semibold">{order.name}</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {order.sides.map((side) => (
                <span
                  key={side}
                  className="chip border border-border bg-muted text-muted-foreground"
                >
                  {side}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <StatusBar status={order.status} />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={async () => {
                  await updateOrderStatus(order.id, nextStatus as OrderStatus);
                  toast.success(`#${order.id}: ${nextStatus}`);
                }}
                disabled={order.status === "Entregue"}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                Avançar <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={async () => {
                  await updateOrderStatus(order.id, "Entregue");
                  toast.success(`#${order.id} entregue! 🎉`);
                }}
                className="flex items-center gap-1 rounded-xl bg-accent px-3 py-2.5 text-sm font-bold text-accent-foreground"
              >
                <Check className="h-4 w-4" /> Entregar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function SidesAdmin() {
  useStore();
  const sides = getSides();
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!name.trim()) return;
          await addSide(name.trim());
          setName("");
          toast.success("Recheio adicionado!");
        }}
        className="flex gap-2 rounded-2xl border border-border bg-card p-2"
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Novo recheio..."
          className="flex-1 rounded-xl bg-background px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="space-y-2">
        {sides.map((side) => (
          <li
            key={side.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <span className="text-2xl">{side.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold">{side.name}</div>
              <div className={`text-xs ${side.active ? "text-primary" : "text-destructive"}`}>
                {side.active ? "● Disponível" : "○ Esgotado"}
              </div>
            </div>
            <button
              onClick={() => toggleSide(side.id)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                side.active ? "bg-primary" : "bg-muted"
              }`}
              aria-label="toggle"
            >
              <span
                className={`absolute top-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow transition-all ${
                  side.active ? "left-6" : "left-1"
                }`}
              >
                {side.active ? (
                  <Check className="h-3 w-3 text-primary" />
                ) : (
                  <X className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
