import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  decimal,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name"),
  industry: text("industry"),
  foundingDate: timestamp("founding_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const financialData = pgTable("financial_data", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  cashBalance: decimal("cash_balance", { precision: 12, scale: 2 }),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }),
  monthlyExpenses: decimal("monthly_expenses", { precision: 12, scale: 2 }),
  burnRate: decimal("burn_rate", { precision: 12, scale: 2 }),
  runway: decimal("runway", { precision: 5, scale: 1 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const taxOptimization = pgTable("tax_optimization", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  pensionContribution: decimal("pension_contribution", {
    precision: 10,
    scale: 2,
  }),
  salaryGuid: decimal("salary_guid", { precision: 10, scale: 2 }),
  cycleToWork: decimal("cycle_to_work", { precision: 10, scale: 2 }),
  totalAnnualSavings: decimal("total_annual_savings", {
    precision: 10,
    scale: 2,
  }),
  effectiveRate: decimal("effective_rate", { precision: 5, scale: 2 }),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const forecasts = pgTable("forecasts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(), // "cash_flow" | "revenue" | "profitability"
  period: text("period").notNull(), // "Q1", "Q2", etc.
  year: integer("year").notNull(),
  projected: decimal("projected", { precision: 12, scale: 2 }),
  actual: decimal("actual", { precision: 12, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsArticles = pgTable("news_articles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  url: text("url"),
  publishedAt: timestamp("published_at"),
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }),
  impact: text("impact"), // "positive" | "negative" | "neutral"
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(), // "opportunity" | "risk" | "optimization"
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: decimal("impact", { precision: 12, scale: 2 }),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  priority: text("priority").notNull(), // "high" | "medium" | "low"
  actionable: boolean("actionable").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrationStatus = pgTable("integration_status", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  platform: text("platform").notNull(), // "google_cloud" | "payabl" | "ipushpull"
  status: text("status").notNull(), // "connected" | "disconnected" | "error"
  lastSync: timestamp("last_sync"),
  metadata: jsonb("metadata"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    companyName: true,
    industry: true,
    foundingDate: true,
  })
  .partial({
    industry: true,
    foundingDate: true,
  });

export const insertFinancialDataSchema = createInsertSchema(financialData).omit(
  {
    id: true,
    userId: true,
    lastUpdated: true,
  }
);

export const insertTaxOptimizationSchema = createInsertSchema(
  taxOptimization
).omit({
  id: true,
  userId: true,
  calculatedAt: true,
});

export const insertForecastSchema = createInsertSchema(forecasts).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FinancialData = typeof financialData.$inferSelect;
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type TaxOptimization = typeof taxOptimization.$inferSelect;
export type InsertTaxOptimization = z.infer<typeof insertTaxOptimizationSchema>;
export type Forecast = typeof forecasts.$inferSelect;
export type InsertForecast = z.infer<typeof insertForecastSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type IntegrationStatus = typeof integrationStatus.$inferSelect;
