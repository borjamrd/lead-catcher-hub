
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Answer } from "@/stores/useCurrentTestState";
import { useCurrentTestState } from "@/stores/useCurrentTestState";

export function useQuestionAnswers(questionId: string | undefined) {
  const addAnswersToQuestion = useCurrentTestState(state => state.addAnswersToQuestion);

  return useQuery({
    queryKey: ["answers", questionId],
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

      if (data && data.length > 0) {
        addAnswersToQuestion(questionId, data);
      }

      return data || [];
    },
    enabled: !!questionId,
  });
}
