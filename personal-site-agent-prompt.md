# BUILD BRIEF — Personal Website for an Early-Stage Data Science PhD Researcher

You are a senior front-end engineer and design lead. Build the complete, production-ready website described below, end to end, in one pass. **Do not ask clarifying questions.** Every decision you might otherwise ask about is specified here. Where personal content is unknown, use the exact placeholder tokens from §1 and leave a `TODO(content):` comment beside each. If an instruction is technically impossible or two instructions conflict, implement the closest working alternative and record the deviation in `DECISIONS.md` with a one-line rationale.

Deliverable: a git repository that builds to a static site, deploys to GitHub Pages via GitHub Actions, and passes the acceptance checklist in §18.

---

## 1. IDENTITY VARIABLES — replace every occurrence

Create `src/config/site.ts` as the single source of truth. Every value below lives there and is imported everywhere. No hard-coded names, emails, or URLs anywhere else in the codebase.

```ts
export const site = {
  name: "{{FULL_NAME}}",
  firstName: "{{FIRST_NAME}}",
  initials: "{{INITIALS}}",                        // 2–3 characters
  role: "PhD Researcher",
  field: "Data Science",
  institution: "{{UNIVERSITY}}",
  lab: "{{LAB_OR_GROUP}}",
  advisor: "{{ADVISOR_NAME}}",
  startedPhD: "{{YYYY-MM}}",                       // used for "Year 1" / "Year 2" labels
  location: "{{CITY}}, {{COUNTRY}}",
  email: "{{EMAIL}}",
  tagline: "{{ONE_SENTENCE_ON_WHAT_YOU_STUDY}}",   // ≤ 110 chars, plain language
  bio: "{{THREE_SENTENCE_BIO}}",
  domain: "https://{{GITHUB_USERNAME}}.github.io",
  repo: "{{REPO_NAME}}",                           // base-path logic in §3.4
  cvPdf: "/cv.pdf",
  socials: {
    github: "https://github.com/{{GITHUB_USERNAME}}",
    linkedin: "{{LINKEDIN_URL}}",
    scholar: "{{GOOGLE_SCHOLAR_URL}}",
    orcid: "{{ORCID_URL}}",
    x: "{{X_URL}}",
    bluesky: "{{BLUESKY_URL}}",
    kaggle: "{{KAGGLE_URL}}",
    huggingface: "{{HUGGINGFACE_URL}}",
  },
  interests: ["{{AREA_1}}", "{{AREA_2}}", "{{AREA_3}}"],
  openTo: "Collaborations, reading groups, and internship conversations.",
} as const;
```

Write one utility, `src/lib/config.ts`, exporting `isSet(value)` — any string still containing `{{` is treated as unset. **Nothing unset ever renders**: no empty link, no dangling separator, no orphan heading. Audit every component against this.

---

## 2. THE HONEST POSITIONING — read this before designing anything

This person **just started their PhD**. They may have zero, one, or two publications. The site must never look like it is hiding an empty trophy case, and must never inflate. Design the whole thing around that truth:

- **The name and the person are the headline.** Not a paper count, not metrics, not logos. At this stage the strongest asset is a clear identity and a clear direction, presented with total confidence.
- **Evidence is what they are doing now**, not what they have accumulated: projects, code, replications, notebooks, coursework taken seriously, notes and explainers, reading, talks at the lab. Give these primary real estate.
- **Every list must survive being short.** One project, two notes, zero publications — all of it must still look deliberate and complete. Sections with no entries are removed from the page and from the navigation automatically, never rendered as an empty state with a shrug.
- **No fake scale.** Forbidden everywhere: counters of any kind, "trusted by", university logo walls, skill percentage bars, star ratings on skills, "10+ projects", certificate badge grids, and any phrasing implying years of experience.
- Copy rule: name the thing, say what was done, say what it showed. No adjectives doing the work of evidence. Banned words and phrases: passionate, cutting-edge, leveraging, innovative, journey, "excited to share", "aspiring", "wannabe", "seeking opportunities", exclamation marks, and the word "just" used to diminish ("I just started").
- Correct register example — Now item: `Reproducing the DEC clustering baseline on MNIST and Reuters to establish a reference point for my first experiment.` Wrong register: `Excited to be diving deep into the amazing world of unsupervised learning! 🚀`

Audience, in priority order: (1) a PI or senior student deciding in 20 seconds whether this person is serious and what they work on; (2) a recruiter or collaborator looking for real code and writing; (3) a peer who found them through a repo or a note.

---

## 3. TECHNICAL STACK — fixed, not negotiable

