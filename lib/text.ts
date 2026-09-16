export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

/** Strip em/en dashes the model may have slipped in, as a last-resort safety net. */
export function stripEmDashes(text: string): string {
  return text
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/ -- /g, ", ")
    .replace(/‑/g, "-"); // non-breaking hyphen some models emit
}
