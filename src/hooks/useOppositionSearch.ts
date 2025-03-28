
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useOppositionSearch() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["opposition_search", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase.rpc("list_user_oppositions", {
        profile_id: user.id,
      });

      if (error) throw error;

      // Opcional: separar ya en dos listas
      const assigned = data.filter((o: any) => o.is_assigned);
      const available = data.filter((o: any) => !o.is_assigned);

      return { assigned, available };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}
