import { DashboardLayout } from "@/components/DashboardLayout";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { KPICards } from "@/components/dashboard/KPICards";
import { MainChart } from "@/components/dashboard/MainChart";

export default function Dashboard() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, <span className="gradient-text">Investidor</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seus investimentos e insights do mercado
          </p>
        </div>

        {/* AI Insight Card */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <AIInsightCard />
        </div>

        {/* KPI Cards */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <KPICards />
        </div>

        {/* Main Chart */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <MainChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
