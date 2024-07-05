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
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

const userLoginValidationSchema = z.object({
  email: z.string({ message: "Email is Required" }).email(),
  password: z.string({ message: "Password is Required" }),
});

type UserFormValue = z.infer<typeof userLoginValidationSchema>;

export function Login() {
  const [loading, setLoading] = useState(false);

  const homeServices = new HomeServices();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const authUser: authUserType | null = useAuthUser();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(userLoginValidationSchema),
    defaultValues: {
      email: "aasim@z.com",
      password: "12345678",
    },
  });

  const onSubmit = async (values: UserFormValue) => {
    setLoading(true);
    try {
      const response = await homeServices.loginUser(values);
      // console.log("Login Response:", response.data.data);
      if (!response.error) {
        if (response.data) {
          toast.success("Login Successful");
          signIn({
            auth: {
              token: response.data.data.token,
              type: "Bearer",
            },
            userState: {
              id: response.data.data.user.id,
              name: response.data.data.user.name,
              email: response.data.data.user.email,
              avatar: response.data.data.user.avatar,
              phone: response.data.data.user.phone,
              serviceType: response.data.data.user.serviceType,
              state: response.data.data.user.state,
              pincode: response.data.data.user.pincode,
              address: response.data.data.user.address,
            },
          }),
            navigate("/services");
        }
      }
      if (response.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        toast.error(`error: ${response.error.message}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
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
          <Card className="mx-auto max-w-lg mt-2 mb-2">
            <CardHeader>
              <CardTitle className="text-xl">
                Login as Service Provider
              </CardTitle>
              <CardDescription>
                Enter details to Login your Account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <FormCombinedInput
                            type="password"
                            placeholder="Enter your Password"
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
                  Login as Service Provider
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Dont have an account?{" "}
                <Link to={"/services/register"} className="underline">
                  Register Now
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
