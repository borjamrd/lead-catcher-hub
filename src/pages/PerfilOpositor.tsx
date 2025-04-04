
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

const PerfilOpositor = () => {
  const { user } = useAuth();
  const { setOnboardingInfo } = useOnboardingStore();

  const { data: onboardingInfo, isLoading } = useQuery({
    queryKey: ["onboarding_info", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("onboarding_info")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGSQL_RELATION_DOES_NOT_EXIST") {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update the store when data is loaded
  useEffect(() => {
    if (onboardingInfo) {
      setOnboardingInfo(onboardingInfo);
    }
  }, [onboardingInfo, setOnboardingInfo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Perfil de Opositor</h1>

      {onboardingInfo ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Horas disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{onboardingInfo.available_hours} horas al día</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Días de estudio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{onboardingInfo.study_days} días a la semana</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              {onboardingInfo.objectives && typeof onboardingInfo.objectives === 'object' ? (
                <ul className="list-disc pl-5 space-y-2">
                  {Object.values(onboardingInfo.objectives).map((objective, index) => (
                    <li key={index}>{String(objective)}</li>
                  ))}
                </ul>
              ) : (
                <p>No se han definido objetivos</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center items-center p-10 bg-muted rounded-lg">
          <p className="text-xl text-muted-foreground">No hay información</p>
        </div>
      )}
    </div>
  );
};

export default PerfilOpositor;
