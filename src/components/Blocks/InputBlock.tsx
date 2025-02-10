
import { useState } from "react";
import { Input } from "@/components/ui/input";
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

  if (isEditing) {
    return (
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
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="p-2 rounded-md hover:bg-gray-100 cursor-text"
    >
      {value}
    </div>
  );
};

export default InputBlock;
