"use client";

import { useState } from "react";
import { ArrowsClockwise, Check, Copy } from "@phosphor-icons/react";
import { FORMAT_BY_ID, FormatId } from "@/lib/formats";
import { countWords } from "@/lib/text";

export function ResultsPanel({
  outputs,
  missing,
  provider,
  onRegenerate,
}: {
  outputs: Record<string, string>;
  missing: string[];
  provider: string;
  onRegenerate: (id: FormatId) => Promise<void>;
}) {
  const ids = Object.keys(outputs) as FormatId[];
  const [active, setActive] = useState<FormatId>(ids[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState<FormatId | null>(null);

  const current = outputs[active] ?? "";

  const copy = async (id: FormatId) => {
    try {
      await navigator.clipboard.writeText(outputs[id]);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  const regen = async (id: FormatId) => {
    setBusy(id);
    try {
      await onRegenerate(id);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rise overflow-hidden rounded-card border border-line bg-surface shadow-pop">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2.5">
        <div
          role="tablist"
          aria-label="Generated formats"
          className="scroll-quiet -mx-1 flex min-w-0 gap-1 overflow-x-auto px-1"
        >
          {ids.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={active === id}
              onClick={() => setActive(id)}
              className={[
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active === id
                  ? "bg-accent text-cream-on"
                  : "text-ink-soft hover:bg-line/60 hover:text-ink",
              ].join(" ")}
            >
              {FORMAT_BY_ID[id].label}
            </button>
          ))}
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] text-ink-faint sm:block">
          via {provider}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] tabular-nums text-ink-faint">
            {countWords(current)} words, {current.length} chars
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => regen(active)}
              disabled={busy === active}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-accent hover:text-accent active:translate-y-px disabled:opacity-50"
            >
              <ArrowsClockwise
                size={12}
                weight="bold"
                aria-hidden
                className={busy === active ? "animate-spin" : ""}
              />
              {busy === active ? "Rewriting…" : "Rewrite"}
            </button>
            <button
              type="button"
              onClick={() => copy(active)}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-cream-on transition-transform duration-150 hover:bg-accent-ink active:translate-y-px"
            >
              {copied === active ? (
                <Check size={12} weight="bold" aria-hidden />
              ) : (
                <Copy size={12} weight="bold" aria-hidden />
              )}
              <span aria-live="polite">{copied === active ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
        <pre className="scroll-quiet max-h-[58vh] overflow-auto whitespace-pre-wrap break-words rounded-input border border-line bg-paper/50 p-4 font-sans text-[13.5px] leading-relaxed text-ink">
          {current}
        </pre>
      </div>

      {missing.length > 0 && (
        <p className="border-t border-line bg-danger/5 px-4 py-3 text-xs text-danger">
          Skipped {missing.map((m) => FORMAT_BY_ID[m as FormatId]?.label ?? m).join(", ")}.
          Use Rewrite on those tabs.
        </p>
      )}
    </div>
  );
}
