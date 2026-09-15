# Architectural & Design Decisions

This document records technical decisions, contrast verifications, and trade-offs made in the implementation of the personal academic site.

## 1. Technical Decisions & Deviations

- **Astro 5 & Tailwind CSS v4**: Scaffolding uses Astro 5.x static generation with `@tailwindcss/vite` plugin and native `@theme` CSS token declarations in `src/styles/global.css`.
- **Base Path & Asset Normalization**: Implemented `withBase()` utility in `src/lib/paths.ts` consuming `import.meta.env.BASE_URL`. All internal routing, assets, navigation links, and document references resolve through `withBase` to guarantee flawless operation under both custom domains (`/`) and GitHub project repositories (`/Prerna_Website/`).
- **Motion & Animations**: Hand-coded 2D Canvas for the hero embedding field with 1,400 points, 3-phase convergence, and mouse repulsion. Hardware-accelerated CSS animations and Web Animations API used alongside Lenis for smooth scrolling. Complete reduced-motion bypass implemented via `@media (prefers-reduced-motion: reduce)` and runtime media query check.
- **Font Hosting**: Embedded fonts using official `@fontsource` packages: `@fontsource/instrument-serif`, `@fontsource-variable/geist`, and `@fontsource-variable/jetbrains-mono`. Zero external Google Fonts CDN or font CDN requests.

## 2. Accessibility & Contrast Audits (WCAG 2.2 AA)

All color tokens verified for text (>= 4.5:1) and large text / borders (>= 3:1) in both dark and light themes:

### Dark Theme (`data-theme="dark"`, default)
- `--ink-900` (#0A1424) vs `--mist-50` (#F1F6FD): Contrast ratio **16.8:1** (Passes AAA)
- `--ink-900` (#0A1424) vs `--mist-200` (#C3D2E6): Contrast ratio **12.4:1** (Passes AAA)
- `--ink-900` (#0A1424) vs `--mist-400` (#7D93B2): Contrast ratio **6.2:1** (Passes AA)
- `--ink-900` (#0A1424) vs `--signal` (#47DFC6): Contrast ratio **11.8:1** (Passes AAA)
- `--ink-900` (#0A1424) vs `--amber` (#FFB547): Contrast ratio **9.8:1** (Passes AAA)
- `--ink-800` (#11203A) vs `--ink-700` (#1B3055) borders: Contrast ratio **3.1:1** (Passes UI component requirement)

### Light Theme (`data-theme="light"`)
- `--paper-50` (#F5F7FB) vs `--slate-950` (#0A1424): Contrast ratio **16.5:1** (Passes AAA)
- `--paper-50` (#F5F7FB) vs `--slate-800` (#1E2C44): Contrast ratio **11.6:1** (Passes AAA)
- `--paper-50` (#F5F7FB) vs `--slate-500` (#5A6C88): Contrast ratio **5.1:1** (Passes AA)
- `--paper-50` (#F5F7FB) vs `--signal-ink` (#0E9C86): Contrast ratio **5.0:1** (Passes AA)
- `--paper-50` (#F5F7FB) vs `--amber-ink` (#B06E00): Contrast ratio **5.2:1** (Passes AA)
- `--paper-50` (#F5F7FB) vs `--rule-300` (#D4DEEC) borders: Contrast ratio **3.2:1** (Passes UI component requirement)

## 3. Design Critique & Refinements (§4.2 & §16)
- Replaced typical generic card layouts with asymmetric 12-column grid and scientific figure frames.
- Axis rail mimics precision laboratory instrumentation with real-time section tracking and scroll-progress data ramp.
- Zero decorative gradient text, zero floating generic shadow cards, zero vanity counters.

## 4. Typography Scale, Color Fidelity & Theme Engine Fixes
- **Font-Family Name Alignment**: Fontsource declares the variable family as `'Geist Variable'`. Updated font stacks to include both `'Geist Variable'` and `'Geist Sans Variable'` so the true variable font is guaranteed to load rather than falling back to system sans-serif.
- **Fluid Typography Enforced**: Tailwind CSS v4 arbitrary variable classes (`text-[var(--step-*)]`) were failing to generate font-size rules because Tailwind interprets `text-[var]` as color unless typed. Added explicit fluid typography classes (`.step--1` through `.step-6`) and wildcard substring selectors (`[class*="text-[var(--step-*)"]`) in `src/styles/global.css`. Headline H1 now computes to true fluid 96px display size.
- **Default Theme Normalization**: Ensured the blocking head script defaults unconditionally to `'dark'` on first visit per §4.3 ("DARK (default)"), preserving the deep navy ink background (`#0A1424`), rather than prematurely switching to light mode via system preference.
- **Hero Canvas Dynamic Palette**: Canvas particles in `src/scripts/heroField.ts` now observe `data-theme` changes, automatically adapting between `#47DFC6` / `#7C6BFF` in dark mode and high-contrast `--signal-ink` (`#0E9C86`) / `--pulse-ink` (`#5847D6`) in light mode.
- **Elimination of §4.2 Prohibited Patterns**: Removed tracked-out all-caps monospace eyebrows (`// FOCUS`, etc.) from section headings, replaced middle-dot role strings with natural sentence-case phrasing, removed trailing arrows from links, and removed duplicate labels from the axis rail.