### 3.1 Core
- **Astro 5.x** (latest stable), `output: 'static'`. Zero JS by default; interactivity only via the islands listed in §10.
- **TypeScript** `strict`, plus `noUncheckedIndexedAccess`. No `any`, no non-null assertions without a justifying comment.
- **Tailwind CSS v4** through the `@tailwindcss/vite` plugin (not the legacy `@astrojs/tailwind` integration). All tokens declared with `@theme` in `src/styles/global.css` (§6).
- **Astro Content Collections** + **Zod** schemas for all structured content (§9).
- **MDX** (`@astrojs/mdx`) for notes, with `remark-math` + `rehype-katex` and **Shiki** dual-theme code highlighting.
- **`@astrojs/sitemap`**, and `@astrojs/rss` for `/rss.xml`.
- **pnpm**, Node 22 LTS, lockfile committed.

### 3.2 Motion
- **GSAP** core + **ScrollTrigger** + **SplitText**, dynamically imported inside islands only.
- **Lenis** for smooth scroll, driven by GSAP's ticker — one RAF loop for the whole site, never two.
- Verify the current GSAP license permits free use of those plugins. If not, reimplement with the Web Animations API + IntersectionObserver and note it in `DECISIONS.md`. Never add a paid dependency.
- The hero field in §7.1 is hand-written canvas 2D. No charting, particle, or 3D library.

### 3.3 Explicitly forbidden
React, Vue, Svelte, jQuery, Bootstrap, Material UI, shadcn, DaisyUI, Framer Motion, AOS, Three.js, WebGL, Lottie, Google Fonts CDN links, Font Awesome, cookie-setting analytics, any runtime CDN, AI-generated stock imagery, emoji as UI icons.

### 3.4 GitHub Pages base path — handle both cases
- If `{{REPO_NAME}}` is exactly `{{GITHUB_USERNAME}}.github.io`: set `site` and **omit** `base`.
- Otherwise: set `site: 'https://{{GITHUB_USERNAME}}.github.io'` and `base: '/{{REPO_NAME}}'`.
- Never write a raw `href="/about"`. Every internal link and asset path goes through `withBase(path)` in `src/lib/paths.ts`, built on `import.meta.env.BASE_URL`. Grep the repo for `href="/` and `src="/` before finishing — broken sub-path links are the most common failure of Astro on Pages.
- Create an empty `public/.nojekyll`.
- Create `public/CNAME` containing only `{{CUSTOM_DOMAIN_OR_DELETE_THIS_FILE}}`, and tell the owner in `README.md` to delete it if unused.

---

## 4. DESIGN DIRECTION

### 4.1 Concept: **plasma**

Named after the colormap. The site is mostly deep, saturated violet-black — a colour, never a grey — and the researcher's name is a full-bleed band of live spectral colour across the top of the page. One blaze, then discipline. Every structural device afterwards borrows from plotting: hairline rules like axis lines, tick marks, figure frames, monospaced identifiers, numbered captions. The contrast between the one loud moment and the quiet precision underneath is the whole aesthetic. It should feel like the title card of a well-made scientific instrument, not a portfolio template.

### 4.2 Colour — use exactly these tokens, no others

Neutrals must carry violet chroma. Pure greys, `#111`, `#0B0B0B`, `#1a1a1a`, and `slate-*`/`gray-*` Tailwind defaults are banned everywhere.

```
DARK (default)
--void-950   #120722   page background          (deep violet-black, visibly violet)
--void-900   #190B2E   sunken wells, code blocks
--void-850   #21103C   raised surfaces
--void-800   #2C1750   inputs, chips
--void-700   #41236F   hairlines, gridlines, borders
--void-600   #5E37A0   emphasis dividers
--haze-400   #B49FDC   muted / metadata text     (7.0:1 on void-950 — verify)
--haze-200   #E2D8F7   body text
--haze-50    #FCF9FF   headings, high emphasis

SPECTRAL RAMP (expression only — never on plain text, never as page background)
--plasma-1   #FF2E8B   magenta
--plasma-2   #FF5C4D   coral
--plasma-3   #FF9E1F   tangerine
--plasma-4   #FFD84D   gold

INTERACTION (cool counterpoint — links, focus, active, selection)
--volt-400   #3BE8FF   electric cyan
--volt-600   #0FB9DB   cyan, darkened for light theme text use

LIGHT
--wash-50    #FBF8FF   page background           (lavender-tinted white, not cream)
--wash-100   #F2ECFC   sunken wells
--wash-0     #FFFFFF   raised surfaces
--rule-300   #DCD0F2   hairlines, gridlines
--plum-500   #6B5B8C   muted text
--plum-800   #2E1A50   body text
--plum-950   #150826   headings
--volt-ink   #077E99   interactive (AA on wash-50)
ramp in light theme: #D6006E, #E0402E, #C96A00, #A07400
```

Colour law, enforced everywhere:
1. The four ramp stops appear **together, in order** only inside the name band (§7.1), the 2px section rules, the scroll-progress line, and the contact band. Nowhere else.
2. A single ramp stop may be used alone as a categorical marker (tag hue, status dot, active filter). Assign stops to categories deterministically by index — never randomly per render.
3. `--volt-400` is the only colour used for links, focus rings, text selection, and active states. It never appears decoratively.
4. No blurred colour blobs, no radial glow behind text, no mesh gradients, no gradient text on anything except the name in the hero and the contact band.
5. Every surface must be distinguishable from its neighbour by a hairline, not only by a background shade.

