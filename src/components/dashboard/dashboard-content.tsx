import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStudySessionStore } from "@/stores/useStudySessionStore";
import {
  Award,
  Calendar,
  Clock,
  FlameIcon,
  PauseCircle,
  PlayCircle,
  Rocket,
  Search,
  StopCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnkiCard } from "./AnkiCard";
import { StudySessionModal } from "./StudySessionModal";
import { TuProgreso } from "./TuProgreso";

export function DashboardContent() {
  const [showStudyModal, setShowStudyModal] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Obtenemos estado y acciones del store
  const {
    isActive: studySessionActive,
    isPaused: studySessionPaused,
    selectedSound,
    pauseSession,
    resumeSession,
    endSession,
    updateElapsedTime,
    elapsedSeconds,
  } = useStudySessionStore();

  // Control audio playback based on session state
  useEffect(() => {
    if (studySessionActive && !studySessionPaused && selectedSound !== "none") {
      // Buscar la URL del sonido seleccionado y reproducirlo
      // En una aplicación real, esto podría requerir una consulta a la base de datos
      // para obtener la URL correcta basada en selectedSound

      const loadAndPlayAudio = async () => {
        try {
          // Aquí deberíamos obtener la URL real del sonido desde la base de datos
          // Por ahora, simularemos tener la URL
          const { data } = await supabase
            .from("study_sounds")
            .select("url")
            .eq("value", selectedSound)
            .single();

          if (data?.url) {
            if (audioRef.current) {
              audioRef.current.pause();
            }

            const audio = new Audio(data.url);
            audio.loop = true;
            audio.volume = 0.4;
            audio.play().catch((error) => {
              console.error("Error playing audio:", error);
            });
            audioRef.current = audio;
          }
        } catch (error) {
          console.error("Error fetching sound URL:", error);
        }
      };

      if (selectedSound !== "none") {
        loadAndPlayAudio();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [studySessionActive, studySessionPaused, selectedSound]);

  // Update elapsed time counter
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (studySessionActive && !studySessionPaused) {
      interval = setInterval(() => {
        updateElapsedTime(elapsedSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    studySessionActive,
    studySessionPaused,
    elapsedSeconds,
    updateElapsedTime,
  ]);

  // Event listener for opening the study modal from navbar
  useEffect(() => {
    const handleOpenStudyModal = () => {
      setShowStudyModal(true);
    };

    document.addEventListener("open-study-modal", handleOpenStudyModal);

    return () => {
      document.removeEventListener("open-study-modal", handleOpenStudyModal);
    };
  }, []);

  const handleStartStudySession = () => {
    // La lógica de inicio ahora está en el componente modal
    // Este método ahora solo se usa para configurar el UI
    toast({
      title: "Sesión de estudio iniciada",
      description: "El temporizador está activo. ¡Buena suerte!",
    });
    setShowStudyModal(false);
  };

  const handlePauseStudy = () => {
    pauseSession();
    toast({
      title: "Sesión de estudio pausada",
      description: "Puedes continuar cuando estés listo.",
    });
  };

  const handleResumeStudy = () => {
    resumeSession();
    toast({
      title: "Sesión de estudio reanudada",
      description: "¡Continúa con tu estudio!",
    });
  };

  const handleFinishStudy = () => {
    endSession();

    // Ensure audio is stopped when study session is finished
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    toast({
      title: "Sesión de estudio finalizada",
      description: "¡Buen trabajo! Has completado tu sesión de estudio.",
    });
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Grid layout for the dashboard */}
      <div className="flex gap-6 mb-6">
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
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Resumen del Progreso - 5 columns, spans 2 rows */}
        <TuProgreso />

        {/* Botón empezar sesión de estudio */}
        {!studySessionActive ? (
          <Card
            className="col-span-4  hover:bg-muted/50 transition-colors cursor-pointer"
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
          <Card className="col-span-4 ">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-6 w-6" />
                Controles de estudio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-2">
                {studySessionPaused ? (
                  <Button
                    onClick={handleResumeStudy}
                    size="sm"
                    className="px-4"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continuar
                  </Button>
                ) : (
                  <Button
                    onClick={handlePauseStudy}
                    size="sm"
                    className="px-4"
                    variant="outline"
                  >
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
        <Card className="col-span-4">
          <CardContent className="space-y-4 mt-3">
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
