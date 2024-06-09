/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Select, { components, ControlProps, OptionProps } from "react-select";

export interface DropdownOption {
  label: string;
  value: string | number | boolean;
}

export interface FormSelectInputProps {
  onChange: (value: any) => void;
  placeholder?: string;
  value?: string | number | boolean;
  options?: DropdownOption[];
  animated?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  create?: boolean;
  onClickCreate?: () => void;
}

export const FormSelectInput = React.forwardRef<any, FormSelectInputProps>(
  (
    {
      onChange,
      placeholder,
      value,
      options = [],
      animated,
      multiple = false,
      searchable = false,
      create = false,
      onClickCreate,
      ...props
    }: FormSelectInputProps,
    ref
  ) => {
    const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(
      null
    );

    const handleOnChange = (selectedOption: DropdownOption | null) => {
      setSelectedItem(selectedOption);
      onChange(selectedOption ? selectedOption.value : null);
    };

    useEffect(() => {
      if (!value) {
        setSelectedItem(null);
        return;
      }
      const finalValue =
        options.find((option) => option.value === value) || null;
      setSelectedItem(finalValue);
    }, [value, options]);

    const CustomControl = (props: ControlProps<any>) => (
      <components.Control {...props} />
    );

    const CustomMenuList = (props: any) => (
      <components.MenuList {...props}>
        {create && (
          <components.Option
            {...props}
            innerProps={{
              ...props.innerProps,
              style: {
                marginBottom: "8px",
                width: "100%",
                borderWidth: "1px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                borderRadius: "4px",
                cursor: "pointer",
                textAlign: "center",
              },
              onClick: () => onClickCreate && onClickCreate(),
            }}
          >
            Create New
          </components.Option>
        )}
        {props.children}
      </components.MenuList>
    );

    const customComponents = {
      Control: CustomControl,
      MenuList: CustomMenuList,
    };

    const customStyles = {
      option: (provided: any, state: any) => ({
        ...provided,
        color: state.isFocused
          ? "hsl(var(--background))"
          : "hsl(var(--foreground))",
        backgroundColor: state.isFocused
          ? "hsl(var(--foreground))"
          : "hsl(var(--background))",
        "&:active": {
          backgroundColor: state.isFocused
            ? "hsl(var(--foreground))"
            : "hsl(var(--background))",
        },
      }),
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "var(--card)",
        "&:hover": { borderColor: "var(--input)" },
        boxShadow: state.isFocused ? "var(--ring)" : "none",
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "var(--foreground)",
        backgroundColor: "var(--card-foreground)",
      }),
      valueContainer: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "var(--card-foreground)",
        boxShadow: state.isFocused ? "none" : "none",
      }),
      menu: (provided: any) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        boxShadow: "none",
      }),
      menuList: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--foreground)",
      }),
    };

    return (
      <Select
        ref={ref}
        onChange={handleOnChange as any}
        placeholder={placeholder}
        value={selectedItem}
        styles={customStyles}
        options={options}
        components={customComponents}
        isMulti={multiple}
        openMenuOnClick={true}
        openMenuOnFocus={true}
        isSearchable={searchable}
        {...props}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "white",
            primary: "bg-background",
          },
        })}
      />
    );
  }
);

FormSelectInput.displayName = "FormSelectInput";
