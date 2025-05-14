export function detectLocale(req: Request, supportedLocales: string[] = ["en", "tr"]): string {
  const url = new URL(req.url);
  const pathLocale = url.pathname.split("/")[1];
  if (supportedLocales.includes(pathLocale)) return pathLocale;

  const header = req.headers.get("accept-language");
  const fallback = supportedLocales[0];
  if (!header) return fallback;

  const languages = header.split(",").map(lang => lang.split(";")[0].trim());
  return languages.find(lang => supportedLocales.includes(lang)) || fallback;
}
