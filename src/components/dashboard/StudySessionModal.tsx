
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-primary text-white border-primary"
        style={{ maxWidth: "500px" }}
      >
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Sesión de estudio
          </DialogTitle>
          <DialogDescription className="text-lg pt-6 text-center text-white/90">
            Si haces click en "Comenzar" activarás un temporizador y el tiempo quedará registrado en tu historial.
            <p className="mt-4">
              Relájate, tómate un té o una tila, activa el modo focus... ¡y a por ello!
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label className="block text-lg text-center mb-2 text-white/90">
            Sonido ambiente
          </label>
          <Select defaultValue="none">
            <SelectTrigger className="w-full bg-primary text-white border-white/20 h-12 text-base">
              <SelectValue placeholder="Selecciona un sonido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin sonido</SelectItem>
              <SelectItem value="waves">Olas del atlántico</SelectItem>
              <SelectItem value="cabin">Cabaña en Cazorla</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter className="sm:justify-center mt-6">
          <Button 
            onClick={onStart} 
            className="w-full sm:w-auto h-12 text-lg bg-white text-primary hover:bg-white/90 hover:text-primary"
          >
            <Brain className="mr-2 h-5 w-5" />
            Comenzar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
