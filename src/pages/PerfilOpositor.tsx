
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { OnboardingInfo } from '@/stores/useOnboardingStore';
import { useOppositionStore } from '@/stores/useOppositionStore';

const PerfilOpositor = () => {
  const { user } = useAuth();
  const { setOnboardingInfo } = useOnboardingStore();
  const { onboardingInfo } = useOnboardingStore();
  const { currentSelectedOppositionId } = useOppositionStore();

  const { data: oppositionInfo } = useQuery({
    queryKey: ['opposition', currentSelectedOppositionId],
    queryFn: async () => {
      if (!currentSelectedOppositionId) return null;
      const { data, error } = await supabase
        .from('oppositions')
        .select('*')
        .eq('id', currentSelectedOppositionId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!currentSelectedOppositionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: onboardingData } = useQuery({
    queryKey: ['onboarding', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('onboarding_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as OnboardingInfo;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (onboardingData) {
      setOnboardingInfo(onboardingData);
    }
  }, [onboardingData, setOnboardingInfo]);

  if (!onboardingInfo) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Perfil Opositor</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No hay información disponible</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Perfil Opositor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Información de estudio</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Horas disponibles:</span> {onboardingInfo.available_hours} horas al día</p>
                <p><span className="font-medium">Días de estudio:</span> {onboardingInfo.study_days} días a la semana</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Objetivos</h3>
              {onboardingInfo.objectives?.areas ? (
                <ul className="list-disc pl-5">
                  {Array.isArray(onboardingInfo.objectives.areas) ? 
                    onboardingInfo.objectives.areas.map((area: string, idx: number) => (
                      <li key={idx}>{area}</li>
                    )) : 
                    <li>{String(onboardingInfo.objectives.areas)}</li>
                  }
                </ul>
              ) : (
                <p>No hay objetivos definidos</p>
              )}
            </div>
          </div>

          {oppositionInfo && (
            <div>
              <h3 className="font-medium text-lg mb-2">Oposición</h3>
              <p><span className="font-medium">Nombre:</span> {oppositionInfo.name}</p>
              {oppositionInfo.description && (
                <p className="mt-2"><span className="font-medium">Descripción:</span> {oppositionInfo.description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilOpositor;
