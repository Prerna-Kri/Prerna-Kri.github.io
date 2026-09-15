# Content Management Guide for Prerna Kumari

This guide explains how to manage content across your academic site without editing template code or styling.

All structured content lives in `src/content/` organized into dedicated subdirectories.

---

## 1. Identity & Profile Variables

Site-wide identity is configured in:
`src/config/site.ts`

- **Name, Email, Institution, Location, Tagline, Bio**: Edit string values directly.
- **Socials**: When you set up new profiles (e.g. Google Scholar, ORCID), replace the `{{...}}` placeholder with your URL. Any string still containing `{{` is automatically hidden site-wide.
- **CV Download**: Place your newest CV at `public/cv.pdf`.

---

## 2. Publications (`src/content/publications/`)

> [!NOTE]
> Currently, the `publications` collection has **0 entries**, which intentionally suppresses the Publications page and nav link.
> **Adding your first publication automatically creates the Publications page and adds the link to navigation.**

When you are ready to add your first paper, create `src/content/publications/my-paper.yaml`:

```yaml
title: "Deep Learning for Fine-Grained Agricultural Vision Diagnostics"
authors:
  - "Prerna Kumari"
  - "Co-Author Name"
year: 2026
venue: "IEEE Conference on Computer Vision"
type: "conference" # 'journal' | 'conference' | 'preprint' | 'workshop' | 'thesis'
status: "published" # 'published' | 'accepted' | 'under-review' | 'in-press' | 'preprint'
topics:
  - "computer-vision"
  - "deep-learning"
abstract: "Summary of your findings and methodology..."
bibtex: |
  @inproceedings{kumari2026deep,
    title={Deep Learning for Fine-Grained Agricultural Vision Diagnostics},
    author={Kumari, Prerna},
    year={2026}
  }
doi: "10.1109/..."
code: "https://github.com/Prerna-Kri/..."
featured: true
date: 2026-06-01
```

---

## 3. Timeline Updates (`src/content/now/`)

The **Now** section on the home page shows your 3–5 most recent activities. To add an update, create `src/content/now/entry-name.yaml`:

```yaml
date: 2026-03-15
text: "Running visual feature extraction experiments on field-captured foliage datasets."
link: "https://github.com/Prerna-Kri" # Optional link
```

---

## 4. Projects (`src/content/projects/`)

To add a project, create `src/content/projects/my-project.yaml`:

```yaml
name: "Project Title"
slug: "project-slug"
summary: "One-sentence overview."
description: "Detailed description of the computational pipeline and outcomes."
type: "research" # 'research' | 'tool' | 'replication' | 'coursework' | 'exploration'
stack:
  - "Python"
  - "PyTorch"
role: "Lead Developer"
status: "active" # 'active' | 'paused' | 'archived'
year: 2026
repo: "https://github.com/Prerna-Kri/repo-name"
demo: "https://..."
featured: true # true displays on Home page (up to 4)
```

---

## 5. Technical Notes (`src/content/writing/`)

To publish a note, create an `.md` or `.mdx` file in `src/content/writing/`:

```markdown
---
title: "Understanding Convolutional Gradients"
description: "Mathematical formulation of backward passes across feature channels."
date: 2026-04-01
tags:
  - "deep-learning"
  - "mathematics"
draft: false
---

Write using Markdown, KaTeX math ($$f(x) = Wx + b$$), and code blocks!
```

---

## 6. Skills (`src/content/skills/`)

Skills appear on `/cv` as clean grouped text (no rating bars or stars). Add or modify items in `src/content/skills/group-*.yaml`.
