# BUILD BRIEF — Personal Academic Website for a Data Science PhD Researcher

You are a senior front-end engineer and design lead. Build the complete, production-ready website described below, end to end, in one pass. **Do not ask clarifying questions.** Every decision you might otherwise ask about is specified here. Where personal content is unknown, use the exact placeholder tokens given in §1 and leave a `TODO(content):` comment beside each one. If any instruction in this brief is technically impossible or two instructions conflict, implement the closest working alternative, and record the deviation in `DECISIONS.md` with a one-line rationale.

Deliverable: a git repository that builds to a static site, deploys to GitHub Pages via GitHub Actions, and passes the acceptance checklist in §17.

---

## 1. IDENTITY VARIABLES — replace every occurrence

Create `src/config/site.ts` as the single source of truth. Every value below must live there and be imported everywhere; no hard-coded names, emails, or URLs anywhere else in the codebase.

```ts
export const site = {
  name: "{{FULL_NAME}}",
  shortName: "{{FIRST_NAME}}",
  role: "PhD Researcher, Data Science",
  institution: "{{UNIVERSITY}}",
  department: "{{DEPARTMENT_OR_LAB}}",
  advisor: "{{ADVISOR_NAME}}",
  location: "{{CITY}}, {{COUNTRY}}",
  email: "{{EMAIL}}",
  tagline: "{{ONE_LINE_RESEARCH_TAGLINE}}",       // ≤ 90 chars
  bio: "{{THREE_SENTENCE_BIO}}",
  domain: "https://{{GITHUB_USERNAME}}.github.io",
  repo: "{{REPO_NAME}}",                           // see §3.4 for base-path logic
  cvPdf: "/cv.pdf",
  socials: {
    scholar: "{{GOOGLE_SCHOLAR_URL}}",
    orcid: "{{ORCID_URL}}",
    github: "https://github.com/{{GITHUB_USERNAME}}",
    linkedin: "{{LINKEDIN_URL}}",
    x: "{{X_URL}}",
    bluesky: "{{BLUESKY_URL}}",
    semanticScholar: "{{SEMANTIC_SCHOLAR_URL}}",
  },
  researchAreas: [
    "{{AREA_1}}", "{{AREA_2}}", "{{AREA_3}}", "{{AREA_4}}"
  ],
  openTo: "Research collaborations, internships, and reviewing.",
} as const;
```

Any social key left as a placeholder must be filtered out of the rendered UI automatically (a link whose value still starts with `{{` is not rendered). Write that filter once, as a utility in `src/lib/config.ts`.

---

## 2. AUDIENCE, PURPOSE, TONE

Primary audience, in priority order:

1. **Faculty, hiring committees, and lab PIs** skimming for 30 seconds to decide if this person is serious. They need: name, research area, best three papers, institution, and a CV link — all visible without scrolling or clicking.
2. **Fellow researchers** who arrived from a paper, looking for code, data, BibTeX, or the full publication list.
3. **Recruiters** for industry research roles, looking for shipped artifacts and applied impact.

Tone of all copy: precise, plain, confident, never promotional. Write like a good methods section — specific nouns, active verbs, no adjectives doing work that evidence should do. Never write "passionate about," "cutting-edge," "leveraging," "innovative," "journey," or "I'm excited to." Never use exclamation marks. Sentence case for all headings and buttons.

---

## 3. TECHNICAL STACK — fixed, not negotiable

### 3.1 Core
- **Astro 5.x** (latest stable), static output (`output: 'static'`). Zero JavaScript ships by default; interactivity is added only through explicit islands listed in §9.
- **TypeScript** in `strict` mode. `noUncheckedIndexedAccess: true`. No `any`, no non-null assertions except where a comment justifies it.
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (not the legacy `@astrojs/tailwind` integration). All design tokens declared with `@theme` in `src/styles/global.css` — see §5.
- **Astro Content Collections** with **Zod** schemas for every piece of structured content (§8).
- **MDX** (`@astrojs/mdx`) for blog posts, with `remark-math` + `rehype-katex` for LaTeX and **Shiki** for code highlighting (themes: `github-light` / `github-dark-default`, dual-theme via CSS variables).
- **`@astrojs/sitemap`** for `sitemap-index.xml`; a hand-rolled RSS feed at `/rss.xml` using `@astrojs/rss`.
- Package manager: **pnpm**. Node 22 LTS. Commit the lockfile.

