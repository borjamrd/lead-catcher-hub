import {
  Background,
  ConnectionLineType,
  Controls,
  Edge,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { OpositionNode } from "./OpositionNode";

import ELK from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

interface RoadmapFlowProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (nodeId: string) => void;
}

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: "RIGHT" | "DOWN" = "DOWN"
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const isHorizontal = direction === "RIGHT";

  const graph = {
    id: "root",
    layoutOptions: {
      "elk.direction": direction,
      ...elkOptions,
    },
    children: nodes.map((node) => ({
      ...node,
      sourcePosition: isHorizontal ? "right" : "top",
      targetPosition: isHorizontal ? "left" : "bottom",
      width: 253,
      height: 120,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
      ...edge,
    })),
    
  };

  

  const layout = await elk.layout(graph);

  return {
    nodes: layout.children.map((node: any) => ({
      ...node,
      position: { x: node.x, y: node.y },
    })),
    edges: layout.edges,
  };
};

const RoadmapFlow = ({
  initialNodes,
  initialEdges,
  onNodeClick,
}: RoadmapFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length && initialEdges.length) {
      getLayoutedElements(initialNodes, initialEdges, "DOWN").then(
        ({ nodes, edges }) => {
          setNodes(nodes);
          setEdges(edges);
        }
      );
    }
  }, [initialNodes, initialEdges]);

  const onLayout = useCallback(
    (direction: "DOWN" | "RIGHT") => {
      getLayoutedElements(nodes, edges, direction).then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
      });
    },
    [nodes, edges]
  );

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          custom: OpositionNode,
        }}
        className="bg-white"
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          animated: false,
          type: "smoothstep",
          style: { stroke: "#334155", strokeWidth: 2 },
        }}
        nodeOrigin={[0, 0]}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        zoomOnPinch={false}
      >
        <Controls />
        <Background />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={() => onLayout("DOWN")}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Vertical
            </button>
            <button
              onClick={() => onLayout("RIGHT")}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Horizontal
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default RoadmapFlow;
