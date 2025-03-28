import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useActiveOpposition() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["active_opposition", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_oppositions")
        .select("oppositions(id, name)")
        .eq("profile_id", user.id)
        .eq("active", true);

      if (error) throw error;

      // Devuelve un array de oposiciones
      return data.map((row) => row.oppositions);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
}
