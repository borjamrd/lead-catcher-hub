
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useStudySessionStore } from "@/stores/useStudySessionStore";

interface StudySessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
}

export function StudySessionModal({
  open,
  onOpenChange,
  onStart,
}: StudySessionModalProps) {
  const [selectedSound, setSelectedSound] = useState("none");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startSession = useStudySessionStore((state) => state.startSession);

  const { data: sounds = [], isLoading } = useQuery({
    queryKey: ["study_sounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_sounds")
        .select("value, name, url");

      if (error) throw error;

      return [
        { value: "none", label: "Sin sonido", url: null },
        ...data.map((s) => ({
          value: s.value,
          label: s.name,
          url: s.url,
        })),
      ];
    },
    staleTime: 100000 * 60 * 5,
  });

  // Handle audio playback when sound selection changes
  useEffect(() => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Only play if modal is open and a sound is selected
    if (open && selectedSound !== "none") {
      const selected = sounds.find((s) => s.value === selectedSound);
      if (selected?.url) {
        const audio = new Audio(selected.url);
        audio.loop = true;
        audio.volume = 0.4;
        audio.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        audioRef.current = audio;
      }
    }
  }, [selectedSound, sounds, open]);

  // Clean up audio when modal closes
  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [open]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle start button click
  const handleStart = () => {
    // Almacenar el estado de la sesión en el store global
    startSession(selectedSound);
    
    // Llamar al callback de inicio
    onStart();
    
    // The audio cleanup will be handled by the useEffect when open changes
  };

  // Handle dialog close via escape key or clicking outside
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-primary text-white border-primary rounded-2xl"
        style={{ maxWidth: "540px", padding: "2rem" }}
      >
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Sesión de estudio
          </DialogTitle>
          <DialogDescription className="text-lg pt-8 pb-2 text-center text-white/90">
            Si haces click en "Comenzar" activarás un temporizador y el tiempo
            quedará registrado en tu historial.
            <p className="mt-4">
              Relájate, tómate un té o una tila, activa el modo focus... ¡y a
              por ello!
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <label className="block text-lg text-center mb-3 text-white/90">
            Sonido ambiente
          </label>
          <Select
            value={selectedSound}
            onValueChange={setSelectedSound}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full bg-primary text-white border-white/20 h-12 text-base rounded-xl">
              <SelectValue placeholder="Selecciona un sonido" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {sounds.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="sm:justify-center mt-8">
          <Button
            onClick={handleStart}
            className="w-full sm:w-auto h-12 text-lg bg-white text-primary hover:bg-white/90 hover:text-primary rounded-xl"
          >
            <Brain className="mr-2 h-5 w-5" />
            Comenzar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