### 4.3 Typography — three families, self-hosted via Fontsource

| Role | Family | Rule |
|---|---|---|
| Display | **Archivo Variable** (weight + width axes) | Used **only** at width ≥ 110 and weight ≥ 600. That constraint is what keeps it distinct from the body face. Name lockup uses width 125, weight 700. |
| Text | **Geist Sans Variable** (400 / 500 / 600) | All body, navigation, buttons, labels. Never above `--step-3`. |
| Mono | **JetBrains Mono Variable** (400 / 500) | Only for genuine identifiers: dates, DOIs, arXiv IDs, versions, code, file names, tick labels. Never for decorative small labels — that is a template tell. |

Subset to `latin` + `latin-ext`, ship `woff2`, `font-display: swap`, preload only the two faces used above the fold, and declare size-adjusted local fallbacks so no layout shift occurs when they load.

Fluid scale, capped so it stops growing past 2560px:

```
--step--1  clamp(0.84rem, 0.81rem + 0.14vw, 0.92rem)
--step-0   clamp(1rem,    0.96rem + 0.22vw, 1.09rem)
--step-1   clamp(1.2rem,  1.13rem + 0.38vw, 1.45rem)
--step-2   clamp(1.5rem,  1.38rem + 0.62vw, 1.95rem)
--step-3   clamp(1.85rem, 1.65rem + 1.0vw,  2.6rem)
--step-4   clamp(2.3rem,  1.96rem + 1.7vw,  3.5rem)
--step-5   clamp(2.9rem,  2.3rem + 3.0vw,   4.8rem)
```

The name in the hero is **not** on this scale — it is width-fitted SVG (§7.1). Body line-height 1.62, measure capped at **70ch**. All headings sentence case. Never set text below `--step--1`.

### 4.4 Layout — full-bleed by default

The page is edge-to-edge. Colour fields, rules, and the name band span the **entire viewport width at every screen size**; only reading content is constrained.

