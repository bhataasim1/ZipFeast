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
import * as z from "zod";
import { CrudServices } from "@/API/CrudServices";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { userUpdateImageValidationSchema } from "./zodValidation";

type UserFormValue = z.infer<typeof userUpdateImageValidationSchema>;

const ProfileImageUploadCard = () => {
  const crudServices = new CrudServices();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const authUser: authUserType | null = useAuthUser();
  const [, setFile] = useState<File | null>(null);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(userUpdateImageValidationSchema),
    defaultValues: {
      avatar: undefined,
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
        setImage(res?.data?.data?.avatar);
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

  const submit = async (data: UserFormValue) => {
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    setUploading(true);
    try {
      const res = await crudServices.updateProfileImage(formData);
      if (res) {
        toast.success("Avatar updated successfully");
        fetchUserProfile();
      } else {
        toast.error("Failed to update avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="grid gap-2 mt-2">
          {loading ? (
            <Skeleton className="aspect-square w-full rounded-md bg-slate-400" />
          ) : (
            <div className="flex justify-center items-center">
              <img
                alt={authUser?.name || "User Profile Image"}
                className="aspect-square rounded-full object-cover"
                src={image || "https://via.placeholder.com/200"}
                height={200}
                width={200}
              />
            </div>
          )}
          <div className="flex justify-center items-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="flex gap-3">
                <FormField
                  name="avatar"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
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
                <Button
                  className="col-span-1"
                  type="submit"
                  disabled={uploading}
                  variant={'secondary'}
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
