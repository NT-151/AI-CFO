import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, CreditCard, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Integration {
  id: string;
  platform: string;
  status: string;
  lastSync?: Date;
  metadata?: any;
}

export default function PlatformIntegrations() {
  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ['/api/integrations'],
  });

  const integrations = (integrationsData as any)?.integrations || [];

  const getIntegrationConfig = (platform: string) => {
    switch (platform) {
      case 'google_cloud':
        return {
          name: 'Google Cloud Platform',
          description: 'Hosting & AI Services',
          icon: Cloud,
          color: 'bg-google-blue',
          borderColor: 'border-google-blue/20',
          bgColor: 'bg-google-blue/5',
        };
      case 'payabl':
        return {
          name: 'Payabl',
          description: 'Financial Data Import',
          icon: CreditCard,
          color: 'bg-purple-500',
          borderColor: 'border-purple-200',
          bgColor: 'bg-purple-50',
        };
      case 'ipushpull':
        return {
          name: 'ipushpull',
          description: 'Data Optimization',
          icon: RefreshCw,
          color: 'bg-orange-500',
          borderColor: 'border-orange-200',
          bgColor: 'bg-orange-50',
        };
      default:
        return {
          name: platform,
          description: 'Integration',
          icon: Cloud,
          color: 'bg-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const formatLastSync = (lastSync: string | Date | null) => {
    if (!lastSync) return 'Never';
    const date = typeof lastSync === 'string' ? new Date(lastSync) : lastSync;
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle>Platform Integration Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
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
        <CardTitle className="text-lg font-semibold text-gray-900">Platform Integration Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {integrations.map((integration: Integration) => {
            const config = getIntegrationConfig(integration.platform);
            const Icon = config.icon;
            
            return (
              <div 
                key={integration.id} 
                className={`p-4 border rounded-lg ${config.borderColor} ${config.bgColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{config.name}</h4>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Last Sync</div>
                    <div className="font-semibold">{formatLastSync(integration.lastSync || null)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">
                      {integration.platform === 'google_cloud' && 'API Calls'}
                      {integration.platform === 'payabl' && 'Accounts Linked'}
                      {integration.platform === 'ipushpull' && 'Data Streams'}
                    </div>
                    <div className="font-semibold">
                      {integration.platform === 'google_cloud' && `${integration.metadata?.apiCalls || '0'} this month`}
                      {integration.platform === 'payabl' && `${integration.metadata?.accounts || '0'} accounts`}
                      {integration.platform === 'ipushpull' && `${integration.metadata?.streams || '0'} active feeds`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button 
          className="w-full mt-4 bg-google-blue hover:bg-google-blue-dark"
        >
          Manage Integrations
        </Button>
      </CardContent>
    </Card>
  );
}
