import { upsertGhlContact } from "./ghl";

/**
 * Lead capture. localStorage-only on the client; this is the server-side sink.
 * Logs, upserts into GHL (tagged "repurposer") when GHL_API_KEY/GHL_LOCATION_ID
 * are set, and optionally forwards to EMAIL_WEBHOOK_URL (Zapier / Sheets / ESP).
 * Failures here never block a generation.
 */
export async function captureEmail(
  email: string,
  meta: Record<string, unknown> = {},
): Promise<void> {
  const firstName = typeof meta.firstName === "string" ? meta.firstName.trim() : "";
  const payload = { email, ts: new Date().toISOString(), source: "repurposer.io", ...meta };

  // Always leave a server-side trail.
  console.log("[lead]", JSON.stringify(payload));

  void upsertGhlContact(email, firstName);

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
