
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NoteTitleInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NoteTitleInput = ({ title, onChange }: NoteTitleInputProps) => {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="title">Título</Label>
      <Input
        id="title"
        value={title}
        onChange={onChange}
        placeholder="Introduce el título del apunte"
        className="w-full"
      />
    </div>
  );
};

export default NoteTitleInput;
