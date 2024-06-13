import { z } from "zod";

export const userProfileUpdateSchema = z.object({
  name: z
    .string({ message: "Please enter a valid name" })
    .min(2, "Name is too short")
    .max(30, "Name is too long")
    .optional(),
  storeName: z
    .string({ message: "Please enter a valid Store Name" })
    .min(3, "Store Name is too short")
    .max(30, "Store Name is too long")
    .optional(),
  address: z
    .string({ message: "Please enter a valid Address" })
    .min(3, "Address is too short")
    .max(60, "Address is too long")
    .optional(),
  pincode: z
    .string({ message: "Please enter a valid Pincode" })
    .min(6, "Pincode is too short")
    .max(6, "Pincode is too long")
    .optional(),
  city: z
    .string({ message: "Please enter a valid City" })
    .min(3, "City is too short")
    .max(20, "City is too long")
    .optional(),
  state: z
    .string({ message: "Please enter a valid State" })
    .min(3, "State is too short")
    .max(20, "State is too long")
    .optional(),
});

export const userUpdateImageValidationSchema = z.object({
  avatar: z.instanceof(File, { message: "Avatar is Required" }),
});
