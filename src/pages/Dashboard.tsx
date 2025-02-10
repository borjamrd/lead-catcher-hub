
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Outlet />
        {!isRootDashboard && (
          <div className="mt-8">
            <Link 
              to=".." 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
