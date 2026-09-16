import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const QA = [
  {
    q: "Is it actually free?",
    a: "Three runs per browser, no account and no card. When those are used up you can join the waitlist for the paid plan, which adds unlimited runs, saved history, and reusable brand-voice profiles.",
  },
  {
    q: "What happens to my email?",
    a: "It unlocks the free runs and goes on a list for occasional product updates. It is not sold and not shared. There is no password and no verification step.",
  },
  {
    q: "Do you store what I paste?",
    a: "No. Your content is sent to the model to generate the posts and is not written to a database. Once you close the tab, nothing about the session remains.",
  },
  {
    q: "Which model writes the posts?",
    a: "Gemini first, with Groq as an automatic backup if Gemini is slow or unavailable. Both get the same structured prompt, so the rules are identical either way.",
  },
  {
    q: "Can I control the voice?",
    a: "Open the Context panel and add your niche, audience, tone, and what you want the post to drive. The more you give it, the closer the output lands. Saved brand-voice profiles are on the roadmap.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="faq-section section-wrap scroll-mt-24">
      <div className="faq-layout">
        <Reveal>
          <p className="section-kicker">A few things to know</p>
          <h2>
            Good questions.
            <br />
            <span>Short answers.</span>
          </h2>
        </Reveal>

        <div className="divide-y divide-line">
          {QA.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex items-center justify-between gap-4 text-[15px] font-semibold text-ink">
                {item.q}
                <Plus
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-ink-soft">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
