import * as z from "zod";

export const userProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .max(255, "Name is too long")
    .optional(),
  email: z
    .string()
    .email("Invalid email")
    .max(255, "Email is too long")
    .optional(),
  address: z
    .string()
    .min(2, "Address is too short")
    .max(255, "Address is too long")
    .optional(),
  phone: z
    .string()
    .min(2, "Phone is too short")
    .max(12, "Phone is too long")
    .optional(),
  city: z
    .string()
    .min(2, "City is too short")
    .max(255, "City is too long")
    .optional(),
  pincode: z
    .string()
    .min(2, "Pincode is too short")
    .max(6, "Pincode is too long")
    .optional(),
  state: z
    .string()
    .min(2, "State is too short")
    .max(255, "State is too long")
    .optional(),
});


export const userUpdateImageValidationSchema = z.object({
  avatar: z.instanceof(File, { message: "Avatar is Required"}),
});