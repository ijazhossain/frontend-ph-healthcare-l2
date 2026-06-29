import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.email("invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be 8 character long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});
export type ILoginPayload=z.infer<typeof loginZodSchema>