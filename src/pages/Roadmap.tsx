
import { NodeSidebarContent } from "@/components/roadmap/NodeSidebarContent";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetClose
} from "@/components/ui/sheet";
import { useRoadmapData } from "@/hooks/use-roadmap-data";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useQuery } from "@tanstack/react-query";
import { Edge, Node } from "@xyflow/react";
import { Map, X } from "lucide-react";
import { useState } from "react";

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: roadmapData, isLoading } = useRoadmapData(currentSelectedOppositionId);

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

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
          onNodeClick={handleNodeClick}
        />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-2/5 overflow-y-auto p-6">
          {selectedNodeId && (
            <NodeSidebarContent 
              onClose={handleSidebarClose}
              nodeId={selectedNodeId} 
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Roadmap;
