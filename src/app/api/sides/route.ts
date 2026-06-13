import { NextResponse } from "next/server";
import { createSide, snapshot } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json((await snapshot()).sides);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    emoji?: string;
  } | null;
  const name = body?.name?.trim();
  const emoji = body?.emoji?.trim();

  if (!name) {
    return NextResponse.json({ error: "Nome do acompanhamento é obrigatório." }, { status: 400 });
  }

  return NextResponse.json(await createSide(name, emoji), { status: 201 });
}
