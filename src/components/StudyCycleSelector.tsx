import { useState } from "react";
import { useStudyCycles } from "@/hooks/use-study-cycle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  oppositionId: string;
  onCycleSelect?: (cycleId: string) => void;
}

const StudyCycleSelector = ({ oppositionId, onCycleSelect }: Props) => {
  const { data: cycles, isLoading } = useStudyCycles(oppositionId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setSelectedId(value);
    onCycleSelect(value);
  };

  return (
    <div className="w-full max-w-sm">
      {cycles?.length ? (
        <Select
          value={selectedId || ""}
          onValueChange={handleChange}
          disabled={isLoading || !cycles?.length}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una vuelta" />
          </SelectTrigger>
          <SelectContent>
            {cycles?.map((cycle) => (
              <SelectItem key={cycle.id} value={cycle.id}>
                Vuelta #{cycle.cycle_number} —{" "}
                {new Date(cycle.started_at).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-gray-500 text-xs mt-1 text-center">
          No hay ciclos de estudio disponibles
        </div>
      )}
      {isLoading && <div className="text-gray-500 text-sm">Cargando...</div>}
    </div>
  );
};

export default StudyCycleSelector;
