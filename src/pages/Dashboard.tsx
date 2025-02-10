
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <SidebarTrigger />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
