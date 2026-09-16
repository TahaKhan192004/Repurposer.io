/**
 * LLM layer: Gemini primary, Groq fallback.
 * Both are asked for a JSON object. Callers get back parsed JSON or a thrown error.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
// Groq chat model. whisper-* models are transcription only and will not work here.
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const TIMEOUT_MS = 45_000;

export type Provider = "gemini" | "groq";

export interface LlmResult {
  provider: Provider;
  raw: string;
}

class LlmError extends Error {
  constructor(
    public provider: Provider,
    message: string,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

function withTimeout(ms: number): { signal: AbortSignal; done: () => void } {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, done: () => clearTimeout(t) };
}

/** Pull the first balanced JSON object out of a string (handles stray prose or fences). */
export function extractJsonObject(text: string): unknown {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("no JSON object found in model output");
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.slice(start, i + 1));
      }
    }
  }
  throw new Error("unterminated JSON object in model output");
}

async function callGemini(system: string, user: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new LlmError("gemini", "GEMINI_API_KEY not set");
  const { signal, done } = withTimeout(TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": key,
        },
        signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new LlmError("gemini", `HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as any;
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("") ??
      undefined;
    if (!text || !text.trim()) {
      throw new LlmError(
        "gemini",
        `empty response (finishReason: ${data?.candidates?.[0]?.finishReason ?? "unknown"})`,
      );
    }
    return text;
  } catch (err) {
    if (err instanceof LlmError) throw err;
    const msg =
      (err as Error)?.name === "AbortError"
        ? `timeout after ${TIMEOUT_MS}ms`
        : (err as Error)?.message || "network error";
    throw new LlmError("gemini", msg);
  } finally {
    done();
  }
}

async function callGroq(system: string, user: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new LlmError("groq", "GROQ_API_KEY not set");
  const { signal, done } = withTimeout(TIMEOUT_MS);
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.85,
        max_tokens: 8192,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new LlmError("groq", `HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as any;
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text || !text.trim()) throw new LlmError("groq", "empty response");
    return text;
  } catch (err) {
    if (err instanceof LlmError) throw err;
    const msg =
      (err as Error)?.name === "AbortError"
        ? `timeout after ${TIMEOUT_MS}ms`
        : (err as Error)?.message || "network error";
    throw new LlmError("groq", msg);
  } finally {
    done();
  }
}

/**
 * Try Gemini (with one retry), then fall back to Groq.
 * Throws an aggregate error only if every attempt fails.
 */
export async function generateWithFallback(
  system: string,
  user: string,
): Promise<LlmResult> {
  const errors: string[] = [];

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const raw = await callGemini(system, user);
      return { provider: "gemini", raw };
    } catch (err) {
      errors.push(`gemini#${attempt}: ${(err as Error).message}`);
    }
  }

  try {
    const raw = await callGroq(system, user);
    return { provider: "groq", raw };
  } catch (err) {
    errors.push(`groq: ${(err as Error).message}`);
  }

  throw new Error(`all providers failed [${errors.join(" | ")}]`);
}

export function providersConfigured(): { gemini: boolean; groq: boolean } {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    groq: Boolean(process.env.GROQ_API_KEY),
  };
}
