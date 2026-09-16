import { Reveal } from "./Reveal";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
const steps = [
  {
    title: "Start with your original.",
    body: "A newsletter, a blog post, a transcript, or that thought in your notes app. Bring up to 2,000 words.",
  },
  {
    title: "Choose where it goes.",
    body: "Pick up to three formats. Add your audience and tone for a result that feels more like you.",
  },
  {
    title: "Make it yours. Put it out there.",
    body: "Review, copy, and publish. Want another angle? Rewrite an individual format without starting over.",
  },
];
export function HowItWorks() {
  return (
    <section id="how" className="process-section section-wrap scroll-mt-24">
      <div className="process-layout">
        <div className="process-heading">
          <p className="section-kicker">A simpler way to create</p>
          <h2>
            You did the thinking.
            <br />
            <span>We'll do the reshaping.</span>
          </h2>
          <p>
            Keep the part you love about creating.
            <br />
            Skip the part that feels like copy-paste.
          </p>
          <a className="text-link" href="#tool">
            Start creating <ArrowRight size={17} />
          </a>
        </div>
        <div className="process-steps">
          {steps.map(({ title, body }, i) => (
            <Reveal key={title} className="process-step">
              <span className="step-count">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
