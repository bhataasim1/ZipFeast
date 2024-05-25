import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { userProfileUpdateSchema } from "./zodValidation";
import { CrudServices } from "@/API/CrudServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

type userProfileUpdateValues = z.infer<typeof userProfileUpdateSchema>;

const ProfileUpdate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialData, setInitialData] =
    useState<userProfileUpdateValues | null>(null);

  const crudServices = new CrudServices();

  const form = useForm<userProfileUpdateValues>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: initialData ?? {},
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await crudServices.getUserProfile();
        if (response.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setInitialData(response.data.data);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          form.reset(response.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onSubmit = async (values: userProfileUpdateValues) => {
    setLoading(true);
    try {
      const response = await crudServices.updateUserProfile(values);
      if (response.data) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 p-4 overflow-y-auto w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="max-w-screen-2xl w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex flex-col w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <FormCombinedInput
                          {...field}
                          type="text"
                          placeholder="Update your name"
                          disabled={loading}
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
                          {...field}
                          type="text"
                          placeholder="Update your email"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <FormCombinedInput
                          {...field}
                          type="text"
                          placeholder="Phone Number"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              {...field}
                              type="text"
                              placeholder="Address"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              {...field}
                              type="text"
                              placeholder="Pincode"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </div>
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              {...field}
                              type="text"
                              placeholder="City"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <div className="flex-1">
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <FormCombinedInput
                              {...field}
                              type="text"
                              placeholder="State"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </div>

                <Button disabled={loading} className="w-full" type="submit">
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
