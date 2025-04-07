
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

export function TestTimer() {
  const { isTimerRunning, toggleTimer } = useCurrentTestState();
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
  return (
    <div className="bg-muted/30 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono">{formatTime(seconds)}</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => toggleTimer()}
            className="gap-1"
          >
            {isTimerRunning ? (
              <>
                <Pause className="h-4 w-4" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Reanudar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
