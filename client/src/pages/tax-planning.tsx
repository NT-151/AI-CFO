import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, PiggyBank, Bike, Heart, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TaxPlanning() {
  const { toast } = useToast();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  const optimizeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/tax-planning/optimize', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Tax optimization updated",
        description: "Your tax planning has been recalculated with the latest data.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Optimization failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const taxData = (dashboardData as any)?.taxOptimization;
  
  const optimizations = [
    {
      icon: PiggyBank,
      title: "Pension Contribution",
      description: "Annual allowance optimization for maximum tax relief",
      amount: parseFloat(taxData?.pensionContribution || '0'),
      details: "Contributing to your workplace pension reduces both income tax and National Insurance. The current annual allowance is £40,000.",
      status: "active",
    },
    {
      icon: Heart,
      title: "Gift Aid Donations",
      description: "Charitable giving with tax benefits",
      amount: parseFloat(taxData?.salaryGuid || '0'),
      details: "Gift Aid allows charities to claim an extra 25p for every £1 you donate, and you can claim higher-rate relief.",
      status: "active",
    },
    {
      icon: Bike,
      title: "Cycle to Work Scheme",
      description: "Tax-free bicycle purchase through salary sacrifice",
      amount: parseFloat(taxData?.cycleToWork || '0'),
      details: "Save up to 42% on the cost of a bike and safety equipment through salary sacrifice arrangements.",
      status: "active",
    },
  ];

  const ukTaxBands = [
    { band: "Personal Allowance", range: "£0 - £12,570", rate: "0%", status: "Using" },
    { band: "Basic Rate", range: "£12,571 - £50,270", rate: "20%", status: "Using" },
    { band: "Higher Rate", range: "£50,271 - £125,140", rate: "40%", status: "Optimizing" },
    { band: "Additional Rate", range: "Over £125,140", rate: "45%", status: "Not Applicable" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Tax Planning" subtitle="UK tax optimization for startup founders" />
        <main className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Annual Savings</p>
                    <p className="text-2xl font-bold text-google-green">
                      £{parseFloat(taxData?.totalAnnualSavings || '0').toLocaleString()}
                    </p>
                  </div>
                  <Calculator className="text-google-blue" size={24} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Effective Tax Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parseFloat(taxData?.effectiveRate || '0').toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-google-green rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {taxData?.calculatedAt ? new Date(taxData.calculatedAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => optimizeMutation.mutate()}
                    disabled={optimizeMutation.isPending}
                    className="bg-google-blue hover:bg-google-blue-dark"
                  >
                    {optimizeMutation.isPending ? (
                      <RefreshCw className="animate-spin" size={16} />
                    ) : (
                      "Recalculate"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tax Optimization Strategies */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Optimization Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizations.map((item) => {
                      const Icon = item.icon;
                      
                      return (
                        <div key={item.title} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-google-green rounded-lg flex items-center justify-center">
                                <Icon className="text-white" size={20} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-google-green">
                                £{item.amount.toLocaleString()}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 ml-13">
                            {item.details}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* UK Tax Bands */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>UK Tax Bands 2024/25</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ukTaxBands.map((band) => (
                      <div key={band.band} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{band.band}</p>
                          <p className="text-sm text-gray-600">{band.range}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{band.rate}</p>
                          <Badge 
                            variant={
                              band.status === "Using" ? "default" :
                              band.status === "Optimizing" ? "secondary" :
                              "outline"
                            }
                            className="text-xs"
                          >
                            {band.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
