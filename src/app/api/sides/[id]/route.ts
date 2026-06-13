import { NextResponse } from "next/server";
import { deleteSide, setSideActive, updateSide } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    emoji?: string;
    active?: boolean;
  } | null;

  const side = body
    ? await updateSide(id, {
        name: body.name,
        emoji: body.emoji,
        active: typeof body.active === "boolean" ? body.active : undefined,
      })
    : await setSideActive(id);

  if (!side) {
    return NextResponse.json({ error: "Acompanhamento não encontrado." }, { status: 404 });
  }

  return NextResponse.json(side);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const side = await deleteSide(id);

  if (!side) {
    return NextResponse.json({ error: "Acompanhamento não encontrado." }, { status: 404 });
  }

  return NextResponse.json(side);
}
