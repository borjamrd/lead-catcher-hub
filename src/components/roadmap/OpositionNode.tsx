import { CheckCircle } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export function OpositionNode({ data, type }: any) {
  const baseStyle = "p-4 rounded-md text-sm font-medium shadow-md border";
  const completed = data?.completed;

  const stylesByType = {
    oposition: "bg-yellow-100 border-yellow-400 text-yellow-800",
    block: "bg-blue-100 border-blue-400 text-blue-800",
    topic: "bg-green-100 border-green-400 text-green-800",
    content: "bg-gray-100 border-gray-400 text-gray-800",
  };

  const nodeStyle = stylesByType[type as keyof typeof stylesByType] || "bg-white";

  return (
    <div className={cn(baseStyle, nodeStyle, "relative")}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {completed && (
        <CheckCircle className="absolute -top-1.5 -left-1.5 h-4 w-4 text-green-600" />
      )}
      <div className="text-center">{data.label}</div>
    </div>
  );
}
