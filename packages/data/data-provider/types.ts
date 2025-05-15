export type ProviderType =
  | "rest"
  | "graphql"
  | "firebase"
  | "supabase"
  | "mock"
  | "local"
  | "airtable"
  | "medusa"
  | "drizzle"
  | "kysely"
  | "xata"
  | "neon"
  | "odoo"
  | "sap"
  | "zopio"
  | "prisma"
  | "syncops"
  | "github"
  | "notion"
  | "baserow"
  | "nocodb"
  | "google-sheets"
  | "n8n"
  | "temporal"
  | "killbill"
  | "stripe"
  | "formbricks"
  | "shopify"
  | "custom";

export interface CreateDataProviderOptions {
  type: ProviderType;
  config?: Record<string, unknown>;
}