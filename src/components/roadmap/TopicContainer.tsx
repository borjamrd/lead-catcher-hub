import { Skeleton } from "@/components/ui/skeleton";
import { updateTopicStatus } from "@/hooks/update-topic-status";
import { useTopic } from "@/hooks/use-topic";
import { TopicAndBlockStatus } from "@/models/models";
import { useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { StatusSelector } from "../StatusSelector";
import { useAuth } from "@/contexts/AuthContext";

interface TopicContainerProps {
  topicId: string;
}

export function TopicContainer({ topicId }: TopicContainerProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: topic, isLoading } = useTopic(topicId);

  const handleStatusChange = async (newStatus: TopicAndBlockStatus) => {
    const error = await updateTopicStatus(user.id, topicId, newStatus);
    if (error) return;

    if (newStatus === "completed") confetti({ particleCount: 100 });
    await queryClient.invalidateQueries({ queryKey: ["roadmap"] });
    topic.status = newStatus;
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

  if (!topic) {
    return (
      <div className="text-muted-foreground">
        No se encontró información para este tema.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatusSelector value={topic.status} onChange={handleStatusChange} />
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{topic.name}</h2>
      </div>

      {topic.description && (
        <div className="text-muted-foreground whitespace-pre-line">
          {topic.description}
        </div>
      )}
    </div>
  );
}
