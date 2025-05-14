import type { TranslationLoaderOptions, TranslationData } from "./types";

export async function loadTranslations({
  locale,
  namespace = "common",
  baseUrl = "/locales"
}: TranslationLoaderOptions): Promise<TranslationData> {
  const url = `${baseUrl}/${locale}/${namespace}.json`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to load translations from ${url}`);
  }

  return res.json();
}
