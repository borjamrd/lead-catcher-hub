
import { useEffect, useState } from "react";
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { Button } from "@/components/ui/button";
import { Pause, Play, StopCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function TestTimer() {
  const { isTimerRunning, toggleTimer, stopExam } = useCurrentTestState();
  const [seconds, setSeconds] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    let interval: number | undefined;
    
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
  
  const handleStop = () => {
    stopExam();
    toast({
      title: "Test finalizado",
      description: `Tiempo total: ${formatTime(seconds)}`,
    });
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
        
        <Button 
          size="sm" 
          variant="destructive"
          onClick={handleStop}
          className="gap-1"
        >
          <StopCircle className="h-4 w-4" /> Finalizar examen
        </Button>
      </div>
    </div>
  );
}
