
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader, Check } from "lucide-react";

interface InputBlockProps {
  id: string;
  content: { text: string };
  noteId: string;
  position: number;
}

const InputBlock = ({ id, content, noteId, position }: InputBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content.text);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    // Solo guardar si el contenido ha cambiado
    if (value === content.text) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("blocks")
        .update({
          content: { text: value },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update note's updated_at timestamp
      const { error: updateError } = await supabase
        .from("notes")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", noteId);

      if (updateError) throw updateError;

      setIsEditing(false);
      setIsSaving(false);
      setShowSuccess(true);
      
      // Ocultar el icono de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      toast({
        title: "Bloque actualizado",
        description: "El contenido se ha guardado correctamente.",
      });
    } catch (error) {
      console.error("Error updating block:", error);
      setIsSaving(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ha ocurrido un error al actualizar el bloque. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
          autoFocus
        />
        <div className="absolute top-2 right-2">
          {isSaving && <Loader className="h-4 w-4 animate-spin" />}
          {showSuccess && <Check className="h-4 w-4 text-green-500" />}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="p-2 rounded-md hover:bg-gray-100 cursor-text relative"
    >
      {value}
      <div className="absolute top-2 right-2">
        {isSaving && <Loader className="h-4 w-4 animate-spin" />}
        {showSuccess && <Check className="h-4 w-4 text-green-500" />}
      </div>
    </div>
  );
};

export default InputBlock;
