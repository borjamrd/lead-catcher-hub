
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NuevoApunte = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);

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
        description:
          "Ha ocurrido un error al crear el apunte. Por favor, inténtalo de nuevo.",
      });
      return null;
    }
  };

  const handleContentSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (!user) return;

    setIsLoading(true);
    try {
      const currentNoteId = noteId || await createInitialNote();
      if (!currentNoteId) return;

      // Create the new block
      const { error: blockError } = await supabase.from("blocks").insert([
        {
          note_id: currentNoteId,
          type: "text" as const,
          content: { text: content },
          position: 0,
        },
      ]);

      if (blockError) throw blockError;

      // Update the note's updated_at timestamp
      const { error: updateError } = await supabase
        .from("notes")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", currentNoteId);

      if (updateError) throw updateError;

      setContent(""); // Clear input after successful submission
      toast({
        title: "Bloque guardado",
        description: "El contenido se ha guardado correctamente.",
      });

    } catch (error) {
      console.error("Error saving block:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ha ocurrido un error al guardar el contenido. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    if (noteId) {
      navigate(`/dashboard/mis-apuntes/${noteId}`);
    } else {
      navigate("/dashboard/mis-apuntes");
    }
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
        <div className="w-full">
          <Input
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleContentSubmit}
            placeholder="Escribe el contenido y presiona Enter para guardar..."
            className="w-full"
            disabled={isLoading}
          />
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