- `.bleed` = full viewport width, no side padding, no max-width.
- `.frame` = `width: min(100% - 2 * var(--gutter), var(--measure-max))`, centred; `--gutter: clamp(1.15rem, 4vw, 4.5rem)`; `--measure-max: 1360px`, raised to `1560px` above 1800px.
- 12-column grid ≥1024px, 8-column 768–1023px, 4-column below 768px. Section content is left-aligned and asymmetric — typically columns 1–8 of 12 with the remainder carrying dates, tags, or a figure. Never centre-align body text.
- Every major section is separated by a **2px full-bleed rule** carrying the four-stop ramp at 100% width, 10% opacity, with the active section's rule at 100% opacity. This is the site's structural signature.
- Vertical rhythm tokens only: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 224px` → `--space-1 … --space-12`. Section padding block: `clamp(4rem, 9vh, 9rem)`.
- Radii encode meaning, not uniformity: `0` for figure frames and table cells, `4px` for inputs and tags, `12px` for interactive surfaces, `999px` only for the avatar and filter pills.
- One shadow token, used only on genuinely floating layers (command palette, mobile panel, sticky header once scrolled): dark `0 24px 64px -16px rgb(0 0 0 / 0.65)`, light `0 24px 64px -22px rgb(40 15 80 / 0.22)`.
- Use **container queries** (`@container`) for card and row components so they adapt to their slot, not just the viewport.

### 4.5 Responsive law — must hold at any width

Verify at **320, 360, 390, 414, 540, 600, 768, 834, 1024, 1180, 1280, 1440, 1728, 1920, 2560px**, in both orientations on touch sizes.

- Zero horizontal overflow at every one of those widths. Use `overflow-x: clip` on `body` as a safety net **and** fix the real cause.
- Use `100svh` for the hero, never `100vh` (mobile browser chrome). Use `dvh` for the mobile menu panel.
- No fixed pixel widths on content. No `width: 100vw` (scrollbar overflow) — use `100%` on a full-bleed wrapper.
- Touch targets ≥ 44×44px. Increase gutters and reduce the type scale gracefully; never let two columns become unreadably narrow — collapse instead.
- Above 1800px: content stops widening, but the name band, rules, and colour fields still span the full width, and section padding grows.
- Respect safe-area insets (`env(safe-area-inset-*)`) on the header, mobile panel, and footer.
- Hover-only affordances must have a tap or focus equivalent. Gate all hover CSS behind `@media (hover: hover) and (pointer: fine)`.

### 4.6 "Aesthetic, not cringe" — banned outright
Glassmorphism panels, neon glow on everything, animated gradient buttons, rainbow-gradient headings beyond the two permitted places, sparkle or rocket emoji, typewriter loops cycling adjectives ("I am a | Developer | Dreamer"), matrix rain, parallax star fields, floating 3D blobs, mouse-trail comets, "scroll down" bouncing arrows, confetti, tilt-on-hover cards, marquees of technology logos, hero video backgrounds, and cursors replaced by a custom dot.

Also banned because they read as machine-generated defaults: fade-and-slide-up on every section, identical rounded cards for every kind of content, tracked-out ALL-CAPS eyebrow labels, meta strings joined with middle dots, `WORD — fragment` labels, a `→` glued to every link, and one word of a headline coloured differently from the rest.

---

## 5. MOTION SPECIFICATION

Hierarchy: **one signature moment**, a short list of interaction responses, nothing else. If an animation neither explains a change the user caused nor is the signature moment, delete it.

### 5.1 Signature: the name comes alive
Specified in full in §7.1. It runs once on load and then settles into a slow, low-amplitude idle. It is the only autonomous motion on the site.

### 5.2 Interaction responses — the complete permitted list

| Trigger | Response | Timing |
|---|---|---|
| Scroll | The full-bleed rule of the section in view goes from 10% to 100% opacity; the previous one fades back | 260ms linear |
| Scroll | A 2px scroll-progress line under the header fills with the ramp | linear, scroll-linked |
| Hover a project or note row | Background lifts to `--void-850`; a 2px left bar in that item's assigned ramp stop wipes down from the top; the mono date shifts to `--volt-400` | 160ms `--ease-out-quint` |
| Click an expandable row | Expands in place via `grid-template-rows: 0fr → 1fr` (never animate `height: auto`) | 300ms `--ease-out-quint` |
| Click a copy button | Label crossfades to "Copied", icon swaps to a check, reverts after 1600ms | 160ms |
| Hover the primary action | Magnetic pull toward the cursor, **max 6px**, spring-eased, released on leave. Pointer-fine only | ~400ms settle |
| Filter | FLIP reflow; removed items fade out and scale to 0.98 | 280ms `--ease-in-out-quart` |
| Page navigation | Astro `<ClientRouter />`; header, rules, and theme persist; `<main>` crossfades and rises 12px | 240ms |
| Theme toggle | View Transitions crossfade on `documentElement`; 200ms opacity dissolve fallback | 260ms |
| Focus | Ring appears instantly | 0ms |

Scroll-entrance animation is permitted for exactly **two** things site-wide: the Focus section's three direction blocks (6px rise + fade, 60ms stagger, once), and the first paint of the project list (same, capped at 6 items). Nothing else animates on scroll.

### 5.3 Reduced motion — mandatory
Check `matchMedia('(prefers-reduced-motion: reduce)')` and re-evaluate on change. When reduced: no Lenis (native scroll), the hero renders a single static frame, no magnetic effect, no page-transition movement; disclosure still works but switches instantly. Plus the global net:

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

## 6. TOKENS IN CODE

All of §4.2, §4.3, §4.4 goes into `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-void-950: #120722;
  /* …every colour token above… */
  --font-display: "Archivo Variable", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Geist Sans Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --dur-fast: 160ms; --dur-base: 300ms; --dur-slow: 620ms; --dur-signature: 2200ms;
}
```

Theme switching: `data-theme="dark" | "light"` on `<html>`, light overrides in a `[data-theme="light"]` block. Resolve the initial theme in a **blocking inline script in `<head>`** reading `localStorage.theme` then `prefers-color-scheme`. **Zero flash of the wrong theme**, verified with an empty cache on both themes. Keep `<meta name="color-scheme">` and `theme-color` in sync on toggle.

---

## 7. PAGES

Global shell: skip link → header → main → footer → command palette.

**Header** — 64px. Transparent over the hero; past 120px of scroll it gains `backdrop-filter: blur(14px)`, a `--void-950` at 74% background, a bottom hairline, and the scroll-progress line. Left: `{{INITIALS}}` set in Archivo 700 width 125, with `{{FULL_NAME}}` beside it at `--step-0` (initials only below `sm`). Right: nav, theme toggle, `⌘K` affordance. Below `md` the nav becomes a full-screen panel sliding from the right in 280ms with a focus trap and `inert` on the background.

**Nav items** are generated from content, not hard-coded: Research, Work, Writing, CV, Contact — plus Publications **only if** that collection has ≥ 1 entry. A section with no entries never appears in the nav.

**Footer** — full-bleed. `{{FULL_NAME}}` again in Archivo at `--step-4`, spanning the width; below it, three columns: a two-line statement of what they work on, configured links only, and a build-time "last updated" date from the git commit. Then `© {{FULL_NAME}} {year}` and "Source on GitHub".

### 7.1 `/` — Home

**1. Name band (the signature).** Full-bleed, `min-height: 92svh`, flush to the top of the page under the transparent header.

- The name is rendered as **SVG `<text>`**, not HTML, so it fits the viewport width exactly at every device width. Implementation: render the SVG with `width="100%"`, then on load measure the text with `getBBox()` and set `viewBox` to that bounding box plus 2% padding, with `preserveAspectRatio="xMidYMid meet"`. Reserve the space beforehand with a CSS `aspect-ratio` computed from an estimated ratio so nothing shifts. Font: Archivo, width 125, weight 700, `letter-spacing: -0.02em`.
- **Long names:** if `{{FULL_NAME}}` exceeds 13 characters including spaces, break it onto two `<tspan>` lines (first name / surname), each independently width-fitted, line-height 0.86. Below 480px, always break onto two lines.
- **Fill:** a `<linearGradient>` running left to right through `--plasma-1 → --plasma-2 → --plasma-3 → --plasma-4`. A small rAF loop in the hero island advances the stop offsets along a sine, so the spectrum drifts slowly through the letterforms: full cycle 14s, offsets never leaving `[0,1]`, amplitude 0.12. This is the entire "alive" effect on the name — no glow, no blur, no shimmer sweep.
- **Entrance:** the name is revealed by an SVG `clipPath` rectangle wiping left to right over 900ms `--ease-out-expo`, starting at 150ms. Once, never on scroll-back.
- **Field behind it:** a `<canvas>` across the full band, `devicePixelRatio`-aware, resize-observed. 900 points, radius 1–2px, coloured by assignment to one of four clusters using the four ramp stops at 45% alpha. They begin as uniform noise and relax into four separated Gaussian clusters over 2200ms with ease-out-expo and a per-point stagger up to 500ms, then drift on a slow noise field (≤0.25px/frame). ~30 connecting lines between nearest neighbours at 7% opacity on a 6s fade cycle. Cursor applies quadratic-falloff repulsion within 130px, easing back over 900ms; disabled on touch. The whole canvas sits at 40% opacity so the name always dominates. Pause the RAF loop when out of viewport or the tab is hidden. Island budget: 12KB gzipped.
- **Under the name**, in this order, left-aligned inside `.frame`: one line at `--step-1` in `--haze-200` composing role, field, institution, and lab from config; the tagline at `--step-2` in `--haze-50`, max 30ch; a mono line at `--step--1` in `--haze-400` giving location and a computed "Year N of the PhD" from `startedPhD`; then two actions — primary "See what I'm working on" (solid `--volt-400`, ink text) and secondary "Download CV" (1px `--void-600` border, ghost). Finally a single line using `openTo`.
- **Reduced motion / no JS:** static converged frame, static gradient, name fully visible, no wipe. The name must be real text in the SVG and selectable, with `<title>` and `aria-label` set to the full name.

**2. Now** — the most important section on this site. Heading "Now", plus a mono sub-line with the current month and year, generated at build. Three to five entries from the `now` collection, each a row: mono date in the left gutter, one or two sentences on the right, an optional link. This is the proof of activity that replaces a publication list.

**3. Focus** — three research directions. Each: a two-to-four-word name in Archivo at `--step-3`, three sentences of plain-language description, a hairline top border in the direction's assigned ramp stop, and mono tags for the methods involved. Three columns ≥1024px, one below. No cards, no icons, no shadows. Each links to its anchor on `/research`.

**4. Work** — up to four `featured` projects, each a full-bleed-width row inside `.frame`: a 16:10 figure with a square 1px frame on one side, and on the other the project name at `--step-2`, one-sentence summary, three-sentence description, mono stack tags, and links to code, demo, and write-up. Alternate the figure side row to row. Ends with a text link to `/work`.

**5. Writing** — the three newest notes: mono date, title at `--step-1`, one-line description, reading time. Omitted entirely if the collection is empty.

**6. Publications** — rendered only if the collection has entries. Same row format as §7.4.

**7. Contact band** — full-bleed, `--void-900` background with the four-stop ramp as a 3px top edge. `{{FIRST_NAME}}`'s email as a copy-to-clipboard button showing the real address at `--step-3`, one line of context, configured social links, and the initials mark. No contact form — a static site cannot handle one honestly.

### 7.2 `/research`
Intro paragraph (≤70ch). One long-form section per direction with an `h2`, 3–5 paragraphs written for a technically literate non-specialist, an optional `<figure>` with a numbered caption in mono, a list of related output matched by `topic`, and mono method tags. Anchors `#direction-1..3`. Sticky in-page table of contents in the margin at `xl`+, active heading tracked by IntersectionObserver.

