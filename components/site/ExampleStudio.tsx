"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
  ArrowsSplit,
} from "@phosphor-icons/react";

const POSTS = [
  {
    name: "LinkedIn",
    Icon: LinkedinLogo,
    text: "Your best content might already be written.\n\nThat lesson from a client call. The thought in your notes app. The newsletter you sent last Tuesday.\n\nStart there. Give one good idea a different angle, and a new audience a reason to care.",
  },
  {
    name: "Instagram",
    Icon: InstagramLogo,
    text: "Your notes app is a content plan in disguise.\n\nA lesson you learned. A question you keep getting. An idea you can't stop thinking about.\n\nYou don't always need a new idea. Sometimes you just need a new way to share it.\n\nSave this for your next writing day.",
  },
  {
    name: "X",
    Icon: XLogo,
    text: "You don't need 10 new ideas.\n\nYou need one good idea, told 10 different ways.\n\nStart with the draft already in your notes.",
  },
];

export function ExampleStudio() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");
  const post = POSTS[active];
  async function copy() {
    try {
      await navigator.clipboard.writeText(post.text);
      setMessage("Copied to clipboard");
    } catch {
      setMessage("Copy unavailable. Select the text to copy it.");
    }
  }
  return (
    <div className="content-scene">
      <div className="scene-grid" aria-hidden />
      <div className="content-deck">
        <div className="source-note sheet-linkedin">
          <span>
            <ArrowsSplit size={15} /> YOUR ORIGINAL IDEA
          </span>
          <p>
            “You don’t need more ideas.
            <br />
            You need more from your ideas.”
          </p>
        </div>
        <div className="studio-panel sheet-draft">
          <div className="studio-header">
            <span className="studio-symbol">
              <ArrowsSplit size={18} weight="bold" />
            </span>
            <strong>One draft, three directions</strong>
            <span className="example-label">Live example</span>
          </div>
          <div
            className="studio-tabs"
            role="tablist"
            aria-label="Example post format"
          >
            {POSTS.map(({ name, Icon }, i) => (
              <button
                key={name}
                id={`example-tab-${i}`}
                role="tab"
                aria-selected={active === i}
                aria-controls="example-post"
                tabIndex={active === i ? 0 : -1}
                onKeyDown={(e) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : (active + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                    setActive(next);
                    setMessage("");
                    document.getElementById(`example-tab-${next}`)?.focus();
                  }
                }}
                onClick={() => {
                  setActive(i);
                  setMessage("");
                }}
              >
                <Icon size={17} weight="bold" />
                {name}
              </button>
            ))}
          </div>
          <div
            id="example-post"
            role="tabpanel"
            aria-labelledby={`example-tab-${active}`}
            className="studio-post"
            tabIndex={0}
          >
            <span className="post-byline">
              <span className="author-avatar">Y</span>
              <span>
                <strong>You, in your own words</strong>
                <small>Adapted for {post.name}</small>
              </span>
            </span>
            <p>{post.text}</p>
          </div>
          <div className="studio-footer">
            <span>{post.text.length} characters</span>
            <button onClick={copy}>
              <Copy size={15} />
              Copy post
            </button>
          </div>
          <span className="studio-feedback" role="status">
            {message}
          </span>
        </div>
        <div className="ready-note sheet-instagram">
          <span>
            <Check size={18} weight="bold" />
          </span>
          <div>
            <strong>Same idea. New possibilities.</strong>
            <small>Your voice comes with you.</small>
          </div>
          <ArrowUpRight size={19} />
        </div>
      </div>
    </div>
  );
}
