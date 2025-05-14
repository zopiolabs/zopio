import { detectLocale } from "./utils";

export const withI18n = (supportedLocales: string[] = ["en", "tr"]) => {
  return async (req: Request, next: (locale: string) => Promise<Response>): Promise<Response> => {
    const locale = detectLocale(req, supportedLocales);
    return next(locale);
  };
};
