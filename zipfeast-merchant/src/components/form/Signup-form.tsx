import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { merchantRegistrationValidationSchema } from "./zodValidation";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";
import { BASE_ENDPOINT, LOGIN_ENDPOINT } from "@/constants/endpoints";

type UserFormValue = z.infer<typeof merchantRegistrationValidationSchema>;

export default function MerchantSignUpForm() {
  const [loading, setLoading] = useState(false);

  const crudService = new CrudServices();
  const navigate = useNavigate();
  const authUser: authUserType | null = useAuthUser();

  const defaultValues: UserFormValue = {
    storeName: "Zipfeast",
    name: "Aasim Ashraf",
    email: "merchant@zipfeast.com",
    password: "Aasim@123",
    confirmPassword: "Aasim@123",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(merchantRegistrationValidationSchema),
    defaultValues,
  });

  const onSubmit = async (values: UserFormValue) => {
    setLoading(true);
    try {
      const response = await crudService.registerUser(values);
      if (response.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        toast.error(response.error.message);
      } else {
        toast.success("User registered successfully");
        navigate(LOGIN_ENDPOINT);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>

        <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <FormCombinedInput
                    type="text"
                    placeholder="Enter your Store"
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

          <Button
            disabled={loading}
            className="ml-auto w-full mt-2"
            type="submit"
          >
            Register Your Account
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
      <Link to={LOGIN_ENDPOINT}>
        <Button variant="outline" className="w-full">
          Already have an Account? Login
        </Button>
      </Link>
    </>
  );
}
