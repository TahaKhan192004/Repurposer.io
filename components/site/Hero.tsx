import {
  ArrowUpRight,
  ArrowRight,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
  RedditLogo,
  XLogo,
  ThreadsLogo,
} from "@phosphor-icons/react/dist/ssr";
import { ExampleStudio } from "./ExampleStudio";

export function Hero() {
  return (
    <>
      <section id="top" className="scroll-story" aria-labelledby="hero-title">
        <div className="story-sticky">
          <div className="story-layout">
            <div className="story-copy">
              <p className="hero-label">Less rewriting. More creating.</p>
              <h1 id="hero-title">
                Your ideas.
                <br />
                <span>Everywhere.</span>
              </h1>
              <p className="hero-description">
                Turn one draft into content for every platform.
                <br className="desktop-break" /> All the right formats. All in
                your voice.
              </p>
              <div className="hero-actions">
                <a href="#tool" className="button-primary">
                  Start creating <ArrowUpRight size={19} />
                </a>
                <a href="#how" className="text-link">
                  See how it works <ArrowRight size={16} />
                </a>
              </div>
            </div>
            <ExampleStudio />
          </div>
          <div className="hero-bottom">
            <span>Made for the ideas you already have.</span>
            <span>
              3 free runs <span aria-hidden="true">/</span> No account needed
            </span>
          </div>
        </div>
      </section>
      <div className="platform-strip">
        <p>One draft. A whole lot of places to go.</p>
        <div>
          {[
            [InstagramLogo, "Instagram"],
            [LinkedinLogo, "LinkedIn"],
            [XLogo, "X"],
            [YoutubeLogo, "YouTube"],
            [ThreadsLogo, "Threads"],
            [RedditLogo, "Reddit"],
          ].map(([Icon, label]) => {
            const Mark = Icon as typeof InstagramLogo;
            return (
              <span key={String(label)}>
                <Mark size={21} weight="regular" />
                {String(label)}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
