import { z, ZodSchema } from "zod";

export const validateWithZod =
  <Schema extends ZodSchema>(schema: Schema) =>
  (input: z.input<Schema>) => {
    return schema.parse(input) as z.infer<Schema>;
  };
