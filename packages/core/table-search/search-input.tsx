import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  placeholder?: string;
  onChange: (value: string) => void;
  delay?: number;
}

export function SearchInput({ placeholder = "Search...", onChange, delay = 300 }: Props) {
  const handleDebounce = useDebouncedCallback(onChange, delay);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={(e) => handleDebounce(e.target.value)}
    />
  );
}
