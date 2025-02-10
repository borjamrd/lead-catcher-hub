
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DetalleApunte = () => {
  const { id } = useParams();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["blocks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("note_id", id)
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Cargando bloques...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Detalle del apunte</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(blocks, null, 2)}
      </pre>
    </div>
  );
};

export default DetalleApunte;

