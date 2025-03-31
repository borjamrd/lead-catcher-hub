
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fetchResources = async (oppositionId: string | null) => {
  if (!oppositionId) return [];
  const { data, error } = await supabase
    .from("opposition_resources")
    .select("resources(id, title, url)")
    .eq("opposition_id", oppositionId);

  if (error) throw new Error(error.message);
  
  // Map and return resources safely
  return data?.map((relation) => relation.resources) || [];
};

const MisRecursos = () => {
  const { currentSelectedOppositionId } = useOppositionStore();

  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resources", currentSelectedOppositionId],
    queryFn: () => fetchResources(currentSelectedOppositionId),
    enabled: !!currentSelectedOppositionId,
  });

  if (isLoading) return <ResourcesLoading />;
  if (error) return <p className="p-8">Error al cargar los recursos: {error.message}</p>;
  if (!resources) return <p className="p-8">No se pudieron cargar los recursos.</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mis Recursos</h1>
      
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay recursos disponibles para esta oposición.</p>
      )}
    </div>
  );
};

const ResourceCard = ({ resource }: { resource: any }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium line-clamp-2">{resource.title}</h3>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center mt-2"
            >
              Ver recurso <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ResourcesLoading = () => {
  return (
    <div className="p-8">
      <Skeleton className="h-8 w-40 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-24">
            <CardContent className="p-5">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MisRecursos;
