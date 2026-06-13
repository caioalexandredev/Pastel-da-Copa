import { NextResponse } from "next/server";
import { createOrder, snapshot } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json((await snapshot()).orders);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    sides?: string[];
  } | null;

  const name = body?.name?.trim();
  const sides = body?.sides?.filter(Boolean) ?? [];

  if (!name || sides.length === 0) {
    return NextResponse.json(
      { error: "Nome e acompanhamentos são obrigatórios." },
      { status: 400 },
    );
  }

  return NextResponse.json(await createOrder(name, sides), { status: 201 });
}
