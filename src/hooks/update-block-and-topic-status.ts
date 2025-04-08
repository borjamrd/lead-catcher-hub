import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TopicAndBlockStatus } from "@/models/models";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";

export const updateBlockAndTopicsStatus = async (
  blockId: string,
  status: TopicAndBlockStatus
) => {
  const user = (await supabase.auth.getUser()).data.user;
  const { selectedCycleId } = useStudyCycleStore.getState();

  // 1. Actualizar el estado del bloque
  const { error: blockError } = await supabase
    .from("user_blocks")
    .update({ status })
    .eq("block_id", blockId)
    .eq("user_id", user.id)
    .eq("study_cycle_id", selectedCycleId);

  if (blockError) {
    toast({
      title: "Error",
      description: "No se pudo actualizar el estado del bloque.",
      variant: "destructive",
    });
    console.error("Error updating block status:", blockError);
    return blockError;
  }

  // 2. Actualizar temas relacionados (solo los que no hayan empezado)
  const { error: topicsError } = await supabase
    .from("user_topics")
    .update({ status })
    .match({ user_id: user.id, study_cycle_id: selectedCycleId })
    .in(
      "topic_id",
      (
        await supabase.from("topics").select("id").eq("block_id", blockId)
      ).data?.map((t) => t.id) || []
    )
    .eq("status", "not_started");

  if (topicsError) {
    toast({
      title: "Error",
      description: "No se pudo actualizar el estado de los temas.",
      variant: "destructive",
    });
    console.error("Error updating topics status:", topicsError);
  }

  return topicsError || blockError;
};