### 7.3 `/work`
All projects. Filter pills by type (`research`, `tool`, `replication`, `coursework`, `exploration`) and by stack tag, with state written to the URL query string and restored on load. Rendered server-side in full; JS only hides, reorders, and animates. Two-column grid ≥`md`, one below, using container queries. Each card: figure, name, summary, description, stack tags, role, status (`active` / `paused` / `archived`), year, and links. A repo's language and star count appear only if stored in the content file — never fetched at runtime.

### 7.4 `/publications` — generated only if the collection is non-empty
If the collection is empty, this route is not built and the nav item does not exist. When it exists: group by year with a sticky mono year marker in the left gutter. Each row shows authors with `{{FULL_NAME}}` in `--haze-50` weight 600 and co-authors in `--haze-400`; title at `--step-1`; venue; ramp-coloured badges for Preprint / Workshop / Poster / Oral / In press; and link chips for PDF, DOI, arXiv, Code, Data, Poster, Slides — each rendered only if present. Clicking a row expands it to reveal abstract, a `<pre>` BibTeX block with a copy button, and a "cite this" block in APA and IEEE. Page actions: "Copy all BibTeX", and a Scholar link if configured. Each entry also gets `/publications/[slug]/` with full metadata and `ScholarlyArticle` JSON-LD.

