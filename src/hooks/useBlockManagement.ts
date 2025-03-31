
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useBlockManagement = (noteId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: blocks, refetch: refetchBlocks } = useQuery({
    queryKey: ["blocks", noteId],
    queryFn: async () => {
      if (!noteId) return [];
      const { data, error } = await supabase
        .from("note_blocks")
        .select("*")
        .eq("note_id", noteId)
        .order("position", { ascending: true });

      if (error) {
        console.error("Error fetching blocks:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los bloques. Por favor, inténtalo de nuevo.",
        });
        return [];
      }
      return data;
    },
    enabled: !!noteId,
  });

  const createNewBlock = async (position: number, currentNoteId: string) => {
    if (!user) return;

    try {
      // Primero actualizamos las posiciones de los bloques existentes
      if (blocks) {
        const blocksToUpdate = blocks
          .filter(block => block.position >= position)
          .map(block => ({
            id: block.id,
            position: block.position + 1
          }));

        for (const block of blocksToUpdate) {
          const { error } = await supabase
            .from("note_blocks")
            .update({ position: block.position })
            .eq("id", block.id);

          if (error) {
            console.error("Error updating block positions:", error);
          }
        }
      }

      // Luego creamos el nuevo bloque en la posición deseada
      const { error: blockError } = await supabase
        .from("note_blocks")
        .insert([
          {
            note_id: currentNoteId,
            type: "text",
            content: { text: "" },
            position,
          },
        ]);

      if (blockError) {
        console.error("Error creating block:", blockError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al crear el bloque. Por favor, inténtalo de nuevo.",
        });
        return;
      }

      const { error: updateError } = await supabase
        .from("notes")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", currentNoteId);

      if (updateError) {
        console.error("Error updating note timestamp:", updateError);
      }

      refetchBlocks();
    } catch (error) {
      console.error("Error in createNewBlock:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el bloque. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return {
    blocks,
    createNewBlock,
    refetchBlocks,
  };
};
