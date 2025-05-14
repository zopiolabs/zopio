export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface TranslationLoaderOptions {
  locale: string;
  namespace?: string;
  baseUrl?: string;
}
