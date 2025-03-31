import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface NoteTitleInputProps {
  title: string;
  onChange: (text: string) => void;
  onEnter?: () => void;
}

const NoteTitleInput = ({ title, onChange, onEnter }: NoteTitleInputProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && title && ref.current.innerText !== title) {
      ref.current.innerText = title;
    }
  }, [title]);

  const handleInput = () => {
    onChange(ref.current?.innerText || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        "outline-none text-5xl font-bold mb-2 w-full",
        "focus:ring-0 focus-visible:ring-0"
      )}
      placeholder="Sin título"
      data-placeholder="Sin título"
    />
  );
};

export default NoteTitleInput;
