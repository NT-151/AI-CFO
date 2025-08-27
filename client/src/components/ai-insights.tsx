import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Lightbulb, AlertTriangle, Trophy, Brain } from "lucide-react";

interface AiInsight {
  id: string;
  type: "opportunity" | "risk" | "optimization";
  title: string;
  description: string;
  impact: number;
  confidence: number;
  priority: "high" | "medium" | "low";
}

interface AiInsightsProps {
  insights: AiInsight[];
  isLoading?: boolean;
}

export default function AiInsights({ insights, isLoading }: AiInsightsProps) {
  const getInsightIcon = (type: AiInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return Lightbulb;
      case 'risk':
        return AlertTriangle;
      case 'optimization':
        return Trophy;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: AiInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'border-google-blue/20 bg-google-blue/5';
      case 'risk':
        return 'border-google-yellow/20 bg-google-yellow/5';
      case 'optimization':
        return 'border-google-green/20 bg-google-green/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconBgColor = (type: AiInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'bg-google-blue';
      case 'risk':
        return 'bg-google-yellow';
      case 'optimization':
        return 'bg-google-green';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bot className="text-google-blue text-xl" />
            <CardTitle className="text-lg font-semibold text-gray-900">AI Financial Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="text-google-blue text-xl" />
            <CardTitle className="text-lg font-semibold text-gray-900">AI Financial Insights</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Brain size={16} />
            <span>Powered by OpenAI</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="mx-auto mb-4" size={48} />
              <p>No insights available at the moment.</p>
            </div>
          ) : (
            insights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              
              return (
                <div key={insight.id} className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${getIconBgColor(insight.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span>Impact: £{insight.impact.toLocaleString()}</span>
                          <span>Confidence: {(insight.confidence * 100).toFixed(0)}%</span>
                          <span className={`px-2 py-1 rounded-full ${
                            insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                            insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {insight.priority} priority
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={`text-sm hover:underline ${
                            insight.type === 'opportunity' ? 'text-google-blue' :
                            insight.type === 'risk' ? 'text-google-yellow' :
                            'text-google-green'
                          }`}
                        >
                          View details →
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
