"use client";

import { Check, Plus } from "@phosphor-icons/react";
import { FORMATS, FormatId, MAX_FORMATS } from "@/lib/formats";

export function FormatPicker({
  selected,
  onChange,
  onOverLimit,
}: {
  selected: FormatId[];
  onChange: (next: FormatId[]) => void;
  onOverLimit: () => void;
}) {
  const toggle = (id: FormatId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
      return;
    }
    if (selected.length >= MAX_FORMATS) {
      onOverLimit();
      return;
    }
    onChange([...selected, id]);
  };

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-ink">Output formats</h2>
        <span
          aria-live="polite"
          className="font-mono text-xs tabular-nums text-ink-faint"
        >
          {selected.length} / {MAX_FORMATS}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((f, i) => {
          const isOn = selected.includes(f.id);
          const isBlocked = !isOn && selected.length >= MAX_FORMATS;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              aria-pressed={isOn}
              title={f.blurb}
              style={{ "--index": i } as React.CSSProperties}
              className={[
                "fade-up inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium",
                "transition-[background-color,border-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "active:translate-y-px",
                isOn
                  ? "border-accent bg-accent text-cream-on"
                  : isBlocked
                    ? "border-line bg-surface text-ink-faint opacity-55"
                    : "border-line-strong bg-surface text-ink-soft hover:border-ink/40 hover:text-ink",
              ].join(" ")}
            >
              {isOn ? (
                <Check size={13} weight="bold" aria-hidden />
              ) : (
                <Plus size={13} weight="bold" aria-hidden className="opacity-45" />
              )}
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
