import { neon } from "@neondatabase/serverless";
import {
  DEFAULT_SCOREBOARD,
  DEFAULT_SIDES,
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type Scoreboard,
  type Side,
} from "@/lib/orders-types";

type OrderRow = {
  id: number;
  name: string;
  sides: string[] | string;
  status: OrderStatus;
  created_at: number | string;
};

type SideRow = {
  id: string;
  name: string;
  emoji: string;
  active: boolean;
};

type ScoreboardRow = {
  home_flag: string;
  away_flag: string;
  home_label: string;
  away_label: string;
  home_score: number;
  away_score: number;
  minute: string;
  period: string;
  venue: string;
  prep_time_label: string;
  live: boolean;
};

let initPromise: Promise<void> | undefined;

function sql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada.");
  }

  return neon(databaseUrl);
}

async function initDb() {
  const db = sql();

  await db`
    CREATE TABLE IF NOT EXISTS copa_orders (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sides JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'Recebido',
      created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS copa_sides (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true
    )
  `;

  await db`
    CREATE TABLE IF NOT EXISTS copa_scoreboard (
      id INTEGER PRIMARY KEY DEFAULT 1,
      home_flag TEXT NOT NULL,
      away_flag TEXT NOT NULL,
      home_label TEXT NOT NULL,
      away_label TEXT NOT NULL,
      home_score INTEGER NOT NULL,
      away_score INTEGER NOT NULL,
      minute TEXT NOT NULL,
      period TEXT NOT NULL,
      venue TEXT NOT NULL,
      prep_time_label TEXT NOT NULL DEFAULT '12 min',
      live BOOLEAN NOT NULL DEFAULT true,
      CONSTRAINT one_scoreboard CHECK (id = 1)
    )
  `;

  await db`
    ALTER TABLE copa_scoreboard
    ADD COLUMN IF NOT EXISTS prep_time_label TEXT NOT NULL DEFAULT '12 min'
  `;

  for (const side of DEFAULT_SIDES) {
    await db`
      INSERT INTO copa_sides (id, name, emoji, active)
      VALUES (${side.id}, ${side.name}, ${side.emoji}, ${side.active})
      ON CONFLICT (id) DO NOTHING
    `;
  }

  await db`
    INSERT INTO copa_scoreboard (
      id,
      home_flag,
      away_flag,
      home_label,
      away_label,
      home_score,
      away_score,
      minute,
      period,
      venue,
      prep_time_label,
      live
    )
    VALUES (
      1,
      ${DEFAULT_SCOREBOARD.homeFlag},
      ${DEFAULT_SCOREBOARD.awayFlag},
      ${DEFAULT_SCOREBOARD.homeLabel},
      ${DEFAULT_SCOREBOARD.awayLabel},
      ${DEFAULT_SCOREBOARD.homeScore},
      ${DEFAULT_SCOREBOARD.awayScore},
      ${DEFAULT_SCOREBOARD.minute},
      ${DEFAULT_SCOREBOARD.period},
      ${DEFAULT_SCOREBOARD.venue},
      ${DEFAULT_SCOREBOARD.prepTimeLabel},
      ${DEFAULT_SCOREBOARD.live}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function ready() {
  initPromise ??= initDb();
  await initPromise;
  return sql();
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    name: row.name,
    sides: Array.isArray(row.sides) ? row.sides : (JSON.parse(row.sides) as string[]),
    status: row.status,
    createdAt: Number(row.created_at),
  };
}

function mapSide(row: SideRow): Side {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    active: row.active,
  };
}

function mapScoreboard(row: ScoreboardRow): Scoreboard {
  return {
    homeFlag: row.home_flag,
    awayFlag: row.away_flag,
    homeLabel: row.home_label,
    awayLabel: row.away_label,
    homeScore: row.home_score,
    awayScore: row.away_score,
    minute: row.minute,
    period: row.period,
    venue: row.venue,
    prepTimeLabel: row.prep_time_label,
    live: row.live,
  };
}

export async function snapshot() {
  const db = await ready();
  const [orders, sides, scoreboard] = await Promise.all([
    db`SELECT id, name, sides, status, created_at FROM copa_orders ORDER BY created_at DESC`,
    db`SELECT id, name, emoji, active FROM copa_sides ORDER BY name ASC`,
    db`SELECT home_flag, away_flag, home_label, away_label, home_score, away_score, minute, period, venue, prep_time_label, live FROM copa_scoreboard WHERE id = 1`,
  ]);

  return {
    orders: (orders as OrderRow[]).map(mapOrder),
    sides: (sides as SideRow[]).map(mapSide),
    scoreboard: mapScoreboard((scoreboard as ScoreboardRow[])[0]),
  };
}

export async function createOrder(name: string, sides: string[]) {
  const db = await ready();
  const rows = await db`
    INSERT INTO copa_orders (name, sides, status)
    VALUES (${name}, ${JSON.stringify(sides)}::jsonb, 'Recebido')
    RETURNING id, name, sides, status, created_at
  `;

  return mapOrder((rows as OrderRow[])[0]);
}

export async function setOrderStatus(id: number, status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) return null;

  const db = await ready();
  const rows = await db`
    UPDATE copa_orders
    SET status = ${status}
    WHERE id = ${id}
    RETURNING id, name, sides, status, created_at
  `;

  const order = (rows as OrderRow[])[0];
  return order ? mapOrder(order) : null;
}

export async function deleteOrder(id: number) {
  const db = await ready();
  const rows = await db`
    DELETE FROM copa_orders
    WHERE id = ${id}
    RETURNING id, name, sides, status, created_at
  `;

  const order = (rows as OrderRow[])[0];
  return order ? mapOrder(order) : null;
}

export async function createSide(name: string) {
  const db = await ready();
  const side: Side = {
    id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    name,
    emoji: "⭐",
    active: true,
  };

  const rows = await db`
    INSERT INTO copa_sides (id, name, emoji, active)
    VALUES (${side.id}, ${side.name}, ${side.emoji}, ${side.active})
    RETURNING id, name, emoji, active
  `;

  return mapSide((rows as SideRow[])[0]);
}

export async function setSideActive(id: string) {
  const db = await ready();
  const rows = await db`
    UPDATE copa_sides
    SET active = NOT active
    WHERE id = ${id}
    RETURNING id, name, emoji, active
  `;

  const side = (rows as SideRow[])[0];
  return side ? mapSide(side) : null;
}

export async function updateScoreboard(scoreboard: Partial<Scoreboard>) {
  const current = (await snapshot()).scoreboard;
  const next = {
    ...current,
    ...scoreboard,
    homeScore: Number(scoreboard.homeScore ?? current.homeScore),
    awayScore: Number(scoreboard.awayScore ?? current.awayScore),
    live: Boolean(scoreboard.live ?? current.live),
  };

  const db = await ready();
  const rows = await db`
    UPDATE copa_scoreboard
    SET
      home_flag = ${next.homeFlag},
      away_flag = ${next.awayFlag},
      home_label = ${next.homeLabel},
      away_label = ${next.awayLabel},
      home_score = ${next.homeScore},
      away_score = ${next.awayScore},
      minute = ${next.minute},
      period = ${next.period},
      venue = ${next.venue},
      prep_time_label = ${next.prepTimeLabel},
      live = ${next.live}
    WHERE id = 1
    RETURNING home_flag, away_flag, home_label, away_label, home_score, away_score, minute, period, venue, prep_time_label, live
  `;

  return mapScoreboard((rows as ScoreboardRow[])[0]);
}
