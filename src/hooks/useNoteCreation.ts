
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useNoteCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createInitialNote = async (title: string) => {
    if (!user || isCreating) return null;

    setIsCreating(true);
    try {
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .insert([
          {
            title: title || "Sin título",
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (noteError) {
        console.error("Error creating note:", noteError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al crear el apunte. Por favor, inténtalo de nuevo.",
        });
        return null;
      }

      setNoteId(note.id);
      return note.id;
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el apunte. Por favor, inténtalo de nuevo.",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    noteId,
    isCreating,
    createInitialNote,
  };
};
