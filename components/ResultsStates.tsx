"use client";

import { TextAlignLeft } from "@phosphor-icons/react";
import { FORMAT_BY_ID, FormatId } from "@/lib/formats";

export function ResultsSkeleton({ count }: { count: number }) {
  return (
    <div
      role="status"
      aria-label="Generating"
      className="rounded-card border border-line bg-surface p-4 shadow-pop sm:p-5"
    >
      <div className="mb-4 flex gap-1.5">
        {Array.from({ length: Math.max(1, count) }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer h-7 rounded-full bg-line"
            style={{ width: 78 + ((i * 26) % 40) }}
          />
        ))}
      </div>
      <div className="skeleton-shimmer rounded-input border border-line bg-paper/50 p-4">
        <div className="space-y-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 rounded bg-line"
              style={{ width: `${62 + ((i * 17) % 34)}%` }}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink-faint">
        Writing in your voice, one platform at a time…
      </p>
    </div>
  );
}

export function ResultsEmpty({ picked }: { picked: FormatId[] }) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-8 text-center shadow-pop">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-input border border-line bg-surface">
        <TextAlignLeft size={20} weight="regular" aria-hidden className="text-ink-faint" />
      </div>
      <p className="mt-4 text-sm font-medium text-ink">Your rewrites land here</p>
      <p className="mx-auto mt-1 max-w-[34ch] text-xs leading-relaxed text-ink-soft">
        {picked.length === 0
          ? "Paste a draft, choose up to three formats, then generate."
          : "One tab per format, each with its own copy button and a rewrite option."}
      </p>
      {picked.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {picked.map((id) => (
            <span
              key={id}
              className="rounded-full border border-line bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink-soft"
            >
              {FORMAT_BY_ID[id].label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
