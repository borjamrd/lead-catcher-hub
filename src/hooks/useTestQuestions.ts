
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/stores/useCurrentTestState";

export function useTestQuestions(testId: string | undefined) {
  return useQuery({
    queryKey: ["questions", testId],
    queryFn: async (): Promise<Question[]> => {
      if (!testId) return [];

      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", testId);

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!testId,
  });
}
