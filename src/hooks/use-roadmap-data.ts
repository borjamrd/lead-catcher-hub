import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Node, Edge } from "@xyflow/react";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { useAuth } from "@/contexts/AuthContext";

export function useRoadmapData(oppositionId: string | null) {
  const { currentSelectedOpposition } = useOppositionStore();
  const { user } = useAuth(); // Asumimos que este hook te da el usuario autenticado

  return useQuery({
    queryKey: ["roadmap", oppositionId, user?.id],
    enabled: !!oppositionId && !!user,
    queryFn: async () => {
      // 1. Obtener el ciclo actual del usuario
      const { data: cycle, error: cycleError } = await supabase
        .from("user_study_cycles")
        .select("id")
        .eq("user_id", user.id)
        .eq("opposition_id", oppositionId)
        .order("cycle_number", { ascending: false })
        .limit(1)
        .single();

      if (cycleError || !cycle) throw cycleError || new Error("No cycle found");

      const cycleId = cycle.id;

      // 2. Obtener los bloques con su status y datos base
      const { data: userBlocks, error: blocksError } = await supabase
        .from("user_blocks")
        .select("status, block:blocks(id, name, position)")
        .eq("study_cycle_id", cycleId);

      if (blocksError || !userBlocks)
        throw blocksError || new Error("No blocks found");

      const blocks = userBlocks
        .map((ub) => ({
          id: ub.block.id,
          name: ub.block.name,
          position: ub.block.position,
          status: ub.status,
        }))
        .sort((a, b) => a.position - b.position);

      const blockIds = blocks.map((b) => b.id);

      // 3. Obtener los temas con su status y datos base
      const { data: userTopics, error: topicsError } = await supabase
        .from("user_topics")
        .select("status, topic:topics(id, name, block_id, position)")
        .eq("study_cycle_id", cycleId);

      if (topicsError || !userTopics)
        throw topicsError || new Error("No topics found");

      const topics = userTopics
        .map((ut) => ({
          id: ut.topic.id,
          name: ut.topic.name,
          block_id: ut.topic.block_id,
          position: ut.topic.position,
          status: ut.status,
        }))
        .sort((a, b) => a.position - b.position);

      // 4. Construir nodos
      const nodes: Node[] = [
        {
          id: "opposition",
          type: "custom",
          data: {
            label: currentSelectedOpposition || "Oposición",
            type: "oposition",
            status: "in_progress",
          },
          position: { x: 0, y: 0 },
        },
        ...blocks.map((block) => ({
          id: `block-${block.id}`,
          type: "custom",
          data: {
            label: block.name,
            type: "block",
            status: block.status,
          },
          position: { x: 0, y: 0 },
        })),
        ...topics.map((topic) => ({
          id: `topic-${topic.id}`,
          type: "custom",
          data: {
            label: topic.name,
            type: "topic",
            status: topic.status,
          },
          position: { x: 0, y: 0 },
        })),
      ];

      // 5. Construir conexiones
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
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
