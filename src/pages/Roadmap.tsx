
import { useOppositionStore } from "@/stores/useOppositionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Map } from "lucide-react";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import { Node, Edge } from "@xyflow/react";

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  
  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ["roadmap", currentSelectedOppositionId],
    queryFn: async () => {
      if (!currentSelectedOppositionId) return null;
      
      // This is the sample data from the user request
      return {
        nodes: [
          {
            id: "1",
            type: "default",
            position: { x: 100, y: 50 },
            data: { label: "Constitución Española" }
          },
          {
            id: "2",
            type: "default",
            position: { x: 300, y: 150 },
            data: { label: "Título Preliminar" }
          },
          {
            id: "3",
            type: "default",
            position: { x: 300, y: 250 },
            data: { label: "Título I: Derechos y Deberes" }
          },
          {
            id: "4",
            type: "default",
            position: { x: 500, y: 250 },
            data: { label: "Ley 39/2015" }
          },
          {
            id: "5",
            type: "default",
            position: { x: 700, y: 250 },
            data: { label: "Ley 40/2015" }
          },
          {
            id: "6",
            type: "default",
            position: { x: 500, y: 100 },
            data: { label: "Ley de Contratos del Sector Público" }
          }
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e1-3", source: "1", target: "3" },
          { id: "e3-4", source: "3", target: "4" },
          { id: "e3-5", source: "3", target: "5" },
          { id: "e2-6", source: "2", target: "6" }
        ]
      } as RoadmapData;
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
          {[1, 2, 3].map((i) => (
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
      <h1 className="text-2xl font-bold">Roadmap de Estudio</h1>
      <div className="border rounded-lg bg-card overflow-hidden">
        <RoadmapFlow initialNodes={roadmapData.nodes} initialEdges={roadmapData.edges} />
      </div>
    </div>
  );
};

export default Roadmap;
