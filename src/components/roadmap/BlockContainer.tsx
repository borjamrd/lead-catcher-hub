
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface BlockContainerProps {
  blockId: string;
}

export function BlockContainer({ blockId }: BlockContainerProps) {
  const { data: block, isLoading } = useQuery({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("id", blockId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!block) {
    return <div className="text-muted-foreground">No se encontró información para este bloque.</div>;
  }

  const getStatusBadge = () => {
    switch (block.status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En progreso</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{block.name}</h2>
        {getStatusBadge()}
      </div>
      
      {block.description && (
        <div className="text-muted-foreground whitespace-pre-line">
          {block.description}
        </div>
      )}
    </div>
  );
}
