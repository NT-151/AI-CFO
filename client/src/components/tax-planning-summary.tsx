import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Bike, Heart } from "lucide-react";

interface TaxOptimization {
  pensionContribution: number;
  cycleToWork: number;
  salaryGuid: number;
  totalAnnualSavings: number;
}

interface TaxPlanningSummaryProps {
  data: TaxOptimization;
  onViewFullPlan?: () => void;
}

export default function TaxPlanningSummary({ data, onViewFullPlan }: TaxPlanningSummaryProps) {
  const optimizations = [
    {
      icon: PiggyBank,
      label: "Pension Contribution",
      amount: data.pensionContribution,
      iconColor: "text-google-green",
    },
    {
      icon: Bike,
      label: "Cycle to Work",
      amount: data.cycleToWork,
      iconColor: "text-google-green",
    },
    {
      icon: Heart,
      label: "Gift Aid",
      amount: data.salaryGuid,
      iconColor: "text-google-green",
    },
  ];

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Tax Optimization</CardTitle>
          <Button 
            variant="ghost" 
            className="text-google-blue hover:bg-google-blue/10"
            onClick={onViewFullPlan}
          >
            View Full Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimizations.map((item) => {
            const Icon = item.icon;
            
            return (
              <div key={item.label} className="flex items-center justify-between p-3 bg-google-green/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className={item.iconColor} size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-google-green">
                  £{item.amount.toLocaleString()}
                </span>
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">Total Annual Savings</span>
              <span className="text-xl font-bold text-google-green">
                £{data.totalAnnualSavings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
