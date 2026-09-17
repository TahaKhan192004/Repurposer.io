/**
 * GoHighLevel (GHL) contact sync. Upserts the lead into the sub-account and
 * tags them "repurposer". Fire-and-forget: failures are logged, never block
 * the user or the rest of the capture flow.
 */
const GHL_API_BASE = "https://services.leadconnectorhub.com";
const GHL_API_VERSION = "2021-07-28";

export async function upsertGhlContact(
  email: string,
  firstName: string,
  tags: string[] = ["repurposer"],
): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: GHL_API_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        email,
        firstName: firstName || undefined,
        tags,
      }),
      signal: ctrl.signal,
    }).finally(() => clearTimeout(t));

    if (!res.ok) {
      console.warn("[ghl] upsert failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.warn("[ghl] upsert error:", (err as Error).message);
  }
}
