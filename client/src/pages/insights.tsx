import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Lightbulb, AlertTriangle, Trophy, Brain, TrendingUp, DollarSign, Target, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AiInsight {
  id: string;
  type: "opportunity" | "risk" | "optimization";
  title: string;
  description: string;
  impact: number;
  confidence: number;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  createdAt: Date;
}

export default function Insights() {
  const { toast } = useToast();

  const { data: insightsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/insights'],
  });

  const refreshMutation = useMutation({
    mutationFn: () => {
      // Trigger a refetch of insights
      return refetch();
    },
    onSuccess: () => {
      toast({
        title: "Insights refreshed",
        description: "AI insights have been updated with the latest data.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const insights: AiInsight[] = (insightsData as any)?.insights || [];

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
        return {
          border: 'border-l-google-blue',
          bg: 'bg-google-blue/5',
          iconBg: 'bg-google-blue',
          text: 'text-google-blue'
        };
      case 'risk':
        return {
          border: 'border-l-google-red',
          bg: 'bg-google-red/5',
          iconBg: 'bg-google-red',
          text: 'text-google-red'
        };
      case 'optimization':
        return {
          border: 'border-l-google-green',
          bg: 'bg-google-green/5',
          iconBg: 'bg-google-green',
          text: 'text-google-green'
        };
      default:
        return {
          border: 'border-l-gray-400',
          bg: 'bg-gray-50',
          iconBg: 'bg-gray-500',
          text: 'text-gray-700'
        };
    }
  };

  const getPriorityBadge = (priority: AiInsight['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Less than 1 hour ago";
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  // Group insights by type
  const opportunityInsights = insights.filter(i => i.type === 'opportunity');
  const riskInsights = insights.filter(i => i.type === 'risk');
  const optimizationInsights = insights.filter(i => i.type === 'optimization');
  const highPriorityInsights = insights.filter(i => i.priority === 'high');

  const InsightCard = ({ insight }: { insight: AiInsight }) => {
    const Icon = getInsightIcon(insight.type);
    const colors = getInsightColor(insight.type);
    
    return (
      <Card className={`mb-6 border-l-4 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow`}>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{insight.title}</h3>
                {getPriorityBadge(insight.priority)}
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <DollarSign size={14} />
                    <span>Impact: £{parseFloat(insight.impact?.toString() || '0').toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target size={14} />
                    <span>Confidence: {(parseFloat(insight.confidence?.toString() || '0') * 100).toFixed(0)}%</span>
                  </div>
                  <span>{formatTimeAgo(insight.createdAt)}</span>
                </div>
                {insight.actionable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${colors.text} hover:bg-current/10`}
                  >
                    Take Action →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="AI Financial Insights" subtitle="Data-driven recommendations powered by OpenAI" />
        <main className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Insights</p>
                    <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
                  </div>
                  <Brain className="text-google-blue" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Opportunities</p>
                    <p className="text-2xl font-bold text-google-blue">{opportunityInsights.length}</p>
                  </div>
                  <Lightbulb className="text-google-blue" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Risk Alerts</p>
                    <p className="text-2xl font-bold text-google-red">{riskInsights.length}</p>
                  </div>
                  <AlertTriangle className="text-google-red" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-google-green">{highPriorityInsights.length}</p>
                  </div>
                  <Trophy className="text-google-green" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="text-google-blue text-2xl" />
                  <div>
                    <CardTitle className="text-xl">AI-Generated Financial Insights</CardTitle>
                    <p className="text-gray-600 text-sm">
                      Powered by OpenAI • Updated every hour • Based on real-time market data
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => refreshMutation.mutate()}
                  disabled={refreshMutation.isPending || isLoading}
                  className="bg-google-blue hover:bg-google-blue-dark"
                >
                  {refreshMutation.isPending ? (
                    <RefreshCw className="animate-spin mr-2" size={16} />
                  ) : (
                    <RefreshCw className="mr-2" size={16} />
                  )}
                  Refresh Insights
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Insights Content */}
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : insights.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Brain className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No insights available</h3>
                <p className="text-gray-500 mb-6">AI insights will appear here once your financial data is analyzed.</p>
                <Button 
                  onClick={() => refreshMutation.mutate()}
                  className="bg-google-blue hover:bg-google-blue-dark"
                >
                  Generate Insights
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Insights ({insights.length})</TabsTrigger>
                <TabsTrigger value="high-priority">High Priority ({highPriorityInsights.length})</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities ({opportunityInsights.length})</TabsTrigger>
                <TabsTrigger value="risks">Risks ({riskInsights.length})</TabsTrigger>
                <TabsTrigger value="optimizations">Optimizations ({optimizationInsights.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="space-y-0">
                  {insights
                    .sort((a, b) => {
                      // Sort by priority first (high > medium > low), then by impact
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                      if (priorityDiff !== 0) return priorityDiff;
                      return parseFloat(b.impact?.toString() || '0') - parseFloat(a.impact?.toString() || '0');
                    })
                    .map(insight => (
                      <InsightCard key={insight.id} insight={insight} />
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="high-priority" className="mt-6">
                <div className="space-y-0">
                  {highPriorityInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="opportunities" className="mt-6">
                <div className="space-y-0">
                  {opportunityInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="risks" className="mt-6">
                <div className="space-y-0">
                  {riskInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="optimizations" className="mt-6">
                <div className="space-y-0">
                  {optimizationInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
