import { NextRequest, NextResponse } from "next/server";
import { FormatId, MAX_FORMATS, isFormatId } from "@/lib/formats";
import { buildSystemPrompt, buildUserPrompt, GenerateContext } from "@/lib/prompt";
import { generateWithFallback, extractJsonObject, providersConfigured } from "@/lib/llm";
import { captureEmail, isValidEmail } from "@/lib/emailCapture";
import { countWords, stripEmDashes } from "@/lib/text";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_WORDS = Number(process.env.NEXT_PUBLIC_MAX_WORDS || 2000);

interface Body {
  source?: string;
  formats?: string[];
  email?: string;
  context?: GenerateContext;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const source = (body.source || "").trim();
  const rawFormats = Array.isArray(body.formats) ? body.formats : [];
  const email = (body.email || "").trim();
  const context: GenerateContext = {
    niche: body.context?.niche?.trim() || undefined,
    audience: body.context?.audience?.trim() || undefined,
    tone: body.context?.tone?.trim() || undefined,
    ctaGoal: body.context?.ctaGoal?.trim() || undefined,
  };

  // --- validation ---
  if (!source) {
    return NextResponse.json({ error: "Paste some content first." }, { status: 400 });
  }
  const words = countWords(source);
  if (words > MAX_WORDS) {
    return NextResponse.json(
      { error: `That's ${words} words. The limit is ${MAX_WORDS}.` },
      { status: 400 },
    );
  }
  if (words < 20) {
    return NextResponse.json(
      { error: "Give it at least 20 words to work with." },
      { status: 400 },
    );
  }

  const formats = rawFormats.filter(isFormatId) as FormatId[];
  const uniqueFormats = [...new Set(formats)];
  if (uniqueFormats.length === 0) {
    return NextResponse.json({ error: "Pick at least one output format." }, { status: 400 });
  }
  if (uniqueFormats.length > MAX_FORMATS) {
    return NextResponse.json(
      { error: `Pick up to ${MAX_FORMATS} formats.` },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const configured = providersConfigured();
  if (!configured.gemini && !configured.groq) {
    return NextResponse.json(
      {
        error:
          "No LLM provider configured. Set GEMINI_API_KEY (and optionally GROQ_API_KEY) in your environment.",
      },
      { status: 503 },
    );
  }

  // Fire-and-forget lead capture. Never blocks or fails the request.
  void captureEmail(email, { formats: uniqueFormats, words });

  // --- generate ---
  const system = buildSystemPrompt();
  const user = buildUserPrompt(source, uniqueFormats, context);

  let result;
  try {
    result = await generateWithFallback(system, user);
  } catch (err) {
    // Both providers failed. Per the plan: do NOT consume a try.
    return NextResponse.json(
      {
        error:
          "Both Gemini and Groq failed to respond. Your free generation was not used. Try again in a moment.",
        detail: (err as Error).message,
        consumed: false,
      },
      { status: 502 },
    );
  }

  // --- parse ---
  let parsed: Record<string, unknown>;
  try {
    parsed = extractJsonObject(result.raw) as Record<string, unknown>;
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "The model returned something we couldn't read. Your free generation was not used.",
        detail: (err as Error).message,
        consumed: false,
      },
      { status: 502 },
    );
  }

  const outputs: Record<string, string> = {};
  const missing: string[] = [];
  for (const id of uniqueFormats) {
    const val = parsed[id];
    if (typeof val === "string" && val.trim()) {
      outputs[id] = stripEmDashes(val.trim());
    } else {
      missing.push(id);
    }
  }

  if (Object.keys(outputs).length === 0) {
    return NextResponse.json(
      {
        error: "The model didn't return usable content. Your free generation was not used.",
        consumed: false,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    outputs,
    missing,
    provider: result.provider,
    consumed: true,
  });
}
