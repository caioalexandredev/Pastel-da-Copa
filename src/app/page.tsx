import Link from "next/link";
import { AppShell } from "@/components/copa/AppShell";
import { HomeStats } from "@/components/copa/HomeStats";
import { LiveScoreboard } from "@/components/copa/LiveScoreboard";
import { Trophy, Flame } from "lucide-react";

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

      <HomeStats />

      <LiveScoreboard />

      <section className="mt-6">
        <Link
          href="/meus-pedidos"
          className="block rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Acompanhe</div>
          <div className="mt-1 font-display text-xl">Meus Pedidos</div>
        </Link>
      </section>
    </AppShell>
  );
}
