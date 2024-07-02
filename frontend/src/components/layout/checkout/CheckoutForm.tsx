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
import { CrudServices } from "@/API/CrudServices";
import { toast } from "sonner";
import { FormSelectInput } from "@/components/common/FormSelectInput";
import { LucideShoppingBag } from "lucide-react";
import { CartItemType } from "@/types/types";
import { checkoutFormValidationSchema } from "../form/zodValidation";
import { paymentMethodOptions } from "@/constant/paymentOptions";
import { useNavigate } from "react-router-dom";
import { BASE_ENDPOINT } from "@/constant/endpoins";

type UserFormValue = z.infer<typeof checkoutFormValidationSchema>;

interface CheckoutFormProps {
  cartItems: CartItemType[];
  clearCart: () => void;
}

export default function CheckoutForm({
  cartItems,
  clearCart,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const crudService = new CrudServices();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(checkoutFormValidationSchema),
    defaultValues: {
      cart: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        merchantId: item.product.merchantId,
      })),
      deliveryAddress: "",
      paymentMethod: "",
    },
  });

  const onSubmit = async (values: UserFormValue) => {
    setLoading(true);
    // console.log(values);
    try {
      const response = await crudService.placeOrder(values);
      // console.log(response);
      if (!response.error) {
        clearCart();
        toast.success("Order placed successfully");
        navigate(BASE_ENDPOINT);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Failed to place order");
    }
    setLoading(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
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
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Mode</FormLabel>
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
            type="submit"
            disabled={loading}
            className="ml-auto w-full mt-2 gap-3"
            variant={"destructive"}
          >
            <LucideShoppingBag size={20} /> Place Order
          </Button>
        </form>
      </Form>
    </>
  );
}