### 7.5 `/cv`
HTML CV generated from the same collections (education, experience, projects, output, awards, skills, service) so it can never drift from the rest of the site. Prominent "Download PDF" to `public/cv.pdf` (ship a placeholder plus a `TODO(content):` note). Skills are listed as plain grouped text — **no bars, no percentages, no star ratings**. Print stylesheet: light theme forced, canvas and rules hidden, links expanded via `a::after { content: " (" attr(href) ")" }`, `break-inside: avoid` on entries, target 1–2 pages.

### 7.6 `/writing` and `/writing/[slug]`
Index: reverse-chronological rows — mono date, title, one-line description, reading time computed at build, tag filter. Post: 70ch measure; 2px reading-progress line in the ramp pinned to the top of the viewport; KaTeX math; Shiki blocks with a language label and copy button; footnotes; blockquote with a 2px left rule in `--plasma-1`; auto-generated heading anchors; margin ToC at `xl`+; previous/next links.

### 7.7 `/404`
Short, quiet, useful: one line ("That page doesn't exist."), a button that opens the command palette, and links to the main sections. No giant "404", no joke, no animation.

---

## 8. CONTENT MODEL

`src/content.config.ts`, Zod-validated. Optional fields must be `.optional()` and the UI must handle absence with no empty containers or stray separators.

```ts
now       { date, text, link? }                       // text ≤ 220 chars, 1–2 sentences
directions{ title, slug, order, blurb, body, methods: string[], figure?, caption? }
projects  { name, slug, summary, description, type, stack: string[], role, status,
            year, repo?, demo?, writeup?, image?, featured: boolean }
writing   { title, description, date, updated?, tags: string[], draft: boolean }   // MDX
publications { title, authors: string[], year, venue, venueShort?, type, status,
            topics: string[], abstract, bibtex, doi?, arxiv?, pdf?, code?, data?,
            poster?, slides?, award?, featured: boolean, date }
talks     { title, event, date, location, type, slides?, video? }
teaching  { code, title, institution, term, role, description, year }
awards    { title, issuer, year, description? }
experience{ role, org, location, start, end?, bullets: string[] }
education { degree, field, institution, start, end?, advisor?, thesis? }
skills    { group, items: string[], order }
```

**Empty-collection rule — implement once, apply everywhere:** a helper `hasEntries(collection)` gates section rendering, nav items, route generation, and sitemap entries. No section, nav link, route, or heading exists for an empty collection.

**Seed content** — realistic and clearly marked `TODO(content): replace`, sized for someone in year one: 4 `now` entries, 3 directions, 5 projects (one `replication`, one `tool`, two `research`, one `coursework`), 2 writing posts (one heavy with math and code to prove the rendering path), 1 publication of type `workshop` or `preprint`, 2 talks, 3 awards, 1 education entry, 1 experience entry, 4 skill groups. Seed copy must follow §2's register exactly — if a seed sentence would embarrass a careful researcher, rewrite it.

---

## 9. COMPONENTS

All components are `.astro` files in `src/components/`, with `interface Props`, and a leading comment stating purpose and props.

```
layout/     Header, Nav, MobileNav, Footer, SectionRule, SkipLink, Bleed, Frame
hero/       NameBand, NameSvg, PlasmaField, HeroMeta
sections/   NowList, DirectionGrid, ProjectRow, WritingList, PublicationList, ContactBand
common/     Icon, Button, Tag, CopyButton, Figure, SectionHeading, DefinitionRow, Prose,
            TableOfContents, ThemeToggle, SEO, CommandPalette, LinkChip, FilterPills
```

Icons: inline SVG only, 1.5px stroke, 20×20, `currentColor`, in `src/icons/`, rendered through one `<Icon name>` component. Maximum 14 across the site.

---

## 10. ISLANDS AND JS BUDGET

Client JS exists in exactly these six modules in `src/scripts/`:

| Island | Directive | Budget (gz) |
|---|---|---|
| `NameBand` (SVG fit + gradient drift + canvas field) | `client:load` | 12KB |
| `MotionRuntime` (Lenis + GSAP + ScrollTrigger orchestration) | `client:idle` | 40KB |
| `Filter` (work + writing, URL state, FLIP) | `client:idle` | 6KB |
| `CommandPalette` | `client:idle` | 7KB |
| `ThemeToggle` (plus the inline head script) | `client:load` | 1.5KB |
| `CopyButton` | `client:visible` | 1KB |

