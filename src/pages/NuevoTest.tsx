
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, PauseCircle, PlayCircle, StopCircle } from "lucide-react";

const NuevoTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setStartTime(new Date());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sesión de estudio</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-6 w-6" />
            Temporizador de estudio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="text-5xl font-bold tabular-nums">
              {formatTime(time)}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="px-6">
                <PlayCircle className="mr-2 h-5 w-5" />
                {startTime ? 'Continuar' : 'Iniciar'}
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" className="px-6" variant="outline">
                <PauseCircle className="mr-2 h-5 w-5" />
                Pausar
              </Button>
            )}
            
            <Button 
              onClick={handleReset} 
              size="lg" 
              className="px-6" 
              variant="destructive"
              disabled={!startTime}
            >
              <StopCircle className="mr-2 h-5 w-5" />
              Finalizar
            </Button>
          </div>

          {startTime && (
            <div className="text-center text-sm text-muted-foreground">
              Sesión iniciada a las {startTime.toLocaleTimeString()}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Badge variant="outline" className="text-base px-4 py-2">
              Tu racha actual: 7 días
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NuevoTest;
