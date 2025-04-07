import { CheckCircle } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

export function OpositionNode({ data }: any) {
  const baseStyle =
    "min-w-[220px] max-w-[260px] px-5 py-4 rounded-md text-sm font-medium shadow-md border cursor-pointer relative";

  const status = data?.status as Status | undefined;
  const type = data?.type;

  const baseColorsByType = {
    oposition: "border-yellow-400",
    block: "border-blue-400",
    topic: "border-green-400",
    content: "border-gray-400",
  };

  const styleByStatus: Record<Status, string> = {
    not_started: "bg-gray-100 text-gray-400 border-gray-300",
    in_progress:
      {
        oposition: "bg-yellow-100 text-yellow-800",
        block: "bg-blue-100 text-blue-800",
        topic: "bg-green-100 text-green-800",
        content: "bg-gray-100 text-gray-800",
      }[type] ?? "bg-white",
    completed: "bg-green-100 text-green-800 border-green-400 line-through",
  };

  const nodeStyle = status
    ? `${styleByStatus[status]} ${baseColorsByType[type] || ""}`
    : "bg-white";
  return (
    <div className={cn(baseStyle, nodeStyle)}>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      {status === "completed" && (
        <CheckCircle className="absolute -top-1.5 -left-1.5 h-4 w-4 text-green-600" />
      )}
      <div
        className={cn(
          "text-center text-3xl",
          status === "completed" && "line-through"
        )}
      >
        {data.label}
      </div>
    </div>
  );
}
