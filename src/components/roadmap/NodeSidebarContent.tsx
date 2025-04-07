import { BlockContainer } from "./BlockContainer";
import { TopicContainer } from "./TopicContainer";

interface NodeSidebarContentProps {
  node: { nodeId: string; nodeType: string };
  onClose: () => void;
}

export function NodeSidebarContent({
  node: node,
  onClose,
}: NodeSidebarContentProps) {

  const { nodeId, nodeType } = node;

  const topicId = nodeId.split("topic-")[1];
  const blockId = nodeId.split("block-")[1];


  return (
    <div className="relative">
      <div className="">
        {nodeType === "topic" && <TopicContainer topicId={topicId} />}
        {nodeType === "block" && <BlockContainer blockId={blockId} />}
        {nodeType !== "topic" &&
          nodeType !== "block" &&
          nodeType !== "opposition" && (
            <div className="text-muted-foreground">
              Selecciona un bloque o tema para ver más información.
            </div>
          )}
      </div>
    </div>
  );
}
