
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Test } from "@/hooks/useTests";

export function useTest(testId: string | null) {
  return useQuery({
    queryKey: ["test", testId],
    queryFn: async (): Promise<Test | null> => {
      if (!testId) return null;

      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .eq("id", testId)
        .single();

      if (error) {
        console.error("Error fetching test:", error);
        throw error;
      }

      return data;
    },
    enabled: !!testId,
  });
}
