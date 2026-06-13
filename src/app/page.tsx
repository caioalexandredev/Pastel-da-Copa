import Link from "next/link";
import { AppShell } from "@/components/copa/AppShell";
import { Trophy, Flame, Timer } from "lucide-react";

export default function Home() {
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-hero)] p-6 text-primary-foreground shadow-[var(--shadow-pop)]">
        <div className="absolute inset-0 opacity-30 [background:var(--gradient-sun)]" />
        <div className="absolute inset-x-0 bottom-0 h-10 field-bg opacity-60" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
            <Trophy className="h-3.5 w-3.5" /> Edição Mundial
          </div>
          <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">
            NOITE DE
            <br />
            <span className="text-[var(--secondary)]">PASTÉIS</span>
            <br />
            DA COPA
          </h1>
          <p className="mt-3 max-w-xs text-sm text-white/90">
            Monte seu pastel e acompanhe seu pedido em tempo real, do gol ao balcão.
          </p>
          <Link
            href="/pedido"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-4 text-base font-bold text-secondary-foreground shadow-lg transition-transform active:scale-95"
          >
            <Flame className="h-5 w-5" /> Fazer Pedido
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: "Recheios", value: "8+" },
          { icon: Timer, label: "Tempo médio", value: "12 min" },
          { icon: Trophy, label: "Pastéis hoje", value: "127" },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)]"
          >
            <Icon className="mx-auto h-5 w-5 text-primary" />
            <div className="mt-1 font-display text-2xl">{value}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl">Placar da noite</h2>
          <span className="chip bg-primary text-primary-foreground">AO VIVO</span>
        </div>
        <div className="grid grid-cols-3 items-center gap-2 rounded-2xl bg-foreground p-4 text-background">
          <div className="text-center">
            <div className="text-3xl">🇧🇷</div>
            <div className="mt-1 text-xs opacity-80">CASA</div>
          </div>
          <div className="text-center font-display text-4xl tracking-widest">2 - 1</div>
          <div className="text-center">
            <div className="text-3xl">🇦🇷</div>
            <div className="mt-1 text-xs opacity-80">VISIT.</div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          75&apos; — Segundo tempo · Estádio Pastelão
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/meus-pedidos"
          className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Acompanhe</div>
          <div className="mt-1 font-display text-xl">Meus Pedidos</div>
        </Link>
        <Link
          href="/admin"
          className="rounded-2xl bg-accent p-4 text-accent-foreground shadow-[var(--shadow-card)]"
        >
          <div className="text-xs uppercase tracking-wider opacity-80">Cozinha</div>
          <div className="mt-1 font-display text-xl">Painel Admin</div>
        </Link>
      </section>
    </AppShell>
  );
}
