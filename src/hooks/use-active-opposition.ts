import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useActiveOpposition() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["active_opposition", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_oppositions")
        .select("id, opposition_id, active, oppositions(id, name)")
        .eq("profile_id", user.id)
        .eq("active", true)
        .single();

      if (error) throw error;

      return data?.oppositions;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // opcional: cachea durante 5 min
  });
}
