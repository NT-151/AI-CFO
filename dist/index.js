// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  financialData = /* @__PURE__ */ new Map();
  taxOptimizations = /* @__PURE__ */ new Map();
  forecasts = /* @__PURE__ */ new Map();
  newsArticles = /* @__PURE__ */ new Map();
  aiInsights = /* @__PURE__ */ new Map();
  integrationStatuses = /* @__PURE__ */ new Map();
  constructor() {
    this.initializeDemoData();
  }
  initializeDemoData() {
    const demoUserId = "demo-user-1";
    const demoUser = {
      id: demoUserId,
      username: "demo@cfo.ai",
      password: "demo123",
      companyName: "TechVenture Ltd",
      industry: "fintech",
      foundingDate: /* @__PURE__ */ new Date("2023-01-15"),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(demoUserId, demoUser);
    const demoFinancialData = {
      id: randomUUID(),
      userId: demoUserId,
      cashBalance: "445000.00",
      monthlyRevenue: "68000.00",
      monthlyExpenses: "85000.00",
      burnRate: "24500.00",
      runway: "18.2",
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.financialData.set(demoUserId, demoFinancialData);
    const demoTaxOptimization = {
      id: randomUUID(),
      userId: demoUserId,
      pensionContribution: "8400.00",
      salaryGuid: "2800.00",
      cycleToWork: "1200.00",
      totalAnnualSavings: "12400.00",
      effectiveRate: "15.30",
      calculatedAt: /* @__PURE__ */ new Date()
    };
    this.taxOptimizations.set(demoUserId, demoTaxOptimization);
    const demoIntegrations = [
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "google_cloud",
        status: "connected",
        lastSync: /* @__PURE__ */ new Date(),
        metadata: { usage: "87%", apiCalls: "14200" },
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "payabl",
        status: "connected",
        lastSync: new Date(Date.now() - 2 * 60 * 1e3),
        // 2 minutes ago
        metadata: { accounts: 3 },
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        platform: "ipushpull",
        status: "connected",
        lastSync: /* @__PURE__ */ new Date(),
        metadata: { streams: 7, optimizationScore: "92%" },
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    this.integrationStatuses.set(demoUserId, demoIntegrations);
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      companyName: insertUser.companyName || null,
      industry: insertUser.industry || null,
      foundingDate: insertUser.foundingDate || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async getFinancialData(userId) {
    return this.financialData.get(userId);
  }
  async upsertFinancialData(userId, data) {
    const existing = this.financialData.get(userId);
    const financialData2 = {
      id: existing?.id || randomUUID(),
      userId,
      cashBalance: data.cashBalance || null,
      monthlyRevenue: data.monthlyRevenue || null,
      monthlyExpenses: data.monthlyExpenses || null,
      burnRate: data.burnRate || null,
      runway: data.runway || null,
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.financialData.set(userId, financialData2);
    return financialData2;
  }
  async getTaxOptimization(userId) {
    return this.taxOptimizations.get(userId);
  }
  async upsertTaxOptimization(userId, data) {
    const existing = this.taxOptimizations.get(userId);
    const taxOptimization2 = {
      id: existing?.id || randomUUID(),
      userId,
      pensionContribution: data.pensionContribution || null,
      salaryGuid: data.salaryGuid || null,
      cycleToWork: data.cycleToWork || null,
      totalAnnualSavings: data.totalAnnualSavings || null,
      effectiveRate: data.effectiveRate || null,
      calculatedAt: /* @__PURE__ */ new Date()
    };
    this.taxOptimizations.set(userId, taxOptimization2);
    return taxOptimization2;
  }
  async getForecasts(userId, type) {
    const userForecasts = this.forecasts.get(userId) || [];
    if (type) {
      return userForecasts.filter((f) => f.type === type);
    }
    return userForecasts;
  }
  async createForecast(userId, forecastData) {
    const forecast = {
      id: randomUUID(),
      userId,
      type: forecastData.type,
      period: forecastData.period,
      year: forecastData.year,
      projected: forecastData.projected || null,
      actual: forecastData.actual || null,
      confidence: forecastData.confidence || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    const userForecasts = this.forecasts.get(userId) || [];
    userForecasts.push(forecast);
    this.forecasts.set(userId, userForecasts);
    return forecast;
  }
  async getNewsArticles(userId, limit = 10) {
    const userNews = this.newsArticles.get(userId) || [];
    return userNews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  async createNewsArticle(userId, articleData) {
    const article = {
      id: randomUUID(),
      userId,
      title: articleData.title,
      summary: articleData.summary,
      source: articleData.source,
      url: articleData.url || null,
      publishedAt: articleData.publishedAt || null,
      relevanceScore: articleData.relevanceScore || null,
      impact: articleData.impact || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    const userNews = this.newsArticles.get(userId) || [];
    userNews.push(article);
    this.newsArticles.set(userId, userNews);
    return article;
  }
  async getAiInsights(userId, limit = 10) {
    const userInsights = this.aiInsights.get(userId) || [];
    return userInsights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  }
  async createAiInsight(userId, insightData) {
    const insight = {
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
      createdAt: /* @__PURE__ */ new Date()
    };
    const userInsights = this.aiInsights.get(userId) || [];
    userInsights.push(insight);
    this.aiInsights.set(userId, userInsights);
    return insight;
  }
  async getIntegrationStatus(userId) {
    return this.integrationStatuses.get(userId) || [];
  }
  async updateIntegrationStatus(userId, platform, status, metadata) {
    let userIntegrations = this.integrationStatuses.get(userId) || [];
    let integration = userIntegrations.find((i) => i.platform === platform);
    if (integration) {
      integration.status = status;
      integration.metadata = metadata || integration.metadata;
      integration.updatedAt = /* @__PURE__ */ new Date();
      if (status === "connected") {
        integration.lastSync = /* @__PURE__ */ new Date();
      }
    } else {
      integration = {
        id: randomUUID(),
        userId,
        platform,
        status,
        lastSync: status === "connected" ? /* @__PURE__ */ new Date() : null,
        metadata,
        updatedAt: /* @__PURE__ */ new Date()
      };
      userIntegrations.push(integration);
      this.integrationStatuses.set(userId, userIntegrations);
    }
    return integration;
  }
};
var storage = new MemStorage();

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function generateFinancialInsights(financialData2, marketData) {
  try {
    const prompt = `Analyze the following financial data and market conditions to generate actionable insights for a startup founder:

Financial Data:
${JSON.stringify(financialData2)}

Market Data:
${JSON.stringify(marketData)}

Generate 3-5 specific, actionable financial insights. For each insight, provide:
- type: "opportunity", "risk", or "optimization"  
- title: A clear, concise title
- description: Detailed explanation with specific recommendations
- impact: Estimated financial impact in GBP
- confidence: Confidence score between 0.0 and 1.0
- priority: "high", "medium", or "low"

Respond with JSON in this format: { "insights": [...] }`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert financial advisor and CFO with deep knowledge of UK tax law, startup finance, and financial planning. Provide specific, actionable insights based on the data provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error("Failed to generate financial insights: " + (error instanceof Error ? error.message : String(error)));
  }
}
async function summarizeNewsArticle(title, content, industry) {
  try {
    const prompt = `Analyze this news article for a ${industry} startup founder:

Title: ${title}
Content: ${content}

Provide:
- summary: 2-3 sentence AI summary highlighting key points and business impact
- relevanceScore: Relevance to ${industry} startups (0.0-1.0)
- impact: Overall impact assessment ("positive", "negative", or "neutral")

Respond with JSON in this format: { "summary": "...", "relevanceScore": 0.85, "impact": "positive" }`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a business analyst specializing in startup finance and market analysis. Focus on actionable insights for startup founders."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error("Failed to summarize news article: " + (error instanceof Error ? error.message : String(error)));
  }
}
async function calculateTaxOptimization(financialData2) {
  try {
    const prompt = `Calculate UK tax optimization for a startup founder with:
- Annual salary: \xA3${financialData2.annualSalary}
- Company revenue: \xA3${financialData2.companyRevenue}
- Company expenses: \xA3${financialData2.companyExpenses}
- Current pension contribution: \xA3${financialData2.currentPensionContrib}

Calculate optimal:
- Pension contribution (up to \xA340k annual allowance)
- Gift Aid donations
- Cycle to Work scheme savings
- Total annual tax savings
- Effective tax rate after optimizations

Provide specific recommendations for UK tax law compliance.

Respond with JSON: {
  "pensionContribution": 8400,
  "salaryGuid": 2800,
  "cycleToWork": 1200,
  "totalAnnualSavings": 12400,
  "effectiveRate": 15.3,
  "recommendations": ["specific recommendation 1", "recommendation 2"]
}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a UK tax specialist with expertise in startup taxation, pension schemes, and HMRC regulations. Provide accurate calculations based on current UK tax law."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error("Failed to calculate tax optimization: " + (error instanceof Error ? error.message : String(error)));
  }
}

// server/services/financial.ts
function calculateCashFlowForecast(currentData, marketTrends) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const projections = [];
  let currentBalance = parseFloat(currentData.cashBalance || "0");
  const monthlyRevenue = parseFloat(currentData.monthlyRevenue || "0");
  const monthlyExpenses = parseFloat(currentData.monthlyExpenses || "0");
  for (let i = 0; i < 6; i++) {
    const variation = (Math.random() - 0.5) * 0.1;
    projections.push({
      month: months[i],
      cashBalance: currentBalance + (monthlyRevenue - monthlyExpenses) * i + variation * currentBalance,
      inflow: monthlyRevenue * (1 + variation),
      outflow: monthlyExpenses * (1 + variation),
      projected: false
    });
  }
  for (let i = 6; i < 12; i++) {
    const growthFactor = 1 + marketTrends.growthRate / 100 / 12;
    const riskFactor = 1 + marketTrends.riskFactor / 100;
    const projectedInflow = monthlyRevenue * Math.pow(growthFactor, i - 5);
    const projectedOutflow = monthlyExpenses * riskFactor;
    currentBalance += projectedInflow - projectedOutflow;
    projections.push({
      month: months[i],
      cashBalance: currentBalance,
      inflow: projectedInflow,
      outflow: projectedOutflow,
      projected: true
    });
  }
  return projections;
}
function calculateProfitabilityForecast(currentData, marketTrends) {
  const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024", "Q1 2025", "Q2 2025"];
  const projections = [];
  const quarterlyRevenue = parseFloat(currentData.monthlyRevenue || "0") * 3;
  const quarterlyExpenses = parseFloat(currentData.monthlyExpenses || "0") * 3;
  for (let i = 0; i < quarters.length; i++) {
    const isProjected = i >= 2;
    let revenue = quarterlyRevenue;
    let expenses = quarterlyExpenses;
    if (isProjected) {
      const growthFactor = 1 + marketTrends.growthRate / 100 / 4;
      revenue *= Math.pow(growthFactor, i - 1);
      expenses *= 1 + marketTrends.competitionFactor / 100;
    } else {
      const variation = (Math.random() - 0.5) * 0.15;
      revenue *= 1 + variation;
      expenses *= 1 + Math.abs(variation) * 0.5;
    }
    const profit = revenue - expenses;
    const margin = revenue > 0 ? profit / revenue * 100 : 0;
    projections.push({
      period: quarters[i],
      revenue,
      expenses,
      profit,
      margin,
      projected: isProjected
    });
  }
  return projections;
}
function calculateBreakevenPoint(monthlyRevenue, monthlyExpenses, revenueGrowthRate) {
  if (monthlyRevenue >= monthlyExpenses) return 0;
  if (revenueGrowthRate <= 0) return Infinity;
  const ratio = monthlyExpenses / monthlyRevenue;
  const growthFactor = 1 + revenueGrowthRate / 100;
  return Math.ceil(Math.log(ratio) / Math.log(growthFactor));
}

// server/services/news.ts
var mockNewsData = [
  {
    title: "FinTech Funding Reaches Record High in Q2",
    content: "UK fintech startups raised \xA32.1 billion in the second quarter, representing a 45% increase from Q1. The surge was driven by strong investor appetite for SaaS platforms and payment solutions, with several companies securing Series A rounds above \xA310 million. Industry analysts attribute the growth to improved market conditions and increased enterprise demand for digital financial services. The payments sector led with \xA3890 million in funding, followed by lending platforms at \xA3620 million. This trend is expected to continue into Q3, with several unicorn rounds already in the pipeline.",
    url: "https://bloomberg.com/news/fintech-funding-q2",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1e3),
    // 2 hours ago
    source: "Bloomberg"
  },
  {
    title: "Bank of England Signals Potential Rate Changes",
    content: "The Bank of England monetary policy committee indicated a potential 0.25% interest rate cut in the next quarter, citing stabilizing inflation and economic growth concerns. The decision would mark the first rate reduction in over a year and could significantly impact startup financing costs. Small businesses and early-stage companies are expected to benefit from lower borrowing costs, while savers may see reduced returns on deposits. Financial advisors recommend companies consider fixing borrowing rates before any potential cuts take effect. The announcement has already influenced corporate bond markets and venture debt pricing.",
    url: "https://ft.com/content/bank-england-rates",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1e3),
    // 4 hours ago
    source: "Financial Times"
  },
  {
    title: "New UK Tax Incentives for Tech Startups Announced",
    content: "The government has unveiled enhanced Enterprise Investment Scheme (EIS) and Seed Enterprise Investment Scheme (SEIS) benefits for qualifying tech startups. The new measures include increased tax relief up to 50% on qualifying investments and extended carry-forward periods for unused allowances. Companies in AI, cleantech, and digital health sectors are particularly well-positioned to benefit from these changes. The initiative aims to boost early-stage funding and encourage more private investment in high-growth sectors. Tax experts estimate eligible companies could access additional benefits worth \xA325,000-\xA3100,000 annually depending on their funding structure.",
    url: "https://bbc.co.uk/business/startup-tax-incentives",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1e3),
    // 6 hours ago
    source: "BBC Business"
  }
];
async function fetchIndustryNews(industry, limit = 10) {
  try {
    const relevantNews = mockNewsData.filter((article) => {
      const content = article.title.toLowerCase() + " " + article.content.toLowerCase();
      const industryKeywords = getIndustryKeywords(industry.toLowerCase());
      return industryKeywords.some((keyword) => content.includes(keyword));
    });
    return relevantNews.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch industry news:", error);
    return [];
  }
}
function getIndustryKeywords(industry) {
  const keywordMap = {
    "fintech": ["fintech", "financial", "payments", "banking", "lending", "investment", "funding"],
    "saas": ["saas", "software", "cloud", "subscription", "platform", "enterprise"],
    "ecommerce": ["ecommerce", "retail", "marketplace", "commerce", "shopping", "consumer"],
    "healthcare": ["healthcare", "health", "medical", "pharmaceutical", "biotech"],
    "ai": ["ai", "artificial intelligence", "machine learning", "automation", "data"],
    "default": ["startup", "funding", "investment", "business", "technology", "innovation"]
  };
  return keywordMap[industry] || keywordMap["default"];
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  companyName: text("company_name"),
  industry: text("industry"),
  foundingDate: timestamp("founding_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var financialData = pgTable("financial_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cashBalance: decimal("cash_balance", { precision: 12, scale: 2 }),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }),
  monthlyExpenses: decimal("monthly_expenses", { precision: 12, scale: 2 }),
  burnRate: decimal("burn_rate", { precision: 12, scale: 2 }),
  runway: decimal("runway", { precision: 5, scale: 1 }),
  lastUpdated: timestamp("last_updated").defaultNow()
});
var taxOptimization = pgTable("tax_optimization", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  pensionContribution: decimal("pension_contribution", { precision: 10, scale: 2 }),
  salaryGuid: decimal("salary_guid", { precision: 10, scale: 2 }),
  cycleToWork: decimal("cycle_to_work", { precision: 10, scale: 2 }),
  totalAnnualSavings: decimal("total_annual_savings", { precision: 10, scale: 2 }),
  effectiveRate: decimal("effective_rate", { precision: 5, scale: 2 }),
  calculatedAt: timestamp("calculated_at").defaultNow()
});
var forecasts = pgTable("forecasts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // "cash_flow" | "revenue" | "profitability"
  period: text("period").notNull(),
  // "Q1", "Q2", etc.
  year: integer("year").notNull(),
  projected: decimal("projected", { precision: 12, scale: 2 }),
  actual: decimal("actual", { precision: 12, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});
var newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  url: text("url"),
  publishedAt: timestamp("published_at"),
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }),
  impact: text("impact"),
  // "positive" | "negative" | "neutral"
  createdAt: timestamp("created_at").defaultNow()
});
var aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // "opportunity" | "risk" | "optimization"
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: decimal("impact", { precision: 12, scale: 2 }),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  priority: text("priority").notNull(),
  // "high" | "medium" | "low"
  actionable: boolean("actionable").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});
var integrationStatus = pgTable("integration_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(),
  // "google_cloud" | "payabl" | "ipushpull"
  status: text("status").notNull(),
  // "connected" | "disconnected" | "error"
  lastSync: timestamp("last_sync"),
  metadata: jsonb("metadata"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  companyName: true,
  industry: true,
  foundingDate: true
});
var insertFinancialDataSchema = createInsertSchema(financialData).omit({
  id: true,
  userId: true,
  lastUpdated: true
});
var insertTaxOptimizationSchema = createInsertSchema(taxOptimization).omit({
  id: true,
  userId: true,
  calculatedAt: true
});
var insertForecastSchema = createInsertSchema(forecasts).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertAiInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  userId: true,
  createdAt: true
});

// server/routes.ts
async function registerRoutes(app2) {
  const DEMO_USER_ID = "demo-user-1";
  app2.get("/api/dashboard", async (req, res) => {
    try {
      const financialData2 = await storage.getFinancialData(DEMO_USER_ID);
      const taxOptimization2 = await storage.getTaxOptimization(DEMO_USER_ID);
      const integrationStatus2 = await storage.getIntegrationStatus(DEMO_USER_ID);
      if (!financialData2) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      res.json({
        financialData: financialData2,
        taxOptimization: taxOptimization2,
        integrationStatus: integrationStatus2,
        metrics: {
          runway: parseFloat(financialData2.runway || "0"),
          burnRate: parseFloat(financialData2.burnRate || "0"),
          taxSavings: parseFloat(taxOptimization2?.totalAnnualSavings || "0"),
          breakeven: calculateBreakevenPoint(
            parseFloat(financialData2.monthlyRevenue || "0"),
            parseFloat(financialData2.monthlyExpenses || "0"),
            8
            // 8% monthly growth assumption
          )
        }
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  app2.get("/api/cash-flow/forecast", async (req, res) => {
    try {
      const financialData2 = await storage.getFinancialData(DEMO_USER_ID);
      if (!financialData2) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      const marketTrends = {
        growthRate: 8,
        // 8% monthly growth
        riskFactor: 0.05
        // 5% risk increase
      };
      const forecast = calculateCashFlowForecast(financialData2, marketTrends);
      res.json({ forecast });
    } catch (error) {
      console.error("Cash flow forecast error:", error);
      res.status(500).json({ message: "Failed to calculate cash flow forecast" });
    }
  });
  app2.get("/api/profitability/forecast", async (req, res) => {
    try {
      const financialData2 = await storage.getFinancialData(DEMO_USER_ID);
      if (!financialData2) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      const marketTrends = {
        growthRate: 15,
        // 15% quarterly growth
        competitionFactor: 0.03
        // 3% expense increase due to competition
      };
      const forecast = calculateProfitabilityForecast(financialData2, marketTrends);
      res.json({ forecast });
    } catch (error) {
      console.error("Profitability forecast error:", error);
      res.status(500).json({ message: "Failed to calculate profitability forecast" });
    }
  });
  app2.post("/api/tax-planning/optimize", async (req, res) => {
    try {
      const financialData2 = await storage.getFinancialData(DEMO_USER_ID);
      if (!financialData2) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      const optimizationData = {
        annualSalary: parseFloat(financialData2.monthlyRevenue || "0") * 12 * 0.3,
        // Assume 30% as salary
        companyRevenue: parseFloat(financialData2.monthlyRevenue || "0") * 12,
        companyExpenses: parseFloat(financialData2.monthlyExpenses || "0") * 12,
        currentPensionContrib: 3e3
        // Default current contribution
      };
      const optimization = await calculateTaxOptimization(optimizationData);
      const taxOptimization2 = await storage.upsertTaxOptimization(DEMO_USER_ID, {
        pensionContribution: optimization.pensionContribution.toString(),
        salaryGuid: optimization.salaryGuid.toString(),
        cycleToWork: optimization.cycleToWork.toString(),
        totalAnnualSavings: optimization.totalAnnualSavings.toString(),
        effectiveRate: optimization.effectiveRate.toString()
      });
      res.json({
        taxOptimization: taxOptimization2,
        recommendations: optimization.recommendations
      });
    } catch (error) {
      console.error("Tax optimization error:", error);
      res.status(500).json({ message: "Failed to optimize tax planning" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const user = await storage.getUser(DEMO_USER_ID);
      const industry = user?.industry || "fintech";
      const newsData = await fetchIndustryNews(industry, 10);
      const articles = [];
      for (const article of newsData) {
        try {
          const analysis = await summarizeNewsArticle(article.title, article.content, industry);
          const newsArticle = await storage.createNewsArticle(DEMO_USER_ID, {
            title: article.title,
            summary: analysis.summary,
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            relevanceScore: analysis.relevanceScore.toString(),
            impact: analysis.impact
          });
          articles.push(newsArticle);
        } catch (aiError) {
          const newsArticle = await storage.createNewsArticle(DEMO_USER_ID, {
            title: article.title,
            summary: article.content.substring(0, 200) + "...",
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            relevanceScore: "0.5",
            impact: "neutral"
          });
          articles.push(newsArticle);
        }
      }
      res.json({ articles });
    } catch (error) {
      console.error("News feed error:", error);
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });
  app2.get("/api/insights", async (req, res) => {
    try {
      const financialData2 = await storage.getFinancialData(DEMO_USER_ID);
      if (!financialData2) {
        return res.status(404).json({ message: "Financial data not found" });
      }
      const marketData = {
        interestRates: 5.25,
        inflationRate: 2.3,
        sectorGrowth: 12.5,
        competitionIndex: 0.7,
        economicIndicators: {
          gdpGrowth: 1.8,
          unemployment: 4.2,
          consumerConfidence: 65
        }
      };
      let insights = [];
      try {
        const aiInsightsData = await generateFinancialInsights(financialData2, marketData);
        for (const insight of aiInsightsData.insights) {
          const aiInsight = await storage.createAiInsight(DEMO_USER_ID, {
            type: insight.type,
            title: insight.title,
            description: insight.description,
            impact: insight.impact.toString(),
            confidence: insight.confidence.toString(),
            priority: insight.priority,
            actionable: true,
            metadata: null
          });
          insights.push(aiInsight);
        }
      } catch (aiError) {
        const demoInsights = [
          {
            type: "optimization",
            title: "Tax Optimization Opportunity",
            description: "Based on your current financial position, increasing pension contributions could save you \xA38,400 annually in tax.",
            impact: "8400",
            confidence: "0.85",
            priority: "high",
            actionable: true,
            metadata: null
          },
          {
            type: "opportunity",
            title: "Revenue Growth Potential",
            description: "Market conditions indicate a 15% growth opportunity in your sector over the next quarter.",
            impact: "25000",
            confidence: "0.72",
            priority: "medium",
            actionable: true,
            metadata: null
          }
        ];
        for (const insight of demoInsights) {
          const aiInsight = await storage.createAiInsight(DEMO_USER_ID, insight);
          insights.push(aiInsight);
        }
      }
      res.json({ insights });
    } catch (error) {
      console.error("AI insights error:", error);
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });
  app2.post("/api/financial-data", async (req, res) => {
    try {
      const validatedData = insertFinancialDataSchema.parse(req.body);
      const financialData2 = await storage.upsertFinancialData(DEMO_USER_ID, validatedData);
      res.json(financialData2);
    } catch (error) {
      console.error("Update financial data error:", error);
      res.status(400).json({ message: "Invalid financial data" });
    }
  });
  app2.get("/api/integrations", async (req, res) => {
    try {
      const integrations = await storage.getIntegrationStatus(DEMO_USER_ID);
      res.json({ integrations });
    } catch (error) {
      console.error("Integration status error:", error);
      res.status(500).json({ message: "Failed to fetch integration status" });
    }
  });
  app2.post("/api/integrations/:platform", async (req, res) => {
    try {
      const { platform } = req.params;
      const { status, metadata } = req.body;
      const integration = await storage.updateIntegrationStatus(DEMO_USER_ID, platform, status, metadata);
      res.json(integration);
    } catch (error) {
      console.error("Update integration error:", error);
      res.status(500).json({ message: "Failed to update integration status" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  preview: {
    port: 8080,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
