
import { Input } from "@/components/ui/input";

interface NoteTitleInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
}

const NoteTitleInput = ({ title, onChange, onEnter }: NoteTitleInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <Input
      value={title || "Sin título"}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder="Sin título"
      className="w-full text-5xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
};

export default NoteTitleInput;
