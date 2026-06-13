import { NextResponse } from "next/server";
import { snapshot } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await snapshot());
}
