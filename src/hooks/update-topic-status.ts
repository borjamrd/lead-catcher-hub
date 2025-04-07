// services/updateTopicStatus.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TopicAndBlockStatus } from "@/models/models";

export const updateTopicStatus = async (topicId: string, status: TopicAndBlockStatus) => {
  const { error } = await supabase
    .from("topics")
    .update({ status })
    .eq("id", topicId);

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