### 3.2 Motion
- **GSAP** (core) + **ScrollTrigger** + **SplitText** for text reveals, loaded only on pages that need them, via dynamic `import()` inside an island.
- **Lenis** for smooth scroll, wired to ScrollTrigger's ticker (do not let both run independent RAF loops).
- Before adding GSAP, verify the current license permits free use of the plugins named above. If any plugin is not freely usable, implement the equivalent with the **Web Animations API + IntersectionObserver** instead, and note the substitution in `DECISIONS.md`. Do not add a paid dependency under any circumstances.
- Canvas work in §6.1 is hand-written 2D canvas — no charting or particle library.

### 3.3 Explicitly forbidden
React, Vue, Svelte, jQuery, Bootstrap, Material UI, shadcn, DaisyUI, Framer Motion, AOS, Three.js, WebGL, Lottie, Google Fonts CDN links, Font Awesome, any analytics that sets cookies, any external CDN at runtime, any AI-generated stock imagery, emoji used as UI icons.

### 3.4 GitHub Pages base path — handle both cases correctly
- If `{{REPO_NAME}}` is exactly `{{GITHUB_USERNAME}}.github.io`: set `site: 'https://{{GITHUB_USERNAME}}.github.io'` and **omit** `base`.
- Otherwise: set `site: 'https://{{GITHUB_USERNAME}}.github.io'` and `base: '/{{REPO_NAME}}'`.
- Never write a raw `href="/about"`. Every internal link and asset path goes through a `withBase(path)` helper in `src/lib/paths.ts` built on `import.meta.env.BASE_URL`. Audit for this before finishing — broken sub-path links are the single most common failure of Astro sites on Pages.
- Create an empty `public/.nojekyll`.
- Create `public/CNAME` containing only the text `{{CUSTOM_DOMAIN_OR_DELETE_THIS_FILE}}`, and note in `README.md` that it must be deleted if no custom domain is used.

---

## 4. DESIGN DIRECTION

### 4.1 The concept: *instrument, not brochure*

The site should read like a precision scientific instrument — a plot canvas with an axis rail — rather than a startup landing page. Everything structural on the page borrows from the vocabulary of figures and notebooks: gridlines, axis ticks, figure captions, footnote markers, monospaced identifiers. This is the organising idea; every design choice below serves it. Restraint is the point: one memorable moment (§6.1), everything else quiet and exact.

### 4.2 Things that would make this look generated — avoid all of them
- A fade-and-slide-up entrance on every section, and a lift-and-shadow hover on every card.
- Identical rounded cards with the same radius and the same soft grey shadow for every kind of content.
- Tracked-out ALL-CAPS eyebrow labels above headings.
- Meta strings joined with middle dots (`A · B · C`) and labels built as `WORD — fragment`.
- A `→` glued onto every button and link label.
- Purple-to-pink gradient washes as decoration.
- Accenting one word of a headline in a different colour.
- Vanity counters that tick up ("500+ commits", "10k lines of code").
- A centred hero with a big gradient blob behind it.

### 4.3 Colour — declare exactly these tokens

Dark is the default theme; light is a real, equally finished second theme (not an afterthought). Base is a deep navy ink with genuine hue, never a tinted near-black.

```
DARK (default)
--ink-900      #0A1424   page background
--ink-850      #0D1A2D   sunken wells, code blocks
--ink-800      #11203A   raised surfaces
--ink-700      #1B3055   hairlines, borders, gridlines
--ink-600      #2C4571   dividers at emphasis
--mist-400     #7D93B2   muted / metadata text
--mist-200     #C3D2E6   body text
--mist-50      #F1F6FD   headings, high-emphasis text
--signal       #47DFC6   primary accent (links, focus, active)
--pulse        #7C6BFF   secondary accent (data ramp only)
--amber        #FFB547   rare tertiary: "in press", awards, "new"

LIGHT
--paper-50     #F5F7FB   page background
--paper-100    #EDF1F7   sunken wells
--paper-0      #FFFFFF   raised surfaces
--rule-300     #D4DEEC   hairlines, gridlines
--slate-500    #5A6C88   muted text
--slate-800    #1E2C44   body text
--slate-950    #0A1424   headings
--signal-ink   #0E9C86   primary accent
--pulse-ink    #5847D6   secondary accent
--amber-ink    #B06E00   tertiary
```

Rules: `--signal` and `--pulse` may appear together **only** as a two-stop ramp on things that are genuinely data (the hero canvas, sparklines, the scroll-progress rail, chart strokes). Never as a decorative background gradient. `--amber` appears at most twice per viewport. Total accent coverage stays under roughly 5% of any screen.

### 4.4 Typography — exactly three families, self-hosted

Install via Fontsource npm packages and self-host as `woff2`; subset to `latin` + `latin-ext`. Preload only the two faces used above the fold.

