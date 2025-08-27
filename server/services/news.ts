export interface NewsSource {
  name: string;
  url: string;
  apiKey?: string;
}

export interface RawNewsArticle {
  title: string;
  content: string;
  url: string;
  publishedAt: Date;
  source: string;
}

// Mock news data for demo - in production, integrate with real APIs
const mockNewsData: RawNewsArticle[] = [
  {
    title: "FinTech Funding Reaches Record High in Q2",
    content: "UK fintech startups raised £2.1 billion in the second quarter, representing a 45% increase from Q1. The surge was driven by strong investor appetite for SaaS platforms and payment solutions, with several companies securing Series A rounds above £10 million. Industry analysts attribute the growth to improved market conditions and increased enterprise demand for digital financial services. The payments sector led with £890 million in funding, followed by lending platforms at £620 million. This trend is expected to continue into Q3, with several unicorn rounds already in the pipeline.",
    url: "https://bloomberg.com/news/fintech-funding-q2",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    source: "Bloomberg"
  },
  {
    title: "Bank of England Signals Potential Rate Changes",
    content: "The Bank of England monetary policy committee indicated a potential 0.25% interest rate cut in the next quarter, citing stabilizing inflation and economic growth concerns. The decision would mark the first rate reduction in over a year and could significantly impact startup financing costs. Small businesses and early-stage companies are expected to benefit from lower borrowing costs, while savers may see reduced returns on deposits. Financial advisors recommend companies consider fixing borrowing rates before any potential cuts take effect. The announcement has already influenced corporate bond markets and venture debt pricing.",
    url: "https://ft.com/content/bank-england-rates",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    source: "Financial Times"
  },
  {
    title: "New UK Tax Incentives for Tech Startups Announced",
    content: "The government has unveiled enhanced Enterprise Investment Scheme (EIS) and Seed Enterprise Investment Scheme (SEIS) benefits for qualifying tech startups. The new measures include increased tax relief up to 50% on qualifying investments and extended carry-forward periods for unused allowances. Companies in AI, cleantech, and digital health sectors are particularly well-positioned to benefit from these changes. The initiative aims to boost early-stage funding and encourage more private investment in high-growth sectors. Tax experts estimate eligible companies could access additional benefits worth £25,000-£100,000 annually depending on their funding structure.",
    url: "https://bbc.co.uk/business/startup-tax-incentives",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    source: "BBC Business"
  }
];

export async function fetchIndustryNews(industry: string, limit: number = 10): Promise<RawNewsArticle[]> {
  // In a real implementation, this would integrate with:
  // - Bloomberg API
  // - Financial Times API  
  // - BBC News API
  // - Google News API
  
  try {
    // Filter mock data based on industry relevance
    const relevantNews = mockNewsData.filter(article => {
      const content = article.title.toLowerCase() + ' ' + article.content.toLowerCase();
      const industryKeywords = getIndustryKeywords(industry.toLowerCase());
      return industryKeywords.some(keyword => content.includes(keyword));
    });
    
    return relevantNews.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch industry news:', error);
    return [];
  }
}

function getIndustryKeywords(industry: string): string[] {
  const keywordMap: { [key: string]: string[] } = {
    'fintech': ['fintech', 'financial', 'payments', 'banking', 'lending', 'investment', 'funding'],
    'saas': ['saas', 'software', 'cloud', 'subscription', 'platform', 'enterprise'],
    'ecommerce': ['ecommerce', 'retail', 'marketplace', 'commerce', 'shopping', 'consumer'],
    'healthcare': ['healthcare', 'health', 'medical', 'pharmaceutical', 'biotech'],
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'automation', 'data'],
    'default': ['startup', 'funding', 'investment', 'business', 'technology', 'innovation']
  };
  
  return keywordMap[industry] || keywordMap['default'];
}

export function calculateRelevanceScore(article: RawNewsArticle, industry: string): number {
  const keywords = getIndustryKeywords(industry.toLowerCase());
  const content = (article.title + ' ' + article.content).toLowerCase();
  
  let score = 0;
  let totalKeywords = keywords.length;
  
  keywords.forEach(keyword => {
    if (content.includes(keyword)) {
      score += 1;
    }
  });
  
  // Boost score for recent articles
  const hoursOld = (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60);
  const recencyBoost = Math.max(0, 1 - hoursOld / 24); // Decay over 24 hours
  
  return Math.min(1, (score / totalKeywords) + recencyBoost * 0.3);
}
