
import { Input } from "@/components/ui/input";

interface NoteTitleInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NoteTitleInput = ({ title, onChange }: NoteTitleInputProps) => {
  return (
    <Input
      value={title || "Sin título"}
      onChange={onChange}
      placeholder="Sin título"
      className="w-full text-4xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
    />
  );
};

export default NoteTitleInput;
