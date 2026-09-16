"use client";

import { useState } from "react";

export function WaitlistPrompt({ email }: { email: string }) {
  const [joined, setJoined] = useState(false);
  const [sending, setSending] = useState(false);

  const join = async () => {
    setSending(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      /* do not punish them for our network */
    } finally {
      setJoined(true);
      setSending(false);
    }
  };

  return (
    <div className="rise rounded-card border border-accent/25 bg-accent-wash p-6 sm:p-7">
      <h3 className="font-display text-xl text-ink">That was your last free run</h3>
      <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-soft">
        The paid plan adds unlimited runs, saved history, and reusable brand-voice profiles.
        Want first access and founder pricing?
      </p>
      {joined ? (
        <p role="status" className="mt-4 text-sm font-medium text-accent-ink">
          Done. We will email {email} the moment it opens.
        </p>
      ) : (
        <button
          type="button"
          onClick={join}
          disabled={sending}
          className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-cream-on transition-transform duration-150 hover:bg-accent-ink active:translate-y-px disabled:opacity-50"
        >
          {sending ? "Adding You…" : "Join the Waitlist"}
        </button>
      )}
    </div>
  );
}
