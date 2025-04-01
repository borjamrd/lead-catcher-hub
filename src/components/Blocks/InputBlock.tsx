import { useState, useRef, useEffect, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import CommandMenu from "@/components/Notes/CommandMenu";
import BlockEditor from "@/components/Blocks/BlockEditor";
import BlockViewer from "@/components/Blocks/BlockViewer";

interface InputBlockProps {
  id: string;
  content: { text: string };
  noteId: string;
  position: number;
  type: string;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onEmptyBlockEnter?: () => void;
  onContentBlockEnter?: (position: number) => void;
  onDelete?: () => void;
  onFocusNavigate?: (position: number) => void;
  autoFocus?: boolean;
}

const InputBlock = forwardRef<HTMLTextAreaElement, InputBlockProps>(
  (props, ref) => {
    const { id, content, noteId, position, type, onSaveStart, onSaveEnd, onEmptyBlockEnter, onContentBlockEnter, onDelete, onFocusNavigate,  autoFocus, } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(content?.text || "");
    const [caretPosition, setCaretPosition] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      if (autoFocus && !isEditing) {
        setIsEditing(true);
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }, [autoFocus, isEditing]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      let offset = 0;
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        offset = range ? range.startOffset : 0;
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        offset = pos ? pos.offset : 0;
      }
      setCaretPosition(offset);
      setIsEditing(true);
    };

    const handleSave = async () => {
      if (value === content?.text) {
        setIsEditing(false);
        return;
      }
      onSaveStart();
      try {
        // Guardado omitido temporalmente (mock)
        setIsEditing(false);
        onSaveEnd();
      } catch (error) {
        console.error("Error updating block:", error);
        onSaveEnd();
      }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        onFocusNavigate?.(position + 1);
        return;
      }
      if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        onFocusNavigate?.(position - 1);
        return;
      }
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
        // Eliminación omitida temporalmente
      }
    };

    return (
      <div data-block-position={position} className="relative">
        {/* <span>{position}</span> */}
        {isEditing ? (
          <BlockEditor
            value={value}
            setValue={setValue}
            textareaRef={textareaRef}
            refProp={ref}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            type={type}
            caretPosition={caretPosition || 0}
          />
        ) : (
          <BlockViewer value={value} type={type} onClick={handleClick} />
        )}

        {showMenu && (
          <CommandMenu
            position={menuPosition}
            onSelect={(newType) => {
              onSaveStart();
              try {
                // Actualización del tipo omitida temporalmente
                onSaveEnd();
              } catch (error) {
                console.error("Error changing block type:", error);
                onSaveEnd();
              }
            }}
            close={() => setShowMenu(false)}
          />
        )}
      </div>
    );
  }
);

InputBlock.displayName = "InputBlock";
export default InputBlock;

