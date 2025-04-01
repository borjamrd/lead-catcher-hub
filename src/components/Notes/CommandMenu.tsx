// components/CommandMenu.tsx
import { useEffect, useRef } from "react";

interface CommandMenuProps {
  onSelect: (type: string) => void;
  position: { x: number; y: number };
  close: () => void;
}

const blockOptions = [
  { label: "Text", type: "paragraph", shortcut: "" },
  { label: "Heading 1", type: "heading_1", shortcut: "#" },
  { label: "Heading 2", type: "heading_2", shortcut: "##" },
  { label: "Heading 3", type: "heading_3", shortcut: "###" },
  { label: "To-do list", type: "to_do", shortcut: "[]", icon: "☑️" },
  { label: "Toggle", type: "toggle", shortcut: "", icon: "▸" },
];

const CommandMenu = ({ onSelect, position, close }: CommandMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-64 rounded-md border bg-white shadow-md"
      style={{ top: position.y, left: position.x }}
    >
      <ul>
        {blockOptions.map((item) => (
          <li
            key={item.type}
            onClick={() => onSelect(item.type)}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between"
          >
            <span>
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </span>
            <span className="text-sm text-gray-400">{item.shortcut}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandMenu;
