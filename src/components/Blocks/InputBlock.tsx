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
  onEmptyBlockEnter?: () => void;
  onContentBlockEnter?: (position: number) => void;
}

const InputBlock = ({ 
  id, 
  content, 
  noteId, 
  position, 
  onSaveStart, 
  onSaveEnd,
  onEmptyBlockEnter,
  onContentBlockEnter 
}: InputBlockProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() === "" && onEmptyBlockEnter) {
        onEmptyBlockEnter();
        return;
      }
      await handleSave();
      if (value.trim() !== "" && onContentBlockEnter) {
        onContentBlockEnter(position);
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsEditing(true);
    
    setTimeout(() => {
      if (textareaRef.current) {
        const textareaElement = textareaRef.current;
        const style = window.getComputedStyle(textareaElement);
        const lineHeight = parseInt(style.lineHeight);
        const paddingLeft = parseInt(style.paddingLeft);
        
        const approximateCharWidth = 8;
        const clickedLine = Math.floor(y / lineHeight);
        const clickedChar = Math.floor((x - paddingLeft) / approximateCharWidth);
        
        const lines = value.split('\n');
        let position = 0;
        
        for (let i = 0; i < clickedLine && i < lines.length; i++) {
          position += lines[i].length + 1;
        }
        
        position += Math.min(clickedChar, lines[Math.min(clickedLine, lines.length - 1)].length);
        
        textareaRef.current.setSelectionRange(position, position);
      }
    }, 0);
  };

  const sharedStyles = "p-2 rounded-md hover:bg-gray-100 whitespace-pre-wrap min-h-[42px]";

  if (isEditing) {
    return (
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        rows={1}
        className={`${sharedStyles} focus:ring-0 focus:ring-offset-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none cursor-text`}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${sharedStyles} cursor-text text-gray-800`}
    >
      {value || <span className="text-gray-400">Presiona '/' para ver comandos</span>}
    </div>
  );
};

export default InputBlock;
