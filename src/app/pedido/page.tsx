"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/copa/AppShell";
import { SideIcon } from "@/components/copa/SideIcon";
import { addOrder, getSides, useStore } from "@/lib/orders-store";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";

export default function PedidoPage() {
  const { sides: allSides } = useStore();
  const sides = useMemo(() => allSides.filter((side) => side.active), [allSides]);
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Diga seu nome para a torcida!");
    if (picked.length === 0) return toast.error("Escolha pelo menos 1 recheio.");

    setSending(true);
    try {
      const sidesNames = sides.filter((side) => picked.includes(side.id)).map((side) => side.name);
      const order = await addOrder(name.trim(), sidesNames);
      toast.success(`Pedido #${order.id} enviado! 🎉`);
      router.push("/meus-pedidos");
    } catch {
      toast.error("Não foi possível enviar o pedido agora.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Escalação
        </div>
        <h1 className="font-display text-4xl">Monte seu pastel</h1>
        <p className="text-sm text-muted-foreground">Escolha o craque do seu time de recheios.</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nome do participante
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: João da Torcida"
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/30 focus:border-primary focus:ring-4"
          />
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl">Acompanhamentos</h2>
            <span className="chip bg-secondary text-secondary-foreground">
              {picked.length} selecionado{picked.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sides.map((side) => {
              const on = picked.includes(side.id);
              return (
                <button
                  type="button"
                  key={side.id}
                  onClick={() => toggle(side.id)}
                  className={`relative flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98] ${
                    on
                      ? "border-primary bg-primary/10 shadow-[var(--shadow-pop)]"
                      : "border-border bg-background"
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center">
                    <SideIcon icon={side.emoji} label={`Ícone de ${side.name}`} />
                  </span>
                  <span className="flex-1 text-sm font-semibold">{side.name}</span>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ${
                      on
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform active:scale-95 disabled:opacity-70"
        >
          <Send className="h-5 w-5" /> {sending ? "Enviando..." : "Enviar Pedido"}
        </button>
      </form>
    </AppShell>
  );
}
