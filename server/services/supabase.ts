import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@shared/schema";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
}

// Supabase client for auth/real-time
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Postgres client for Drizzle
export const client = postgres(
  process.env.SUPABASE_URL.replace(
    "https://",
    "postgresql://postgres:" + process.env.SUPABASE_SERVICE_ROLE_KEY + "@"
  )
);
export const db = drizzle(client, { schema });
