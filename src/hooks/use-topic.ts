import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";
import { useAuth } from "@/contexts/AuthContext";

export const useTopic = (topicId: string) => {
  const { user } = useAuth();
  const { selectedCycleId } = useStudyCycleStore();


  return useQuery({
    queryKey: ["user_topic", topicId, user?.id, selectedCycleId],
    enabled: !!user && !!selectedCycleId,
    queryFn: async () => {
      // 1. Obtener el user_topic que contiene el status
      const { data: userTopic, error: userTopicError } = await supabase
        .from("user_topics")
        .select("status, topic:topics(id, name, description, block_id)")
        .eq("user_id", user.id)
        .eq("study_cycle_id", selectedCycleId)
        .eq("topic_id", topicId)
        .single();

        console.log({userTopic})
      if (userTopicError) throw userTopicError;

      return {
        ...userTopic.topic,
        status: userTopic.status,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
