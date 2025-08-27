import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

export default function CashFlow() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  const { data: cashFlowData, isLoading: isCashFlowLoading } = useQuery({
    queryKey: ['/api/cash-flow/forecast'],
  });

  const forecast = (cashFlowData as any)?.forecast || [];
  const financialData = (dashboardData as any)?.financialData;

  const formatCurrency = (value: number) => `£${(value / 1000).toFixed(0)}k`;

  // Separate actual and projected data
  const actualData = forecast.filter((item: any) => !item.projected);
  const projectedData = forecast.filter((item: any) => item.projected);
  
  // Create combined chart data
  const chartData = forecast.map((item: any) => ({
    month: item.month,
    actual: !item.projected ? item.cashBalance : null,
    projected: item.projected ? item.cashBalance : null,
    inflow: item.inflow,
    outflow: item.outflow,
  }));

  const metrics = [
    {
      title: "Current Cash Balance",
      value: formatCurrency(parseFloat(financialData?.cashBalance || '0')),
      change: "+2.3%",
      changeType: "positive" as const,
      icon: Coins,
    },
    {
      title: "Monthly Inflow",
      value: formatCurrency(parseFloat(financialData?.monthlyRevenue || '0')),
      change: "+5.7%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Monthly Outflow",
      value: formatCurrency(parseFloat(financialData?.monthlyExpenses || '0')),
      change: "+8.2%",
      changeType: "negative" as const,
      icon: TrendingDown,
    },
    {
      title: "Net Cash Flow",
      value: formatCurrency(parseFloat(financialData?.monthlyRevenue || '0') - parseFloat(financialData?.monthlyExpenses || '0')),
      change: "-12.5%",
      changeType: "negative" as const,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Cash Flow Forecast" subtitle="Monitor runway and cash position" />
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
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Cash Balance Forecast */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Balance Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
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
                        formatter={(value: number) => [formatCurrency(value), ""]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#4285F4" 
                        strokeWidth={3}
                        dot={{ fill: '#4285F4', strokeWidth: 2, r: 5 }}
                        name="Actual Balance"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="projected" 
                        stroke="#FBBC04" 
                        strokeWidth={3}
                        strokeDasharray="8 8"
                        dot={{ fill: '#FBBC04', strokeWidth: 2, r: 5 }}
                        name="Projected Balance"
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow (Inflow/Outflow) */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
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
                        formatter={(value: number) => [formatCurrency(value), ""]}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="inflow" 
                        fill="#34A853" 
                        name="Inflow"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="outflow" 
                        fill="#EA4335" 
                        name="Outflow"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Runway Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Runway Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-blue mb-2">
                    {parseFloat((dashboardData as any)?.metrics?.runway || '0').toFixed(1)}
                  </div>
                  <div className="text-gray-600">Months Remaining</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Based on current burn rate
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-red mb-2">
                    {formatCurrency(parseFloat(financialData?.burnRate || '0'))}
                  </div>
                  <div className="text-gray-600">Monthly Burn Rate</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Average over last 3 months
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-google-green mb-2">
                    {new Date(Date.now() + (parseFloat((dashboardData as any)?.metrics?.runway || '0') * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-gray-600">Projected End Date</div>
                  <div className="text-sm text-gray-500 mt-2">
                    At current burn rate
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
