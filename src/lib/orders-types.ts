export type OrderStatus =
  | "Recebido"
  | "Preparando"
  | "Fritando"
  | "Pronto para Retirada"
  | "Entregue"
  | "Cancelado";

export const ORDER_STATUSES: OrderStatus[] = [
  "Recebido",
  "Preparando",
  "Fritando",
  "Pronto para Retirada",
  "Entregue",
  "Cancelado",
];

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
  Cancelado: "bg-destructive",
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

export interface Scoreboard {
  homeFlag: string;
  awayFlag: string;
  homeLabel: string;
  awayLabel: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  period: string;
  venue: string;
  prepTimeLabel: string;
  live: boolean;
}

export const DEFAULT_SIDE_EMOJI = "⭐";

export const SIDE_ICON_OPTIONS = [
  "⭐",
  "🧀",
  "🥩",
  "🍗",
  "🍕",
  "🌶️",
  "🌴",
  "🍫",
  "🍌",
  "🥓",
  "🥚",
  "🧅",
  "🍅",
  "🌽",
  "🥬",
  "🥗",
  "🍄",
  "🥔",
  "🫒",
  "🦐",
  "🐟",
  "🍍",
  "🥥",
  "🍓",
  "🍯",
] as const;

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

export const DEFAULT_SCOREBOARD: Scoreboard = {
  homeFlag: "🇧🇷",
  awayFlag: "🇦🇷",
  homeLabel: "CASA",
  awayLabel: "VISIT.",
  homeScore: 2,
  awayScore: 1,
  minute: "75'",
  period: "Segundo tempo",
  venue: "Estádio Pastelão",
  prepTimeLabel: "12 min",
  live: true,
};

export interface StoreSnapshot {
  orders: Order[];
  sides: Side[];
  scoreboard: Scoreboard;
}
