
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Award,
  Calendar,
  Clock,
  FlameIcon,
  PauseCircle,
  PlayCircle,
  Rocket,
  Search,
  Settings,
  StopCircle
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnkiCard } from "./AnkiCard";
import { StudySessionModal } from "./StudySessionModal";

export function DashboardContent() {
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [studySessionStarted, setStudySessionStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  
  // Control audio playback based on isStudyActive state
  useEffect(() => {
    if (isStudyActive && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isStudyActive]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isStudyActive) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isStudyActive]);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock data
  const progressData = {
    temarioCompletado: 65,
    testsRealizados: 78,
    testsAprobados: 82,
    rachaEstudio: 7,
    tiempoEstudioSemana: "12h 30m",
  };

  const revisionData = {
    repasos: [
      {
        id: 1,
        titulo: "Principios Constitucionales",
        fecha: "Hoy",
        prioridad: "Alta",
      },
      {
        id: 2,
        titulo: "Procedimiento Administrativo",
        fecha: "Mañana",
        prioridad: "Media",
      },
      {
        id: 3,
        titulo: "Derecho Comunitario",
        fecha: "3 días",
        prioridad: "Baja",
      },
    ],
    preguntasFalladas: [
      {
        id: 1,
        pregunta:
          "¿Cuáles son los plazos en el procedimiento administrativo común?",
        tema: "Procedimiento",
      },
      {
        id: 2,
        pregunta: "¿Qué establece el artículo 14 de la Constitución?",
        tema: "Constitución",
      },
    ],
  };

  const motivacionData = {
    logros: [
      {
        id: 1,
        titulo: "7 días seguidos estudiando",
        icono: <FlameIcon className="h-5 w-5 text-orange-500" />,
      },
      {
        id: 2,
        titulo: "50 tests completados",
        icono: <Award className="h-5 w-5 text-yellow-500" />,
      },
      {
        id: 3,
        titulo: "100 horas de estudio",
        icono: <Clock className="h-5 w-5 text-blue-500" />,
      },
    ],
   
  };

  const handleStartStudySession = () => {
    setIsStudyActive(true);
    setStudySessionStarted(true);
    setStartTime(new Date());
    toast({
      title: "Sesión de estudio iniciada",
      description: "El temporizador está activo. ¡Buena suerte!",
    });
    setShowStudyModal(false);
  };
  
  const handlePauseStudy = () => {
    setIsStudyActive(false);
    toast({
      title: "Sesión de estudio pausada",
      description: "Puedes continuar cuando estés listo.",
    });
  };
  
  const handleResumeStudy = () => {
    setIsStudyActive(true);
    toast({
      title: "Sesión de estudio reanudada",
      description: "¡Continúa con tu estudio!",
    });
  };
  
  const handleFinishStudy = () => {
    setIsStudyActive(false);
    setStudySessionStarted(false);
    setStudyTime(0);
    setStartTime(null);
    toast({
      title: "Sesión de estudio finalizada",
      description: "¡Buen trabajo! Has completado tu sesión de estudio.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Grid layout for the dashboard */}
      <div className="grid grid-cols-12 gap-6">
        {/* Resumen del Progreso - 5 columns, spans 2 rows */}
        <Card className="col-span-8 row-span-1 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl">
              📊 Tu progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  % de temario completado
                </span>
                <span className="text-sm font-semibold">
                  {progressData.temarioCompletado}%
                </span>
              </div>
              <Progress
                value={progressData.temarioCompletado}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  % de tests aprobados
                </span>
                <span className="text-sm font-semibold">
                  {progressData.testsAprobados}%
                </span>
              </div>
              <Progress value={progressData.testsAprobados} className="h-2" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <FlameIcon className="mr-2 h-5 w-5 text-orange-500" />
                <span className="font-medium">Racha actual</span>
              </div>
              <Badge variant="outline" className="font-bold">
                {progressData.rachaEstudio} días
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <span className="font-medium">Tiempo esta semana</span>
              </div>
              <Badge variant="outline" className="font-bold">
                {progressData.tiempoEstudioSemana}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Botón empezar sesión de estudio o Temporizador de estudio */}
        {!studySessionStarted ? (
          <Card 
            className="col-span-4 shadow-md hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => setShowStudyModal(true)}
          >
            <CardContent className="flex h-full items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <Rocket className="h-12 w-12 text-primary mb-2" />
                <h3 className="text-xl font-semibold">
                  Empezar sesión de estudio
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Activa el temportizador y concéntrate.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="col-span-4 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-6 w-6" />
                Temporizador de estudio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="text-4xl font-bold tabular-nums">
                  {formatTime(studyTime)}
                </div>
              </div>
              
              <div className="flex justify-center space-x-2">
                {!isStudyActive ? (
                  <Button onClick={handleResumeStudy} size="sm" className="px-4">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continuar
                  </Button>
                ) : (
                  <Button onClick={handlePauseStudy} size="sm" className="px-4" variant="outline">
                    <PauseCircle className="mr-2 h-4 w-4" />
                    Pausar
                  </Button>
                )}
                
                <Button 
                  onClick={handleFinishStudy} 
                  size="sm" 
                  className="px-4" 
                  variant="destructive"
                >
                  <StopCircle className="mr-2 h-4 w-4" />
                  Finalizar
                </Button>
              </div>

              {startTime && (
                <div className="text-center text-xs text-muted-foreground">
                  Sesión iniciada a las {startTime.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modal de sesión de estudio */}
        <StudySessionModal 
          open={showStudyModal} 
          onOpenChange={setShowStudyModal}
          onStart={handleStartStudySession}
        />

        {/* Motivación - 4 columns, spans 1 row */}
        <Card className="col-span-4 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl">
              🏆 ¡Menuda crack!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                Logros desbloqueados
              </h3>
              <div className="space-y-2">
                {motivacionData.logros.map((logro) => (
                  <div
                    key={logro.id}
                    className="flex items-center bg-muted/50 p-2 rounded-md"
                  >
                    {logro.icono}
                    <span className="ml-2 text-sm">{logro.titulo}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </CardContent>
        </Card>

        {/* Revisión Inteligente - 3 columns, spans 2 rows */}
        <Card className="col-span-8 row-span-1 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl">
              🧠 Revisión Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">
                Repasos programados
              </h3>
              <div className="space-y-2">
                {revisionData.repasos.map((repaso) => (
                  <div
                    key={repaso.id}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{repaso.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {repaso.fecha}
                      </p>
                    </div>
                    <Badge
                      variant={
                        repaso.prioridad === "Alta"
                          ? "default"
                          : repaso.prioridad === "Media"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {repaso.prioridad}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atajos útiles - ocupa las columnas restantes */}
        <Card className="col-span-4 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl">
              <Settings className="mr-2 h-6 w-6 text-primary" />
              ¿Con prisas?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-start h-16"
              >
                <Calendar className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Modo examen</div>
                  <div className="text-xs text-muted-foreground">
                    Simula un examen real
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-start h-16"
              >
                <Search className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Buscar un tema</div>
                  <div className="text-xs text-muted-foreground">
                    Encuentra contenido rápidamente
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nueva sección - Anki Card */}
        <div className="col-span-4">
          <AnkiCard 
            front="🔹 El órgano de contratación en la Administración General del Estado es el __________."
            back="🔹 Ministro del departamento correspondiente o el titular del organismo autónomo, salvo delegación."
          />
        </div>

        <Card className="col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl">
              Preguntas falladas recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {revisionData.preguntasFalladas.map((pregunta) => (
                <div key={pregunta.id} className="bg-muted/50 p-2 rounded-md">
                  <p className="text-sm">{pregunta.pregunta}</p>
                  <p className="text-xs text-muted-foreground">
                    Tema: {pregunta.tema}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
