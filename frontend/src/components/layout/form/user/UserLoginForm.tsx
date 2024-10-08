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
import { userSigninValidationSchema } from "../zodValidation";
import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BASE_ENDPOINT } from "@/constant/endpoins";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

type UserFormValue = z.infer<typeof userSigninValidationSchema>;

const defaultValues: UserFormValue = {
  email: "aasim@zipfeast.com",
  password: "Aasim@123",
};

export default function UserLoginForm() {
  const [loading, setLoading] = useState(false);

  const crudService = new CrudServices();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const authUser: authUserType | null = useAuthUser();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(userSigninValidationSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    try {
      const response = await crudService.loginUser(data);
      if (response.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        toast.error(response.error.message);
        console.error(response.error);
      } else {
        if (response.data) {
          signIn({
            auth: {
              token: response.data.accessToken,
              type: "Bearer",
            },
            userState: {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              avatar: response.data.user.avatar,
            },
          }),
            navigate(BASE_ENDPOINT);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  if (authUser) {
    navigate(BASE_ENDPOINT);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormCombinedInput
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <FormCombinedInput
                    {...field}
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {/* <GoogleSignInButton /> */}
      <Button variant="outline" className="w-full" disabled>
        Login with Google
      </Button>
    </>
  );
}
