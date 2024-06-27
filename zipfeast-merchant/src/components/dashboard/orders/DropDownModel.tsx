import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSelectInput } from "@/components/common/FormSelectInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";

const orderStatusValidation = z.object({
  orderStatus: z.string().nonempty(),
});

type UserFormValue = z.infer<typeof orderStatusValidation>;

type DropDownModelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  order: Order;
};

const DropDownModel = ({
  isOpen,
  onClose,
  title,
  order,
}: DropDownModelProps) => {
  console.log(order);
  const orderStatusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Delivered", value: "DELIVERED" },
  ];

  const form = useForm<UserFormValue>({
    resolver: zodResolver(orderStatusValidation),
    defaultValues: {
      orderStatus: order.orderStatus,
    },
  });

  const crudServices = new CrudServices();

  const onSubmit = async (values: UserFormValue) => {
    try {
      const response = await crudServices.updateOrderStatus(
        order.id,
        values.orderStatus
      );
      if (!response.error) {
        onClose();
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p>Order: {order?.items[0]?.product?.name}</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Order Status</FormLabel>
                  <FormSelectInput
                    {...field}
                    options={orderStatusOptions}
                    placeholder="Select Order Status"
                    animated={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-2">
              <Button variant="destructive" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DropDownModel;
