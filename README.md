# Repurposer.io

Paste one piece of content (up to 2,000 words), pick up to 3 output formats, get
platform-native posts back, written in the creator's voice. Gemini primary, Groq fallback.
No database. Free-tier usage is tracked in the browser via `localStorage`.

Built from `plan (10).md`. Voice and de-AI rules are baked into the model prompts from the
`content-repurposing` and `humanizer` skills in `context/`.

## Stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS v4, `next/font` (Newsreader + Manrope), `@phosphor-icons/react`
- Motion drives scroll-linked 3D transforms without per-frame React renders.
- API route `app/api/generate/route.ts` runs all LLM calls server-side (keys never reach the client)
- No DB. `localStorage` schema in `lib/useUsage.ts`

## Page structure

`app/page.tsx` is a marketing landing page (server component) that composes `components/site/*`:
Navbar, Hero, the tool (`components/Workbench.tsx`), HowItWorks, FormatsMarquee, VoiceSection,
Faq, FinalCta, SiteFooter. The design uses cream (#FFF9F1), umber (#271512), and
terracotta (#7A1F2B) for actions, numerals, and eyebrows. Newsreader handles display
type and italic emphasis; Manrope handles body text and UI. The serif wordmark
keeps its coral (#FF8874) dot. Marketing
styles live in `app/site.css`; shared product tokens live in `app/globals.css`.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in keys (GEMINI_API_KEY, optional GROQ_API_KEY)
npm run dev
```

Open http://localhost:3000.

If that port is occupied, run `npm run dev -- --port 3001` and open
http://localhost:3001 instead.

### Scroll experience

The desktop hero separates an original idea, an interactive example, and a result
note in 3D. Example tabs and copy controls work locally without API calls. The
walkthrough keeps its heading in view, and four format groups pan with vertical scrolling.
`components/site/ScrollExperience.tsx` owns motion subscriptions and cleanup.
Mobile uses a compact hero and a swipeable formats track. Reduced-motion mode
removes the scroll choreography; content remains usable without JavaScript.

### Environment variables

| Var | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | yes (or Groq) | Primary provider. https://aistudio.google.com/app/apikey |
| `GEMINI_MODEL` | no | Default `gemini-2.5-flash` |
| `GROQ_API_KEY` | no | Fallback provider. https://console.groq.com/keys |
| `GROQ_MODEL` | no | Groq chat model (not `whisper-*`). Default `openai/gpt-oss-120b` |
| `EMAIL_WEBHOOK_URL` | no | Captured emails are POSTed here as `{ email, ts, source, ... }`. Point it at a GHL inbound webhook, Zapier/Make, or a Google Apps Script endpoint. |
| `NEXT_PUBLIC_MAX_TRIES` | no | Free generations per browser. Default `3` |
| `NEXT_PUBLIC_MAX_WORDS` | no | Input word cap. Default `2000` |

If neither LLM key is set, the API returns a clear 503 and the UI shows the error.

## How generation works

1. One request per generation. All selected formats go to the model in a single call with a
   structured prompt; the model returns a JSON object keyed by format id.
2. Fallback chain: Gemini, then Gemini retry once, then Groq. If all fail, the API returns
   `consumed: false` and the client does **not** count the try.
3. A last-resort `stripEmDashes` pass runs server-side on every output.

Per-format rules (length, hook style, hashtag/CTA conventions, platform constraints) live in
`lib/formats.ts`. Global voice + banned-phrase rules live in `lib/prompt.ts`.

## Formats

Instagram caption, Instagram Reel script, LinkedIn post, Facebook post, Twitter/X post,
Threads post, YouTube description, Reddit post, Carousel (slide-by-slide + caption).

## Known MVP limitations

- `localStorage` try-tracking is bypassable (incognito, clearing storage, another browser).
  Fine for validation, not a real paywall. Move to a DB keyed by email + IP/fingerprint when
  abuse shows up.
- No auth. Email is lead capture only, not verified.
- No persistence of past generations.

## Deploy

Vercel. Push the repo, set the env vars in the project settings, deploy. `maxDuration` on the
generate route is set to 60s for the LLM calls.

## Roadmap (from the plan)

- Phase 3: analytics on which formats get picked most (PostHog)
- Phase 4: DB-backed usage, accounts, paid tiers, saved history, brand-voice profiles