| Role | Family | Use |
|---|---|---|
| Display | **Instrument Serif** (400, + italic) | h1, h2, pull quotes, paper titles in the selected-work list |
| Text | **Geist Sans Variable** (400/500/600) | all body copy, navigation, buttons, labels |
| Mono | **JetBrains Mono Variable** (400/500) | DOIs, arXiv IDs, code, BibTeX, version tags, axis tick labels |

Monospace is reserved for text that is genuinely an identifier or code. Never use it for decorative small labels — that is a tell.

Type scale (fluid, `clamp()`, ratio ~1.25 at mobile widening to ~1.333 at desktop):

```
--step--1  clamp(0.833rem, 0.80rem + 0.15vw, 0.9rem)
--step-0   clamp(1rem,     0.96rem + 0.20vw, 1.0625rem)
--step-1   clamp(1.25rem,  1.18rem + 0.36vw, 1.42rem)
--step-2   clamp(1.563rem, 1.44rem + 0.62vw, 1.9rem)
--step-3   clamp(1.953rem, 1.75rem + 1.02vw, 2.53rem)
--step-4   clamp(2.441rem, 2.11rem + 1.66vw, 3.38rem)
--step-5   clamp(3.052rem, 2.53rem + 2.61vw, 4.5rem)
--step-6   clamp(3.815rem, 3.02rem + 3.98vw, 6.0rem)
```

Body: `--step-0`, line-height 1.65, max line length **68 characters** (`max-width: 68ch`). Display serif: line-height 1.04, letter-spacing `-0.02em`. Never set body text below `--step--1`. All headings sentence case.

### 4.5 Layout — the plot canvas

- 12-column grid, gutter `--space-5`, page max-width `1320px`, side padding `clamp(1.25rem, 5vw, 5rem)`.
- Content sits in columns **2–9** on desktop — deliberately asymmetric, left-aligned, never centre-aligned body text.
- Columns **10–12** form a persistent **axis rail**: a 1px vertical hairline in `--ink-700` carrying section tick marks, the current section name set in `--step--1`, and a scroll-progress segment filled with the signal→pulse ramp. It behaves like the y-axis of a figure. Hidden below 1024px, replaced by a 2px progress bar pinned under the header.
- A faint graticule (1px lines, `--ink-700` at 22% opacity, 96px cells) sits behind the page, masked by a radial gradient so it's densest near the viewport centre and fades at the edges. It must never be visible over body text at more than 22% opacity.
- Spacing scale (use these tokens only, never arbitrary values): `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192px` → `--space-1 … --space-11`.
- Radii are meaningful, not uniform: `0px` for figure frames and table cells, `4px` for inputs and tags, `10px` for interactive surfaces (cards, buttons), `999px` only for the avatar and filter pills.
- Borders carry the structure; shadows are used sparingly and only on genuinely floating elements (command palette, dropdown, sticky header once scrolled). One shadow token: `0 18px 50px -12px rgb(0 0 0 / 0.55)` dark, `0 18px 50px -18px rgb(16 32 56 / 0.18)` light.
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

### 4.6 Iconography
Inline SVG only, 1.5px stroke, 20×20 box, `currentColor`, stored in `src/icons/` and rendered through a single `<Icon name="..." />` component. Maximum 14 distinct icons across the whole site. No icon fonts, no emoji.

---

## 5. TOKENS IN CODE

