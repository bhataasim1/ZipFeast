import { useForm } from "react-hook-form";
import { Form, FormField } from "../ui/form";
import { FormCombinedInput } from "./FormCombinedInput";

const FormSearchBox = () => {
  const form = useForm();


  return (
    <>
      <Form {...form}>
        <form className="w-full">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormCombinedInput
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded-md "
                {...field}
                value={field.value}
              />
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default FormSearchBox;
