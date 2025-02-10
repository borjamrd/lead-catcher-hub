
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InputBlock from "@/components/Blocks/InputBlock";
import { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { Loader, Check } from "lucide-react";

type Block = Database['public']['Tables']['blocks']['Row'];

const DetalleApunte = () => {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSaveStart = () => {
    setIsSaving(true);
  };

  const handleSaveEnd = () => {
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Cargando bloques...</p>
      </div>
    );
  }

  return (
    <div className="p-8 relative">
      <div className="absolute top-4 right-4">
        {isSaving && <Loader className="h-5 w-5 animate-spin" />}
        {showSuccess && <Check className="h-5 w-5 text-green-500" />}
      </div>
      <h1 className="text-2xl font-bold mb-4">Detalle del apunte</h1>
      <div className="space-y-4">
        {blocks?.map((block) => (
          <div key={block.id}>
            {block.type === "text" && block.content && typeof block.content === 'object' && 'text' in block.content ? (
              <InputBlock
                id={block.id}
                content={block.content as { text: string }}
                noteId={id!}
                position={block.position}
                onSaveStart={handleSaveStart}
                onSaveEnd={handleSaveEnd}
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
