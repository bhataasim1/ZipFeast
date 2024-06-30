import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { FormSelectInput } from "@/components/common/FormSelectInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";
import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const createProductValidationSchema = z.object({
  name: z.string().nonempty("Name is required"),
  price: z.string().nonempty("Price is required"),
  description: z.string().nonempty("Description is required"),
  category: z.string().nonempty("Category is required"),
  stock: z.string().nonempty("Stock is required"),
  isAvailable: z.boolean({ message: "Is available is required" }),
  productImage: z.instanceof(File).optional(),
});

type UserFormValue = z.infer<typeof createProductValidationSchema>;

type AddProductDropDownProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const AddProductDropDown = ({
  isOpen,
  onClose,
  title,
}: AddProductDropDownProps) => {
  // console.log(product);

  const [, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(createProductValidationSchema),
    defaultValues: {
      name: "New Product",
      price: "110",
      description: "New Product Description",
      category: "New Category",
      stock: "10",
      isAvailable: true,
    },
  });

  const crudServices = new CrudServices();

  const onSubmit = async (values: UserFormValue) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("stock", values.stock);
    formData.append("isAvailable", values.isAvailable.toString());

    if (values.productImage) {
      formData.append("productImage", values.productImage);
    }
    try {
      setLoading(true);
      const response = await crudServices.createProduct(formData);
      console.log("Success  ", response);
      if (response.data.status === "success") {
        toast.success("Product updated successfully");
        onClose();
      }
    } catch (error) {
      toast.error("Error while updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Product Name</FormLabel>
                  <FormCombinedInput
                    {...field}
                    placeholder="Enter product name"
                    type="text"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <FormCombinedInput
                      type="text"
                      placeholder="Update product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <div className="flex-1">
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <FormCombinedInput
                          type="text"
                          placeholder="Update product Price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <div className="flex-1">
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <FormCombinedInput
                          type="number"
                          placeholder="Update product Stock"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <div className="flex-1">
                    <FormItem>
                      <FormLabel>Available</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <FormCombinedInput
                      type="text"
                      placeholder="Update product Category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productImage"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full"
                      placeholder="Choose Product Image"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFile(file as File);
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button
                variant="destructive"
                onClick={onClose}
                disabled={loading}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDropDown;
