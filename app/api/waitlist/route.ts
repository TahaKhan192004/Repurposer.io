import { NextRequest, NextResponse } from "next/server";
import { captureEmail, isValidEmail } from "@/lib/emailCapture";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let email = "";
  let firstName = "";
  try {
    const body = await req.json();
    email = String(body?.email || "").trim();
    firstName = String(body?.firstName || "").trim();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  void captureEmail(email, { firstName, list: "waitlist" });
  return NextResponse.json({ ok: true });
}
