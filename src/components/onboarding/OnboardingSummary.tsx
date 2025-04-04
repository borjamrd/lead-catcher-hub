
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

const dayNames = [
  "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];

interface Props {
  availableHours: number;
  studyDays: number;
  onConfirm: () => void;
}

const OnboardingSummary = ({ availableHours, studyDays, onConfirm }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const setOnboardingInfo = useOnboardingStore((state) => state.setOnboardingInfo);
  
  const recommendedDays = dayNames.slice(0, studyDays); // Mock básico

  const handleConfirm = async () => {
    if (!user) {
      toast.error("No se ha podido guardar la información. Usuario no autenticado.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock objectives data as requested
      const mockObjectives = {
        areas: ["Preparación general", "Estudio eficiente"],
        goals: ["Aprobar la oposición", "Mejorar técnicas de estudio"]
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from("onboarding_info")
        .insert({
          user_id: user.id,
          available_hours: availableHours,
          study_days: studyDays,
          objectives: mockObjectives,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving onboarding info:", error);
        toast.error("Error al guardar la información de onboarding");
        return;
      }

      // Update global state
      setOnboardingInfo({
        id: data.id,
        user_id: data.user_id,
        available_hours: data.available_hours,
        study_days: data.study_days,
        objectives: data.objectives,
        created_at: data.created_at
      });

      // Show success message
      toast.success("¡Configuración guardada correctamente!");
      
      // Close modal
      onConfirm();
    } catch (err) {
      console.error("Error en el proceso de onboarding:", err);
      toast.error("Ha ocurrido un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          ¡Muchas gracias! 🎉
        </h2>
        <p className="text-center">
          Basándome en tu perfil y situación personal, te recomiendo lo siguiente:
        </p>

        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            Estudiar <strong>{availableHours}</strong> horas al día
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            Días de estudio recomendados:{" "}
            <strong>{recommendedDays.join(", ")}</strong>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleConfirm} 
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : "Comenzar ahora"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSummary;
