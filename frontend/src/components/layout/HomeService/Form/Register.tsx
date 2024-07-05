import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { HomeServices } from "@/API/HomeServices";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

const userRegisterValidationSchema = z
  .object({
    name: z.string({ message: "Name is Required" }).nonempty().min(3).max(20),
    email: z.string({ message: "Email is Required" }).email(),
    phone: z.string({ message: "Phone Number is Required" }).min(10).max(10),
    serviceType: z.string({ message: "Service Type is Required" }).nonempty(),
    address: z.string({ message: "Address is Required" }).nonempty(),
    city: z.string({ message: "City is Required" }).nonempty(),
    state: z.string({ message: "State is Required" }).nonempty(),
    pincode: z.string({ message: "Pincode is Required" }).min(6).max(6),
    avatar: z.instanceof(File, { message: "Avatar is Required" }),
    price: z.string({ message: "Price is Required" }).min(3).max(6),
    password: z.string({ message: "Password is Required" }).min(8),
    confirmPassword: z
      .string({ message: "Confirm Password is Required" })
      .min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValue = z.infer<typeof userRegisterValidationSchema>;

export function Register() {
  const [loading, setLoading] = useState(false);
  const [, setFile] = useState<File | null>(null);
  const authUser: authUserType | null = useAuthUser();

  const homeServices = new HomeServices();
  const navigate = useNavigate();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(userRegisterValidationSchema),
    defaultValues: {
      name: "Aasim",
      email: "aasim@z.com",
      phone: "1234567891",
      password: "12345678",
      confirmPassword: "12345678",
      serviceType: "Electrician",
      address: "123, Street",
      city: "City",
      state: "State",
      pincode: "123456",
      price: "500",
    },
  });

  const onSubmit = async (values: UserFormValue) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("serviceType", values.serviceType);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("pincode", values.pincode);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    if (values.avatar) {
      formData.append("avatar", values.avatar);
    }
    try {
      setLoading(true);
      const response = await homeServices.registerUser(formData);
      console.log("Registration Response:", response);
      if (!response.error) {
        toast.success("Registration Successful");
        navigate("/services/login");
      }
      if (response.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        toast.error(`error: ${response.error.message}`);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authUser) {
    navigate("/services");
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mx-auto max-w-2xl mt-2 mb-2">
            <CardHeader>
              <CardTitle className="text-xl">
                Register as Service Provider
              </CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    name="avatar"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              //@ts-ignore
                              setFile(file);
                              field.onChange(file);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="Enter your Name"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Type</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="eg. Electrician, Plumber, etc."
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="email"
                              placeholder="Enter your email"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="Enter your Phone Number"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="password"
                              placeholder="Enter your password"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="password"
                              placeholder="Confirm your password"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="Enter your City"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="Enter your State"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              type="text"
                              placeholder="Enter your Pincode"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <FormCombinedInput
                            type="text"
                            placeholder="Your Service Price"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <FormCombinedInput
                            type="text"
                            rows={3}
                            placeholder="Enter your Address"
                            disabled={loading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button disabled={loading} className="w-full" type="submit">
                  Create an Account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to={"/services/login"} className="underline">
                  Login Here
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
