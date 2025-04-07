import { Skeleton } from "@/components/ui/skeleton";
import { updateBlockAndTopicsStatus } from "@/hooks/update-block-and-topic-status";
import { useBlock } from "@/hooks/use-block";
import { TopicAndBlockStatus } from "@/models/models";
import { useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { StatusSelector } from "../StatusSelector";

interface BlockContainerProps {
  blockId: string;
}

export function BlockContainer({ blockId }: BlockContainerProps) {
  const queryClient = useQueryClient();
  const { data: block, isLoading } = useBlock(blockId);

  const handleStatusChange = async (status: TopicAndBlockStatus) => {
    const error = await updateBlockAndTopicsStatus(blockId, status);

    if (!error && status === "completed") {
      confetti({ particleCount: 100 });
    }

    await queryClient.invalidateQueries({ queryKey: ["roadmap"] });
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!block) {
    return (
      <div className="text-muted-foreground">
        No se encontró información para este bloque.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatusSelector value={block.status} onChange={handleStatusChange} />
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{block.name}</h2>
      </div>

      {block.description && (
        <div className="text-muted-foreground whitespace-pre-line">
          {block.description}
        </div>
      )}
    </div>
  );
}
