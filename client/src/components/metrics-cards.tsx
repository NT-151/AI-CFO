import { Card, CardContent } from "@/components/ui/card";
import { Clock, Flame, PoundSterling, Target } from "lucide-react";

interface MetricsData {
  runway: number;
  burnRate: number;
  taxSavings: number;
  breakeven: number;
}

interface MetricsCardsProps {
  data: MetricsData;
  isLoading?: boolean;
}

export default function MetricsCards({ data, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Cash Runway",
      value: data.runway.toFixed(1),
      unit: "months remaining",
      change: "+2.1 months",
      changeType: "positive" as const,
      icon: Clock,
      iconColor: "text-google-blue",
    },
    {
      title: "Monthly Burn Rate",
      value: `£${(data.burnRate / 1000).toFixed(1)}k`,
      unit: "per month",
      change: "+8.2%",
      changeType: "negative" as const,
      icon: Flame,
      iconColor: "text-google-red",
    },
    {
      title: "Tax Optimization",
      value: `£${(data.taxSavings / 1000).toFixed(1)}k`,
      unit: "annual savings",
      change: "15.3%",
      changeType: "neutral" as const,
      icon: PoundSterling,
      iconColor: "text-google-green",
    },
    {
      title: "Profitability Target",
      value: data.breakeven === Infinity ? "∞" : data.breakeven.toString(),
      unit: "months to breakeven",
      change: "On track",
      changeType: "positive" as const,
      icon: Target,
      iconColor: "text-google-yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        
        return (
          <Card key={metric.title} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <Icon className={`${metric.iconColor}`} size={18} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-3">{metric.unit}</div>
              <div className="text-sm">
                <span 
                  className={
                    metric.changeType === "positive" 
                      ? "text-google-green" 
                      : metric.changeType === "negative" 
                      ? "text-google-red" 
                      : "text-google-green"
                  }
                >
                  {metric.change}
                </span>
                {metric.changeType !== "neutral" && (
                  <span className="text-gray-500 ml-1">vs last month</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
