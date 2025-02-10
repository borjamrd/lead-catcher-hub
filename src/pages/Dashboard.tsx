
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