Put every token above into `src/styles/global.css` using Tailwind v4's `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-ink-900: #0A1424;
  /* …all colour tokens… */
  --font-display: "Instrument Serif", ui-serif, Georgia, serif;
  --font-sans: "Geist Sans Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --dur-fast: 160ms;
  --dur-base: 320ms;
  --dur-slow: 620ms;
  --dur-signature: 2400ms;
}
```

Theme switching: `data-theme="dark" | "light"` on `<html>`, with light-theme token overrides in a `[data-theme="light"]` block. Resolve the initial theme in a tiny **blocking inline script in `<head>`** that reads `localStorage.theme` and falls back to `prefers-color-scheme` — there must be **zero** flash of the wrong theme. Also set `<meta name="color-scheme">` and update `theme-color` on toggle.

---

## 6. MOTION SPECIFICATION

Motion hierarchy: **one signature moment**, a small set of interaction responses, nothing else. If an animation does not either (a) explain a change the user caused or (b) constitute the one signature moment, delete it.

### 6.1 The signature moment — hero embedding field

A `<canvas>` behind the hero headline, occupying the full hero block, `devicePixelRatio`-aware, resize-observed.

- **1,400 points**, radius 1.2–2.0px, colour interpolated along the `--signal` → `--pulse` ramp by cluster assignment.
- **Phase 1 (0–400ms):** points appear as uniform random noise across the canvas, opacity 0 → 0.9.
- **Phase 2 (400–2400ms):** points relax into **four** well-separated Gaussian clusters, as if a dimensionality reduction converged. Interpolate each point from its noise position to its target with an ease-out-expo curve and a per-point stagger of 0 to 600ms derived from its index, so the structure emerges progressively rather than all at once.
- **Phase 3 (steady state):** each point drifts on a slow, low-amplitude 2D noise field (≤ 0.25px per frame). Between the two nearest clusters, draw ~40 thin connecting lines at 8% opacity that fade in and out on a 6s cycle — a suggestion of a graph, not a full mesh.
- **Pointer interaction:** the cursor applies a soft repulsion within a 130px radius, falling off quadratically; points ease back over 900ms. On touch devices, disable repulsion entirely.
- **Performance:** cap at 60fps with a fixed timestep; pause the RAF loop when the canvas is out of the viewport (IntersectionObserver) or the tab is hidden (`visibilitychange`). Total island JS for this must stay under 12KB gzipped.
- **Reduced motion / no-JS:** render a single static frame of the converged state, no animation, no pointer handling.

The headline sits above it: `h1` in Instrument Serif at `--step-6`, revealed with SplitText by line — each line clipped by an overflow-hidden wrapper and moved from `110%` to `0%` over 620ms, ease-out-expo, 70ms stagger, starting at 250ms. One reveal, once, never repeated on scroll-back.

### 6.2 Interaction responses (the only other motion allowed)

| Trigger | Response | Timing |
|---|---|---|
| Scroll | Axis rail progress segment fills; the active section tick grows from 8px to 16px and its label crossfades | linear / 200ms |
| Hover a publication row | Row background lifts to `--ink-800`; a 1px left border in `--signal` wipes down from top; the year in the left gutter shifts to `--signal` | 160ms, ease-out-quint |
| Click a publication row | Row expands in place to reveal abstract, BibTeX block, and links. Animate `grid-template-rows: 0fr → 1fr` (never animate `height: auto`) | 320ms, ease-out-quint |
| Click "Copy BibTeX" | Button label crossfades to "Copied", icon swaps to a check, reverts after 1600ms | 160ms |
| Hover the primary CTA | Magnetic pull toward the cursor, **maximum 6px** translation, spring-eased; releases on leave | spring, ~400ms settle |
| Filter publications | Items reflow with FLIP (measure, then transform); removed items fade to 0 and scale to 0.98 | 280ms, ease-in-out-quart |
| Navigate between pages | Astro `<ClientRouter />`; the header, axis rail, and theme persist. Main content crossfades and moves 12px up | 240ms |
| Toggle theme | Colour tokens transition via a `View Transitions` crossfade on `document.documentElement`; if unsupported, a 200ms opacity dissolve on an overlay | 260ms |
| Focus any control | Focus ring appears instantly, no animation | 0ms |

Scroll-triggered entrances are permitted for exactly **two** elements site-wide: the research-pillar figure on the Research page, and the publication list on first paint (a 6px rise + fade, 40ms stagger, capped at 12 items). Nothing else animates on scroll.

### 6.3 Reduced motion — mandatory

Wrap every animation in a check of `matchMedia('(prefers-reduced-motion: reduce)')`, re-evaluated on change. When reduced: no Lenis (native scroll), no canvas animation (static frame), no magnetic effects, no page-transition movement. Expansion and disclosure still work but switch instantly. Add the global safety net:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. PAGES — build every one of these

Global shell on all pages: skip link → header → main → footer → axis rail → command palette.

**Header:** height 68px, transparent over the hero, and on scroll past 120px it gains `backdrop-filter: blur(12px)`, a `--ink-900` at 72% background, and a bottom hairline. Left: name in Geist 600 at `--step-0`; on the home page render it as the monogram initials instead. Right: nav links (Research, Publications, Projects, Talks, Writing, CV), a theme toggle, and a `⌘K` search affordance. Below `md`, nav collapses into a full-screen panel that slides from the right in 280ms with a focus trap and `inert` on the background.

**Footer:** three columns — a two-line statement of what the person works on; link lists (Scholar, ORCID, GitHub, email — only those configured); and a last-updated line generated at build time from the git commit date, plus a `© {{FULL_NAME}} {year}` and a "Built with Astro. Source on GitHub." link.

### 7.1 `/` — Home
1. **Hero** (min-height `88vh`): the canvas from §6.1; `h1` = `{{FULL_NAME}}`; below it one line, `--step-1`, `--mist-200`: role, institution, and research area composed from config; below that `{{ONE_LINE_RESEARCH_TAGLINE}}` at `--step-1` in max-width 30ch. Two actions: primary "Read the research" (fills to `--signal` with ink text on hover), secondary "Download CV" (ghost, 1px `--ink-600` border, opens the PDF in a new tab). A small availability line in `--mist-400` using `openTo`.
2. **Focus** — three research pillars as a 3-column grid (1 column below `md`). Each: a two-word name in Instrument Serif at `--step-2`, two sentences of plain description, and a hairline top border. No cards, no icons, no shadows. Each links to its anchor on `/research`.
3. **Selected work** — exactly four publications flagged `featured: true`, rendered in the same row format as `/publications` (§7.3) so the pattern is learned once. Ends with a text link to the full list that states the total count, e.g. "All 18 publications".
4. **Building** — two featured projects side by side, each with a 16:10 figure frame (square corners, 1px border), the project name, one sentence, the stack as mono tags, and links to code and demo.
5. **Recent** — the five newest `news` entries as a definition list: date in mono in the left gutter, one-sentence item on the right. This is the page's only auto-updating region.
6. **Contact strip** — a single line of Instrument Serif at `--step-4` ("Get in touch about {{AREA_1}} or collaborations."), the email as a copy-to-clipboard button showing the real address, and social links.

### 7.2 `/research`
Intro paragraph (max 68ch). Then one long-form section per research pillar, each with: an `h2` in display serif; a 3–5 paragraph explanation written for a technically literate non-specialist; a figure slot (`<figure>` with a 1px frame and a numbered caption, "Figure 1. …", in `--step--1` `--mist-400`); a list of the related publications, pulled automatically by matching a `topic` field; and a set of methods as mono tags. Anchors `#pillar-1`, `#pillar-2`, `#pillar-3` matching the home page links. A sticky in-page table of contents in the left margin at `xl` and above, with the active heading tracked by IntersectionObserver.

