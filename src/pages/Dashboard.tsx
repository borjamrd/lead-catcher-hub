import { AppSidebar } from "@/components/app-sidebar";
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, useLocation } from 'react-router-dom';


const Dashboard = () => {

  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';
  const paths = location.pathname.split('/').filter(Boolean);
  const isNotePage = paths[1] === 'mis-apuntes' && paths.length === 3;
  const noteId = isNotePage ? paths[2] : null;

  const { data: note } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      const { data, error } = await supabase
        .from('notes')
        .select('title')
        .eq('id', noteId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!noteId,
  });


  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;

      if (isLast && isNotePage && note) {
        return {
          path: note.title || 'Sin título',
          url,
          isLast,
        };
      }

      const formattedPath = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        path: formattedPath,
        url,
        isLast,
      };
    });

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
       

        {!isRootDashboard && (
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {getBreadcrumbs().slice(1).map((breadcrumb) => (
                <BreadcrumbItem key={breadcrumb.url}>
                  <BreadcrumbSeparator />
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.path}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.url}>{breadcrumb.path}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {isRootDashboard ? <DashboardContent /> : <Outlet />}
      </main>
    </div>
  );
};

export default Dashboard;
