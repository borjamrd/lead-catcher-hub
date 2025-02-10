
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
      className="w-full"
    />
  );
};

export default NoteTitleInput;
