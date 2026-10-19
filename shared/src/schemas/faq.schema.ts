import { z } from "zod";

const FaqContentSchema = z.object({
  card_codes: z.array(z.string()).nullish(),
  cycles: z.array(z.string()).nullish(),
  scenario_codes: z.array(z.string()).nullish(),
  question: z.string(),
  ruling: z.string(),
});

export const JsonDataFaqSchema = z.discriminatedUnion("type", [
  FaqContentSchema.extend({
    type: z.literal("faq"),
    citation: z.string(),
  }),
  FaqContentSchema.extend({
    type: z.literal("rules-form"),
    citation: z.string().default("rules-form"),
    date: z.iso.date(),
  }),
]);

export type JsonDataFaq = z.infer<typeof JsonDataFaqSchema>;

export const FaqSchema = FaqContentSchema.extend({
  type: z.enum(["faq", "rules-form"]),
  citation: z.string(),
  date: z.iso
    .date()
    .nullish()
    .transform((date) => date ?? undefined),
  id: z.number(),
  position: z.number(),
});

export type Faq = z.infer<typeof FaqSchema>;