### 7.3 `/publications`
- Controls row: filter pills for **All / Journal / Conference / Preprint / Workshop / Thesis**, a second pill group for topic, a year sort toggle (newest ↔ oldest), and a text input that filters by title, venue, and co-author. Filtering must work **without JavaScript degradation issues**: render the full list server-side; JS only hides, reorders, and animates. State is written to the URL query string (`?type=conference&topic=graphs`) and restored on load.
- Grouped by year with a sticky year marker in the left gutter set in mono at `--step-3`.
- Each row: authors with `{{FULL_NAME}}` in `--mist-50` weight 600 and everyone else in `--mist-400`; title in Instrument Serif at `--step-1`; venue and year in `--step--1`; badges for **Oral / Spotlight / Best Paper / In press** using `--amber`; and link chips for PDF, DOI, arXiv, Code, Data, Poster, Slides, Video — each chip rendered only if the field exists.
- Expanding a row (§6.2) reveals the abstract, a `<pre>` BibTeX block with a copy button, and the citation count if present.
- Page-level actions: "Copy all BibTeX" and a link to the Scholar profile.
- Each publication also gets its own permalink page at `/publications/[slug]/` with full metadata, abstract, BibTeX, links, a "cite this" block in APA and IEEE, and `ScholarlyArticle` JSON-LD.

### 7.4 `/projects`
Two-column grid (one below `md`) of project entries. Each: 16:10 figure, name, one-line summary, three-sentence description, mono stack tags, role, status (`active` / `archived` / `paper-accompanying`), and links. Sort by `featured` then `date` descending. A project with `repo` set shows its language and star count **only if** those values are stored in the content file — never fetch them at runtime.

### 7.5 `/talks` (includes teaching and service)
Three stacked sections: **Talks** (date, title, event, place, slides/video links), **Teaching** (course code, title, term, institution, role, one line on responsibilities), **Service** (reviewing, organising, mentoring). All rendered as definition-style rows with mono dates in the left gutter — no cards.

### 7.6 `/cv`
A readable HTML CV generated from the same content collections (education, experience, publications, awards, skills, service) so it can never drift from the rest of the site. A prominent "Download PDF" button linking to `public/cv.pdf` (create a placeholder PDF and a `TODO(content):` note). Include a print stylesheet: light theme forced, canvas and rail hidden, links printed with their URLs expanded via `a::after { content: " (" attr(href) ")" }`, page-break-inside avoided on entries.

### 7.7 `/writing` and `/writing/[slug]`
Index: reverse-chronological list with date, title, reading time (computed at build from word count), and a one-line description. Tag filter.
Post: max 68ch measure; a sticky reading-progress line 2px tall at the top of the viewport; KaTeX math; Shiki code blocks with a language label and copy button; footnotes; blockquote styled with a left rule in `--signal` at 40%; auto-generated heading anchors with a link icon on hover; a table of contents in the margin at `xl`; and previous/next post links at the end.

### 7.8 `/404`
Keep it useful and quiet: a short line ("That page doesn't exist."), a search input that opens the command palette, and links to the four main sections. No jokes, no giant "404" typography, no animation.

