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
import { HomeServices } from "@/API/HomeServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const userServiceProfileUpdateValidationSchema = z.object({
  name: z.string({ message: "Name is Required" }).nonempty().min(3).max(20),
  address: z.string({ message: "Address is Required" }).nonempty(),
  city: z.string({ message: "City is Required" }).nonempty(),
  state: z.string({ message: "State is Required" }).nonempty(),
  pincode: z.string({ message: "Pincode is Required" }).min(6).max(6),
  avatar: z.instanceof(File, { message: "Avatar is Required" }),
  price: z.string({ message: "Price is Required" }).min(3).max(6),
});

export type InitialData = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  avatar: string;
  price: string;
};

type userProfileUpdateValues = z.infer<
  typeof userServiceProfileUpdateValidationSchema
>;

const ServiceProfileUpdate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [, setFile] = useState<File | null>(null);
  const [initialData, setInitialData] = useState<InitialData | null>();

  const homeServices = new HomeServices();

  const form = useForm<userProfileUpdateValues>({
    resolver: zodResolver(userServiceProfileUpdateValidationSchema),
    // defaultValues: initialData ?? {},
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await homeServices.getUserProfile();
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
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const onSubmit = async (values: userProfileUpdateValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("pincode", values.pincode);

    if (values.avatar) {
      formData.append("avatar", values.avatar);
    }
    try {
      setUploading(true);
      const response = await homeServices.updateUserProfile(formData);
      if (response.data) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex-1 p-4 overflow-y-auto w-full">
          <div className="flex flex-col justify-center items-center">
            {loading ? (
              <Skeleton className="aspect-square w-full rounded-md bg-slate-400" />
            ) : (
              <div className="flex justify-center items-center">
                <img
                  alt={initialData?.name || "User Profile Image"}
                  className="aspect-square rounded-full object-cover"
                  src={initialData?.avatar || "https://via.placeholder.com/200"}
                  height={200}
                  width={200}
                />
              </div>
            )}
            <div className="max-w-screen-2xl w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 flex flex-col w-full"
                >
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
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <FormCombinedInput
                            {...field}
                            type="text"
                            placeholder="Enter City"
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
                      name="state"
                      render={({ field }) => (
                        <div className="flex-1">
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <FormCombinedInput
                                {...field}
                                type="text"
                                placeholder="Enter State"
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
                      name="price"
                      render={({ field }) => (
                        <div className="flex-1">
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <FormCombinedInput
                                {...field}
                                type="text"
                                placeholder="Enter Price eg. 1000"
                                disabled={loading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      )}
                    />
                  </div>

                  <Button disabled={uploading} className="w-full" type="submit">
                    {uploading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceProfileUpdate;
