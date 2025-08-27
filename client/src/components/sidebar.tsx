import { Link, useLocation } from "wouter";
import {
  TrendingUp,
  Calculator,
  Coins,
  PieChart,
  Newspaper,
  Brain,
  Cloud,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: TrendingUp },
    { path: "/tax-planning", label: "Tax Planning", icon: Calculator },
    { path: "/cash-flow", label: "Cash Flow", icon: Coins },
    { path: "/profitability", label: "Profitability", icon: PieChart },
    { path: "/news", label: "Industry News", icon: Newspaper },
    { path: "/insights", label: "AI Insights", icon: Brain },
  ];

  const integrations = [
    {
      name: "Google Cloud",
      icon: Cloud,
      status: "Connected",
      color: "bg-google-blue",
    },
    {
      name: "Payabl",
      icon: CreditCard,
      status: "Connected",
      color: "bg-purple-500",
    },
    {
      name: "ipushpull",
      icon: RefreshCw,
      status: "Connected",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-google-blue rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FynCo</h1>
            <p className="text-xs text-gray-600">AI Financial Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="px-6 space-y-2 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-google-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Platform Integrations
        </h3>
        <div className="space-y-2">
          {integrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <div
                key={integration.name}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center",
                    integration.color
                  )}
                >
                  <Icon className="text-white text-xs" />
                </div>
                <span className="text-xs text-gray-700 flex-1">
                  {integration.name}
                </span>
                <span className="text-xs text-google-green">
                  {integration.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
