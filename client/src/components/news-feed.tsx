import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rss, ExternalLink } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt?: Date;
  relevanceScore?: number;
  impact?: "positive" | "negative" | "neutral";
}

interface NewsFeedProps {
  articles: NewsArticle[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export default function NewsFeed({ articles, isLoading, onViewAll }: NewsFeedProps) {
  const getImpactColor = (impact: NewsArticle['impact']) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      case 'neutral':
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Recently";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Less than 1 hour ago";
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Industry News & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Industry News & Insights</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Rss size={16} />
            <span>Bloomberg • FT • BBC</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Rss className="mx-auto mb-4" size={48} />
              <p>No news articles available at the moment.</p>
            </div>
          ) : (
            articles.map((article) => (
              <div 
                key={article.id} 
                className="p-4 border border-gray-200 rounded-lg hover:border-google-blue/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${getImpactColor(article.impact)} rounded-full mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{article.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {article.source} • {article.publishedAt ? formatTimeAgo(article.publishedAt) : 'Recently'}
                        </span>
                        {article.relevanceScore && article.relevanceScore > 0.7 && (
                          <Badge variant="secondary" className="text-xs">
                            High relevance
                          </Badge>
                        )}
                      </div>
                      {article.url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs text-google-blue hover:underline p-0 h-auto"
                          onClick={() => window.open(article.url, '_blank')}
                        >
                          Read full article <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {articles.length > 0 && (
          <Button 
            variant="outline"
            className="w-full mt-4 text-google-blue border-google-blue hover:bg-google-blue/10"
            onClick={onViewAll}
          >
            View All Industry News
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
