export type FormatId =
  | "instagram_caption"
  | "linkedin_post"
  | "facebook_post"
  | "twitter_post"
  | "threads_post"
  | "youtube_description"
  | "instagram_reel_script"
  | "reddit_post"
  | "carousel";

export interface FormatDef {
  id: FormatId;
  label: string;
  blurb: string;
  /** Platform-native rules injected into the model prompt for this format. */
  rules: string;
}

/**
 * One rule block per format. These are prompt-level system instructions:
 * ideal length, tone, hook style, hashtag/CTA conventions, formatting norms,
 * and platform-specific constraints. Kept deliberately concrete so output
 * lands platform-native, not generic.
 */
export const FORMATS: FormatDef[] = [
  {
    id: "instagram_reel_script",
    label: "Instagram Reel script",
    blurb: "Talking-head script, hook + body + CTA, ~50 seconds",
    rules: `ANGLE: A personal moment or observation. One specific thing the creator noticed, experienced, or realised. Small and real, not a lesson.
FORMAT: Talking head, creator speaking direct to camera. Script it the way a person actually talks, not the way polished copy reads.
STRUCTURE with timing labels:
  [HOOK] 0:00-0:05  one sentence, stops the scroll, one specific claim or observation. Not a question, not a statistic, not "have you ever". Works with zero context.
  [BODY] 0:05-0:40  spoken lines, one idea per line. No jargon without a plain-English translation right after. At least one concrete detail, number, or example. Build toward the CTA, do not land the main point too early.
  [CTA]  0:40-0:50  one action only, matched to the creator's CTA goal, said conversationally like telling a friend.
LENGTH: ~50 seconds total (~120-150 spoken words).
NO hashtags in a script. Return the lines only, with the bracketed section labels.`,
  },
  {
    id: "instagram_caption",
    label: "Instagram caption",
    blurb: "Scroll-stopping first line, short paragraphs, 3-5 hashtags",
    rules: `IDEAL LENGTH: 80-180 words. First line under 125 characters because that is the visible cutoff before "more".
HOOK: First line is a specific claim or moment, not a question, not "Let's talk about". It must earn the tap.
TONE: One person talking to one person. Warm through specificity, not enthusiasm.
FORMATTING: Short paragraphs, 1-2 sentences each, blank line between them. Line breaks do the work. No headers, no numbered lists.
CTA: One soft CTA near the end, matched to the creator's goal (comment a keyword, DM, link in bio, save this). Optional if it would feel bolted on.
HASHTAGS: 3 to 5, specific and niche, placed on their own line at the very end. No generic tags like #love #instagood. No hashtag walls.
EMOJI: At most 1-2, only if they replace a word. Never decorative rows.`,
  },
  {
    id: "linkedin_post",
    label: "LinkedIn post",
    blurb: "Professional insight, declarative opener, 200-350 words",
    rules: `ANGLE: Business case or professional insight. What this means for how someone runs their work or career. This is NOT a shorter Facebook post.
OPENER: A single declarative sentence. Specific. No preamble. It must land before the "...see more" cutoff (roughly the first 210 characters).
STRUCTURE: Short paragraphs, one idea each, each adding something new. Include at least one concrete results-oriented detail: a time saved, a process change, a before/after, a measurable outcome.
CLOSE: A clear point of view. Not a question, not "I'd love to hear your thoughts", not "Agree?".
LENGTH: 200-350 words, under 2,800 characters.
FORMATTING: No headers. No bullet lists unless there are 4+ genuinely distinct list items. No em dashes.
HASHTAGS: 3 at most, on the final line, specific to the topic. Often better with zero.`,
  },
  {
    id: "facebook_post",
    label: "Facebook post",
    blurb: "A point of view that challenges a default, prose only, 150-400 words",
    rules: `ANGLE: Opinion or point of view. A clear take that challenges a default assumption the audience holds, without shaming them.
OPENER: A statement that is interesting without being clickbait. The most relatable entry point, not the most technical one. Do not start with "I", a question, or a statistic.
BUILD: Into the opinion through specifics. At least one real detail, number, observation, or concrete scenario.
CLOSE: A thought that feels complete. End on a real observation or open statement. Never "drop a comment below" or a manufactured engagement question.
LENGTH: 150-400 words, under 2,800 characters.
FORMATTING: Short paragraphs, 1-3 sentences each, white space between them. No headers, no bullet points, prose only.
HASHTAGS: None. Facebook posts do not use them.
CTA: Optional. If present it should read like an afterthought, not a campaign.`,
  },
  {
    id: "twitter_post",
    label: "Twitter / X post",
    blurb: "Single post under 280 chars, or a tight thread",
    rules: `DEFAULT: One post, hard limit 280 characters including spaces. Count it.
IF the idea genuinely needs more room: a thread of 3-6 tweets, each its own numbered line (1/ 2/ ...), each under 280 characters and each able to stand alone.
HOOK: The first tweet is the whole pitch. Specific claim or observation. No "A thread 🧵" throat-clearing on the first line unless it is a thread, and even then keep it minimal.
TONE: Direct, a little sharp, conversational. Lowercase is fine if it fits the creator's voice.
HASHTAGS: 0-1 maximum, only if it is a real community tag.
NO link-in-bio language. One clear line if there is a CTA.
Return the character count for the single-post version in parentheses at the end, e.g. (241/280).`,
  },
  {
    id: "threads_post",
    label: "Threads post",
    blurb: "Conversational, 1-3 short paragraphs, ~500 char sweet spot",
    rules: `LENGTH: 300-500 characters is the sweet spot. Hard limit 500 characters.
TONE: More casual and conversational than LinkedIn, less performative than X. Like texting a smart friend an observation.
HOOK: A specific take or small moment in the first sentence.
FORMATTING: 1-3 short paragraphs. Minimal punctuation. No headers, no lists.
HASHTAGS: None, or one at most. Threads culture does not use them heavily.
CTA: Usually none. If present, an invitation to reply with a specific experience, phrased naturally.
Return the character count in parentheses at the end.`,
  },
  {
    id: "youtube_description",
    label: "YouTube description",
    blurb: "First 2 lines hook + keywords, then chapters, links, CTA",
    rules: `STRUCTURE, in this order:
  1. First 2-3 lines: a hook summary that front-loads the main keyword and the payoff. This is what shows above "Show more" and feeds search. ~200-350 characters.
  2. A blank line, then a fuller 2-4 sentence paragraph on what the video covers and who it is for.
  3. "Chapters:" followed by timestamp lines starting at 00:00, e.g. "00:00 Intro". Generate 4-7 plausible chapter titles from the source content. Mark the timestamps as estimates with [approx] on the first one.
  4. "Links:" section with placeholder lines the creator fills in: newsletter, the resource mentioned, socials. Use [ ] placeholders, do not invent URLs.
  5. A one-line CTA matched to the creator's goal (subscribe, grab the free thing, comment).
  6. 3-5 hashtags on the final line, specific to the topic.
LENGTH: 150-300 words total across the prose parts.
TONE: Clear and plain. This is a utility text, not a performance.`,
  },
  {
    id: "reddit_post",
    label: "Reddit post",
    blurb: "Title + body, no hype, no hashtags, genuine and specific",
    rules: `FORMAT: A "Title:" line then the post body.
TITLE: Plain, specific, curiosity through substance not clickbait. No emoji, no "You won't believe", no title case gimmicks.
BODY: First-person, genuine, specific to a real situation or question. Reddit punishes anything that smells like marketing. No hard sell, no brand voice, no CTA to a link or a funnel. If the creator has a resource, at most a single honest offer to share it in comments if asked.
STRUCTURE: 150-350 words. Short paragraphs. A concrete detail or number early. It is fine to end with a genuine question to the subreddit if it is specific.
NO hashtags. NO "edit: thanks for the awards". NO em dashes.
TONE: Like a real person posting to people who will call out anything fake.`,
  },
  {
    id: "carousel",
    label: "Carousel (slide-by-slide)",
    blurb: "8-11 slides, one idea each, trust slide + CTA, plus caption",
    rules: `ANGLE: Process or framework. The practical how. Steps, shifts, or a named way of thinking the audience can apply immediately.
HOOK TYPE: Choose one and state it: contrarian/myth-busting, personal story + outcome, number hook, curiosity/teaser, or direct call-out.
SLIDE COUNT: 8 to 11 slides.
STRUCTURE:
  SLIDE 1 (HOOK): Broad enough for anyone to enter, does not reveal the full point, no jargon. Give Headline, Sub-text, Design note.
  MIDDLE SLIDES: One idea per slide, complete sentences, readable in 3-5 seconds, each earns the next. Give Headline (optional), Text, Design note.
  SECOND-TO-LAST (TRUST SLIDE): Name a real limitation, real setup cost, or real tradeoff. Not vague. This is what makes the rest believable.
  FINAL SLIDE (CTA): One action, matched to the creator's goal.
PER-SLIDE WORD CAP: ~25 words of on-slide text.
CAPTION: 150-400 words. Opens with the most personal or specific moment from the carousel, adds a layer the slides do not have, ends with the same CTA as the final slide. 2-4 niche hashtags on the last line.
OUTPUT: Use "SLIDE N" labels and a line of --- between slides, then "CAPTION:" at the end.`,
  },
];

export const FORMAT_BY_ID: Record<FormatId, FormatDef> = FORMATS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FormatId, FormatDef>,
);

export const MAX_FORMATS = 3;
export function isFormatId(x: string): x is FormatId {
  return x in FORMAT_BY_ID;
}
