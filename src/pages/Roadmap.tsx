
import { useOppositionStore } from "@/stores/useOppositionStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import RoadmapMindMap from "@/components/roadmap/RoadmapMindMap";

interface RoadmapNode {
  title: string;
  items: string[];
  completed?: boolean;
}

interface RoadmapData {
  title: string;
  nodes: RoadmapNode[];
}

const Roadmap = () => {
  const { currentSelectedOppositionId } = useOppositionStore();
  
  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ["roadmap", currentSelectedOppositionId],
    queryFn: async () => {
      if (!currentSelectedOppositionId) return null;
      
      // In a real application, you would fetch the roadmap data from Supabase
      // For now, we'll return demo data
      return {
        title: "Oposiciones - Administración General del Estado",
        nodes: [
          {
            title: "Constitución Española",
            items: [
              "Título Preliminar",
              "Título I: Derechos y Deberes Fundamentales",
              "Título II: Corona",
              "Título III: Cortes Generales",
              "Título IV: Gobierno",
              "Título VIII: Organización Territorial del Estado"
            ],
            completed: true
          },
          {
            title: "Ley 39/2015 del Procedimiento Administrativo Común",
            items: [
              "Ámbito de aplicación",
              "Términos y plazos",
              "Iniciación del procedimiento",
              "Instrucción",
              "Terminación",
              "Revisión de actos administrativos"
            ],
            completed: false
          },
          {
            title: "Ley 40/2015 del Régimen Jurídico del Sector Público",
            items: [
              "Principios de actuación",
              "Órganos de las Administraciones Públicas",
              "Funcionamiento electrónico",
              "Responsabilidad patrimonial"
            ],
            completed: false
          },
          {
            title: "Ley 9/2017 de Contratos del Sector Público",
            items: [
              "Objeto y ámbito",
              "Tipos de contratos",
              "Procedimientos de adjudicación",
              "Ejecución y efectos de los contratos"
            ],
            completed: false
          },
          {
            title: "Unión Europea",
            items: [
              "Instituciones",
              "Tratados y fuentes del Derecho",
              "Competencias",
              "Funcionamiento institucional"
            ],
            completed: false
          },
          {
            title: "Función Pública",
            items: [
              "Estatuto Básico del Empleado Público",
              "Derechos y deberes",
              "Régimen disciplinario",
              "Selección y acceso"
            ],
            completed: false
          }
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
      <h1 className="text-2xl font-bold">{roadmapData.title}</h1>
      <div className="overflow-auto">
        <RoadmapMindMap data={roadmapData} />
      </div>
    </div>
  );
};

export default Roadmap;
