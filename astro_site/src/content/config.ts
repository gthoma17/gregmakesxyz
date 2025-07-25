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

export const collections = {
  posts,
  notes,
};