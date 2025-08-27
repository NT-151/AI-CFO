import {
  type User,
  type InsertUser,
  type FinancialData,
  type InsertFinancialData,
  type TaxOptimization,
  type InsertTaxOptimization,
  type Forecast,
  type InsertForecast,
  type NewsArticle,
  type InsertNewsArticle,
  type AiInsight,
  type InsertAiInsight,
  type IntegrationStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./services/supabase";
import { eq, and } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Financial Data
  getFinancialData(userId: string): Promise<FinancialData | undefined>;
  upsertFinancialData(
    userId: string,
    data: InsertFinancialData
  ): Promise<FinancialData>;

  // Tax Optimization
  getTaxOptimization(userId: string): Promise<TaxOptimization | undefined>;
  upsertTaxOptimization(
    userId: string,
    data: InsertTaxOptimization
  ): Promise<TaxOptimization>;

  // Forecasts
  getForecasts(userId: string, type?: string): Promise<Forecast[]>;
  createForecast(userId: string, forecast: InsertForecast): Promise<Forecast>;

  // News Articles
  getNewsArticles(userId: string, limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(
    userId: string,
    article: InsertNewsArticle
  ): Promise<NewsArticle>;

  // AI Insights
  getAiInsights(userId: string, limit?: number): Promise<AiInsight[]>;
  createAiInsight(userId: string, insight: InsertAiInsight): Promise<AiInsight>;

  // Integration Status
  getIntegrationStatus(userId: string): Promise<IntegrationStatus[]>;
  updateIntegrationStatus(
    userId: string,
    platform: string,
    status: string,
    metadata?: any
  ): Promise<IntegrationStatus>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private financialData: Map<string, FinancialData> = new Map();
  private taxOptimizations: Map<string, TaxOptimization> = new Map();
  private forecasts: Map<string, Forecast[]> = new Map();
  private newsArticles: Map<string, NewsArticle[]> = new Map();
  private aiInsights: Map<string, AiInsight[]> = new Map();
  private integrationStatuses: Map<string, IntegrationStatus[]> = new Map();

  constructor() {
    // Initialize with demo user data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUserId = "demo-user-1";
    const demoUser: User = {
      id: demoUserId,
      username: "demo@cfo.ai",
      password: "demo123",
      companyName: "TechVenture Ltd",
      industry: "fintech",
      foundingDate: new Date("2023-01-15"),
      createdAt: new Date(),
    };
    this.users.set(demoUserId, demoUser);

    // Demo financial data
    const demoFinancialData: FinancialData = {
      id: randomUUID(),
      userId: demoUserId,
      cashBalance: "445000.00",
      monthlyRevenue: "68000.00",
      monthlyExpenses: "85000.00",
      burnRate: "24500.00",
      runway: "18.2",
      lastUpdated: new Date(),
    };
    this.financialData.set(demoUserId, demoFinancialData);

    // Demo tax optimization
    const demoTaxOptimization: TaxOptimization = {
      id: randomUUID(),
      userId: demoUserId,
      pensionContribution: "8400.00",
      salaryGuid: "2800.00",
      cycleToWork: "1200.00",
      totalAnnualSavings: "12400.00",
      effectiveRate: "15.30",
      calculatedAt: new Date(),
    };
    this.taxOptimizations.set(demoUserId, demoTaxOptimization);

    // Demo integration statuses
    const demoIntegrations: IntegrationStatus[] = [
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "google_cloud",
        status: "connected",
        lastSync: new Date(),
        metadata: { usage: "87%", apiCalls: "14200" },
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "payabl",
        status: "connected",
        lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        metadata: { accounts: 3 },
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "ipushpull",
        status: "connected",
        lastSync: new Date(),
        metadata: { streams: 7, optimizationScore: "92%" },
        updatedAt: new Date(),
      },
    ];
    this.integrationStatuses.set(demoUserId, demoIntegrations);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      companyName: insertUser.companyName || null,
      industry: insertUser.industry || null,
      foundingDate: insertUser.foundingDate || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);

    // Create demo financial data for this new user
    this.initializeDemoDataForUser(id);

    return user;
  }

  private initializeDemoDataForUser(userId: string) {
    // Demo financial data
    const demoFinancialData: FinancialData = {
      id: randomUUID(),
      userId,
      cashBalance: "445000.00",
      monthlyRevenue: "68000.00",
      monthlyExpenses: "85000.00",
      burnRate: "24500.00",
      runway: "18.2",
      lastUpdated: new Date(),
    };
    this.financialData.set(userId, demoFinancialData);

    // Demo tax optimization
    const demoTaxOptimization: TaxOptimization = {
      id: randomUUID(),
      userId,
      pensionContribution: "8400.00",
      salaryGuid: "2800.00",
      cycleToWork: "1200.00",
      totalAnnualSavings: "12400.00",
      effectiveRate: "15.30",
      calculatedAt: new Date(),
    };
    this.taxOptimizations.set(userId, demoTaxOptimization);

    // Demo integration statuses
    const demoIntegrations: IntegrationStatus[] = [
      {
        id: randomUUID(),
        userId,
        platform: "google_cloud",
        status: "connected",
        lastSync: new Date(),
        metadata: { usage: "87%", apiCalls: "14200" },
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        platform: "payabl",
        status: "connected",
        lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        metadata: { accounts: 3 },
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        platform: "ipushpull",
        status: "connected",
        lastSync: new Date(),
        metadata: { streams: 7, optimizationScore: "92%" },
        updatedAt: new Date(),
      },
    ];
    this.integrationStatuses.set(userId, demoIntegrations);

    // Demo AI insights
    const demoInsights: AiInsight[] = [
      {
        id: randomUUID(),
        userId,
        type: "optimization",
        title: "Tax Optimization Opportunity",
        description:
          "Based on your current financial position, increasing pension contributions could save you £8,400 annually in tax.",
        impact: "8400.00",
        confidence: "0.85",
        priority: "high",
        actionable: true,
        metadata: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        type: "opportunity",
        title: "Revenue Growth Potential",
        description:
          "Market conditions indicate a 15% growth opportunity in your sector over the next quarter.",
        impact: "25000.00",
        confidence: "0.72",
        priority: "medium",
        actionable: true,
        metadata: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        type: "risk",
        title: "Cash Flow Monitoring",
        description:
          "Your current burn rate suggests monitoring cash flow closely over the next 6 months.",
        impact: "-15000.00",
        confidence: "0.68",
        priority: "medium",
        actionable: true,
        metadata: null,
        createdAt: new Date(),
      },
    ];
    this.aiInsights.set(userId, demoInsights);

    // Demo forecasts
    const demoForecasts: Forecast[] = [
      {
        id: randomUUID(),
        userId,
        type: "cash_flow",
        period: "Q1",
        year: 2025,
        projected: "185000.00",
        actual: null,
        confidence: "0.75",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        type: "revenue",
        period: "Q1",
        year: 2025,
        projected: "204000.00",
        actual: null,
        confidence: "0.80",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        type: "profitability",
        period: "Q1",
        year: 2025,
        projected: "19000.00",
        actual: null,
        confidence: "0.70",
        createdAt: new Date(),
      },
    ];
    this.forecasts.set(userId, demoForecasts);

    // Demo news articles
    const demoNews: NewsArticle[] = [
      {
        id: randomUUID(),
        userId,
        title: "UK Fintech Sector Shows Strong Growth in Q1 2025",
        summary:
          "The UK fintech sector continues to demonstrate robust growth with 12% increase in investment and 8% rise in employment.",
        source: "Financial Times",
        url: "https://example.com/fintech-growth-2025",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        relevanceScore: "0.92",
        impact: "positive",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId,
        title: "New Tax Incentives for Startup Investments",
        summary:
          "Government announces enhanced tax relief for angel investors and startup funding initiatives.",
        source: "BBC Business",
        url: "https://example.com/tax-incentives-startups",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        relevanceScore: "0.88",
        impact: "positive",
        createdAt: new Date(),
      },
    ];
    this.newsArticles.set(userId, demoNews);
  }

  async getFinancialData(userId: string): Promise<FinancialData | undefined> {
    return this.financialData.get(userId);
  }

  async upsertFinancialData(
    userId: string,
    data: InsertFinancialData
  ): Promise<FinancialData> {
    const existing = this.financialData.get(userId);
    const financialData: FinancialData = {
      id: existing?.id || randomUUID(),
      userId,
      cashBalance: data.cashBalance || null,
      monthlyRevenue: data.monthlyRevenue || null,
      monthlyExpenses: data.monthlyExpenses || null,
      burnRate: data.burnRate || null,
      runway: data.runway || null,
      lastUpdated: new Date(),
    };
    this.financialData.set(userId, financialData);
    return financialData;
  }

  async getTaxOptimization(
    userId: string
  ): Promise<TaxOptimization | undefined> {
    return this.taxOptimizations.get(userId);
  }

  async upsertTaxOptimization(
    userId: string,
    data: InsertTaxOptimization
  ): Promise<TaxOptimization> {
    const existing = this.taxOptimizations.get(userId);
    const taxOptimization: TaxOptimization = {
      id: existing?.id || randomUUID(),
      userId,
      pensionContribution: data.pensionContribution || null,
      salaryGuid: data.salaryGuid || null,
      cycleToWork: data.cycleToWork || null,
      totalAnnualSavings: data.totalAnnualSavings || null,
      effectiveRate: data.effectiveRate || null,
      calculatedAt: new Date(),
    };
    this.taxOptimizations.set(userId, taxOptimization);
    return taxOptimization;
  }

  async getForecasts(userId: string, type?: string): Promise<Forecast[]> {
    const userForecasts = this.forecasts.get(userId) || [];
    if (type) {
      return userForecasts.filter((f) => f.type === type);
    }
    return userForecasts;
  }

  async createForecast(
    userId: string,
    forecastData: InsertForecast
  ): Promise<Forecast> {
    const forecast: Forecast = {
      id: randomUUID(),
      userId,
      type: forecastData.type,
      period: forecastData.period,
      year: forecastData.year,
      projected: forecastData.projected || null,
      actual: forecastData.actual || null,
      confidence: forecastData.confidence || null,
      createdAt: new Date(),
    };

    const userForecasts = this.forecasts.get(userId) || [];
    userForecasts.push(forecast);
    this.forecasts.set(userId, userForecasts);

    return forecast;
  }

  async getNewsArticles(
    userId: string,
    limit: number = 10
  ): Promise<NewsArticle[]> {
    const userNews = this.newsArticles.get(userId) || [];
    return userNews
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createNewsArticle(
    userId: string,
    articleData: InsertNewsArticle
  ): Promise<NewsArticle> {
    const article: NewsArticle = {
      id: randomUUID(),
      userId,
      title: articleData.title,
      summary: articleData.summary,
      source: articleData.source,
      url: articleData.url || null,
      publishedAt: articleData.publishedAt || null,
      relevanceScore: articleData.relevanceScore || null,
      impact: articleData.impact || null,
      createdAt: new Date(),
    };

    const userNews = this.newsArticles.get(userId) || [];
    userNews.push(article);
    this.newsArticles.set(userId, userNews);

    return article;
  }

  async getAiInsights(
    userId: string,
    limit: number = 10
  ): Promise<AiInsight[]> {
    const userInsights = this.aiInsights.get(userId) || [];
    return userInsights
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createAiInsight(
    userId: string,
    insightData: InsertAiInsight
  ): Promise<AiInsight> {
    const insight: AiInsight = {
      id: randomUUID(),
      userId,
      type: insightData.type,
      title: insightData.title,
      description: insightData.description,
      impact: insightData.impact || null,
      confidence: insightData.confidence || null,
      priority: insightData.priority,
      actionable: insightData.actionable || null,
      metadata: insightData.metadata || null,
      createdAt: new Date(),
    };

    const userInsights = this.aiInsights.get(userId) || [];
    userInsights.push(insight);
    this.aiInsights.set(userId, userInsights);

    return insight;
  }

  async getIntegrationStatus(userId: string): Promise<IntegrationStatus[]> {
    return this.integrationStatuses.get(userId) || [];
  }

  async updateIntegrationStatus(
    userId: string,
    platform: string,
    status: string,
    metadata?: any
  ): Promise<IntegrationStatus> {
    let userIntegrations = this.integrationStatuses.get(userId) || [];
    let integration = userIntegrations.find((i) => i.platform === platform);

    if (integration) {
      integration.status = status;
      integration.metadata = metadata || integration.metadata;
      integration.updatedAt = new Date();
      if (status === "connected") {
        integration.lastSync = new Date();
      }
    } else {
      integration = {
        id: randomUUID(),
        userId,
        platform,
        status,
        lastSync: status === "connected" ? new Date() : null,
        metadata,
        updatedAt: new Date(),
      };
      userIntegrations.push(integration);
      this.integrationStatuses.set(userId, userIntegrations);
    }

    return integration;
  }
}
export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    return newUser;
  }

  async getFinancialData(userId: string): Promise<FinancialData | undefined> {
    const result = await db
      .select()
      .from(schema.financialData)
      .where(eq(schema.financialData.userId, userId));
    return result[0];
  }

  async upsertFinancialData(
    userId: string,
    data: InsertFinancialData
  ): Promise<FinancialData> {
    const existing = await this.getFinancialData(userId);

    if (existing) {
      const [updated] = await db
        .update(schema.financialData)
        .set({
          ...data,
          lastUpdated: new Date(),
        })
        .where(eq(schema.financialData.userId, userId))
        .returning();
      return updated;
    } else {
      const [newData] = await db
        .insert(schema.financialData)
        .values({
          ...data,
          userId,
          lastUpdated: new Date(),
        })
        .returning();
      return newData;
    }
  }

  async getTaxOptimization(
    userId: string
  ): Promise<TaxOptimization | undefined> {
    const result = await db
      .select()
      .from(schema.taxOptimization)
      .where(eq(schema.taxOptimization.userId, userId));
    return result[0];
  }

  async upsertTaxOptimization(
    userId: string,
    data: InsertTaxOptimization
  ): Promise<TaxOptimization> {
    const existing = await this.getTaxOptimization(userId);

    if (existing) {
      const [updated] = await db
        .update(schema.taxOptimization)
        .set({
          ...data,
          calculatedAt: new Date(),
        })
        .where(eq(schema.taxOptimization.userId, userId))
        .returning();
      return updated;
    } else {
      const [newData] = await db
        .insert(schema.taxOptimization)
        .values({
          ...data,
          userId,
          calculatedAt: new Date(),
        })
        .returning();
      return newData;
    }
  }

  async getForecasts(userId: string, type?: string): Promise<Forecast[]> {
    let query = db
      .select()
      .from(schema.forecasts)
      .where(eq(schema.forecasts.userId, userId));

    if (type) {
      // Use a single where clause with AND
      return await db
        .select()
        .from(schema.forecasts)
        .where(
          and(
            eq(schema.forecasts.userId, userId),
            eq(schema.forecasts.type, type)
          )
        );
    }

    return await query;
  }

  async createForecast(
    userId: string,
    forecastData: InsertForecast
  ): Promise<Forecast> {
    const [newForecast] = await db
      .insert(schema.forecasts)
      .values({
        ...forecastData,
        userId,
        createdAt: new Date(),
      })
      .returning();
    return newForecast;
  }

  async getNewsArticles(
    userId: string,
    limit: number = 10
  ): Promise<NewsArticle[]> {
    const result = await db
      .select()
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.userId, userId))
      .orderBy(schema.newsArticles.createdAt)
      .limit(limit);
    return result;
  }

  async createNewsArticle(
    userId: string,
    articleData: InsertNewsArticle
  ): Promise<NewsArticle> {
    const [newArticle] = await db
      .insert(schema.newsArticles)
      .values({
        ...articleData,
        userId,
        createdAt: new Date(),
      })
      .returning();
    return newArticle;
  }

  async getAiInsights(
    userId: string,
    limit: number = 10
  ): Promise<AiInsight[]> {
    const result = await db
      .select()
      .from(schema.aiInsights)
      .where(eq(schema.aiInsights.userId, userId))
      .orderBy(schema.aiInsights.createdAt)
      .limit(limit);
    return result;
  }

  async createAiInsight(
    userId: string,
    insightData: InsertAiInsight
  ): Promise<AiInsight> {
    const [newInsight] = await db
      .insert(schema.aiInsights)
      .values({
        ...insightData,
        userId,
        createdAt: new Date(),
      })
      .returning();
    return newInsight;
  }

  async getIntegrationStatus(userId: string): Promise<IntegrationStatus[]> {
    return await db
      .select()
      .from(schema.integrationStatus)
      .where(eq(schema.integrationStatus.userId, userId));
  }

  async updateIntegrationStatus(
    userId: string,
    platform: string,
    status: string,
    metadata?: any
  ): Promise<IntegrationStatus> {
    const existing = await db
      .select()
      .from(schema.integrationStatus)
      .where(
        and(
          eq(schema.integrationStatus.userId, userId),
          eq(schema.integrationStatus.platform, platform)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(schema.integrationStatus)
        .set({
          status,
          metadata,
          updatedAt: new Date(),
          lastSync: status === "connected" ? new Date() : null,
        })
        .where(eq(schema.integrationStatus.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newStatus] = await db
        .insert(schema.integrationStatus)
        .values({
          userId,
          platform,
          status,
          metadata,
          lastSync: status === "connected" ? new Date() : null,
          updatedAt: new Date(),
        })
        .returning();
      return newStatus;
    }
  }
}

// Export both storage options - you can switch between them
export const memStorage = new MemStorage();
export const supabaseStorage = new SupabaseStorage();

export const storage =
  process.env.NODE_ENV === "production" ? supabaseStorage : memStorage;
