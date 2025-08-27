import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface RevenueData {
  period: string;
  actual?: number;
  projected?: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  confidence?: number;
}

export default function RevenueChart({ data, confidence = 87 }: RevenueChartProps) {
  const formatCurrency = (value: number) => `£${(value / 1000).toFixed(0)}k`;

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue Forecast</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp size={16} />
            <span>AI-Enhanced Predictions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
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
              <Bar 
                dataKey="actual" 
                fill="#34A853" 
                name="Actual Revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="projected" 
                fill="#4285F4" 
                name="Projected Revenue"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Powered by industry trends from Bloomberg, FT, BBC
          </div>
          <div className="text-sm font-medium text-google-blue">
            Confidence: {confidence}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
