import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// import myImage from "@/public/undraw_male_avatar_g98d.svg";
// import * as z from "zod";
import { CrudServices } from "@/API/CrudServices";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { userUpdateImageValidationSchema } from "./zodValidation";

// type UserFormValue = z.infer<typeof userUpdateImageValidationSchema>;

const ProfileImageUploadCard = () => {
  const crudServices = new CrudServices();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const authUser: authUserType | null = useAuthUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(userUpdateImageValidationSchema),
    defaultValues: {
      avatar: "",
    },
  });

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await crudServices.getUserProfile();
      if (res) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setImage(res?.data?.avatar);
      } else {
        toast.error("Failed to fetch user profile. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    console.log("Form Data:", formData);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="grid gap-2 mt-2">
          {loading ? (
            <Skeleton className="aspect-square w-full rounded-md bg-slate-400" />
          ) : (
            <img
              alt={authUser?.name || "User Profile Image"}
              className="aspect-square w-full rounded-md object-cover"
              src={image || "https://via.placeholder.com/200"}
              height={200}
              width={200}
            />
          )}
          <div className="grid">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          className="w-full"
                          placeholder="Choose Avatar"
                          accept="image/*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-1"
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Avatar"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUploadCard;
