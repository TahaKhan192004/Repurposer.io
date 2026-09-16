import { Reveal } from "./Reveal";
import { Check, Fingerprint, X } from "@phosphor-icons/react/dist/ssr";
export function VoiceSection() {
  return (
    <section className="voice-section section-wrap">
      <Reveal className="voice-copy">
        <p className="section-kicker">Your voice, kept intact</p>
        <Fingerprint size={42} weight="thin" />
        <h2>
          A different format.
          <br />
          <span>Not a different you.</span>
        </h2>
        <p>
          Your perspective is the whole point. Keep the details, the opinions,
          and the way you actually talk.
        </p>
        <ul>
          <li>
            <Check size={17} />
            Your tone, not a template
          </li>
          <li>
            <Check size={17} />A fresh angle for each platform
          </li>
          <li>
            <Check size={17} />
            No filler. No forced enthusiasm.
          </li>
        </ul>
      </Reveal>
      <Reveal className="voice-example">
        <div className="voice-before">
          <span>
            <X size={15} />
            THE GENERIC VERSION
          </span>
          <p>
            “Unlock the power of content and elevate your digital presence.”
          </p>
        </div>
        <div className="voice-after">
          <span>
            <Check size={15} />
            MORE LIKE YOU
          </span>
          <p>
            “I spent Sunday writing one newsletter. It became my posts for the
            whole week.”
          </p>
          <small>Illustrative rewrite</small>
        </div>
      </Reveal>
    </section>
  );
}
