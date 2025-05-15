import { CreateDataProviderOptions } from "./types";
import { CrudProvider } from "@repo/crud";

// Default clients
import { restProvider } from "./clients/rest";
import { mockProvider } from "./clients/mock";

// Core & platform adapters
import { createGraphQLClient } from "@repo/graphql-client";
import { createFirebaseClient } from "@repo/firebase-client";
import { createSupabaseClient } from "@repo/supabase-client";
import { createLocalClient } from "@repo/local-client";
import { createAirtableClient } from "@repo/airtable-client";
import { createMedusaClient } from "@repo/medusa-client";
import { createDrizzleClient } from "@repo/drizzle-client";
import { createKyselyClient } from "@repo/kysely-client";
import { createXataClient } from "@repo/xata-client";
import { createNeonClient } from "@repo/neon-client";
import { createOdooClient } from "@repo/odoo-client";
import { createSAPClient } from "@repo/sap-client";
import { createZopioClient } from "@repo/zopio-client";
import { createPrismaClient } from "@repo/prisma-client";
import { createSyncOpsClient } from "@repo/syncops-client";

// Productivity & integrations
import { createGithubClient } from "@repo/github-client";
import { createNotionClient } from "@repo/notion-client";
import { createBaserowClient } from "@repo/baserow-client";
import { createNocodbClient } from "@repo/nocodb-client";
import { createGoogleSheetsClient } from "@repo/google-sheets-client";
import { createN8nClient } from "@repo/n8n-client";
import { createTemporalClient } from "@repo/temporal-client";
import { createKillbillClient } from "@repo/killbill-client";
import { createStripeClient } from "@repo/stripe-client";
import { createFormbricksClient } from "@repo/formbricks-client";
import { createShopifyClient } from "@repo/shopify-client";

export const createDataProvider = (options: CreateDataProviderOptions): CrudProvider => {
  switch (options.type) {
    case "rest": return restProvider(options.config);
    case "mock": return mockProvider();
    case "graphql": return createGraphQLClient();
    case "firebase": return createFirebaseClient();
    case "supabase": return createSupabaseClient();
    case "local": return createLocalClient();
    case "airtable": return createAirtableClient();
    case "medusa": return createMedusaClient();
    case "drizzle": return createDrizzleClient();
    case "kysely": return createKyselyClient();
    case "xata": return createXataClient();
    case "neon": return createNeonClient();
    case "odoo": return createOdooClient();
    case "sap": return createSAPClient();
    case "zopio": return createZopioClient();
    case "prisma": return createPrismaClient(options.config as any);
    case "syncops": return createSyncOpsClient(options.config as any);
    case "github": return createGithubClient();
    case "notion": return createNotionClient();
    case "baserow": return createBaserowClient();
    case "nocodb": return createNocodbClient();
    case "google-sheets": return createGoogleSheetsClient();
    case "n8n": return createN8nClient();
    case "temporal": return createTemporalClient();
    case "killbill": return createKillbillClient();
    case "stripe": return createStripeClient();
    case "formbricks": return createFormbricksClient();
    case "shopify": return createShopifyClient();
    default:
      throw new Error(`Unsupported data provider type: ${options.type}`);
  }
};