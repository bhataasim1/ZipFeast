import * as z from "zod";

export const userRegistrationValidationSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email").min(5),
    role: z.string().optional().default("USER"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userSigninValidationSchema = z.object({
  email: z.string().email("Invalid email").min(5),
  password: z.string(),
});

export const checkoutFormValidationSchema = z.object({
  cart: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      merchantId: z.number(),
    })
  ),
  deliveryAddress: z.string(),
  paymentMethod: z.string(),
});