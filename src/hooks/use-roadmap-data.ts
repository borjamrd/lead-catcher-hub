// hooks/useRoadmapData.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node, Edge } from "@xyflow/react";
import { useOppositionStore } from "@/stores/useOppositionStore";

export function useRoadmapData(oppositionId: string | null) {
  const { currentSelectedOpposition, currentSelectedOppositionId } =
    useOppositionStore();
  return useQuery({
    queryKey: ["roadmap", oppositionId],
    enabled: !!oppositionId,
    queryFn: async () => {
      const blocksRes = await supabase
        .from("blocks")
        .select("id, name, position, status")
        .eq("opposition_id", oppositionId);

      if (blocksRes.error) throw blocksRes.error;

      // Ordenar los bloques por el campo 'position'
      const blocks = blocksRes.data.sort((a, b) => a.position - b.position);
      const blockIds = blocks.map((b) => b.id);

      const topicsRes = await supabase
        .from("topics")
        .select("id, name, block_id, position, status")
        .in("block_id", blockIds);

      if (topicsRes.error) throw topicsRes.error;

      // Ordenar los temas por el campo 'position'
      const topics = topicsRes.data.sort((a, b) => a.position - b.position);

      const nodes: Node[] = [
        {
          id: "opposition",
          type: "custom",
          data: {
            label: currentSelectedOpposition || "Oposición",
            type: "oposition",
            status: 'in_progress',
          },
          position: { x: 0, y: 0 },
        },
        ...blocks.map((block, index) => ({
          id: `block-${block.id}`,
          type: "custom",
          data: {
            label: block.name,
            type: "block",
            status: block.status,
          },
          // Asignamos una posición para separar verticalmente cada bloque (ajusta los valores según necesites)
          position: { x: 0, y: 0  },
        })),
        ...topics.map((topic, index) => ({
          id: `topic-${topic.id}`,
          type: "custom",
          data: {
            label: topic.name,
            type: "topic",
            status: topic.status,
          },
          // Asignamos una posición para separar verticalmente cada tema
          position:{ x: 0, y: 0  },
        })),
      ];

      const edges: Edge[] = [
        ...blocks.map((block) => ({
          id: `edge-oppo-block-${block.id}`,
          source: "opposition",
          target: `block-${block.id}`,
        })),
        ...topics.map((topic) => ({
          id: `edge-block-topic-${topic.id}`,
          source: `block-${topic.block_id}`,
          target: `topic-${topic.id}`,
        })),
      ];

      return { nodes, edges };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
