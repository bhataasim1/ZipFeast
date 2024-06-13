import { useState, useEffect } from "react";

type UseDebounceType = (value: string, delay: number) => string;

export const useDebounce: UseDebounceType = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
