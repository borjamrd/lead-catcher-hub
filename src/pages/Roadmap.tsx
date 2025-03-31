import { NodeSidebarContent } from "@/components/roadmap/NodeSidebarContent";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useQuery } from "@tanstack/react-query";
import { Edge, Node } from "@xyflow/react";
import { Map } from "lucide-react";
import { useState } from "react";

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ["roadmap", currentSelectedOppositionId],
    queryFn: async () => {
      if (!currentSelectedOppositionId) return null;
      return {
        nodes: [
          {
            id: "oposicion",
            type: "custom",
            data: {
              label: "Cuerpo de Gestión de la Administración Civil del Estado",
              type: "oposition",
              completed: false,
            },
            position: { x: 400, y: 50 },
          },
          {
            id: "bloque1",
            type: "custom",
            data: {
              label: "Organización del Estado",
              type: "block",
              completed: true,
            },
            position: { x: 100, y: 200 },
          },
          {
            id: "bloque2",
            type: "custom",
            data: {
              label: "Políticas Públicas",
              type: "block",
              completed: false,
            },
            position: { x: 400, y: 200 },
          },
          {
            id: "bloque3",
            type: "custom",
            data: {
              label: "Derecho Administrativo",
              type: "block",
              completed: false,
            },
            position: { x: 700, y: 200 },
          },
          {
            id: "tema1",
            type: "custom",
            data: {
              label: "Constitución Española",
              type: "topic",
              completed: true,
            },
            position: { x: 100, y: 350 },
          },
          {
            id: "tema2",
            type: "custom",
            data: {
              label: "Ley del Gobierno (50/1997)",
              type: "topic",
              completed: false,
            },
            position: { x: 100, y: 400 },
          },
          {
            id: "tema3",
            type: "custom",
            data: {
              label: "Evaluación de Políticas Públicas",
              type: "topic",
              completed: false,
            },
            position: { x: 400, y: 350 },
          },
          {
            id: "contenido1",
            type: "custom",
            data: {
              label: "Guía sobre Evaluación de Políticas",
              type: "content",
              completed: true,
            },
            position: { x: 400, y: 450 },
          },
          {
            id: "tema5",
            type: "custom",
            data: {
              label: "Ley 39/2015 - Procedimiento Administrativo",
              type: "topic",
              completed: false,
            },
            position: { x: 700, y: 350 },
          },
        ],
        edges: [
          { id: "e1", source: "oposicion", target: "bloque1"},
          { id: "e2", source: "oposicion", target: "bloque2"},
          { id: "e3", source: "oposicion", target: "bloque3"},
          { id: "e4", source: "bloque1", target: "tema1" },
          { id: "e5", source: "bloque1", target: "tema2" },
          { id: "e6", source: "bloque2", target: "tema3" },
          { id: "e7", source: "tema3", target: "contenido1" },
          { id: "e8", source: "bloque3", target: "tema5" },
        ],
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
          <h3 className="text-lg font-medium mb-2">
            No hay oposición seleccionada
          </h3>
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Roadmap de Estudio</h1>
      <div className="border rounded-lg bg-card overflow-hidden">
        <RoadmapFlow
          initialNodes={roadmapData.nodes}
          initialEdges={roadmapData.edges}
          onNodeClick={(id) => setSelectedNodeId(id)}
        />
      </div>
      {selectedNodeId && (
      <aside className="fixed top-0 right-0 w-2/5 h-full bg-white border-l shadow-lg z-50 p-6 overflow-y-auto">
        <NodeSidebarContent onClose={() => setSelectedNodeId(null)} nodeId={selectedNodeId} />
        
      </aside>
    )}
    </div>
  );
};

export default Roadmap;
