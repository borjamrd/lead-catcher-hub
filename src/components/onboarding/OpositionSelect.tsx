
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Opposition {
  id: string;
  name: string;
}

interface OpositionSelectProps {
  onSelect: (oppositionId: string) => void;
  onConfirm: () => void;
}

const OpositionSelect = ({ onSelect, onConfirm }: OpositionSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpposition, setSelectedOpposition] = useState<Opposition | null>(null);
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
      let query = supabase
        .from("oppositions")
        .select("id, name");
      
      if (debouncedSearchTerm) {
        query = query.ilike("name", `%${debouncedSearchTerm}%`);
      }
      
      query = query.order("name");
      
      const { data, error } = await query;

      if (error) throw error;
      return data as Opposition[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleOppositionSelect = (opposition: Opposition) => {
    setSelectedOpposition(opposition);
    onSelect(opposition.id);
  };

  const handleConfirm = () => {
    if (selectedOpposition) {
      onConfirm();
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
        {isLoading ? (
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
