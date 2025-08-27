import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function generateFinancialInsights(financialData: any, marketData: any): Promise<{
  insights: Array<{
    type: "opportunity" | "risk" | "optimization";
    title: string;
    description: string;
    impact: number;
    confidence: number;
    priority: "high" | "medium" | "low";
  }>;
}> {
  try {
    const prompt = `Analyze the following financial data and market conditions to generate actionable insights for a startup founder:

Financial Data:
${JSON.stringify(financialData)}

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
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    throw new Error("Failed to generate financial insights: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function summarizeNewsArticle(title: string, content: string, industry: string): Promise<{
  summary: string;
  relevanceScore: number;
  impact: "positive" | "negative" | "neutral";
}> {
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
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    throw new Error("Failed to summarize news article: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function calculateTaxOptimization(financialData: {
  annualSalary: number;
  companyRevenue: number;
  companyExpenses: number;
  currentPensionContrib: number;
}): Promise<{
  pensionContribution: number;
  salaryGuid: number;
  cycleToWork: number;
  totalAnnualSavings: number;
  effectiveRate: number;
  recommendations: string[];
}> {
  try {
    const prompt = `Calculate UK tax optimization for a startup founder with:
- Annual salary: £${financialData.annualSalary}
- Company revenue: £${financialData.companyRevenue}
- Company expenses: £${financialData.companyExpenses}
- Current pension contribution: £${financialData.currentPensionContrib}

Calculate optimal:
- Pension contribution (up to £40k annual allowance)
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
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    throw new Error("Failed to calculate tax optimization: " + (error instanceof Error ? error.message : String(error)));
  }
}
