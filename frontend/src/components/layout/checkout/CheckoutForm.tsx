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
// import { userRegistrationValidationSchema } from "../zodValidation";
// import { CrudServices } from "@/API/CrudServices";
// import { toast } from "sonner";
// import { BASE_ENDPOINT, SIGN_IN } from "@/constant/endpoins";
// import { useNavigate } from "react-router-dom";
import { FormSelectInput } from "@/components/common/FormSelectInput";
import { LucideShoppingBag } from "lucide-react";

const checkoutFormValidationSchema = z.object({
  productId: z.array(z.string()),
  quantity: z.array(z.number()),
  deliveryAddress: z.string(),
  paymentMethod: z.array(z.string()),
  merchantId: z.number(),
});
type UserFormValue = z.infer<typeof checkoutFormValidationSchema>;

const paymentMethodOptions = [{ label: "Cash on Delivery", value: "COD" }];

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);

  //   const crudService = new CrudServices();
  //   const navigate = useNavigate();

  const defaultValues: UserFormValue = {
    productId: ["5"],
    quantity: [3],
    deliveryAddress: "Frisal, Kulgam, Jammu and Kashmir, India",
    merchantId: 1,
    paymentMethod: ["COD"],
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(checkoutFormValidationSchema),
    defaultValues,
  });

  const onSubmit = async (values: UserFormValue) => {
    setLoading(true);
    console.log(values);
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
              <div>
                <FormLabel>Payment Mode</FormLabel>
                <FormSelectInput
                  {...field}
                  options={paymentMethodOptions}
                  placeholder="Choose Payment Method"
                  animated={true}
                />
                <FormMessage />
              </div>
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
