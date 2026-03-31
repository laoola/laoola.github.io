import { defineCollection, z } from 'astro:content';
import { file } from 'astro:content/loaders';

const blog = defineCollection({
  loader: file('src/content/blog/**/*.{md,mdx}'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog,
};
