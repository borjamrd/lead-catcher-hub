import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOppositionStore } from "@/stores/useOppositionStore";

const fetchResources = async (oppositionId: string | null) => {
  if (!oppositionId) return [];
  const { data, error } = await supabase
    .from("opposition_resources")
    .select("resources(id, title, url)")
    .eq("opposition_id", oppositionId);

  if (error) throw new Error(error.message);
  return data.map((relation) => relation.resources);
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

  if (isLoading) return <p>Cargando recursos...</p>;
  if (error) return <p>Error al cargar los recursos: {error.message}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mis Recursos</h1>
      {resources.length > 0 ? (
        <ul>
          {resources.map((resource) => (
            <li key={resource.id}>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay recursos disponibles para esta oposición.</p>
      )}
    </div>
  );
};

export default MisRecursos;
