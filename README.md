# Personal Academic Website — Prerna Kumari

A static, high-performance academic personal website built with Astro 5, Tailwind CSS v4, Astro Content Collections, and self-hosted typography. Engineered with the *"instrument, not brochure"* design philosophy, the site presents research, publications, software artifacts, and curriculum vitae with the quiet precision of scientific figures and lab notebooks. Features a 1,400-point dimensionality-reduction canvas simulation, accessible command palette (`⌘K`), Highwire Press metadata for Google Scholar indexing, full keyboard traversal, and strict WCAG 2.2 AA compliance.

<!-- SCREENSHOT_PLACEHOLDER: Add an annotated desktop screenshot of the Home hero and publications rail here -->

---

## 1. Quick Start

Ensure Node.js 22 LTS is installed on your system.

```bash
# 1. Install dependencies
pnpm install

# 2. Start local development server
pnpm dev

# 3. Typecheck and build production bundle
pnpm build

# 4. Preview local production build
pnpm preview

# 5. Run bundle size & performance budget analysis
pnpm build:analyze
```

---

## 2. GitHub Pages Setup

Deployments are automated through GitHub Actions using `.github/workflows/deploy.yml`.

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial release"
   git branch -M main
   git remote add origin https://github.com/Prerna-Kri/Prerna_Website.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions** (do not select "Deploy from a branch").
4. **Base Path Configuration (§3.4)**:
   - If your repository is named `<username>.github.io` (e.g. `Prerna-Kri.github.io`), the site deploys at the root domain. In `astro.config.mjs`, leave `base` omitted or undefined.
   - If your repository is a project repository (e.g. `Prerna_Website`), the site deploys at `https://Prerna-Kri.github.io/Prerna_Website/`. In `astro.config.mjs`, `base: '/Prerna_Website'` is already pre-configured.
5. **Custom Domain / CNAME**:
   - If deploying with a custom domain (e.g. `prernakumari.com`), replace the content of `public/CNAME` with your domain name.
   - If you are NOT using a custom domain and rely on GitHub Pages URLs, delete `public/CNAME` before pushing.

---

## 3. How to Add a Publication

All publications are stored as individual YAML files in `src/content/publications/`. Add a new file such as `src/content/publications/my-new-paper.yaml`:

```yaml
title: "Self-Supervised Feature Invariance for Robust Visual Object Segmentation"
authors:
  - "Kumari, P."
  - "Sharma, A."
  - "Verma, R."
year: 2025
venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)"
venueShort: "CVPR"
type: "conference" # 'journal' | 'conference' | 'preprint' | 'workshop' | 'thesis' | 'chapter'
status: "published" # 'published' | 'accepted' | 'under-review' | 'preprint'
topics:
  - "computer-vision"
  - "deep-learning"
abstract: "We introduce a self-supervised visual representation framework that preserves semantic topology across extreme geometric and illumination perturbations."
bibtex: |
  @inproceedings{kumari2025self,
    title={Self-Supervised Feature Invariance for Robust Visual Object Segmentation},
    author={Kumari, Prerna and Sharma, Amit and Verma, Rohit},
    booktitle={IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year={2025}
  }
doi: "10.1109/CVPR52688.2025.00142"
arxiv: "2503.04182"
pdf: "https://arxiv.org/pdf/2503.04182"
code: "https://github.com/Prerna-Kri/segmentation"
award: "Spotlight" # Optional badge: 'Oral', 'Spotlight', 'Best Paper'
citations: 14
featured: true # true displays on the Home page
date: 2025-06-18 # Date used for sorting
```

---

## 4. How to Change Colours and Fonts

All tokens are defined in `src/styles/global.css` using Tailwind CSS v4's `@theme` block and root CSS variables:

```css
:root {
  /* DARK THEME (default) */
  --bg-page: #0A1424;       /* Deep ink page background */
  --bg-well: #0D1A2D;       /* Sunken code blocks and wells */
  --bg-surface: #11203A;    /* Raised interactive cards */
  --border-subtle: #1B3055; /* Hairlines, gridlines */
  --border-strong: #2C4571; /* High-emphasis dividers */
  --text-muted: #7D93B2;    /* Metadata, ticks, dates */
  --text-body: #C3D2E6;     /* Body reading measure */
  --text-heading: #F1F6FD;  /* High-emphasis headers */
  --accent-signal: #47DFC6; /* Signal cyan: links, focus, active */
  --accent-pulse: #7C6BFF;  /* Secondary accent: data ramp only */
  --accent-amber: #FFB547;  /* Rare tertiary: awards, in press */
}

[data-theme="light"] {
  /* LIGHT THEME */
  --bg-page: #F5F7FB;
  --bg-well: #EDF1F7;
  --bg-surface: #FFFFFF;
  --border-subtle: #D4DEEC;
  --text-muted: #5A6C88;
  --text-body: #1E2C44;
  --text-heading: #0A1424;
  --accent-signal: #0E9C86;
  --accent-pulse: #5847D6;
  --accent-amber: #B06E00;
}
```

Self-hosted fonts are imported at the top of `src/styles/global.css`:
- **Display**: Instrument Serif (`@fontsource/instrument-serif`)
- **Sans**: Geist Sans Variable (`@fontsource-variable/geist`)
- **Mono**: JetBrains Mono Variable (`@fontsource-variable/jetbrains-mono`)

---

## 5. Troubleshooting

- **Broken links or assets on GitHub Pages**: Ensure every link and asset uses the `withBase()` utility in `src/lib/paths.ts`. If deployed to `https://<username>.github.io/<repo>/`, verify `base: '/<repo>'` matches the repository name in `astro.config.mjs`.
- **404 error when refreshing nested URLs on Pages**: Astro builds purely static pages (`/research/index.html`, `/publications/index.html`). GitHub Pages automatically serves these paths cleanly without requiring an SPA fallback router.
- **Font display and swap**: Fonts are self-hosted woff2 files in `node_modules` bundled at build time. No external requests are made to Google Fonts CDN, ensuring offline reliability, privacy, and zero layout shift.
- **Flashing theme on initial load**: Theme initialization is executed in a synchronous, blocking script in the `<head>` of `BaseLayout.astro` that reads `localStorage.getItem('theme')` prior to DOM rendering.
