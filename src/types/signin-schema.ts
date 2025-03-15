import { z } from "zod";

const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default signInSchema;
