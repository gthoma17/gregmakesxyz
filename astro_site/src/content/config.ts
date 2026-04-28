import { z, defineCollection } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    series: z.array(z.string()).optional(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().optional(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    featuredImage: z.union([image(), z.null()]).optional().default(null),
  }),
});

const recipes = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    featuredImage: z.union([image(), z.null()]).optional().default(null),
    attribution: z.string().optional(),
    equipment: z.array(z.string()),
    ingredients: z.array(z.object({
      name: z.string(),
      amount: z.number(),
      unit: z.string().nullable().optional(),
      dish: z.string(),
      dish_ml: z.number().optional(),
      prep: z.string().optional(),
    })),
    steps: z.array(z.object({
      text: z.string(),
      timers: z.array(z.object({
        label: z.string(),
        minutes: z.number(),
      })).default([]),
      lastUse: z.array(z.string()).default([]),
    })).default([]),
  }),
});

export const collections = {
  posts,
  notes,
  recipes,
};