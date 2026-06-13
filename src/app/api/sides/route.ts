import { NextResponse } from "next/server";
import { createSide, snapshot } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(snapshot().sides);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Nome do acompanhamento é obrigatório." }, { status: 400 });
  }

  return NextResponse.json(createSide(name), { status: 201 });
}