---

## 8. CONTENT MODEL

Create `src/content.config.ts` with Zod schemas. Every field's requirement below is exact — optional fields must be `.optional()` and the UI must handle their absence without empty containers or stray separators.

```ts
// publications
{
  title: string,
  authors: string[],              // "Lastname, F." format, in order
  year: number,
  venue: string,                  // full name
  venueShort: string.optional(),  // e.g. "NeurIPS"
  type: 'journal'|'conference'|'preprint'|'workshop'|'thesis'|'chapter',
  status: 'published'|'accepted'|'under-review'|'preprint',
  topics: string[],               // must match slugs used on /research
  abstract: string,
  bibtex: string,
  doi: string.optional(),
  arxiv: string.optional(),
  pdf: string.optional(),
  code: string.optional(),
  data: string.optional(),
  poster: string.optional(),
  slides: string.optional(),
  video: string.optional(),
  award: string.optional(),       // "Best Paper", "Oral", "Spotlight"
  citations: number.optional(),
  featured: boolean.default(false),
  date: date,                     // for sorting within a year
}

// projects
{ name, summary, description, stack: string[], role, status, year,
  repo?, demo?, paper?, image?, featured: boolean }

// talks
{ title, event, date, location, type: 'invited'|'contributed'|'poster'|'panel',
  slides?, video? }

// teaching
{ code, title, institution, term, role, description, year }

// news
{ date, text, link? }            // text ≤ 140 chars, one sentence

// awards
{ title, issuer, year, description? }

// experience   (for /cv)
{ role, org, location, start, end?, bullets: string[] }

// education    (for /cv)
{ degree, field, institution, start, end?, advisor?, thesis? }

// blog (MDX)
{ title, description, date, updated?, tags: string[], draft: boolean.default(false) }
```

Seed the repository with **realistic placeholder content** so the site looks finished on first build: 8 publications across at least three types and three years (including one with an award badge and one preprint), 4 projects, 6 talks, 2 courses, 6 news items, 3 awards, 2 blog posts (one with heavy math and code to prove the rendering path). Placeholder text must be plausible data-science content, clearly marked with `TODO(content): replace` at the top of each file. Draft posts are excluded from production builds but visible in `pnpm dev`.

---

## 9. COMPONENTS AND ISLANDS

Every component is an `.astro` file in `src/components/`, typed props, documented with a leading comment describing its purpose and props. Client-side JavaScript exists in exactly these six islands, each a self-contained TypeScript module in `src/scripts/`, loaded with the directive shown:

| Island | Directive | Budget (gz) |
|---|---|---|
| `HeroField` (canvas) | `client:visible` | 12KB |
| `PublicationFilter` | `client:idle` | 6KB |
| `CommandPalette` | `client:idle` | 7KB |
| `ThemeToggle` | `client:load` (plus the inline head script) | 1.5KB |
| `MotionRuntime` (Lenis + GSAP orchestration) | `client:idle` | 40KB |
| `CopyButton` | `client:visible` | 1KB |

Everything else — navigation, expansion rows, table of contents, mobile menu, reading progress — must be built with HTML and CSS where possible (`<details>`, `:target`, `:has()`, CSS scroll-driven animations with a JS fallback) or with a shared 3KB vanilla utility module. Total JS on the home page must stay **under 95KB gzipped**; on `/publications` under 60KB; on a blog post under 45KB.

**Command palette (`⌘K` / `Ctrl+K`, and `/` to focus):** fuzzy search across pages, publications, projects, and posts using a small hand-rolled scorer over a JSON index generated at build time (`/search-index.json`, must stay under 60KB). Arrow keys navigate, Enter opens, Escape closes, focus is trapped, focus returns to the trigger on close, results are announced via `aria-live="polite"`. It also exposes actions: toggle theme, copy email, download CV.

---

## 10. ACCESSIBILITY — WCAG 2.2 AA, non-negotiable

- Semantic landmarks: one `<header>`, one `<nav aria-label="Primary">`, one `<main id="main">`, one `<footer>`. A visible-on-focus skip link is the first focusable element.
- Exactly one `h1` per page; heading levels never skip.
- Text contrast ≥ 4.5:1, large text and UI borders ≥ 3:1 — verify every token pair in **both** themes and record the measured ratios in `DECISIONS.md`.
- Focus indicator: `outline: 2px solid var(--color-signal); outline-offset: 3px;` on `:focus-visible`, never removed, and it must be visible against every background it can appear on.
- All interactive targets ≥ 44×44px on touch, ≥ 24×24px on pointer with adequate spacing.
- The canvas is `aria-hidden="true"` with `role="presentation"`; it carries no information not in the text.
- Every image has meaningful `alt`, or `alt=""` when decorative. Figures use `<figure>`/`<figcaption>`.
- Filter controls are real `<button>` elements with `aria-pressed`; the results region has `aria-live="polite"` and announces the count after filtering.
- Expandable rows use `<button aria-expanded>` controlling an element by `aria-controls`; collapsed content is `hidden` so it stays out of the tab order.
- The whole site is fully operable by keyboard alone, and readable with CSS disabled.
- Test with `@axe-core/cli` on every route; zero violations is the pass bar.

