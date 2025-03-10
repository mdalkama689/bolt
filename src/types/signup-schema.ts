import { z } from "zod";

const signUpSchema = z.object({
  fullName: z
    .string()
    .min(5, { message: "Full name must be at least 5 characters" })
    .max(30, { message: "Full name should not exceed 30 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password length must be at least 6 characters" }),
});

export default signUpSchema;
