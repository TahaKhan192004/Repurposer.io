import { ArrowUpRight, ArrowsSplit } from "@phosphor-icons/react/dist/ssr";
export function FinalCta() {
  return (
    <section className="final-section section-wrap">
      <div className="closing-message">
        <p className="section-kicker">An idea worth sharing</p>
        <span className="closing-icon">
          <ArrowsSplit size={34} weight="bold" />
        </span>
        <h2>
          Good ideas deserve
          <br />
          <em>more than one post.</em>
        </h2>
        <p>Start with what you've already written.</p>
        <a href="#tool" className="button-primary">
          Start creating <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
