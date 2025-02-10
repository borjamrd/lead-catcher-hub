
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const NuevoApunte = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // First create the note
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .insert([
          {
            title,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (noteError) throw noteError;

      // Then create the initial text block
      const { error: blockError } = await supabase.from("blocks").insert([
        {
          note_id: note.id,
          type: "text",
          content: { text: content },
          position: 0,
        },
      ]);

      if (blockError) throw blockError;

      toast({
        title: "Apunte creado",
        description: "Tu apunte se ha creado correctamente.",
      });

      navigate(`/dashboard/mis-apuntes/${note.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ha ocurrido un error al crear el apunte. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Crear nuevo apunte</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Introduce el título del apunte"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Contenido</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe el contenido de tu apunte..."
            className="min-h-[200px]"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/mis-apuntes")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear apunte"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NuevoApunte;
