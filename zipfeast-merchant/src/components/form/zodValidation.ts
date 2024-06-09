import * as z from "zod";

export const merchantRegistrationValidationSchema = z
  .object({
    storeName: z.string().min(3, "Store name must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email").min(5),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const merchnatSignInValidationSchema = z.object({
  email: z.string().email("Invalid email").min(5),
  password: z.string({ message: "Password is required" }),
});
