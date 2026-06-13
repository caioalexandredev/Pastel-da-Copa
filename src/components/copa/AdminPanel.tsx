"use client";

import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/copa/AppShell";
import { StatusBadge, StatusBar } from "@/components/copa/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  STATUS_FLOW,
  addSide,
  cancelOrder,
  deleteOrder,
  getScoreboard,
  getOrders,
  getSides,
  toggleSide,
  updateOrderStatus,
  updateScoreboard,
  useStore,
  type Order,
  type OrderStatus,
  type Scoreboard,
} from "@/lib/orders-store";
import { Ban, Check, ChevronRight, Plus, Trash2, Trophy, X } from "lucide-react";
import { toast } from "sonner";

export function AdminPanel() {
  useStore();
  const [tab, setTab] = useState<"fila" | "placar" | "acomps">("fila");
  const orders = getOrders()
    .filter((order) => order.status !== "Entregue" && order.status !== "Cancelado")
    .sort((a, b) => a.createdAt - b.createdAt);
  const delivered = getOrders().filter((order) => order.status === "Entregue").length;
  const canceled = getOrders().filter((order) => order.status === "Cancelado").length;

  return (
    <AppShell locked>
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-accent">
          Cozinha · ao vivo
        </div>
        <h1 className="font-display text-4xl">Painel Admin</h1>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Na fila" value={orders.length} tone="primary" />
        <Stat label="Entregues" value={delivered} tone="accent" />
        <Stat label="Cancelados" value={canceled} tone="secondary" />
      </div>

      <div className="mt-5 inline-flex w-full rounded-2xl border border-border bg-card p-1">
        {(["fila", "placar", "acomps"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              tab === item ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            }`}
          >
            {item === "fila" ? "Fila" : item === "placar" ? "Placar" : "Recheios"}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "fila" ? (
          <Queue orders={orders} />
        ) : tab === "placar" ? (
          <ScoreboardAdmin />
        ) : (
          <SidesAdmin />
        )}
      </div>
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
            <div className="mt-2 grid grid-cols-2 gap-2">
              <OrderActionDialog
                title={`Cancelar pedido #${order.id}?`}
                description="Ele sai da fila da cozinha, mas continua aparecendo para a pessoa como cancelado."
                actionLabel="Cancelar pedido"
                actionClassName="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onConfirm={async () => {
                  await cancelOrder(order.id);
                  toast.success(`#${order.id} cancelado.`);
                }}
              >
                <button className="flex items-center justify-center gap-1 rounded-xl bg-secondary px-3 py-2.5 text-sm font-bold text-secondary-foreground">
                  <Ban className="h-4 w-4" /> Cancelar
                </button>
              </OrderActionDialog>
              <OrderActionDialog
                title={`Apagar pedido #${order.id}?`}
                description="Essa ação remove o pedido do banco de dados. Use só para pedido duplicado ou criado por engano."
                actionLabel="Apagar de vez"
                actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onConfirm={async () => {
                  await deleteOrder(order.id);
                  toast.success(`#${order.id} apagado.`);
                }}
              >
                <button className="flex items-center justify-center gap-1 rounded-xl bg-destructive px-3 py-2.5 text-sm font-bold text-destructive-foreground">
                  <Trash2 className="h-4 w-4" /> Apagar
                </button>
              </OrderActionDialog>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function OrderActionDialog({
  children,
  title,
  description,
  actionLabel,
  actionClassName,
  onConfirm,
}: {
  children: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionClassName: string;
  onConfirm: () => Promise<void>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-3xl border-border p-0">
        <div className="rounded-t-3xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-3xl tracking-normal">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-white/85">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="gap-2 p-5 pt-1 sm:space-x-0">
          <AlertDialogCancel className="mt-0 rounded-xl">Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm().catch(() => toast.error("Não foi possível concluir a ação."));
            }}
            className={`rounded-xl ${actionClassName}`}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

function ScoreboardAdmin() {
  useStore();
  const scoreboard = getScoreboard();
  const [draft, setDraft] = useState<Scoreboard>(scoreboard);
  const [saving, setSaving] = useState(false);

  const setField = <Key extends keyof Scoreboard>(key: Key, value: Scoreboard[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
          await updateScoreboard(draft);
          toast.success("Placar atualizado!");
        } catch {
          toast.error("Não foi possível atualizar o placar.");
        } finally {
          setSaving(false);
        }
      }}
      className="space-y-4"
    >
      <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl">Placar do jogo</h2>
          <button
            type="button"
            onClick={() => setField("live", !draft.live)}
            className={`rounded-xl px-3 py-2 text-xs font-bold ${
              draft.live ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {draft.live ? "AO VIVO" : "PAUSADO"}
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <TeamFields
            flag={draft.homeFlag}
            label={draft.homeLabel}
            score={draft.homeScore}
            side="Casa"
            onFlag={(value) => setField("homeFlag", value)}
            onLabel={(value) => setField("homeLabel", value)}
            onScore={(value) => setField("homeScore", value)}
          />
          <div className="pb-3 text-center font-display text-4xl">x</div>
          <TeamFields
            flag={draft.awayFlag}
            label={draft.awayLabel}
            score={draft.awayScore}
            side="Visitante"
            onFlag={(value) => setField("awayFlag", value)}
            onLabel={(value) => setField("awayLabel", value)}
            onScore={(value) => setField("awayScore", value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Minuto
          </span>
          <input
            value={draft.minute}
            onChange={(event) => setField("minute", event.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:border-primary focus:ring-4"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Tempo
          </span>
          <input
            value={draft.period}
            onChange={(event) => setField("period", event.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:border-primary focus:ring-4"
          />
        </label>
        <label className="col-span-2 block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Local
          </span>
          <input
            value={draft.venue}
            onChange={(event) => setField("venue", event.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:border-primary focus:ring-4"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-pop)] disabled:opacity-70"
      >
        <Trophy className="h-5 w-5" /> {saving ? "Salvando..." : "Atualizar Placar"}
      </button>
    </form>
  );
}

function TeamFields({
  flag,
  label,
  score,
  side,
  onFlag,
  onLabel,
  onScore,
}: {
  flag: string;
  label: string;
  score: number;
  side: string;
  onFlag: (value: string) => void;
  onLabel: (value: string) => void;
  onScore: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {side}
      </div>
      <input
        value={flag}
        onChange={(event) => onFlag(event.target.value)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center text-2xl outline-none ring-primary/30 focus:border-primary focus:ring-4"
      />
      <input
        value={label}
        onChange={(event) => onLabel(event.target.value)}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center text-xs font-bold uppercase outline-none ring-primary/30 focus:border-primary focus:ring-4"
      />
      <input
        type="number"
        min={0}
        value={score}
        onChange={(event) => onScore(Number(event.target.value))}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-center font-display text-4xl outline-none ring-primary/30 focus:border-primary focus:ring-4"
      />
    </div>
  );
}
