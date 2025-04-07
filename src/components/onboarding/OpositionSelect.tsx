import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";

interface Opposition {
  id: string;
  name: string;
}

interface OpositionSelectProps {
  user?: User;
  onSelect: (oppositionId: string) => void;
}

const OpositionSelect = ({
  onSelect,
  user,
}: OpositionSelectProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpposition, setSelectedOpposition] =
    useState<Opposition | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { setCurrentOppositionId } = useOppositionStore();
  const { setSelectedCycleId} = useStudyCycleStore();
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
    staleTime: 1000 * 60 * 10,
  });

  const handleOppositionSelect = (opposition: Opposition) => {
    setSelectedOpposition(opposition);
    onSelect(opposition.id);
  };

  const handleConfirm = async () => {
    if (!selectedOpposition || !user) return;

    // 1. Asociar usuario con la oposición
    const { error: error_user_oppositions } = await supabase
      .from("user_oppositions")
      .insert({
        profile_id: user.id,
        opposition_id: selectedOpposition.id,
        enrolled_at: new Date(),
        active: true,
      });

    if (error_user_oppositions) {
      toast({
        title: "Error",
        description: "No se pudo asociar el usuario con la oposición",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["active_opposition"] });

    const { data: study_cycle, error: error_study_cycles } = await supabase
      .from("study_cycles")
      .insert({
        user_id: user.id,
        opposition_id: selectedOpposition.id,
        cycle_number: 1,
      })
      .single();

    if (error_study_cycles) {
      toast({
        title: "Error",
        description: "No se pudo crear el ciclo de estudio",
        variant: "destructive",
      });
      return;
    }
    setSelectedCycleId(study_cycle.id);
    setCurrentOppositionId(selectedOpposition.id);
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
        {selectedOpposition && (
          <Button
            onClick={handleConfirm}
            disabled={!selectedOpposition}
            className="w-full"
          >
            Confirmar selección
          </Button>
        )}
      </div>
    </div>
  );
};

export default OpositionSelect;
