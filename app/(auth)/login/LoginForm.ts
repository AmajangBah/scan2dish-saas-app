import { z } from "zod";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email("invalid email address")
    .max(255, "email must be less than 256 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export default LoginFormSchema;
