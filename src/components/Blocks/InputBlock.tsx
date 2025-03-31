import { useState, useRef, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface InputBlockProps {
  id: string;
  content: { text: string; checked?: boolean };
  type: string;
  noteId: string;
  position: number;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onEmptyBlockEnter?: () => void;
  onContentBlockEnter?: (position: number) => void;
  onDelete?: () => void;
}

const InputBlock = forwardRef<HTMLTextAreaElement, InputBlockProps>(
  (
    {
      id,
      content,
      type,
      noteId,
      position,
      onSaveStart,
      onSaveEnd,
      onEmptyBlockEnter,
      onContentBlockEnter,
      onDelete,
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(content?.text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    

    const handleSave = async () => {
      if (value === content?.text) {
        setIsEditing(false);
        return;
      }

      onSaveStart();
      try {
        const { error } = await supabase
          .from("note_blocks")
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

    const handleKeyDown = async (
      e: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
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
      } else if (e.key === "Delete" && value.trim() === "") {
        e.preventDefault();
        try {
          const { error } = await supabase
            .from("note_blocks")
            .delete()
            .eq("id", id);

          if (error) throw error;
          if (onDelete) onDelete();
        } catch (error) {
          console.error("Error deleting block:", error);
        }
      }
    };

    const handleClick = () => {
      setIsEditing(true);
    };
    const baseStyles = "p-2 rounded-md hover:bg-gray-100 whitespace-pre-wrap break-words min-h-[42px] overflow-visible";
    const typeStyles = {
      heading_1: "text-4xl font-bold",
      heading_2: "text-3xl font-semibold",
      heading_3: "text-2xl font-medium",
      paragraph: "text-base",
    };
    
    const sharedStyles = `${baseStyles} ${type ? typeStyles[type] ?? "" : ""}`;
    

    if (isEditing) {
      return (
        <Textarea
          ref={(element) => {
            textareaRef.current = element!;
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={1}
          className={cn(
            sharedStyles,
            "p-2 rounded-md border-none focus:ring-0 focus-visible:ring-0 resize-none cursor-text",
            type === "heading_1" && "text-4xl font-bold",
            type === "heading_2" && "text-3xl font-semibold",
            type === "heading_3" && "text-2xl font-medium"
          )}
        />
      );
    }

    if (type === "to_do") {
      return (
        <div className={cn(sharedStyles, "flex items-center gap-2")}>
          <input type="checkbox" checked={content?.checked} readOnly />
          <div onClick={handleClick} className="cursor-text">
            {value || <span className="text-gray-400">Tarea...</span>}
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={handleClick}
        className={cn(sharedStyles, "cursor-text")}
      >
        {value ||
          (isEditing && (
            <span className="text-gray-400">
              Presiona '/' para ver comandos
            </span>
          ))}
      </div>
    );
  }
);

InputBlock.displayName = "InputBlock";
export default InputBlock;
