// hooks/useBlock.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBlock = (blockId: string) =>
  useQuery({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("id", blockId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
