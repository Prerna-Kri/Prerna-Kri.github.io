import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Publications Schema (§8)
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()), // "Lastname, F." format, in order
    year: z.number(),
    venue: z.string(),
    venueShort: z.string().optional(),
    type: z.enum(['journal', 'conference', 'preprint', 'workshop', 'thesis', 'chapter']),
    status: z.enum(['published', 'accepted', 'under-review', 'preprint']),
    topics: z.array(z.string()),
    abstract: z.string(),
    bibtex: z.string(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    pdf: z.string().optional(),
    code: z.string().optional(),
    data: z.string().optional(),
    poster: z.string().optional(),
    slides: z.string().optional(),
    video: z.string().optional(),
    award: z.string().optional(), // "Best Paper", "Oral", "Spotlight"
    citations: z.number().optional(),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
  }),
});

// 2. Projects Schema (§8)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    role: z.string(),
    status: z.enum(['active', 'archived', 'paper-accompanying']),
    year: z.number(),
    repo: z.string().optional(),
    demo: z.string().optional(),
    paper: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// 3. Talks Schema (§8)
const talks = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    type: z.enum(['invited', 'contributed', 'poster', 'panel']),
    slides: z.string().optional(),
    video: z.string().optional(),
  }),
});

// 4. Teaching Schema (§8)
const teaching = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/teaching' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    institution: z.string(),
    term: z.string(),
    role: z.string(),
    description: z.string(),
    year: z.number(),
  }),
});

// 5. News Schema (§8)
const news = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string().max(140),
    link: z.string().optional(),
  }),
});

// 6. Awards Schema (§8)
const awards = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    year: z.number(),
    description: z.string().optional(),
  }),
});

// 7. Experience Schema (for /cv) (§8)
const experience = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/experience' }),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    location: z.string(),
    start: z.string(),
    end: z.string().optional(),
    bullets: z.array(z.string()),
  }),
});

// 8. Education Schema (for /cv) (§8)
const education = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/education' }),
  schema: z.object({
    degree: z.string(),
    field: z.string(),
    institution: z.string(),
    start: z.string(),
    end: z.string().optional(),
    advisor: z.string().optional(),
    thesis: z.string().optional(),
  }),
});

// 9. Blog Schema (MDX) (§8)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  publications,
  projects,
  talks,
  teaching,
  news,
  awards,
  experience,
  education,
  blog,
};
