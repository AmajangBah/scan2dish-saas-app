import { z } from "zod";

export const SignupFormSchema = z
  .object({
    businessName: z.string().min(1, "Business name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .max(255, "Email too long"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number too long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupValues = z.infer<typeof SignupFormSchema>;