Everything else — nav, row expansion, ToC, mobile menu, reading progress — is HTML and CSS (`<details>`, `:target`, `:has()`, CSS scroll-driven animations with a JS fallback) or a shared 3KB vanilla utility. **Home page total JS < 95KB gzipped**; `/work` < 60KB; a note page < 45KB.

**Command palette** (`⌘K` / `Ctrl+K`, `/` to focus): fuzzy search over pages, projects, notes, and publications using a hand-rolled scorer against a build-time `/search-index.json` (< 60KB). Arrow keys navigate, Enter opens, Escape closes, focus trapped, focus returned to the trigger on close, results announced via `aria-live="polite"`. Also exposes actions: toggle theme, copy email, download CV.

---

## 11. ACCESSIBILITY — WCAG 2.2 AA, non-negotiable

- Landmarks: one `<header>`, one `<nav aria-label="Primary">`, one `<main id="main">`, one `<footer>`. A visible-on-focus skip link is the first focusable element.
- One `h1` per page; levels never skip. The hero name is the `h1`, with the SVG carrying `role="img"` and `aria-label="{{FULL_NAME}}"` — or, preferably, real `<text>` exposed to the accessibility tree.
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for large text and UI borders, in **both** themes. Measure every pair you actually use and record the ratios in `DECISIONS.md`. The ramp colours are bright — verify each against the background it sits on and darken the light-theme variants until they pass.
- Focus ring: `outline: 2px solid var(--color-volt-400); outline-offset: 3px;` on `:focus-visible`, never removed, visible on every background it can appear over.
- Colour is never the only carrier of meaning — ramp-coded categories always also carry a text label.
- Filter controls are real `<button>`s with `aria-pressed`; the results region is `aria-live="polite"` and announces the count.
- Expandables use `<button aria-expanded aria-controls>`; collapsed content is `hidden` and out of the tab order.
- The canvas field is `aria-hidden="true"`. All images have meaningful `alt` or `alt=""`. Figures use `<figure>`/`<figcaption>`.
- Fully operable by keyboard, fully readable with CSS disabled, fully functional with JS disabled.
- `@axe-core/cli` on every route in both themes: zero violations is the pass bar.

---

## 12. PERFORMANCE BUDGETS

- Lighthouse mobile, throttled: **Performance ≥ 96, Accessibility 100, Best Practices 100, SEO 100** on `/`, `/work`, and a note page.
- LCP < 1.9s, CLS < 0.02, INP < 120ms, TBT < 150ms. The hero name must not cause CLS — reserve its box before fitting.
- Images: AVIF with WebP fallback via `astro:assets`, explicit `width`/`height`, `loading="lazy"` + `decoding="async"` except the LCP image, `srcset` at 400/800/1200/1600px.
- Inline critical CSS; total CSS < 45KB gzipped; HTML per page < 90KB uncompressed.
- Add `pnpm build:analyze` printing per-route JS and CSS sizes, failing the build if any §10 or §12 budget is exceeded.

---

## 13. SEO AND METADATA

- One `<SEO>` component: title (`Page — {{FULL_NAME}}`; home is `{{FULL_NAME}} — {{ROLE}}, {{FIELD}}`), description, canonical, `og:*`, `twitter:card=summary_large_image`, `robots`.
- **Build-time OG images** via `astro-og-canvas` or `satori`, 1200×630: `--void-950` background, the page title in Archivo, name and institution in Geist, and the four-stop ramp as a 10px bar along the bottom edge.
- JSON-LD: `Person` on home (`sameAs` for configured socials only, `affiliation`, `knowsAbout` from `interests`), `BlogPosting` per note, `ScholarlyArticle` per publication, `BreadcrumbList` on nested routes.
- Highwire Press `citation_*` meta tags on publication pages (`citation_title`, `citation_author` repeated, `citation_publication_date`, `citation_journal_title` or `citation_conference_title`, `citation_doi`, `citation_pdf_url`) so Google Scholar can index them.
- `sitemap-index.xml`, `robots.txt`, `/rss.xml` with full content, `humans.txt`.
- Analytics: ship nothing active; leave a commented integration point in `BaseLayout.astro`.

---

## 14. REPOSITORY STRUCTURE

```
.
├── .github/workflows/deploy.yml
├── .github/workflows/ci.yml
├── public/  .nojekyll  CNAME  cv.pdf  favicon.svg  favicon-96.png
│            apple-touch-icon.png  site.webmanifest  og/
├── src/
│   ├── components/  (as in §9)
│   ├── content/     now/ directions/ projects/ writing/ publications/ talks/
│   │                teaching/ awards/ experience/ education/ skills/
│   ├── config/site.ts
│   ├── layouts/     BaseLayout.astro  PageLayout.astro  PostLayout.astro
│   ├── lib/         paths.ts config.ts collections.ts bibtex.ts cite.ts dates.ts
│   │                readingTime.ts searchIndex.ts sort.ts phdYear.ts
│   ├── scripts/     nameBand.ts motion.ts filter.ts palette.ts theme.ts copy.ts
│   ├── pages/       index, research, work, writing/index, writing/[slug],
│   │                publications/index, publications/[slug], cv, 404,
│   │                rss.xml.ts, search-index.json.ts
│   ├── styles/      global.css prose.css print.css
│   └── icons/
├── astro.config.mjs  tsconfig.json  package.json
├── .prettierrc  .editorconfig  .gitignore  .nvmrc
└── DECISIONS.md  CONTENT.md  README.md
```

