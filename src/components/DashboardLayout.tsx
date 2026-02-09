import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FloatingChatbot } from "@/components/chat/FloatingChatbot";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement Supabase logout
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <AppSidebar onLogout={handleLogout} />
      <main className="pl-16 lg:pl-64 transition-all duration-300">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
      <FloatingChatbot />
    </div>
  );
}
