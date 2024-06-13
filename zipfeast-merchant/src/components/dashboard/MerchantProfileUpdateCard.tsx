import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormCombinedInput } from "../common/FormCombinedInput";
import { Card } from "../ui/card";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CrudServices } from "@/API/CrudServices";
import { userProfileUpdateSchema } from "./zodValidation";

type userProfileUpdateValues = z.infer<typeof userProfileUpdateSchema>;

export default function MerchantProfileUpdateCard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialData, setInitialData] =
    useState<userProfileUpdateValues | null>(null);
  const crudServices = new CrudServices();

  const form = useForm<userProfileUpdateValues>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: initialData ?? {},
  });

  // console.log("Initial data:", initialData);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await crudServices.getMerchantProfile();
        // console.log("Profile response:", response.data.data);
        if (response.data) {
          setInitialData(response.data.data);
          form.reset(response.data.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onSubmit = async (values: userProfileUpdateValues) => {
    setLoading(true);
    try {
      const response = await crudServices.updateMerchantProfile(values);
      // console.log("Update response:", response.data);
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
    <Card className="xl:col-span-2 p-5">
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
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <FormCombinedInput
                    {...field}
                    type="text"
                    placeholder="Update your Store Name"
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
    </Card>
  );
}
