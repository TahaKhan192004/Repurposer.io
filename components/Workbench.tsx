"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowsClockwise } from "@phosphor-icons/react";
import { FormatId, MAX_FORMATS } from "@/lib/formats";
import { countWords } from "@/lib/text";
import { useUsage } from "@/lib/useUsage";
import { FormatPicker } from "@/components/FormatPicker";
import { EmailGate } from "@/components/EmailGate";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ResultsEmpty, ResultsSkeleton } from "@/components/ResultsStates";
import { WaitlistPrompt } from "@/components/WaitlistPrompt";
import { Toast } from "@/components/Toast";

const MAX_WORDS = Number(process.env.NEXT_PUBLIC_MAX_WORDS || 2000);

interface Results {
  outputs: Record<string, string>;
  missing: string[];
  provider: string;
}
interface Ctx {
  niche: string;
  audience: string;
  tone: string;
  ctaGoal: string;
}

const CTX_FIELDS = [
  ["niche", "Niche", "e.g. B2B SaaS onboarding…"],
  ["audience", "Audience", "e.g. founders doing their own marketing…"],
  ["tone", "Tone", "e.g. direct, a little dry, no hype…"],
  ["ctaGoal", "CTA goal", "e.g. reply with a keyword…"],
] as const;

export function Workbench() {
  const usage = useUsage();

  const [source, setSource] = useState("");
  const [formats, setFormats] = useState<FormatId[]>([]);
  const [ctx, setCtx] = useState<Ctx>({ niche: "", audience: "", tone: "", ctaGoal: "" });
  const [showCtx, setShowCtx] = useState(false);

  const [showGate, setShowGate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => countWords(source), [source]);
  const overWords = words > MAX_WORDS;
  const enoughWords = words >= 20;
  const pct = Math.min(100, (words / MAX_WORDS) * 100);
  const showWaitlist = usage.hydrated && !usage.canGenerate;

  const flashPicker = () => {
    setToast(`You can pick ${MAX_FORMATS} formats per run`);
    const el = pickerRef.current;
    if (el) {
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
    }
  };

  async function callApi(targetFormats: FormatId[], emailOverride?: string, firstNameOverride?: string) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source,
        formats: targetFormats,
        email: emailOverride || usage.state.user_email,
        firstName: firstNameOverride || usage.state.user_first_name,
        context: ctx,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Something failed. Try again in a moment.");
    return data as Results & { consumed: boolean };
  }

  async function runGenerate(emailOverride?: string, firstNameOverride?: string) {
    setError(null);
    if (!enoughWords) return setError("Add at least 20 words so there is something to work with.");
    if (overWords) return setError(`That is ${words} words. Trim it to ${MAX_WORDS} or fewer.`);
    if (formats.length === 0) return setError("Choose at least one output format below.");
    if (!emailOverride && !usage.hasEmail) return setShowGate(true);
    if (!usage.canGenerate) return;

    setLoading(true);
    setResults(null);
    try {
      const data = await callApi(formats, emailOverride, firstNameOverride);
      setResults({ outputs: data.outputs, missing: data.missing, provider: data.provider });
      usage.recordGeneration(formats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function regenerateOne(id: FormatId) {
    try {
      const data = await callApi([id]);
      setResults((prev) =>
        prev
          ? {
              ...prev,
              provider: data.provider,
              outputs: { ...prev.outputs, ...data.outputs },
              missing: prev.missing.filter((m) => m !== id),
            }
          : prev,
      );
    } catch (err) {
      setToast((err as Error).message.slice(0, 90));
    }
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
      <div className="divide-y divide-line rounded-card border border-line bg-surface shadow-pop">
        {/* content */}
        <div className="p-5 sm:p-7">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-ink">Your content</h3>
            <span
              aria-live="polite"
              className={[
                "font-mono text-xs tabular-nums",
                overWords ? "font-semibold text-danger" : "text-ink-faint",
              ].join(" ")}
            >
              {words} / {MAX_WORDS}
            </span>
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            rows={8}
            aria-label="Content to repurpose"
            placeholder="Paste a blog post, a voice-note transcript, a newsletter, or rough notes…"
            className="scroll-quiet mt-3 w-full resize-y rounded-input border border-line bg-paper/60 p-4 text-sm leading-relaxed text-ink outline-none transition placeholder:text-ink-soft focus:border-accent focus:bg-surface"
          />
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
            <div
              className="h-full rounded-full transition-[width,background-color] duration-300"
              style={{
                width: `${pct}%`,
                backgroundColor: overWords
                  ? "var(--color-danger)"
                  : "var(--color-accent)",
              }}
            />
          </div>
          {overWords && (
            <p className="mt-2 text-xs text-danger">
              Trim to {MAX_WORDS} words or fewer to generate.
            </p>
          )}
        </div>

        {/* context */}
        <div className="p-5 sm:p-7">
          <button
            type="button"
            onClick={() => setShowCtx((s) => !s)}
            aria-expanded={showCtx}
            className="flex w-full items-center justify-between"
          >
            <span className="text-sm font-semibold text-ink">Context</span>
            <span className="flex items-center gap-2 text-xs text-ink-faint">
              {showCtx ? "Hide" : "Optional, sharpens the output"}
              <ArrowDown
                size={13}
                weight="bold"
                aria-hidden
                className={showCtx ? "rotate-180 transition-transform" : "transition-transform"}
              />
            </span>
          </button>
          {showCtx && (
            <div className="rise mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CTX_FIELDS.map(([key, label, ph]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label htmlFor={`ctx-${key}`} className="text-xs font-medium text-ink-soft">
                    {label}
                  </label>
                  <input
                    id={`ctx-${key}`}
                    name={`ctx-${key}`}
                    value={ctx[key]}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(e) => setCtx((c) => ({ ...c, [key]: e.target.value }))}
                    placeholder={ph}
                    className="w-full rounded-input border border-line bg-paper/60 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-accent focus:bg-surface"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* formats */}
        <div ref={pickerRef} className="p-5 sm:p-7">
          <FormatPicker selected={formats} onChange={setFormats} onOverLimit={flashPicker} />
        </div>

        {/* generate */}
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="text-xs text-ink-faint">
            {usage.hydrated
              ? `${usage.triesLeft} of ${usage.state.max_tries} free runs left in this browser`
              : " "}
          </p>
          <button
            type="button"
            onClick={() => runGenerate()}
            disabled={loading || overWords || showWaitlist}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-cream-on transition-transform duration-150 hover:bg-accent-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading && (
              <ArrowsClockwise size={15} weight="bold" aria-hidden className="animate-spin" />
            )}
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {error && (
          <p role="alert" className="bg-danger/5 px-5 py-3 text-xs text-danger sm:px-7">
            {error}
          </p>
        )}
      </div>

      {/* output */}
      <div className="lg:sticky lg:top-24">
        {loading ? (
          <ResultsSkeleton count={formats.length} />
        ) : results ? (
          <ResultsPanel
            outputs={results.outputs}
            missing={results.missing}
            provider={results.provider}
            onRegenerate={regenerateOne}
          />
        ) : showWaitlist ? (
          <WaitlistPrompt email={usage.state.user_email} firstName={usage.state.user_first_name} />
        ) : (
          <ResultsEmpty picked={formats} />
        )}
        {!loading && results && showWaitlist && (
          <div className="mt-4">
            <WaitlistPrompt email={usage.state.user_email} firstName={usage.state.user_first_name} />
          </div>
        )}
      </div>

      {showGate && (
        <EmailGate
          onClose={() => setShowGate(false)}
          onSubmit={(email, firstName) => {
            usage.setLead(email, firstName);
            setShowGate(false);
            runGenerate(email, firstName);
          }}
        />
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
