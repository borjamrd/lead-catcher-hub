// services/updateBlockStatusIfNeeded.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const updateBlockStatusIfNeeded = async (blockId: string) => {
  const { data: topics } = await supabase
    .from("topics")
    .select("status")
    .eq("block_id", blockId);

  const allCompleted = topics?.every((t) => t.status === "completed");
  const anyInProgress = topics?.some((t) => t.status === "in_progress");

  let newStatus = null;
  if (allCompleted) newStatus = "completed";
  else if (anyInProgress) newStatus = "in_progress";

  if (newStatus) {
    const { error } = await supabase
      .from("blocks")
      .update({ status: newStatus })
      .eq("id", blockId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del bloque.",
        variant: "destructive",
      });
      console.error("Error updating block status:", error);
    }

    return error;
  }
};
