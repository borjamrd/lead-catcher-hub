
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Answer } from "@/stores/useCurrentTestStore";

export function useQuestionAnswers(questionId: string | null) {
  return useQuery({
    queryKey: ["question-answers", questionId],
    queryFn: async (): Promise<Answer[]> => {
      if (!questionId) return [];

      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", questionId);

      if (error) {
        console.error("Error fetching answers:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!questionId,
  });
}
