"use client";

import { useCallback, useEffect, useState } from "react";
import { FormatId } from "./formats";

const KEY = "repurposer_io_v1";

export interface UsageState {
  user_email: string;
  user_first_name: string;
  tries_used: number;
  max_tries: number;
  last_generation: { timestamp: string; formats: FormatId[] } | null;
}

const MAX_TRIES = Number(process.env.NEXT_PUBLIC_MAX_TRIES || 3);

function fresh(): UsageState {
  return {
    user_email: "",
    user_first_name: "",
    tries_used: 0,
    max_tries: MAX_TRIES,
    last_generation: null,
  };
}

function read(): UsageState {
  if (typeof window === "undefined") return fresh();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as Partial<UsageState>;
    return {
      ...fresh(),
      ...parsed,
      max_tries: MAX_TRIES, // env is the source of truth
    };
  } catch {
    return fresh();
  }
}

function write(state: UsageState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode / disabled storage: gate simply won't persist */
  }
}

export function useUsage() {
  const [state, setState] = useState<UsageState>(fresh);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const setLead = useCallback((email: string, firstName: string) => {
    setState((prev) => {
      const next = { ...prev, user_email: email, user_first_name: firstName };
      write(next);
      return next;
    });
  }, []);

  const recordGeneration = useCallback((formats: FormatId[]) => {
    setState((prev) => {
      const next: UsageState = {
        ...prev,
        tries_used: prev.tries_used + 1,
        last_generation: { timestamp: new Date().toISOString(), formats },
      };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = fresh();
    // keep the email + name so they don't re-enter them
    setState((prev) => {
      const merged = { ...next, user_email: prev.user_email, user_first_name: prev.user_first_name };
      write(merged);
      return merged;
    });
  }, []);

  const triesLeft = Math.max(0, state.max_tries - state.tries_used);
  const canGenerate = triesLeft > 0;

  return {
    state,
    hydrated,
    triesLeft,
    canGenerate,
    hasEmail: Boolean(state.user_email),
    setLead,
    recordGeneration,
    reset,
  };
}
