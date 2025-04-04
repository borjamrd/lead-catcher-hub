
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useStudySessionStore } from "@/stores/useStudySessionStore";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Play, Pause, Settings, StopCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Study session state
  const {
    isActive: studySessionActive,
    isPaused: studySessionPaused,
    startTime,
    elapsedSeconds,
    pauseSession,
    resumeSession,
    endSession,
  } = useStudySessionStore();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Has cerrado sesión correctamente");
      navigate("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };
  
  // Format elapsed time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle study session controls
  const handlePauseStudy = () => {
    pauseSession();
    toast.success("Sesión de estudio pausada");
  };
  
  const handleResumeStudy = () => {
    resumeSession();
    toast.success("Sesión de estudio reanudada");
  };
  
  const handleFinishStudy = () => {
    endSession();
    toast.success("Sesión de estudio finalizada");
  };
  
  // Open study session modal
  const openStudyModal = () => {
    // We'll navigate to the dashboard which has the modal
    navigate("/dashboard");
    // The modal will be opened in the dashboard component
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('open-study-modal'));
    }, 100);
  };

  return (
    <nav className="bg-white border-b">
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
            {user && (
              <>
                {/* Study Timer */}
                {studySessionActive ? (
                  <div className="flex items-center space-x-3">
                    {/* Timer display */}
                    <div className="font-mono text-sm font-medium">
                      {formatTime(elapsedSeconds)}
                    </div>
                    
                    {/* Control buttons */}
                    <div className="flex space-x-1">
                      {studySessionPaused ? (
                        <Button size="icon" variant="ghost" onClick={handleResumeStudy} title="Reanudar sesión">
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={handlePauseStudy} title="Pausar sesión">
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button size="icon" variant="ghost" onClick={handleFinishStudy} title="Finalizar sesión" className="text-destructive hover:text-destructive">
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button size="icon" variant="ghost" onClick={openStudyModal} title="Iniciar sesión de estudio">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {profile?.username?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{profile?.username || user.email}</span>
                </Link>
                <Link
                  to="/dashboard/ajustes"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  to="/dashboard/perfil-opositor"
                >
                  <FolderKanban className="h-5 w-5" />
                </Link>

                <Button variant="ghost" onClick={handleLogout}>
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
