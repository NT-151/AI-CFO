import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, PieChart, DollarSign } from "lucide-react";

export default function Profitability() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  const { data: profitabilityData, isLoading: isProfitabilityLoading } = useQuery({
    queryKey: ['/api/profitability/forecast'],
  });

  const forecast = (profitabilityData as any)?.forecast || [];
  const financialData = (dashboardData as any)?.financialData;

  const formatCurrency = (value: number) => `£${(value / 1000).toFixed(0)}k`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Create chart data
  const chartData = forecast.map((item: any) => ({
    period: item.period,
    revenue: item.revenue,
    expenses: item.expenses,
    profit: item.profit,
    margin: item.margin,
    projected: item.projected,
  }));

  // Separate actual and projected for different styling
  const revenueChartData = chartData.map((item: any) => ({
    period: item.period,
    actualRevenue: !item.projected ? item.revenue : null,
    projectedRevenue: item.projected ? item.revenue : null,
    actualExpenses: !item.projected ? item.expenses : null,
    projectedExpenses: item.projected ? item.expenses : null,
  }));

  const profitMarginData = chartData.map((item: any) => ({
    period: item.period,
    actualMargin: !item.projected ? item.margin : null,
    projectedMargin: item.projected ? item.margin : null,
    actualProfit: !item.projected ? item.profit : null,
    projectedProfit: item.projected ? item.profit : null,
  }));

  // Calculate key metrics
  const currentRevenue = parseFloat(financialData?.monthlyRevenue || '0') * 3; // Quarterly
  const currentExpenses = parseFloat(financialData?.monthlyExpenses || '0') * 3;
  const currentProfit = currentRevenue - currentExpenses;
  const currentMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

  const metrics = [
    {
      title: "Quarterly Revenue",
      value: formatCurrency(currentRevenue),
      change: "+12.3%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Operating Expenses",
      value: formatCurrency(currentExpenses),
      change: "+8.7%",
      changeType: "negative" as const,
      icon: TrendingUp,
    },
    {
      title: "Net Profit",
      value: formatCurrency(currentProfit),
      change: currentProfit > 0 ? "+45.2%" : "-23.1%",
      changeType: currentProfit > 0 ? "positive" as const : "negative" as const,
      icon: Target,
    },
    {
      title: "Profit Margin",
      value: formatPercentage(currentMargin),
      change: currentMargin > 0 ? "+5.4%" : "-2.8%",
      changeType: currentMargin > 0 ? "positive" as const : "negative" as const,
      icon: PieChart,
    },
  ];

  // Calculate breakeven metrics
  const monthlyRevenue = parseFloat(financialData?.monthlyRevenue || '0');
  const monthlyExpenses = parseFloat(financialData?.monthlyExpenses || '0');
  const breakeven = (dashboardData as any)?.metrics?.breakeven || 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Profitability Forecast" subtitle="Revenue projections and breakeven analysis" />
        <main className="p-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              
              return (
                <Card key={metric.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      <Icon className="text-gray-600" size={18} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="text-sm">
                      <span className={
                        metric.changeType === "positive" 
                          ? "text-google-green" 
                          : "text-google-red"
                      }>
                        {metric.change}
                      </span>
                      <span className="text-gray-500 ml-1">vs last quarter</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="period" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={formatCurrency}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? [formatCurrency(value), ""] : ["--", ""]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="actualRevenue" 
                        fill="#34A853" 
                        name="Actual Revenue"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="projectedRevenue" 
                        fill="#4285F4" 
                        name="Projected Revenue"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="actualExpenses" 
                        fill="#EA4335" 
                        name="Actual Expenses"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="projectedExpenses" 
                        fill="#FBBC04" 
                        name="Projected Expenses"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Profit Margin Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Margin Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={profitMarginData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="period" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={formatPercentage}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? [formatPercentage(value), ""] : ["--", ""]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="actualMargin" 
                        stroke="#34A853" 
                        fill="#34A853"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="Actual Margin"
                        connectNulls={false}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="projectedMargin" 
                        stroke="#4285F4" 
                        fill="#4285F4"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        strokeDasharray="8 8"
                        name="Projected Margin"
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakeven Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Breakeven Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-blue mb-2">
                    {breakeven === Infinity ? "∞" : breakeven}
                  </div>
                  <div className="text-gray-600">Months to Breakeven</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Based on current growth rate
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-green mb-2">
                    {formatCurrency(monthlyRevenue)}
                  </div>
                  <div className="text-gray-600">Monthly Revenue</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Current run rate
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-red mb-2">
                    {formatCurrency(monthlyExpenses)}
                  </div>
                  <div className="text-gray-600">Monthly Expenses</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Current burn rate
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {breakeven !== Infinity ? 
                      new Date(Date.now() + (breakeven * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) :
                      "TBD"
                    }
                  </div>
                  <div className="text-gray-600">Target Date</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Projected breakeven
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Current Status:</p>
                    <p className="text-gray-700">
                      {currentProfit > 0 ? 
                        `Profitable with ${formatPercentage(currentMargin)} margin` :
                        `Loss of ${formatCurrency(Math.abs(currentProfit))} this quarter`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Growth Required:</p>
                    <p className="text-gray-700">
                      {breakeven !== Infinity ?
                        `Need ${Math.max(0, ((monthlyExpenses / monthlyRevenue) - 1) * 100).toFixed(1)}% revenue increase to break even` :
                        "Revenue growth needed to achieve profitability"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
