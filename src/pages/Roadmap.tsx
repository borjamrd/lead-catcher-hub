import { NodeSidebarContent } from "@/components/roadmap/NodeSidebarContent";
import RoadmapFlow from "@/components/roadmap/RoadmapFlow";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoadmapData } from "@/hooks/use-roadmap-data";
import { cn } from "@/lib/utils";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { CheckCircle, Map } from "lucide-react";
import { useState } from "react";

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  const [selectedNode, setSelectedNode] = useState<{
    nodeId: string;
    nodeType: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: roadmapData, isLoading } = useRoadmapData(
    currentSelectedOppositionId
  );

  const handleNodeClick = ({
    nodeId,
    nodeType,
  }: {
    nodeId: string;
    nodeType: string;
  }) => {
    setSelectedNode({
      nodeId,
      nodeType,
    });
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

  const baseStyle =
    "px-1.5 py-1 rounded-md text-xs font-medium shadow-md border flex items-center gap-3";

  const LegendStatus = () => {
    return (
      <div className="flex gap-4 flex-wrap mb-5">
        <div
          className={cn(baseStyle, "bg-gray-100 text-gray-400 border-gray-300")}
        >
          <span className="">No comenzado</span>
        </div>

        <div
          className={cn(baseStyle, "bg-blue-100 text-blue-800 border-blue-400")}
        >
          <span className="">En progreso</span>
        </div>

        <div
          className={cn(
            baseStyle,
            "bg-green-100 text-green-800 border-green-400 line-through relative"
          )}
        >
          <CheckCircle className="absolute -top-1.5 -left-1.5 h-4 w-4 text-green-600" />
          <span className="">Completado</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roadmap de Estudio</h1>
      <LegendStatus />
      <div className="border rounded-lg bg-card overflow-hidden">
        <RoadmapFlow
          initialNodes={roadmapData.nodes}
          initialEdges={roadmapData.edges}
          onNodeClick={handleNodeClick}
        />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="w-2/5 overflow-y-auto p-6">
          {selectedNode && (
            <NodeSidebarContent
              onClose={handleSidebarClose}
              node={selectedNode}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Roadmap;
