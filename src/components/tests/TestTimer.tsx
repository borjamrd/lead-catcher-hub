
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, StopCircle } from "lucide-react";
import { useCurrentTestStore } from "@/stores/useCurrentTestStore";

export const TestTimer = () => {
  const { 
    elapsedSeconds, 
    isTimerActive, 
    pauseTimer, 
    resumeTimer, 
    finishTest 
  } = useCurrentTestStore();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="text-lg font-medium mb-2">
        Tiempo: {formatTime(elapsedSeconds)}
      </div>
      <div className="flex space-x-2">
        {isTimerActive ? (
          <Button variant="outline" onClick={pauseTimer}>
            <Pause className="h-4 w-4 mr-2" />
            Pausar
          </Button>
        ) : (
          <Button variant="outline" onClick={resumeTimer}>
            <Play className="h-4 w-4 mr-2" />
            Resumir
          </Button>
        )}
        <Button variant="default" onClick={finishTest}>
          <StopCircle className="h-4 w-4 mr-2" />
          Finalizar
        </Button>
      </div>
    </div>
  );
};
