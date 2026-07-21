import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['en', 'fr']),
    order: z.number(),
    title: z.string(),
    summary: z.string(),
    short: z.string().optional(),
    icon: z.string(),           // e.g. "fundraising" → icon-fundraising.png
    featured: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['en', 'fr']),
    title: z.string(),
    partner: z.string(),
    beneficiary: z.string().optional(),
    programme: z.string().optional(),
    location: z.string(),
    date: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    cover: z.string(),          // key into imported image map
    gallery: z.array(z.string()).default([]),
    outcomes: z.array(z.object({ n: z.string(), l: z.string() })).default([]),
    excerpt: z.string(),
  }),
});

const insights = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['en', 'fr']),
    title: z.string(),
    date: z.string(),
    author: z.string(),
    category: z.string(),
    excerpt: z.string(),
    cover: z.string(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    lang: z.enum(['en', 'fr']),
    name: z.string(),
    role: z.string(),
    order: z.number().default(0),
    photo: z.string(),
    linkedin: z.string().optional(),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { services, caseStudies, insights, team };
