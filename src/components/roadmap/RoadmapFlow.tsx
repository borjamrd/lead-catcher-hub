
import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

interface RoadmapFlowProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // Set nodes
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 170, height: 40 });
  });

  // Set edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(dagreGraph);

  // Get positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 85, // Center the node
        y: nodeWithPosition.y - 20,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const RoadmapFlow = ({ initialNodes, initialEdges }: RoadmapFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'TB'
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [initialNodes, initialEdges]);

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        className="bg-white"
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#334155', strokeWidth: 2 },
        }}
        nodeOrigin={[0.5, 0.5]}
        fitView
      >
        <Controls />
        <Background />
        <Panel position="top-right">
          <div className="flex gap-2">
            <button
              onClick={() => onLayout('TB')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Vertical
            </button>
            <button
              onClick={() => onLayout('LR')}
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
