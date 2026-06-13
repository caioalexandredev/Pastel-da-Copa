import { NextResponse } from "next/server";
import { snapshot, updateScoreboard } from "@/lib/orders-server";
import { type Scoreboard } from "@/lib/orders-types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json((await snapshot()).scoreboard);
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<Scoreboard> | null;

  if (!body) {
    return NextResponse.json({ error: "Placar inválido." }, { status: 400 });
  }

  return NextResponse.json(await updateScoreboard(body));
}
