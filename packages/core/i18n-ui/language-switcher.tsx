import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { usePathname } from "next-intl/client";
import { Select } from "@/components/ui/select";
import { useTransition } from "react";

const locales = [
  { label: "🇺🇸 English", value: "en" },
  { label: "🇹🇷 Türkçe", value: "tr" },
  { label: "🇪🇸 Español", value: "es" }
];

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(() => {
      router.push(pathname, { locale: value });
    });
  };

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={handleChange}
    >
      {locales.map((item) => (
        <Select.Item key={item.value} value={item.value}>
          {item.label}
        </Select.Item>
      ))}
    </Select>
  );
}
