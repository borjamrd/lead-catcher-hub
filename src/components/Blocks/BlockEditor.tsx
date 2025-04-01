import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface BlockEditorProps {
  value: string;
  setValue: (val: string) => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  refProp: React.Ref<HTMLTextAreaElement> | undefined;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  type: string;
  caretPosition: number;
}


const typeStyles: Record<string, string> = {
  heading_1: "text-4xl font-bold",
  heading_2: "text-2xl font-semibold",
  heading_3: "text-xl font-medium",
  paragraph: "text-base",
  to_do: "pl-6",
  bulleted_list_item: "pl-6 list-disc list-inside",
  numbered_list_item: "pl-6 list-decimal list-inside",
};


const BlockEditor = ({
  value,
  setValue,
  textareaRef,
  refProp,
  onBlur,
  onKeyDown,
  type,
  caretPosition,
}: BlockEditorProps) => {
  const styles = typeStyles[type] || "";

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Posicionar el cursor en la posición indicada
      textareaRef.current.setSelectionRange(caretPosition, caretPosition);
    }
  }, [caretPosition]);

  return (
    <Textarea
      ref={(element) => {
        if (textareaRef) {
          textareaRef.current = element;
        }
        if (typeof refProp === "function") {
          refProp(element);
        } else if (refProp) {
          if ("current" in refProp) {
            (refProp as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
          }
        }
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus
      rows={1}
      placeholder={value === "" ? "Presiona '/' para ver comandos" : ""}
      className={`p-2 rounded-md whitespace-pre-wrap break-words min-h-[42px] overflow-visible focus:ring-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none cursor-text ${styles}`}
    />
  );
};

export default BlockEditor;
