
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { MainLayout } from "@/components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import FinanceDashboard from "./pages/FinanceDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <FinanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <FinanceDashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/old-dashboard"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/transactions"
                element={
                  <MainLayout>
                    <Transactions />
                  </MainLayout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <MainLayout>
                    <Calendar />
                  </MainLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FinanceProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
