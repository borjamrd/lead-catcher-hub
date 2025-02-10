
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface InputBlockProps {
  id: string;
  content: { text: string };
  noteId: string;
  position: number;
  onSaveStart: () => void;
  onSaveEnd: () => void;
}

const InputBlock = ({ id, content, noteId, position, onSaveStart, onSaveEnd }: InputBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content.text);

  const handleSave = async () => {
    // Solo guardar si el contenido ha cambiado
    if (value === content.text) {
      setIsEditing(false);
      return;
    }

    onSaveStart();
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
      onSaveEnd();
    } catch (error) {
      console.error("Error updating block:", error);
      onSaveEnd();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Si se presiona Enter sin Shift, guardar
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevenir nueva línea
      handleSave();
    }
    // Si se presiona Shift + Enter, permitir nueva línea (comportamiento por defecto)
  };

  if (isEditing) {
    return (
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="focus:ring-0 focus:ring-offset-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px] resize-none"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="p-2 rounded-md hover:bg-gray-100 cursor-text whitespace-pre-wrap"
    >
      {value}
    </div>
  );
};

export default InputBlock;
