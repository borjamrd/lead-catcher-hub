import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";

interface Opposition {
  id: string;
  name: string;
}

interface OpositionSelectProps {
  user?: User;
  onSelect: (oppositionId: string) => void;
  onConfirm: () => void;
}

const OpositionSelect = ({ onSelect, onConfirm, user }: OpositionSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpposition, setSelectedOpposition] =
    useState<Opposition | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const { data: oppositions, isLoading } = useQuery({
    queryKey: ["oppositions", debouncedSearchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oppositions")
        .select("id, name")
        .ilike("name", `%${debouncedSearchTerm}%`)
        .order("name");
  
      if (error) throw error;
      return data;
    },
    enabled: !!debouncedSearchTerm,
    staleTime: 1000 * 60 * 10
  });
  
  const handleOppositionSelect = (opposition: Opposition) => {
    setSelectedOpposition(opposition);
    onSelect(opposition.id);
  };

  const handleConfirm = async () => {
    if (!selectedOpposition || !user) return;
  
    try {
      // 1. Asociar usuario con la oposición
      await supabase
        .from("user_oppositions")
        .insert({
          user_id: user.id,
          opposition_id: selectedOpposition.id,
          enrolled_at: new Date(),
        });
  
      await supabase
        .from("study_cycles")
        .insert({
          user_id: user.id,
          opposition_id: selectedOpposition.id,
          cycle_number: 1
        });
  
      // 4. Continuar flujo
      onConfirm();
    } catch (error) {
      console.error("Error durante la confirmación de oposición:", error);
    }
  };
  

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Buscar oposición..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto border rounded-md">
        {!debouncedSearchTerm ? (
          <div className="flex items-center justify-center h-40 text-gray-400">
            Comienza a escribir para buscar oposiciones
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400">
            Cargando oposiciones...
          </div>
        ) : oppositions && oppositions.length > 0 ? (
          <ul className="divide-y">
            {oppositions.map((opposition) => (
              <li
                key={opposition.id}
                onClick={() => handleOppositionSelect(opposition)}
                className={cn(
                  "p-3 hover:bg-gray-50 cursor-pointer",
                  selectedOpposition?.id === opposition.id && "bg-indigo-50"
                )}
              >
                {opposition.name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400">
            No se encontraron oposiciones
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleConfirm}
          disabled={!selectedOpposition}
          className="w-full"
        >
          Confirmar selección
        </Button>
      </div>
    </div>
  );
};

export default OpositionSelect;
