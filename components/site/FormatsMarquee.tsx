import {
  ChatText,
  VideoCamera,
  Article,
  SquaresFour,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
const groups = [
  {
    Icon: ChatText,
    title: "Start a conversation.",
    kind: "Social posts",
    formats: "Instagram · LinkedIn · Facebook · X · Threads",
    body: "A new angle for every feed. Hooks, length, and structure that belong on the platform.",
    sample: "Your best content might already be sitting in your notes app.",
  },
  {
    Icon: VideoCamera,
    title: "Give your ideas a voice.",
    kind: "Video content",
    formats: "Reel scripts · YouTube descriptions",
    body: "A hook worth recording. A script you can actually say. Descriptions that help people find you.",
    sample: "[HOOK] You don't need to start from a blank page today.",
  },
  {
    Icon: SquaresFour,
    title: "One thought at a time.",
    kind: "Carousels",
    formats: "Slide-by-slide posts + captions",
    body: "Turn your process into a story people can swipe through, save, and come back to.",
    sample: "01 / You don't need more ideas. You need more from your ideas.",
  },
  {
    Icon: Article,
    title: "Join the discussion.",
    kind: "Community posts",
    formats: "Reddit posts",
    body: "A real point of view, written for a real conversation. No hard sell or hashtag wall.",
    sample:
      "I tried reworking an old newsletter instead of writing something new. Here's what I noticed.",
  },
];
export function FormatsMarquee() {
  return (
    <section
      id="formats"
      className="formats-story scroll-mt-20"
      aria-labelledby="formats-title"
    >
      <div className="formats-sticky">
        <div className="formats-heading section-wrap">
          <div>
            <p className="section-kicker">9 FORMATS. YOUR POINT OF VIEW.</p>
            <h2 id="formats-title">
              Made for the platform.
              <br />
              <span>Written like you.</span>
            </h2>
          </div>
          <a href="#tool" className="text-link">
            Find your format <ArrowUpRight size={18} />
          </a>
        </div>
        <div
          className="formats-window"
          tabIndex={0}
          role="region"
          aria-label="Content formats"
        >
          <div className="formats-track">
            {groups.map(({ Icon, title, kind, formats, body, sample }) => (
              <article className="format-panel" key={kind}>
                <div className="format-panel-top">
                  <Icon size={28} weight="light" />
                  <span>{kind}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <blockquote>
                  <span>EXAMPLE</span>
                  {sample}
                </blockquote>
                <div className="format-platforms">{formats}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
