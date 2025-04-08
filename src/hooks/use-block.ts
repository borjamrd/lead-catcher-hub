import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";

export const useBlock = (blockId: string) => {
  const { user } = useAuth();
  const { selectedCycleId } = useStudyCycleStore();

  return useQuery({
    queryKey: ["user_block", blockId, user?.id, selectedCycleId],
    enabled: !!user && !!selectedCycleId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_blocks")
        .select("status, block:blocks(id, name, position)")
        .eq("user_id", user.id)
        .eq("study_cycle_id", selectedCycleId)
        .eq("block_id", blockId)
        .single();

      if (error) throw error;

      return {
        id: data.block.id,
        name: data.block.name,
        position: data.block.position,
        status: data.status,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
