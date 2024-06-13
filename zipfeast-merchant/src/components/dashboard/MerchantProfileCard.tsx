import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { userUpdateImageValidationSchema } from "./zodValidation";

type UserFormValue = z.infer<typeof userUpdateImageValidationSchema>;

export default function MerchantProfileCard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [, setFile] = useState<File | null>(null);
  const crudServices = new CrudServices();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(userUpdateImageValidationSchema),
  });

  const submit = async (data: UserFormValue) => {
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    try {
      setUploading(true);
      const response = await crudServices.uploadProfilePicture(formData);
      // console.log("response", response.data.data.avatar);
      if (response.data) {
        setImage(response.data.data.avatar);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await crudServices.getMerchantProfile();
      // console.log("response", response.data);
      if (response.data) {
        setImage(response.data.data.avatar);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Upload Profile Picture</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {loading ? (
            <Skeleton className="aspect-square w-full rounded-md bg-slate-400" />
          ) : (
            <img
              alt="Product img"
              className="aspect-square w-full rounded-md object-cover"
              height="300"
              src={image}
              width="300"
            />
          )}
          <div className="grid grid-cols-1 gap-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)} className="flex">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile(file);
                              field.onChange(file);
                            }
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
}
