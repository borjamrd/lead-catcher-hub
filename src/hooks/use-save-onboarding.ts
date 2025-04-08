import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSaveOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      available_hours,
      study_days,
      objectives,
      opposition_id,
    }: {
      userId: string;
      available_hours: number;
      study_days: number;
      objectives: string[];
      opposition_id: string | null;
    }) => {
      const { error } = await supabase.from("onboarding_info").insert({
        user_id: userId,
        available_hours,
        study_days,
        objectives: { areas: objectives },
        opposition_id,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Onboarding guardado con éxito");
      queryClient.invalidateQueries({ queryKey: ["onboarding_info"] });
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });
};
