export type OrderStatus =
  | "Recebido"
  | "Preparando"
  | "Fritando"
  | "Pronto para Retirada"
  | "Entregue";

export const STATUS_FLOW: OrderStatus[] = [
  "Recebido",
  "Preparando",
  "Fritando",
  "Pronto para Retirada",
  "Entregue",
];

export const STATUS_COLOR: Record<OrderStatus, string> = {
  Recebido: "bg-[var(--color-status-recebido)]",
  Preparando: "bg-[var(--color-status-preparando)]",
  Fritando: "bg-[var(--color-status-fritando)]",
  "Pronto para Retirada": "bg-[var(--color-status-pronto)]",
  Entregue: "bg-[var(--color-status-entregue)]",
};

export interface Order {
  id: number;
  name: string;
  sides: string[];
  status: OrderStatus;
  createdAt: number;
}

export interface Side {
  id: string;
  name: string;
  emoji: string;
  active: boolean;
}

export const DEFAULT_SIDES: Side[] = [
  { id: "queijo", name: "Queijo", emoji: "🧀", active: true },
  { id: "carne", name: "Carne", emoji: "🥩", active: true },
  { id: "frango", name: "Frango c/ Catupiry", emoji: "🍗", active: true },
  { id: "pizza", name: "Pizza", emoji: "🍕", active: true },
  { id: "calabresa", name: "Calabresa", emoji: "🌶️", active: true },
  { id: "palmito", name: "Palmito", emoji: "🌴", active: true },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", active: true },
  { id: "banana", name: "Banana c/ Canela", emoji: "🍌", active: true },
];

export interface StoreSnapshot {
  orders: Order[];
  sides: Side[];
}
