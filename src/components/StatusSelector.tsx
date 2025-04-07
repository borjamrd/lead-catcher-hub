import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TopicAndBlockStatus } from "@/models/models";

interface StatusSelectorProps {
  value: "not_started" | "in_progress" | "completed";
  onChange: (value: "not_started" | "in_progress" | "completed") => void;
}

const STATUS_LABELS = {
  not_started: "Pendiente",
  in_progress: "En progreso",
  completed: "Completado",
};

const STATUS_COLORS = {
  not_started: "bg-gray-100 text-gray-700 border-gray-300",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
  completed: "bg-green-100 text-green-800 border-green-300",
};

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div className="flex items-center">
      <Badge
        variant="outline"
        className={
          STATUS_COLORS[value] +
          " text-xs h-8 border rounded-e-none rounded-s-sm"
        }
      >
        {STATUS_LABELS[value]}
      </Badge>

      <Select
        value={value}
        onValueChange={(val) => onChange(val as TopicAndBlockStatus)}
      >
        <SelectTrigger className="h-8 w-[160px] text-sm rounded-s-none rounded-e-sm">
          <SelectValue placeholder="Cambiar estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="not_started">Pendiente</SelectItem>
          <SelectItem value="in_progress">En progreso</SelectItem>
          <SelectItem value="completed">Completado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
