import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useStudyCycles = (oppositionId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["study-cycles", user?.id, oppositionId],
    queryFn: async () => {
      if (!user?.id || !oppositionId) return [];

      const { data, error } = await supabase
        .from("study_cycles")
        .select("id, cycle_number, started_at, completed_at")
        .eq("user_id", user.id)
        .eq("opposition_id", oppositionId)
        .order("cycle_number", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!oppositionId,
  });
};
