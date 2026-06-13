"use client";

import Link from "next/link";
import { AppShell } from "@/components/copa/AppShell";
import { StatusBadge, StatusBar } from "@/components/copa/StatusBadge";
import { getOrders, useStore } from "@/lib/orders-store";
import { ClipboardList } from "lucide-react";

export default function MeusPedidos() {
  useStore();
  const orders = getOrders();

  return (
    <AppShell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tribuna
          </div>
          <h1 className="font-display text-4xl">Meus Pedidos</h1>
        </div>
        <Link
          href="/pedido"
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground"
        >
          + Novo
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum pedido ainda. Bora pro balcão!
          </p>
          <Link
            href="/pedido"
            className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            Fazer Pedido
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Pedido
                  </div>
                  <div className="font-display text-2xl">#{order.id}</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{order.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
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
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