---

## 11. PERFORMANCE BUDGETS

- Lighthouse (mobile, throttled): **Performance ≥ 97, Accessibility 100, Best Practices 100, SEO 100** on `/`, `/publications`, and a blog post.
- LCP < 1.8s, CLS < 0.02, INP < 120ms, TBT < 120ms.
- Images: AVIF with WebP fallback via `astro:assets`; explicit `width`/`height` on everything; `loading="lazy"` and `decoding="async"` except the LCP image; responsive `srcset` at 400/800/1200/1600px.
- Fonts: self-hosted woff2, subset, `font-display: swap`, `preload` only the two above-the-fold faces, with size-adjusted fallback metrics declared to prevent layout shift.
- No layout shift from the theme script, the header, or font loading.
- HTML per page < 90KB uncompressed. Inline critical CSS; total CSS < 45KB gzipped.
- Add `pnpm build:analyze` that prints per-route JS and CSS sizes and fails the build if a budget in §9 or §11 is exceeded.

---

## 12. SEO, METADATA, AND SCHOLARLY INTEROP

- A single `<SEO>` component: title (`Page — {{FULL_NAME}}`, home is `{{FULL_NAME}} — Data Science Researcher`), description, canonical URL, `og:*`, `twitter:card=summary_large_image`, and `robots`.
- **Open Graph images generated at build time** with `astro-og-canvas` or `satori`: dark navy background, a faint graticule, the page title in Instrument Serif, the name and institution in Geist, and a 4px signal→pulse ramp bar along the bottom edge. 1200×630. One per page and per publication.
- JSON-LD: `Person` on the home page (with `sameAs` for every configured social, `affiliation`, `knowsAbout` from `researchAreas`), `ScholarlyArticle` on each publication page, `BlogPosting` on each post, and `BreadcrumbList` on nested routes.
- **Highwire Press meta tags** on every publication page (`citation_title`, `citation_author` repeated per author, `citation_publication_date`, `citation_journal_title`, `citation_conference_title`, `citation_doi`, `citation_pdf_url`) so Google Scholar can index them. This matters more than any other SEO work here.
- `sitemap-index.xml`, `robots.txt` pointing to it, `/rss.xml` for the blog with full content, and a `humans.txt`.
- Privacy-respecting analytics: include the integration point as a commented-out snippet in `BaseLayout.astro` with a note; ship nothing active.

---

## 13. REPOSITORY STRUCTURE — create exactly this

```
.
├── .github/workflows/deploy.yml
├── .github/workflows/ci.yml
├── public/
│   ├── .nojekyll
│   ├── CNAME
│   ├── cv.pdf
│   ├── favicon.svg
│   ├── favicon-96.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── layout/        Header, Nav, MobileNav, Footer, AxisRail, Graticule, SkipLink
│   │   ├── hero/          Hero, HeroField, MonogramMark
│   │   ├── publications/  PubRow, PubList, PubFilter, BibtexBlock, CiteBlock, LinkChip
│   │   ├── projects/      ProjectCard, StackTags
│   │   ├── common/        Icon, Button, Tag, CopyButton, Figure, SectionHeading,
│   │   │                  DefinitionRow, Prose, TableOfContents, ThemeToggle, SEO, CommandPalette
│   ├── content/
│   │   ├── publications/  *.yaml
│   │   ├── projects/      *.yaml
│   │   ├── talks/  teaching/  news/  awards/  experience/  education/
│   │   └── blog/          *.mdx
│   ├── config/site.ts
│   ├── layouts/           BaseLayout.astro, PageLayout.astro, PostLayout.astro
│   ├── lib/               paths.ts, config.ts, bibtex.ts, cite.ts, dates.ts,
│   │                      readingTime.ts, searchIndex.ts, sort.ts
│   ├── scripts/           heroField.ts, motion.ts, filter.ts, palette.ts, theme.ts, copy.ts
│   ├── pages/             index, research, publications/index, publications/[slug],
│   │                      projects, talks, cv, writing/index, writing/[slug],
│   │                      404, rss.xml.ts, search-index.json.ts
│   ├── styles/            global.css, prose.css, print.css
│   └── icons/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .prettierrc / .editorconfig / .gitignore / .nvmrc
├── DECISIONS.md
├── CONTENT.md
└── README.md
```

