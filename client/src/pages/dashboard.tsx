import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import MetricsCards from "@/components/metrics-cards";
import CashFlowChart from "@/components/charts/cash-flow-chart";
import RevenueChart from "@/components/charts/revenue-chart";
import TaxPlanningSummary from "@/components/tax-planning-summary";
import AiInsights from "@/components/ai-insights";
import NewsFeed from "@/components/news-feed";
import PlatformIntegrations from "@/components/platform-integrations";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  const { data: cashFlowData, isLoading: isCashFlowLoading } = useQuery({
    queryKey: ['/api/cash-flow/forecast'],
  });

  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ['/api/profitability/forecast'],
  });

  const { data: newsData, isLoading: isNewsLoading } = useQuery({
    queryKey: ['/api/news'],
  });

  const { data: insightsData, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['/api/insights'],
  });

  const handleViewFullTaxPlan = () => {
    setLocation('/tax-planning');
  };

  const handleViewAllNews = () => {
    setLocation('/news');
  };

  // Format data for charts
  const cashFlowChartData = (cashFlowData as any)?.forecast?.map((item: any) => ({
    month: item.month,
    cashBalance: item.cashBalance,
    projected: item.projected,
  })) || [];

  const revenueChartData = (revenueData as any)?.forecast?.map((item: any) => ({
    period: item.period,
    actual: !item.projected ? item.revenue : undefined,
    projected: item.projected ? item.revenue : undefined,
  })) || [];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Financial Dashboard" />
        <main className="p-8">
          {/* Key Metrics Cards */}
          <div className="mb-8">
            <MetricsCards 
              data={(dashboardData as any)?.metrics || {
                runway: 0,
                burnRate: 0,
                taxSavings: 0,
                breakeven: 0,
              }}
              isLoading={isDashboardLoading}
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <CashFlowChart
              data={cashFlowChartData}
              currentCash={parseFloat((dashboardData as any)?.financialData?.cashBalance || '0')}
              monthlyInflow={parseFloat((dashboardData as any)?.financialData?.monthlyRevenue || '0')}
              monthlyOutflow={parseFloat((dashboardData as any)?.financialData?.monthlyExpenses || '0')}
            />
            <RevenueChart
              data={revenueChartData}
              confidence={87}
            />
          </div>

          {/* Tax Planning & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <TaxPlanningSummary
              data={{
                pensionContribution: parseFloat((dashboardData as any)?.taxOptimization?.pensionContribution || '0'),
                cycleToWork: parseFloat((dashboardData as any)?.taxOptimization?.cycleToWork || '0'),
                salaryGuid: parseFloat((dashboardData as any)?.taxOptimization?.salaryGuid || '0'),
                totalAnnualSavings: parseFloat((dashboardData as any)?.taxOptimization?.totalAnnualSavings || '0'),
              }}
              onViewFullPlan={handleViewFullTaxPlan}
            />
            <AiInsights
              insights={(insightsData as any)?.insights || []}
              isLoading={isInsightsLoading}
            />
          </div>

          {/* Industry News Feed & Platform Integrations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <NewsFeed
              articles={(newsData as any)?.articles || []}
              isLoading={isNewsLoading}
              onViewAll={handleViewAllNews}
            />
            <PlatformIntegrations />
          </div>
        </main>
      </div>
    </div>
  );
}
