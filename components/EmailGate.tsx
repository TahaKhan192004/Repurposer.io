"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { isValidEmail } from "@/lib/validate";

export function EmailGate({
  onSubmit,
  onClose,
}: {
  onSubmit: (email: string) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = isValidEmail(email);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-4 backdrop-blur-[3px] [overscroll-behavior:contain] sm:items-center"
      onMouseDown={onClose}
    >
      <div
        className="rise w-full max-w-md rounded-card border border-line bg-surface p-7 shadow-pop"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 id="gate-title" className="font-display text-xl text-ink">
            Unlock 3 Free Runs
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 rounded-lg p-2 text-ink-faint transition hover:bg-line/60 hover:text-ink"
          >
            <X size={16} weight="bold" aria-hidden />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          One email, no password, no signup flow. We send the occasional product update and
          nothing else.
        </p>

        <form
          className="mt-5 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (valid) onSubmit(email.trim());
          }}
        >
          <label htmlFor="gate-email" className="text-xs font-medium text-ink-soft">
            Email address
          </label>
          <input
            id="gate-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="you@studio.com"
            aria-invalid={touched && !valid}
            className="w-full rounded-input border border-line-strong bg-paper/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:bg-surface"
          />
          {touched && !valid && (
            <p role="alert" className="text-xs text-danger">
              That does not look like an email address.
            </p>
          )}
          <button
            type="submit"
            disabled={!valid}
            className="mt-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-cream-on transition-transform duration-150 hover:bg-accent-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
