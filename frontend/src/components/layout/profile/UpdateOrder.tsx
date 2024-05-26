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
import { FormSelectInput } from "@/components/common/FormSelectInput";
import { paymentMethodOptions } from "@/constant/paymentOptions";
import { Card, CardContent } from "@/components/ui/card";

const updateOrderValidationSchema = z.object({
  deliveryAddress: z.string({ message: "Delivery Address is required" }),
  paymentMethod: z.string({ message: "Payment Method is required" }),
});

type UserFormValue = z.infer<typeof updateOrderValidationSchema>;

interface UpdateOrderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UpdateOrder({ order }: UpdateOrderProps) {
  const [loading, setLoading] = useState(false);
  console.log(order);

  const defaultValues: UserFormValue = {
    deliveryAddress: order.deliveryAddress,
    paymentMethod: order.paymentMethod,
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(updateOrderValidationSchema),
    defaultValues,
  });

  const onSubmit = async (values: UserFormValue) => {
    setLoading(true);
    console.log(values);
    setLoading(false);
  };

  return (
    <>
      <Card className="flex-1 max-w-full mx-auto">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center space-y-1.5 p-2 w-full">
              <div className="w-full h-40">
                <img
                  src={order.items[0].product.productImage}
                  alt={order.items[0].product.name}
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <h5 className="text-sm py-2 font-medium truncate w-full overflow-ellipsis">
                {order.items[0].product.name}
              </h5>
              <span className="text-sm font-light">
                {order.items[0].product.description}
              </span>
            </div>
            <h3 className="text-sm font-bold py-3">
              {order.items[0].product.price}
            </h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <FormCombinedInput
                        type="text"
                        placeholder="Enter your Address"
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormSelectInput
                      {...field}
                      options={paymentMethodOptions}
                      placeholder="Choose Payment Method"
                      animated={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="ml-auto w-full mt-2"
                type="submit"
              >
                Update Order
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
