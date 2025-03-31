
import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

interface RoadmapNode {
  title: string;
  items: string[];
  completed?: boolean;
}

interface RoadmapData {
  title: string;
  nodes: RoadmapNode[];
}

interface RoadmapMindMapProps {
  data: RoadmapData;
}

const RoadmapMindMap = ({ data }: RoadmapMindMapProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    data.nodes.reduce((acc, node) => ({ ...acc, [node.title]: false }), {})
  );

  const toggleNode = (title: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="min-w-[1000px] p-4">
      <div className="flex justify-center mb-10">
        <div className="bg-yellow-300 text-black font-bold px-6 py-3 rounded-lg border-2 border-yellow-400 shadow-md">
          {data.title}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-28 gap-y-10">
        {data.nodes.map((node, index) => (
          <div key={node.title} className="flex flex-col items-center w-[300px]">
            <div className="relative">
              {/* Connection line to center */}
              <div className="absolute top-1/2 left-1/2 w-24 h-1 bg-blue-500 -translate-x-full -translate-y-1/2"></div>
              
              {/* Node */}
              <div 
                className={`relative flex justify-between items-center px-4 py-3 rounded-lg border-2 shadow-md cursor-pointer ${
                  node.completed 
                    ? "bg-green-100 border-green-300" 
                    : "bg-yellow-100 border-yellow-300"
                }`}
                onClick={() => toggleNode(node.title)}
              >
                {node.completed && (
                  <div className="absolute -left-2 -top-2 bg-green-500 text-white rounded-full p-0.5">
                    <Check size={16} />
                  </div>
                )}
                <span className="font-semibold pr-2">{node.title}</span>
                {expandedNodes[node.title] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {/* Items */}
            {expandedNodes[node.title] && (
              <div className="mt-3 flex flex-col gap-2">
                {node.items.map((item, itemIndex) => (
                  <div 
                    key={item} 
                    className="relative flex items-center"
                  >
                    {/* Connection line to parent */}
                    <div className="absolute top-0 left-1/2 w-1 h-3 bg-blue-400 -translate-x-1/2 -translate-y-3"></div>
                    
                    <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapMindMap;
