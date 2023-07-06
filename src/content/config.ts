import { defineCollection, reference, z } from "astro:content";

const categories = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
  }),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    categories: z.array(reference("categories")),
    link: z.string().url(),
    support: z.enum(["native", "emulation", "no", "unknown"]),
    notes: z.string(),
  }),
});

export const collections = { projects, categories };
