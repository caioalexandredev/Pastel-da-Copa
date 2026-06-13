import {
  DEFAULT_SCOREBOARD,
  DEFAULT_SIDES,
  STATUS_FLOW,
  type Order,
  type OrderStatus,
  type Scoreboard,
  type Side,
} from "@/lib/orders-types";

type StoreState = {
  counter: number;
  orders: Order[];
  sides: Side[];
  scoreboard: Scoreboard;
};

const globalForStore = globalThis as typeof globalThis & {
  __copaStore?: StoreState;
};

function state() {
  globalForStore.__copaStore ??= {
    counter: 100,
    orders: [],
    sides: DEFAULT_SIDES.map((side) => ({ ...side })),
    scoreboard: { ...DEFAULT_SCOREBOARD },
  };

  return globalForStore.__copaStore;
}

export function snapshot() {
  const store = state();
  return {
    orders: store.orders,
    sides: store.sides,
    scoreboard: store.scoreboard,
  };
}

export function createOrder(name: string, sides: string[]) {
  const store = state();
  store.counter += 1;

  const order: Order = {
    id: store.counter,
    name,
    sides,
    status: "Recebido",
    createdAt: Date.now(),
  };

  store.orders = [order, ...store.orders];
  return order;
}

export function setOrderStatus(id: number, status: OrderStatus) {
  if (!STATUS_FLOW.includes(status)) return null;

  const store = state();
  const existing = store.orders.find((order) => order.id === id);
  if (!existing) return null;

  store.orders = store.orders.map((order) => (order.id === id ? { ...order, status } : order));

  return store.orders.find((order) => order.id === id) ?? null;
}

export function createSide(name: string) {
  const store = state();
  const side: Side = {
    id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    name,
    emoji: "⭐",
    active: true,
  };

  store.sides = [...store.sides, side];
  return side;
}

export function setSideActive(id: string) {
  const store = state();
  const existing = store.sides.find((side) => side.id === id);
  if (!existing) return null;

  store.sides = store.sides.map((side) =>
    side.id === id ? { ...side, active: !side.active } : side,
  );

  return store.sides.find((side) => side.id === id) ?? null;
}

export function updateScoreboard(scoreboard: Partial<Scoreboard>) {
  const store = state();
  store.scoreboard = {
    ...store.scoreboard,
    ...scoreboard,
    homeScore: Number(scoreboard.homeScore ?? store.scoreboard.homeScore),
    awayScore: Number(scoreboard.awayScore ?? store.scoreboard.awayScore),
    live: Boolean(scoreboard.live ?? store.scoreboard.live),
  };

  return store.scoreboard;
}
