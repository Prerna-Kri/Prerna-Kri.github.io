import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 1. Now Schema (§8)
const now = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/now' }),
  schema: z.object({
    date: z.coerce.date(),
    text: z.string().max(240),
    link: z.string().optional(),
  }),
});

// 2. Directions Schema (§8)
const directions = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/directions' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number(),
    blurb: z.string(),
    body: z.string(),
    methods: z.array(z.string()),
    figure: z.string().optional(),
    caption: z.string().optional(),
  }),
});

// 3. Projects Schema (§8)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    summary: z.string(),
    description: z.string(),
    type: z.enum(['research', 'tool', 'replication', 'coursework', 'exploration']),
    stack: z.array(z.string()),
    role: z.string(),
    status: z.enum(['active', 'paused', 'archived']),
    year: z.number(),
    repo: z.string().optional(),
    demo: z.string().optional(),
    writeup: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// 4. Writing Schema (§8)
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

// 5. Publications Schema (§8 - retained for schema validation, empty collection)
const publications = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number(),
    venue: z.string(),
    venueShort: z.string().optional(),
    type: z.enum(['journal', 'conference', 'preprint', 'workshop', 'thesis', 'chapter', 'poster', 'oral']),
    status: z.enum(['published', 'accepted', 'under-review', 'in-press', 'preprint']),
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
    award: z.string().optional(),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
  }),
});

// 6. Talks Schema (§8)
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

// 7. Teaching Schema (§8)
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

// 8. Awards Schema (§8)
const awards = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    year: z.number(),
    description: z.string().optional(),
  }),
});

// 9. Experience Schema (§8)
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

// 10. Education Schema (§8)
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

// 11. Skills Schema (§8)
const skills = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/skills' }),
  schema: z.object({
    group: z.string(),
    items: z.array(z.string()),
    order: z.number(),
  }),
});

export const collections = {
  now,
  directions,
  projects,
  writing,
  publications,
  talks,
  teaching,
  awards,
  experience,
  education,
  skills,
};
