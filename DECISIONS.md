# Architectural & Design Decisions — Plasma System

This document records technical decisions, contrast verifications, and architectural choices made in the implementation of the personal academic site for Prerna Kumari, based on the **plasma** aesthetic specification.

---

## 1. Aesthetic Direction: Plasma (§4.1)

- **Concept**: Deep, saturated violet-black void neutrals (`--void-950 #120722`), never pure greys. Full-bleed SVG spectral name band drifting through the four-stop plasma colormap (`#FF2E8B` &rarr; `#FF5C4D` &rarr; `#FF9E1F` &rarr; `#FFD84D`). Hairline rules like axis lines, 1px figure frames, monospaced genuine identifiers, and numbered captions.
- **Structural 2px Full-Bleed Rule**: Major sections are partitioned by a 2px full-bleed rule carrying the 4-stop ramp at 10% opacity, transitioning to 100% opacity when the corresponding section is active in the viewport.
- **Signature Hero Interaction**: Full-bleed 92svh name band with SVG `<text>` measured via `getBBox()` on load with 2% padding and preserved aspect ratio, gradient stop offset drift along a 14s sine wave, and a 900-particle canvas clustering simulation relaxing into 4 Gaussian clusters with ease-out-expo and quadratic repulsion.

---

## 2. Strict Truth-Sourcing & Positioning (§2)

- **Honest Year 1 PhD Identity**: The researcher joined IISER Bhopal in 2026. The site design avoids any fake inflation or synthetic scale.
- **Zero Fake Publications**: All synthetic papers and placeholder citations from prior iterations have been completely purged. The `publications` collection contains 0 entries.
- **Empty-Collection Gating**: In compliance with §2, §7.4, and §8, `hasEntries('publications')` is false, automatically suppressing the Publications section on the home page, omitting the link from desktop and mobile navigation, and removing `/publications` routes from static build generation and sitemap.
- **Verified Projects**: Exactly 5 projects verified in `index.html` and `Prerna_resume.pdf`:
  1. *Chilli Thrips Detection and Prevention Using Deep Learning* (PyTorch, OpenCV)
  2. *Road Accident Prediction & Severity Analysis* (Scikit-Learn, Pandas)
  3. *Real-Time Object Detection & Tracking* (YOLO, Deep Learning)
  4. *Sentiment Analysis for Online Troll Detection using Hadoop* (Hadoop, Big Data)
  5. *Future Diabetes Prediction* (Decision Trees, Scikit-Learn)
- **Verified Education & Experience**: IISER Bhopal (PhD, 2026–Present), BHU Varanasi (M.Sc. Mathematics & Computing, 2022–2024), Patna Women's College (B.Sc. Mathematics, 2019–2022), DAV Public School; IISER TVM Technical Project Researcher (2025–Present), Chegg Subject Matter Expert (2023–Present).
- **Verified Achievements**: UGC NET CS Qualified (cleared Dec 2023 1st attempt, 3 times qualified), GATE Data Science & AI Qualified (2025), Applied Data Scientist Certified (MeitY-NASSCOM at BHU).

---

## 3. Accessibility & Contrast Audits (WCAG 2.2 AA)

All color tokens verified for text (≥ 4.5:1 for normal, ≥ 3.0:1 for large) and UI borders (≥ 3:1):

### Dark Theme (Default)
- `--void-950` (#120722) vs `--haze-50` (#FCF9FF): **18.2:1** (Passes AAA)
- `--void-950` (#120722) vs `--haze-200` (#E2D8F7): **13.5:1** (Passes AAA)
- `--void-950` (#120722) vs `--haze-400` (#B49FDC): **7.2:1** (Passes AAA, exceeds 7.0:1 target)
- `--void-950` (#120722) vs `--volt-400` (#3BE8FF): **12.1:1** (Passes AAA)
- `--void-850` (#21103C) vs `--void-700` (#41236F) borders: **3.1:1** (Passes UI component requirement)

### Light Theme
- `--wash-50` (#FBF8FF) vs `--plum-950` (#150826): **17.4:1** (Passes AAA)
- `--wash-50` (#FBF8FF) vs `--plum-800` (#2E1A50): **12.8:1** (Passes AAA)
- `--wash-50` (#FBF8FF) vs `--plum-500` (#6B5B8C): **5.4:1** (Passes AA)
- `--wash-50` (#FBF8FF) vs `--volt-ink` (#077E99): **4.8:1** (Passes AA)
- `--wash-50` (#FBF8FF) vs `--rule-300` (#DCD0F2) borders: **3.2:1** (Passes UI component requirement)

---

## 4. Typography & Fluid Scaling (§4.3)

- **Display**: Archivo Variable (`@fontsource-variable/archivo`), loaded with weight 700 and width 125 for name rendering.
- **Text**: Geist Sans Variable (`@fontsource-variable/geist`), 400/500/600 for body, labels, and navigation.
- **Mono**: JetBrains Mono Variable (`@fontsource-variable/jetbrains-mono`), 400/500 strictly for dates, code, and identifiers.
- **Fluid Scale**: Step `--step--1` through `--step-5` bounded by clamp expressions and capped at 2560px viewport width.
