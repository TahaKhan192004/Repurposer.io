/**
 * Scroll-in reveal, CSS-only via `animation-timeline: view()`.
 * No JavaScript: where the feature is unsupported (or under reduced motion),
 * content simply renders visible. Nothing is ever hidden without a way back.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Comp>
  );
}
