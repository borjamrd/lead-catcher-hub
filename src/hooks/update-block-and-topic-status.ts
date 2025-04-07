// services/updateBlockAndTopicsStatus.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TopicAndBlockStatus } from "@/models/models";

export const updateBlockAndTopicsStatus = async (blockId: string, status: TopicAndBlockStatus) => {
  const { error: blockError } = await supabase
    .from("blocks")
    .update({ status })
    .eq("id", blockId);

  if (blockError) {
    toast({
      title: "Error",
      description: "No se pudo actualizar el estado del bloque.",
      variant: "destructive",
    });
    console.error("Error updating block status:", blockError);
    return blockError;
  }

  const { error: topicsError } = await supabase
    .from("topics")
    .update({ status })
    .eq("block_id", blockId);

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
