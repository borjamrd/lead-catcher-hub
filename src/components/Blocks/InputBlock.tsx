
import { useState, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsEditing(true);
    
    // Necesitamos usar setTimeout para asegurarnos de que el textarea está renderizado
    setTimeout(() => {
      if (textareaRef.current) {
        // Calculamos la posición del cursor basándonos en el punto del clic
        const textareaElement = textareaRef.current;
        const style = window.getComputedStyle(textareaElement);
        const lineHeight = parseInt(style.lineHeight);
        const paddingLeft = parseInt(style.paddingLeft);
        
        // Estimamos la posición del cursor basándonos en la posición del clic
        const approximateCharWidth = 8; // Valor aproximado para fuentes monospace
        const clickedLine = Math.floor(y / lineHeight);
        const clickedChar = Math.floor((x - paddingLeft) / approximateCharWidth);
        
        // Calculamos la posición en el texto
        const lines = value.split('\n');
        let position = 0;
        
        for (let i = 0; i < clickedLine && i < lines.length; i++) {
          position += lines[i].length + 1; // +1 por el salto de línea
        }
        
        position += Math.min(clickedChar, lines[Math.min(clickedLine, lines.length - 1)].length);
        
        // Establecemos la posición del cursor
        textareaRef.current.setSelectionRange(position, position);
      }
    }, 0);
  };

  const sharedStyles = "p-2 rounded-md hover:bg-gray-100 whitespace-pre-wrap min-h-[100px]";

  if (isEditing) {
    return (
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className={`${sharedStyles} focus:ring-0 focus:ring-offset-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none cursor-text`}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${sharedStyles} cursor-text`}
    >
      {value}
    </div>
  );
};

export default InputBlock;
