import { STATUS_COLOR, type OrderStatus } from "@/lib/orders-store";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`chip text-white ${STATUS_COLOR[status]} shadow-sm`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {status}
    </span>
  );
}

export function StatusBar({ status }: { status: OrderStatus }) {
  const stages: OrderStatus[] = [
    "Recebido",
    "Preparando",
    "Fritando",
    "Pronto para Retirada",
    "Entregue",
  ];
  const currentIdx = stages.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {stages.map((s, i) => {
        const done = i <= currentIdx;
        return (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              done ? STATUS_COLOR[status] : "bg-muted"
            }`}
          />
        );
      })}
    </div>
  );
}