---

## 14. DEPLOYMENT

`.github/workflows/deploy.yml` — the official Astro Pages flow:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          node-version: 22
          package-manager: pnpm@latest
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

`.github/workflows/ci.yml` runs on pull requests: typecheck (`astro check`), Prettier check, build, bundle-budget check, `@axe-core/cli` against the built output, and a link checker for internal links.

`README.md` must contain, in this order: a one-paragraph description; a screenshot placeholder; a quick-start block (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm preview`); the **exact Pages setup steps** (Settings → Pages → Source: GitHub Actions), including the base-path rule from §3.4 and what to do about `CNAME`; a "How to add a publication" walkthrough with a full example YAML file; a "How to change colours and fonts" section naming the exact token block; and a troubleshooting section covering 404s on refresh, missing base path, and font loading.

`CONTENT.md` is a non-technical guide, written for the site owner, explaining how to edit each content collection without touching code.

---

## 15. CODE QUALITY

- Prettier with `astro` and `tailwindcss` plugins; 2-space indent, single quotes, 100-char print width, trailing commas.
- Every exported function has a JSDoc line. Every non-obvious CSS rule has a one-line comment explaining why.
- No dead code, no commented-out blocks, no `console.log` in shipped code.
- Component props typed with `interface Props`; no implicit `any`.
- Conventional Commits, in logical chunks per milestone (§16), not one giant commit.
- All magic numbers extracted to named constants — especially in the canvas code.

---

## 16. BUILD ORDER

Work in these milestones and commit at the end of each.

1. Scaffold: Astro + TS + Tailwind v4 + fonts + tokens + base layout + theme toggle with no flash. Verify light and dark both look finished.
2. Shell: header, nav, mobile panel, footer, graticule, axis rail, skip link, 404, print stylesheet.
3. Content layer: all collections, Zod schemas, seed data, sorting and filtering utilities, BibTeX and citation formatters.
4. Pages without motion: home, research, publications (+ detail), projects, talks, cv, writing (+ post). Everything correct, static, and accessible first.
5. Motion: Lenis + GSAP runtime, hero canvas, reveals, interaction responses, reduced-motion paths.
6. Islands: publication filter with URL state, command palette, copy buttons.
7. Metadata: SEO component, OG image generation, JSON-LD, Highwire tags, sitemap, RSS, search index.
8. Hardening: axe pass, Lighthouse pass, bundle budgets, cross-browser check (latest Chrome, Firefox, Safari, plus iOS Safari and Android Chrome at 390px), README, CONTENT.md, DECISIONS.md, deploy workflow.

At the end of milestone 4, and again at milestone 8, critique your own output against §4.2 and fix anything that reads as a default rather than a choice. State in `DECISIONS.md` what you changed and why.

---

## 17. ACCEPTANCE CHECKLIST — all must pass

- [ ] `pnpm build` completes with zero warnings; `astro check` reports zero errors.
- [ ] Site works at both `https://user.github.io/` and `https://user.github.io/repo/` by changing only `astro.config.mjs`; no broken asset or link in either mode.
- [ ] No flash of incorrect theme on first paint, on either theme, with an empty cache.
- [ ] Lighthouse mobile scores meet §11 on three routes.
- [ ] `axe` reports zero violations on every route, in both themes.
- [ ] Full keyboard traversal of every page, with a visible focus ring at each stop and no keyboard trap.
- [ ] With `prefers-reduced-motion: reduce`, nothing moves except instant state changes; the hero shows a static converged frame.
- [ ] With JavaScript disabled, every page renders complete content; publications are fully readable and all links work.
- [ ] Layout is correct with no horizontal scroll at 320, 390, 768, 1024, 1280, 1440, and 1920px.
- [ ] A publication page exposes correct Highwire `citation_*` tags, verified by viewing source.
- [ ] Every `{{PLACEHOLDER}}` is either replaced or accompanied by a `TODO(content):` comment; a repo-wide grep for `{{` returns only intentional matches.
- [ ] `README.md`, `CONTENT.md`, and `DECISIONS.md` exist and are accurate.
- [ ] Print preview of `/cv` produces a clean 1–2 page document.
- [ ] Total home-page JS is under 95KB gzipped, verified by `pnpm build:analyze`.

---

## 18. FINAL INSTRUCTIONS

Build the entire thing before reporting back. When you finish, output: the file tree you created; the exact commands to run locally; the exact GitHub Pages settings to click; a list of every `TODO(content):` location the owner must fill in; measured Lighthouse and bundle numbers; and `DECISIONS.md` contents. Do not summarise the brief back to me, and do not leave any section of it unimplemented.
