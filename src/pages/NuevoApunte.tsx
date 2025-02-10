
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import InputBlock from "@/components/Blocks/InputBlock";
import { useQuery } from "@tanstack/react-query";

const NuevoApunte = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);

  // Query to fetch blocks for the current note
  const { data: blocks, refetch: refetchBlocks } = useQuery({
    queryKey: ["blocks", noteId],
    queryFn: async () => {
      if (!noteId) return [];
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("note_id", noteId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!noteId,
  });

  const createInitialNote = async () => {
    if (!user) return;

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

      if (noteError) throw noteError;

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
    }
  };

  const createNewBlock = async (position: number) => {
    if (!user) return;

    try {
      const currentNoteId = noteId || await createInitialNote();
      if (!currentNoteId) return;

      // Create the new block
      const { error: blockError } = await supabase
        .from("blocks")
        .insert([
          {
            note_id: currentNoteId,
            type: "text",
            content: { text: "" },
            position,
          },
        ]);

      if (blockError) throw blockError;

      // Update the note's updated_at timestamp
      const { error: updateError } = await supabase
        .from("notes")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", currentNoteId);

      if (updateError) throw updateError;

      refetchBlocks();

    } catch (error) {
      console.error("Error creating block:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el bloque. Por favor, inténtalo de nuevo.",
      });
    }
  };

  // Create initial block when note is created
  useEffect(() => {
    if (noteId && (!blocks || blocks.length === 0)) {
      createNewBlock(0);
    }
  }, [noteId, blocks]);

  const handleFinish = () => {
    if (noteId) {
      navigate(`/dashboard/mis-apuntes/${noteId}`);
    } else {
      navigate("/dashboard/mis-apuntes");
    }
  };

  const handleSaveStart = () => {
    // Esta función podría usarse para mostrar un indicador de guardado
  };

  const handleSaveEnd = () => {
    // Esta función podría usarse para mostrar un indicador de éxito
  };

  const handleEmptyBlockEnter = async (position: number) => {
    await createNewBlock(position + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-12">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo apunte</h1>
      <div className="space-y-6">
        <div className="space-y-2 w-full">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Introduce el título del apunte"
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          {blocks?.map((block) => (
            <div key={block.id}>
              {block.type === "text" && block.content && typeof block.content === 'object' && 'text' in block.content ? (
                <InputBlock
                  id={block.id}
                  content={block.content as { text: string }}
                  noteId={noteId!}
                  position={block.position}
                  onSaveStart={handleSaveStart}
                  onSaveEnd={handleSaveEnd}
                  onEmptyBlockEnter={() => handleEmptyBlockEnter(block.position)}
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleFinish}
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NuevoApunte;