---

## 15. DEPLOYMENT

`.github/workflows/deploy.yml`:

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

`.github/workflows/ci.yml` runs on pull requests: `astro check`, Prettier check, build, bundle-budget check, `@axe-core/cli` on the built output, and an internal link checker.

`README.md`, in order: one-paragraph description; screenshot placeholder; quick start (`pnpm install`, `dev`, `build`, `preview`); exact Pages setup (Settings → Pages → Source: GitHub Actions) including the §3.4 base-path rule and the `CNAME` instruction; "How to add a project / a note / your first publication" with a full example file for each; "How to change the colours and fonts" naming the exact token block; troubleshooting for 404s on refresh, missing base path, and font loading.

`CONTENT.md`: a non-technical guide for the owner, explaining how to edit each collection without touching code, and stating plainly that adding the first publication automatically creates the Publications page and nav item.

---

## 16. CODE QUALITY

Prettier with the `astro` and `tailwindcss` plugins; 2-space indent, single quotes, 100-char width, trailing commas. JSDoc on every exported function. A one-line comment on every non-obvious CSS rule. No dead code, no commented-out blocks, no `console.log` in shipped output. Magic numbers extracted to named constants, especially in the canvas and SVG-fitting code. Conventional Commits, one commit per milestone.

---

## 17. BUILD ORDER

1. Scaffold: Astro + TS + Tailwind v4 + fonts + tokens + base layout + theme toggle with no flash. Confirm both themes look finished.
2. Shell: header, nav, mobile panel, footer, full-bleed section rules, skip link, 404, print stylesheet.
3. Content layer: all collections, Zod schemas, seed data, `hasEntries` gating, sorting, BibTeX and citation formatters, `phdYear`.
4. Pages without motion: home, research, work, writing (+ post), publications (+ detail), cv. Correct, static, accessible, and fully responsive first.
5. The name band: SVG width-fitting at every breakpoint including two-line long names, gradient drift, canvas field, reduced-motion and no-JS fallbacks.
6. Remaining motion: Lenis + GSAP runtime, section rules, interaction responses.
7. Islands: filters with URL state, command palette, copy buttons.
8. Metadata: SEO, OG images, JSON-LD, Highwire tags, sitemap, RSS, search index.
9. Hardening: axe, Lighthouse, budgets, the full width matrix in §4.5, cross-browser (latest Chrome, Firefox, Safari, iOS Safari, Android Chrome), README, CONTENT.md, DECISIONS.md.

At the end of steps 4 and 9, critique your own output against §2, §4.2, and §4.6 and fix anything that reads as a default rather than a choice. Record what you changed and why in `DECISIONS.md`.

---

## 18. ACCEPTANCE CHECKLIST — all must pass

- [ ] `pnpm build` completes with zero warnings; `astro check` reports zero errors.
- [ ] The full name is legible and spans close to the full viewport width at 320px, 768px, 1440px, and 2560px, with no overflow and no clipping, for both a short name and a 24-character test name.
- [ ] Zero horizontal scroll at every width listed in §4.5.
- [ ] Site works at both `https://user.github.io/` and `https://user.github.io/repo/` by changing only `astro.config.mjs`.
- [ ] No flash of incorrect theme on first paint on either theme with an empty cache.
- [ ] Emptying the `publications` collection removes the section, the nav item, the routes, and the sitemap entries, and the home page still looks complete.
- [ ] Lighthouse mobile meets §12 on three routes; bundle budgets in §10 verified by `pnpm build:analyze`.
- [ ] `axe` reports zero violations on every route in both themes; every measured contrast ratio is logged in `DECISIONS.md`.
- [ ] Full keyboard traversal with a visible focus ring at each stop and no trap.
- [ ] With `prefers-reduced-motion: reduce`, nothing moves; the hero shows a static converged frame with the name fully visible.
- [ ] With JavaScript disabled, every page renders complete content and every link works.
- [ ] No banned element from §4.6 appears anywhere; no banned word from §2 appears in any copy, including seed content.
- [ ] Print preview of `/cv` produces a clean 1–2 page document.
- [ ] A repo-wide grep for `{{` returns only intentional `TODO(content):` placeholders.

---

## 19. FINAL INSTRUCTIONS

Build the entire thing before reporting back. Then output: the file tree; the exact local commands; the exact GitHub Pages settings to click; every `TODO(content):` location the owner must fill; measured Lighthouse and bundle numbers; screenshots or a description of the home page at 390px, 1024px, and 1920px; and the contents of `DECISIONS.md`. Do not summarise this brief back to me, and do not leave any section unimplemented.
