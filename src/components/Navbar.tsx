
import { Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Has cerrado sesión correctamente');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl">
                <span className="text-oxford_blue">oposita</span>
                <span className="text-yinmn_blue">place</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="/#avisos-inap"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Recibe tus avisos
            </a>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{profile?.username || user.email}</span>
                </Link>
                <Link
                  to="/dashboard/ajustes"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cerrar sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
