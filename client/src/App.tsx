import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "@/pages/dashboard";
import TaxPlanning from "@/pages/tax-planning";
import CashFlow from "@/pages/cash-flow";
import Profitability from "@/pages/profitability";
import News from "@/pages/news";
import Insights from "@/pages/insights";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import BankConnection from "@/components/BankConnection";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/">
        <ProtectedRoute>
          <BankConnection />
        </ProtectedRoute>
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/tax-planning">
        <ProtectedRoute>
          <TaxPlanning />
        </ProtectedRoute>
      </Route>
      <Route path="/cash-flow">
        <ProtectedRoute>
          <CashFlow />
        </ProtectedRoute>
      </Route>
      <Route path="/profitability">
        <ProtectedRoute>
          <Profitability />
        </ProtectedRoute>
      </Route>
      <Route path="/news">
        <ProtectedRoute>
          <News />
        </ProtectedRoute>
      </Route>
      <Route path="/insights">
        <ProtectedRoute>
          <Insights />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
