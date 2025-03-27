
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Sesión de estudio</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Si haces click en "Comenzar" activarás un temporizador y el tiempo quedará registrado en tu historial.
            <p className="mt-2">
              Relájate, tómate un té o una tila, activa el modo focus... ¡y a por ello!
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button onClick={onStart} className="w-full sm:w-auto">
            <Brain className="mr-2" />
            Comenzar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
