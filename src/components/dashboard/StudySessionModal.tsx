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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const selected = sounds.find((s) => s.value === selectedSound);
    if (selected?.url) {
      const audio = new Audio(selected.url);
      audio.loop = true;
      audio.volume = 0.4;
      audio.play();
      audioRef.current = audio;
    }
  }, [selectedSound, sounds]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={onStart}
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
