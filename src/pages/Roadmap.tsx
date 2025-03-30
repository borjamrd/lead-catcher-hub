
import { useOppositionStore } from "@/stores/useOppositionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Map } from "lucide-react";

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  
  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ["roadmap", currentSelectedOppositionId],
    queryFn: async () => {
      if (!currentSelectedOppositionId) return null;
      
      // In a real application, you would fetch the roadmap data from Supabase
      // For now, we'll return demo data
      return {
        title: "Plan de estudios",
        description: "Tu hoja de ruta personalizada para preparar la oposición",
        stages: [
          { id: "1", title: "Fundamentos", status: "completed", duration: "4 semanas" },
          { id: "2", title: "Conceptos intermedios", status: "in-progress", duration: "8 semanas" },
          { id: "3", title: "Temas avanzados", status: "pending", duration: "10 semanas" },
          { id: "4", title: "Repaso y simulacros", status: "pending", duration: "6 semanas" },
        ]
      };
    },
    enabled: !!currentSelectedOppositionId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentSelectedOppositionId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Roadmap</h1>
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
          <Map className="h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No hay oposición seleccionada</h3>
          <p className="text-muted-foreground">
            Selecciona una oposición para ver tu roadmap personalizado.
          </p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Roadmap</h1>
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
          <Map className="h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No hay datos disponibles</h3>
          <p className="text-muted-foreground">
            No se encontró un roadmap para esta oposición.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{roadmapData.title}</h1>
        <p className="text-muted-foreground">{roadmapData.description}</p>
      </div>

      <div className="space-y-4">
        {roadmapData.stages.map((stage, index) => (
          <div 
            key={stage.id} 
            className={`relative p-6 border rounded-lg ${
              stage.status === "completed" 
                ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                : stage.status === "in-progress" 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                  : "border-muted-foreground/20"
            }`}
          >
            {index < roadmapData.stages.length - 1 && (
              <div className="absolute bottom-0 left-8 w-1 h-4 bg-muted-foreground/20 z-0"></div>
            )}
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${
                stage.status === "completed" 
                  ? "bg-green-500 text-white" 
                  : stage.status === "in-progress" 
                    ? "bg-blue-500 text-white" 
                    : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{stage.title}</h3>
                    <p className="text-sm text-muted-foreground">Duración estimada: {stage.duration}</p>
                  </div>
                  <div className={`px-3 py-1 text-xs rounded-full ${
                    stage.status === "completed" 
                      ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                      : stage.status === "in-progress" 
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {stage.status === "completed" 
                      ? "Completado" 
                      : stage.status === "in-progress" 
                        ? "En progreso" 
                        : "Pendiente"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
