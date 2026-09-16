/**
 * Lead capture. localStorage-only on the client; this is the server-side sink.
 * Logs, and optionally forwards to EMAIL_WEBHOOK_URL (GHL / Zapier / Sheets / ESP).
 * Failures here never block a generation.
 */
export async function captureEmail(
  email: string,
  meta: Record<string, unknown> = {},
): Promise<void> {
  const payload = { email, ts: new Date().toISOString(), source: "repurposer.io", ...meta };

  // Always leave a server-side trail.
  console.log("[lead]", JSON.stringify(payload));

  const url = process.env.EMAIL_WEBHOOK_URL;
  if (!url) return;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));
  } catch (err) {
    console.warn("[lead] webhook failed:", (err as Error).message);
  }
}

export { isValidEmail } from "./validate";
