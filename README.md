# Personal Academic Website — Prerna Kumari

A static personal academic website built with Astro 5, Tailwind CSS v4, Astro Content Collections, and self-hosted variable typography. Designed under the **plasma** aesthetic direction, the site combines deep violet-black void surfaces (`#120722`), a 4-stop spectral colormap ramp (`#FF2E8B` &rarr; `#FF5C4D` &rarr; `#FF9E1F` &rarr; `#FFD84D`), electric cyan interaction points (`#3BE8FF`), an SVG width-fitted dynamic name band with drifting gradient, and a 900-particle clustering physics simulation.

<!-- SCREENSHOT_PLACEHOLDER: Add an annotated screenshot of the Home hero and work sections here -->

---

## 1. Quick Start

Ensure Node.js 22 LTS and pnpm are installed.

```bash
# 1. Install dependencies
pnpm install

# 2. Start local development server
pnpm dev

# 3. Check types and build production static bundle
pnpm build

# 4. Preview local production build
pnpm preview

# 5. Check performance and bundle size budgets
pnpm build:analyze
```

---

## 2. GitHub Pages Setup

Deployments are automated through GitHub Actions using `.github/workflows/deploy.yml`.

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: plasma aesthetic redesign with ground truth alignment"
   git branch -M main
   git remote add origin https://github.com/Prerna-Kri/Prerna_Website.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions** (do NOT select "Deploy from a branch").
4. **Base Path Configuration (§3.4)**:
   - If your repository is named `<username>.github.io` (e.g. `Prerna-Kri.github.io`), the site deploys at the root domain. In `astro.config.mjs`, leave `base` omitted or undefined.
   - If your repository is a project repository (e.g. `Prerna_Website`), the site deploys at `https://Prerna-Kri.github.io/Prerna_Website/`. In `astro.config.mjs`, `base: '/Prerna_Website'` is pre-configured.
5. **Custom Domain / CNAME**:
   - If using a custom domain (e.g. `prernakumari.com`), enter your domain in `public/CNAME`.
   - If relying on `Prerna-Kri.github.io/Prerna_Website/`, delete `public/CNAME`.

---

## 3. How to Add Content

### Adding a Project (`src/content/projects/`)
Create `src/content/projects/new-project.yaml`:
```yaml
name: "Project Name"
slug: "project-slug"
summary: "One-sentence overview of the computational pipeline."
description: "Detailed description of results, architecture, and validation."
type: "research" # 'research' | 'tool' | 'replication' | 'coursework' | 'exploration'
stack:
  - "Python"
  - "PyTorch"
  - "OpenCV"
role: "Lead Researcher"
status: "active" # 'active' | 'paused' | 'archived'
year: 2026
repo: "https://github.com/Prerna-Kri/repo-name"
featured: true # true displays on Home page
```

### Adding a Technical Note (`src/content/writing/`)
Create `src/content/writing/my-note.mdx`:
```markdown
---
title: "Deriving Multi-Scale Convolutional Receptive Fields"
description: "Step-by-step mathematical expansion of theoretical receptive fields."
date: 2026-05-10
tags:
  - "computer-vision"
  - "deep-learning"
draft: false
---

Use KaTeX math formulas ($$R_l = R_{l-1} + (k_l - 1) \prod s_i$$) and Shiki code blocks!
```

### Adding Your First Publication (`src/content/publications/`)
> [!NOTE]
> Currently, the `publications` collection is empty (0 entries) to honestly reflect your Year 1 PhD status. Adding your first `.yaml` paper file here automatically activates the `/publications` page and nav link!

Create `src/content/publications/paper-name.yaml`:
```yaml
title: "Deep Vision Diagnostics for Agricultural Plant Pathology"
authors:
  - "Prerna Kumari"
  - "Advisor Name"
year: 2026
venue: "IEEE Conference on Computer Vision and Pattern Recognition (CVPR)"
type: "conference" # 'journal' | 'conference' | 'preprint' | 'workshop' | 'thesis'
status: "published"
topics:
  - "computer-vision"
abstract: "Abstract describing the novel visual recognition algorithm..."
bibtex: |
  @inproceedings{kumari2026deep,
    title={Deep Vision Diagnostics for Agricultural Plant Pathology},
    author={Kumari, Prerna},
    year={2026}
  }
doi: "10.1109/..."
code: "https://github.com/Prerna-Kri/..."
featured: true
date: 2026-06-15
```

---

## 4. How to Customize Colours & Fonts

All design tokens are centralized in `src/styles/global.css`:
- **Palette**: Under `@theme`, update `--color-void-*` (dark neutrals), `--color-plasma-*` (spectral ramp), and `--color-volt-*` (cyan interactive accent).
- **Light Theme**: Under `[data-theme="light"]`, adjust `--bg-page`, `--text-heading`, and the light-mode ramp.
- **Fonts**: Self-hosted through Fontsource: Archivo Variable (`--font-display`), Geist Sans Variable (`--font-sans`), and JetBrains Mono Variable (`--font-mono`).

---

## 5. Troubleshooting

- **404 on Sub-Pages or Refresh on GitHub Pages**: Ensure GitHub Pages is using GitHub Actions as the source under Settings → Pages.
- **Broken Sub-Path Links**: Never hard-code `/about` or `/cv.pdf`. Always import and use `withBase('/path')` from `src/lib/paths.ts`.
- **Fonts Failing to Load**: Fonts are bundled locally from `@fontsource-variable/*` into the production build; ensure `@import` statements remain in `src/styles/global.css`.
