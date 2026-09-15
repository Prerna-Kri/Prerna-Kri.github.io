# Content Management Guide for Prerna Kumari

This guide explains how to edit, add, and remove content across the site collections without editing template code or styling.

All structured content lives in `src/content/` organized into dedicated subdirectories.

---

## 1. Identity & Social Links

All site-wide identity variables are defined in:
`src/config/site.ts`

- **Name, Title, Department, Institution, Location**: Modify string values directly.
- **Socials**: When a link is ready (e.g., Google Scholar or ORCID), replace the `{{...}}` placeholder with your profile URL. Any link beginning with `{{` is automatically hidden from the site.
- **Tagline**: Keep under 90 characters for optimal display across mobile and desktop.
- **CV Download**: Place your newest PDF at `public/cv.pdf`.

---

## 2. Publications (`src/content/publications/`)

To add a new publication, create a new `.yaml` file (e.g. `src/content/publications/my-paper.yaml`):

```yaml
title: "Self-Supervised Feature Invariance for Robust Visual Object Segmentation"
authors:
  - "Kumari, P."
  - "Sharma, A."
year: 2025
venue: "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)"
venueShort: "CVPR"
type: "conference" # 'journal' | 'conference' | 'preprint' | 'workshop' | 'thesis' | 'chapter'
status: "published" # 'published' | 'accepted' | 'under-review' | 'preprint'
topics:
  - "computer-vision"
  - "deep-learning"
abstract: "Summary of your paper and key mathematical/empirical findings..."
bibtex: |
  @inproceedings{kumari2025self,
    title={Self-Supervised Feature Invariance for Robust Visual Object Segmentation},
    author={Kumari, Prerna and Sharma, Amit},
    booktitle={IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year={2025}
  }
doi: "10.1109/CVPR52688.2025.00142"
arxiv: "2503.04182"
pdf: "https://arxiv.org/pdf/2503.04182"
code: "https://github.com/Prerna-Kri/my-repo"
award: "Spotlight" # Optional: 'Best Paper', 'Oral', 'Spotlight'
citations: 14 # Optional
featured: true # true displays on Home page (up to 4)
date: 2025-06-18 # Used for chronological sorting within the year
```

---

## 3. Projects (`src/content/projects/`)

To add a project, create `src/content/projects/project-name.yaml`:

```yaml
name: "Chilli Thrips Agricultural Vision"
summary: "Automated leaf pathology detection and thrips damage classification."
description: "Three-sentence description of the model, training scheme, and practical impact."
stack:
  - "PyTorch"
  - "OpenCV"
  - "Python"
role: "Lead Researcher"
status: "paper-accompanying" # 'active' | 'archived' | 'paper-accompanying'
year: 2024
repo: "https://github.com/Prerna-Kri/chilli-thrips-classification"
demo: "https://huggingface.co/spaces/..."
paper: "https://arxiv.org/abs/2408.01920"
featured: true # true puts it on the Home page (up to 2)
```

---

## 4. Talks & Lectures (`src/content/talks/`)

Create `src/content/talks/talk-name.yaml`:

```yaml
title: "Self-Supervised Learning Geometry in Computer Vision"
event: "IISER Bhopal Data Science Seminar"
date: 2025-10-14
location: "Bhopal, India"
type: "invited" # 'invited' | 'contributed' | 'poster' | 'panel'
slides: "https://..."
video: "https://..."
```

---

## 5. Teaching (`src/content/teaching/`)

Create `src/content/teaching/course-code.yaml`:

```yaml
code: "DSE 301"
title: "Data Science & Machine Learning Laboratory"
institution: "IISER Bhopal"
term: "Spring"
role: "Teaching Assistant"
description: "Instructed weekly lab sessions on PyTorch model training and optimization."
year: 2026
```

---

## 6. Recent News (`src/content/news/`)

Create `src/content/news/news-item.yaml`:

```yaml
date: 2026-01-10
text: "Joined the Department of Data Science & Engineering at IISER Bhopal as a PhD Research Scholar." # <= 140 chars
link: "https://www.iiserb.ac.in" # Optional
```

---

## 7. Writing & Essays (`src/content/blog/`)

Create an `.mdx` file in `src/content/blog/` (e.g. `my-essay.mdx`):

```mdx
---
title: "Persistent Homology in Deep Vision"
description: "A quick introduction to topological invariants in neural representation learning."
date: 2025-05-18
tags:
  - "mathematics"
  - "deep-learning"
draft: false
---

Write in standard Markdown. You can include LaTeX formulas:

$$
\mathcal{L}(X) = \sum_{i} \|p_i - \gamma(p_i)\|
$$

And syntax-highlighted code blocks:

```python
import torch
x = torch.randn(10, 512)
```
```
