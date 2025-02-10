
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InputBlock from "@/components/Blocks/InputBlock";

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
      <div className="space-y-4">
        {blocks?.map((block) => (
          <div key={block.id}>
            {block.type === "text" ? (
              <InputBlock
                id={block.id}
                content={block.content}
                noteId={id!}
                position={block.position}
              />
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(block, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleApunte;
