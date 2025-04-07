
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface OppositionsContainerProps {
  oppositionId: string;
}

export function OppositionContainer({ oppositionId: oppositionId }: OppositionsContainerProps) {

  console.log("oppositionId", oppositionId);
  const { data: opposition, isLoading } = useQuery({
    queryKey: ["opposition_info", oppositionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oppositions")
        .select("*")
        .eq("id", oppositionId)
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

  if (!opposition) {
    return <div className="text-muted-foreground">No se encontró información de la oposición.</div>;
  }

 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{opposition.name}</h2>
      </div>
      
      {opposition.description && (
        <div className="text-muted-foreground whitespace-pre-line">
          {opposition.description}
        </div>
      )}
    </div>
  );
}
