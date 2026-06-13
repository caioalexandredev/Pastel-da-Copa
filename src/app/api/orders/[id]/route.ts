import { NextResponse } from "next/server";
import { deleteOrder, setOrderStatus } from "@/lib/orders-server";
import { type OrderStatus } from "@/lib/orders-types";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: OrderStatus } | null;
  const order = await setOrderStatus(Number(id), body?.status as OrderStatus);

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await deleteOrder(Number(id));

  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json(order);
}
