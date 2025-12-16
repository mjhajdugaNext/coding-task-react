export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { clearMockScenario, setMockScenario } from "@/mocks/scenario-store";

export async function POST(request: Request) {
  if (process.env.MOCK_API !== "true") {
    return NextResponse.json({ message: "Mock API disabled" }, { status: 400 });
  }
  const body = await request.json();
  setMockScenario(body);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  clearMockScenario();
  return NextResponse.json({ ok: true });
}
