import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_SIDES,
  DEFAULT_SCOREBOARD,
  STATUS_COLOR,
  STATUS_FLOW,
  type Order,
  type OrderStatus,
  type Scoreboard,
  type Side,
  type StoreSnapshot,
} from "@/lib/orders-types";

export { STATUS_COLOR, STATUS_FLOW, type Order, type OrderStatus, type Scoreboard, type Side };

let current: StoreSnapshot = {
  orders: [],
  sides: DEFAULT_SIDES,
  scoreboard: DEFAULT_SCOREBOARD,
};

const MY_ORDERS_KEY = "copa.my-orders";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setSnapshot(next: StoreSnapshot) {
  current = next;
  emit();
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function refreshStore() {
  const snapshot = await request<StoreSnapshot>("/api/store", { cache: "no-store" });
  setSnapshot(snapshot);
  return snapshot;
}

export function getOrders(): Order[] {
  return current.orders;
}

function readMyOrderIds(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(MY_ORDERS_KEY);
    if (!raw) return [];

    const ids = JSON.parse(raw) as unknown;
    return Array.isArray(ids)
      ? ids.filter((id): id is number => typeof id === "number" && Number.isFinite(id))
      : [];
  } catch {
    return [];
  }
}

function writeMyOrderIds(ids: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(ids));
}

export function rememberMyOrder(id: number) {
  const ids = readMyOrderIds();
  writeMyOrderIds([id, ...ids.filter((existing) => existing !== id)]);
  emit();
}

export function getMyOrders(): Order[] {
  const ids = new Set(readMyOrderIds());
  return current.orders.filter((order) => ids.has(order.id));
}

export function getSides(): Side[] {
  return current.sides;
}

export function getScoreboard(): Scoreboard {
  return current.scoreboard;
}

export async function addOrder(name: string, sides: string[]): Promise<Order> {
  const order = await request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify({ name, sides }),
  });
  rememberMyOrder(order.id);
  await refreshStore();
  return order;
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await request<Order>(`/api/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  await refreshStore();
}

export async function toggleSide(id: string) {
  await request<Side>(`/api/sides/${id}`, {
    method: "PATCH",
  });
  await refreshStore();
}

export async function addSide(name: string) {
  await request<Side>("/api/sides", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  await refreshStore();
}

export async function updateScoreboard(scoreboard: Scoreboard) {
  await request<Scoreboard>("/api/scoreboard", {
    method: "PUT",
    body: JSON.stringify(scoreboard),
  });
  await refreshStore();
}

export function useStore() {
  const subscribe = useCallback((listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    refreshStore().catch(() => undefined);
    const interval = window.setInterval(() => {
      refreshStore().catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}

export function statusProgress(status: OrderStatus) {
  const idx = STATUS_FLOW.indexOf(status);
  return ((idx + 1) / STATUS_FLOW.length) * 100;
}
