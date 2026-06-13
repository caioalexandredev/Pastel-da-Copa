import { NextResponse } from "next/server";
import { setSideActive } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const side = await setSideActive(id);

  if (!side) {
    return NextResponse.json({ error: "Acompanhamento não encontrado." }, { status: 404 });
  }

  return NextResponse.json(side);
}
