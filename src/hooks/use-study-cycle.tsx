
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StudyCycle {
  id: string;
  cycle_number: number;
  started_at: string;
  completed_at: string | null;
  opposition_id: string;
  user_id: string;
}

export const useStudyCycles = (oppositionId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["study-cycles", user?.id, oppositionId],
    queryFn: async (): Promise<StudyCycle[]> => {
      if (!user?.id || !oppositionId) return [];

      const { data, error } = await supabase
        .from("study_cycles")
        .select("id, cycle_number, started_at, completed_at, opposition_id, user_id")
        .eq("user_id", user.id)
        .eq("opposition_id", oppositionId)
        .order("cycle_number", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!oppositionId,
    staleTime: 1000 * 60 * 10,  // 10 minutes
  });
};
