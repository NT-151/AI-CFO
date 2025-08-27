import { FinancialData, Forecast } from "@shared/schema";

export interface CashFlowProjection {
  month: string;
  cashBalance: number;
  inflow: number;
  outflow: number;
  projected: boolean;
}

export interface ProfitabilityProjection {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  projected: boolean;
}

export function calculateCashFlowForecast(
  currentData: FinancialData,
  marketTrends: { growthRate: number; riskFactor: number }
): CashFlowProjection[] {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const projections: CashFlowProjection[] = [];
  let currentBalance = parseFloat(currentData.cashBalance || '0');
  const monthlyRevenue = parseFloat(currentData.monthlyRevenue || '0');
  const monthlyExpenses = parseFloat(currentData.monthlyExpenses || '0');
  
  // Historical data (6 months)
  for (let i = 0; i < 6; i++) {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    projections.push({
      month: months[i],
      cashBalance: currentBalance + (monthlyRevenue - monthlyExpenses) * i + (variation * currentBalance),
      inflow: monthlyRevenue * (1 + variation),
      outflow: monthlyExpenses * (1 + variation),
      projected: false
    });
  }
  
  // Future projections (6 months)
  for (let i = 6; i < 12; i++) {
    const growthFactor = 1 + (marketTrends.growthRate / 100 / 12); // Monthly growth
    const riskFactor = 1 + (marketTrends.riskFactor / 100);
    
    const projectedInflow = monthlyRevenue * Math.pow(growthFactor, i - 5);
    const projectedOutflow = monthlyExpenses * riskFactor;
    
    currentBalance += (projectedInflow - projectedOutflow);
    
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

export function calculateProfitabilityForecast(
  currentData: FinancialData,
  marketTrends: { growthRate: number; competitionFactor: number }
): ProfitabilityProjection[] {
  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];
  const projections: ProfitabilityProjection[] = [];
  
  const quarterlyRevenue = parseFloat(currentData.monthlyRevenue || '0') * 3;
  const quarterlyExpenses = parseFloat(currentData.monthlyExpenses || '0') * 3;
  
  for (let i = 0; i < quarters.length; i++) {
    const isProjected = i >= 2;
    let revenue = quarterlyRevenue;
    let expenses = quarterlyExpenses;
    
    if (isProjected) {
      const growthFactor = 1 + (marketTrends.growthRate / 100 / 4); // Quarterly growth
      revenue *= Math.pow(growthFactor, i - 1);
      expenses *= (1 + marketTrends.competitionFactor / 100);
    } else {
      // Historical data with slight variations
      const variation = (Math.random() - 0.5) * 0.15;
      revenue *= (1 + variation);
      expenses *= (1 + Math.abs(variation) * 0.5);
    }
    
    const profit = revenue - expenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
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

export function calculateRunway(cashBalance: number, burnRate: number): number {
  if (burnRate <= 0) return Infinity;
  return Math.max(0, cashBalance / burnRate);
}

export function calculateBreakevenPoint(
  monthlyRevenue: number,
  monthlyExpenses: number,
  revenueGrowthRate: number
): number {
  if (monthlyRevenue >= monthlyExpenses) return 0;
  
  // Simple model: months = log(expenses/revenue) / log(1 + growth_rate)
  if (revenueGrowthRate <= 0) return Infinity;
  
  const ratio = monthlyExpenses / monthlyRevenue;
  const growthFactor = 1 + (revenueGrowthRate / 100);
  
  return Math.ceil(Math.log(ratio) / Math.log(growthFactor));
}
