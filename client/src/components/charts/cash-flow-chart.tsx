import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Database } from "lucide-react";

interface CashFlowData {
  month: string;
  cashBalance: number;
  projected?: boolean;
}

interface CashFlowChartProps {
  data: CashFlowData[];
  currentCash: number;
  monthlyInflow: number;
  monthlyOutflow: number;
}

export default function CashFlowChart({ 
  data, 
  currentCash, 
  monthlyInflow, 
  monthlyOutflow 
}: CashFlowChartProps) {
  const formatCurrency = (value: number) => `£${(value / 1000).toFixed(0)}k`;

  const actualData = data.filter(d => !d.projected);
  const projectedData = data.filter(d => d.projected);

  // Combine data for chart with separate series
  const chartData = data.map(d => ({
    month: d.month,
    actual: d.projected ? null : d.cashBalance,
    projected: d.projected ? d.cashBalance : null,
  }));

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Cash Flow Forecast</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Database size={16} />
            <span>Live data from Payabl</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
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
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#4285F4" 
                strokeWidth={2}
                dot={{ fill: '#4285F4', strokeWidth: 2, r: 4 }}
                name="Cash Balance"
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="projected" 
                stroke="#FBBC04" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#FBBC04', strokeWidth: 2, r: 4 }}
                name="Projected Balance"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-google-blue">{formatCurrency(currentCash)}</div>
            <div className="text-gray-600">Current Cash</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-google-green">{formatCurrency(monthlyInflow)}</div>
            <div className="text-gray-600">Monthly Inflow</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-google-red">{formatCurrency(monthlyOutflow)}</div>
            <div className="text-gray-600">Monthly Outflow</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
