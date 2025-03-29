
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Test {
  id: string;
  title: string;
  opposition_id: string;
  topic_id?: string;
}

export function useTests(oppositionId: string | null) {
  return useQuery({
    queryKey: ["tests", oppositionId],
    queryFn: async (): Promise<Test[]> => {
      if (!oppositionId) return [];

      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("opposition_id", oppositionId);

      if (error) {
        console.error("Error fetching tests:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!oppositionId,
  });
}
