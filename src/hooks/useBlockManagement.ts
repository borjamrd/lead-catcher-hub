import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useBlockManagement = (noteId: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          description:
            "No se pudieron cargar los bloques. Por favor, inténtalo de nuevo.",
        });
        return [];
      }
      return data;
    },
    enabled: !!noteId,
  });

  const createNewBlock = async (position: number, currentNoteId: string) => {
    if (!user) return;

    // Actualización optimista: agregamos el bloque nuevo al caché local
    queryClient.setQueryData(["blocks", currentNoteId], (oldData: any) => {
      const currentBlocks: any[] = oldData || [];

      // Creamos un bloque temporal con un id provisional
      const temporaryBlock = {
        id: `temp-${Date.now()}`,
        note_id: currentNoteId,
        type: "text",
        content: { text: "" },
        position,
      };

      // Actualizamos las posiciones de los bloques que tienen posición >= la del nuevo
      const updatedBlocks = currentBlocks.map((block) => {
        if (block.position >= position) {
          return { ...block, position: block.position + 1 };
        }
        return block;
      });

      // Agregamos el nuevo bloque y ordenamos por posición
      return [...updatedBlocks, temporaryBlock].sort(
        (a, b) => a.position - b.position
      );
    });

  };

  return {
    blocks,
    createNewBlock,
    refetchBlocks,
  };
};
