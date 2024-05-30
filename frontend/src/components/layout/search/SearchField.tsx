import { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { FormCombinedInput } from "@/components/common/FormCombinedInput";
import { useDebounce } from "@/hooks/useDebounce";
import { useForm } from "react-hook-form";

type SearchFieldProps = {
  setQuery: (query: string) => void;
  query: string;
};

const SearchField = ({ setQuery, query }: SearchFieldProps) => {
  const form = useForm();
  const [searchValue, setSearchValue] = useState(query);
  const debouncedSearchValue = useDebounce(searchValue, 700);

  useEffect(() => {
    setQuery(debouncedSearchValue);
  }, [debouncedSearchValue, setQuery]);

  const handleSearchChange = (event: { target: { value: string } }) => {
    setSearchValue(event.target.value);
  };

  return (
    <Form {...form}>
      <form className="w-full">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormCombinedInput
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-md"
              {...field}
              value={searchValue}
              onChange={handleSearchChange}
            />
          )}
        />
      </form>
    </Form>
  );
};

export default SearchField;
