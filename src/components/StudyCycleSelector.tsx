import { useEffect, useState } from "react";
import { useStudyCycles } from "@/hooks/use-study-cycle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "./ui/badge";

interface Props {
  oppositionId: string;
  onCycleSelect?: (cycleId: string) => void;
}

const StudyCycleSelector = ({ oppositionId, onCycleSelect }: Props) => {
  const { data: cycles, isLoading } = useStudyCycles(oppositionId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (cycles && cycles.length > 0 && !selectedId) {
      const activeCycle = cycles.find(cycle => !cycle.completed_at);
      const defaultCycle = activeCycle ?? cycles[0];
  
      setSelectedId(defaultCycle.id);
      onCycleSelect?.(defaultCycle.id);
    }
  }, [cycles, selectedId, onCycleSelect]);
  

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
          <SelectTrigger className="mt-2 text-xs px-2 py-0">
            <SelectValue placeholder="Selecciona una vuelta" />
          </SelectTrigger>
          <SelectContent>
            {cycles?.map((cycle) => (
             <SelectItem key={cycle.id} value={cycle.id}>
             <div className="flex justify-between items-center">
               <span>Vuelta #{cycle.cycle_number}</span>
               <Badge
                 variant={cycle.completed_at ? "secondary" : "default"}
                 className="ml-2 text-xs"
               >
                 {cycle.completed_at ? "Finalizado" : "Activo"}
               </Badge>
             </div>
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
