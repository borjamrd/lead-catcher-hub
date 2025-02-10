
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isRootDashboard = location.pathname === '/dashboard';

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      const formattedPath = path.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      return {
        path: formattedPath,
        url,
        isLast
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
              {getBreadcrumbs().slice(1).map((breadcrumb, index) => (
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
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
