import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rss, ExternalLink, Search, Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

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

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['/api/news'],
  });

  const articles: NewsArticle[] = (newsData as any)?.articles || [];

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Recently";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "Less than 1 hour ago";
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const getImpactIcon = (impact: NewsArticle['impact']) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="text-google-green" size={16} />;
      case 'negative':
        return <TrendingDown className="text-google-red" size={16} />;
      case 'neutral':
      default:
        return <Minus className="text-gray-500" size={16} />;
    }
  };

  const getImpactColor = (impact: NewsArticle['impact']) => {
    switch (impact) {
      case 'positive':
        return 'border-l-google-green';
      case 'negative':
        return 'border-l-google-red';
      case 'neutral':
      default:
        return 'border-l-gray-400';
    }
  };

  const getRelevanceBadge = (score: number | undefined) => {
    if (!score) return null;
    if (score > 0.8) return <Badge className="bg-google-green text-white">High Relevance</Badge>;
    if (score > 0.6) return <Badge variant="secondary">Medium Relevance</Badge>;
    return null;
  };

  // Filter articles based on search and source
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = selectedSource === "all" || 
      article.source.toLowerCase().includes(selectedSource.toLowerCase());
    
    return matchesSearch && matchesSource;
  });

  // Group articles by impact
  const positiveArticles = filteredArticles.filter(a => a.impact === 'positive');
  const negativeArticles = filteredArticles.filter(a => a.impact === 'negative');
  const neutralArticles = filteredArticles.filter(a => a.impact === 'neutral');

  const sources = ["all", "bloomberg", "financial times", "bbc"];

  const ArticleCard = ({ article }: { article: NewsArticle }) => (
    <Card className={`mb-4 border-l-4 ${getImpactColor(article.impact)} hover:shadow-md transition-shadow`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getImpactIcon(article.impact)}
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{article.title}</h3>
          </div>
          {getRelevanceBadge(parseFloat(String(article.relevanceScore || '0')))}
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">{article.summary}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="font-medium">{article.source}</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
            {article.relevanceScore && (
              <span>Relevance: {(parseFloat(String(article.relevanceScore)) * 100).toFixed(0)}%</span>
            )}
          </div>
          {article.url && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-google-blue hover:bg-google-blue/10"
              onClick={() => window.open(article.url, '_blank')}
            >
              Read Full Article <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Industry News & Insights" subtitle="Stay informed about market trends and opportunities" />
        <main className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                  </div>
                  <Rss className="text-google-blue" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Positive Impact</p>
                    <p className="text-2xl font-bold text-google-green">{positiveArticles.length}</p>
                  </div>
                  <TrendingUp className="text-google-green" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Risk Alerts</p>
                    <p className="text-2xl font-bold text-google-red">{negativeArticles.length}</p>
                  </div>
                  <TrendingDown className="text-google-red" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High Relevance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {articles.filter(a => parseFloat(String(a.relevanceScore || '0')) > 0.8).length}
                    </p>
                  </div>
                  <Filter className="text-gray-600" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {sources.map(source => (
                    <Button
                      key={source}
                      variant={selectedSource === source ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSource(source)}
                      className={selectedSource === source ? "bg-google-blue hover:bg-google-blue-dark" : ""}
                    >
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News Feed */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All News ({filteredArticles.length})</TabsTrigger>
                <TabsTrigger value="positive">Positive ({positiveArticles.length})</TabsTrigger>
                <TabsTrigger value="negative">Risk Alerts ({negativeArticles.length})</TabsTrigger>
                <TabsTrigger value="neutral">Neutral ({neutralArticles.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {filteredArticles.length === 0 ? (
                  <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                      <Rss className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-500">No articles match your current filters.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-0">
                    {filteredArticles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="positive" className="mt-6">
                <div className="space-y-0">
                  {positiveArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="negative" className="mt-6">
                <div className="space-y-0">
                  {negativeArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="neutral" className="mt-6">
                <div className="space-y-0">
                  {neutralArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
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
