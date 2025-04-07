
import { X } from "lucide-react";
import { TopicContainer } from "./TopicContainer";
import { BlockContainer } from "./BlockContainer";

interface NodeSidebarContentProps {
  nodeId: string;
  onClose: () => void;
}

export function NodeSidebarContent({
  nodeId,
  onClose,
}: NodeSidebarContentProps) {
  // Extract the node type and ID from the nodeId format
  // Node IDs come in the format "type-actualId" (e.g., "topic-123" or "block-456")
  const [nodeType, actualId] = nodeId.split('-');

  return (
    <div className="relative p-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mt-6">
        {nodeType === "topic" && <TopicContainer topicId={actualId} />}
        {nodeType === "block" && <BlockContainer blockId={actualId} />}
        {nodeType !== "topic" && nodeType !== "block" && (
          <div className="text-muted-foreground">
            Selecciona un bloque o tema para ver más información.
          </div>
        )}
      </div>
    </div>
  );
}
