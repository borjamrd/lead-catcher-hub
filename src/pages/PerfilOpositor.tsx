
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PerfilOpositor = () => {
  const { user } = useAuth();
  const { onboardingInfo, setOnboardingInfo } = useOnboardingStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["onboardingInfo", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Usuario no autenticado");
      
      const { data, error } = await supabase
        .from("onboarding_info")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!user,
    onSuccess: (data) => {
      if (data) setOnboardingInfo(data);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        Error al cargar los datos: {error.message}
      </div>
    );
  }

  if (!data && !onboardingInfo) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">No hay información</h2>
        <p className="text-gray-500">
          No se ha encontrado información de onboarding para este usuario.
        </p>
      </div>
    );
  }

  const info = data || onboardingInfo;
  const dayNames = [
    "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
  ];
  const recommendedDays = info ? dayNames.slice(0, info.study_days) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil de Opositor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Información de Estudio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Horas disponibles al día:</h3>
            <p>{info?.available_hours} horas</p>
          </div>
          
          <div>
            <h3 className="font-semibold">Días de estudio recomendados:</h3>
            <p>{recommendedDays.join(", ")}</p>
          </div>
          
          {info?.objectives && (
            <div>
              <h3 className="font-semibold">Objetivos:</h3>
              <ul className="list-disc pl-5">
                {info.objectives.goals && info.objectives.goals.map((goal: string, index: number) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
              
              {info.objectives.areas && (
                <>
                  <h3 className="font-semibold mt-2">Áreas de enfoque:</h3>
                  <ul className="list-disc pl-5">
                    {info.objectives.areas.map((area: string, index: number) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilOpositor;
