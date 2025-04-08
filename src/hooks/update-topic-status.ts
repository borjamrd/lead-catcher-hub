import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TopicAndBlockStatus } from "@/models/models";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";
import { useAuth } from "@/contexts/AuthContext";

// Puedes hacer esto como función normal, o hook si necesitas contexto React
export const updateTopicStatus = async (
  idUser: string,
  topicId: string,
  status: TopicAndBlockStatus
) => {
  const { selectedCycleId } = useStudyCycleStore.getState();

  const { error } = await supabase
    .from("user_topics")
    .update({ status })
    .eq("user_id", idUser)
    .eq("topic_id", topicId)
    .eq("study_cycle_id", selectedCycleId);

  if (error) {
    console.error("Error updating topic status:", error);
    toast({
      title: "Error",
      description: "No se pudo actualizar el estado del tema.",
      variant: "destructive",
    });
  }

  return error;
};
