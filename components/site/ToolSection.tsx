import { Workbench } from "@/components/Workbench";
import { ArrowDownRight } from "@phosphor-icons/react/dist/ssr";
export function ToolSection() {
  return (
    <section id="tool" className="tool-section section-wrap scroll-mt-24">
      <div className="tool-heading">
        <div>
          <p className="section-kicker">Your content studio</p>
          <h2>
            Let's give that draft
            <br />
            <em>a second life.</em>
          </h2>
          <p>Paste your content. Pick up to three formats. Make it yours.</p>
        </div>
        <ArrowDownRight size={58} weight="thin" aria-hidden />
      </div>
      <Workbench />
    </section>
  );
}
