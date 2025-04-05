
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

interface AnkiCardProps {
  front: string;
  back: string;
}

export function AnkiCard({ front, back }: AnkiCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: "¡Correcto!",
      description: "Has acertado esta pregunta",
      variant: "default",
    });
    
    console.log("Acertado");
  };

  const handleIncorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "Incorrecto",
      description: "Sigue practicando esta pregunta",
      variant: "destructive",
    });
    
    console.log("No acertado");
  };

  return (
    <Card
      className="perspective h-full"
    >
      <div 
        className={`relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <CardContent className="p-6 backface-hidden absolute w-full h-full">
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-lg">{front}</p>
          </div>
        </CardContent>

        {/* Back of card */}
        <CardContent className="p-6 backface-hidden absolute w-full h-full rotate-y-180">
          <div className="flex flex-col justify-between h-full">
            <div className="flex-1 mb-6 text-center">
              <p className="text-lg">{back}</p>
            </div>
            <div className="mt-auto">
              <p className="text-xs text-muted-foreground mb-2 text-center">
                ¿Has acertado?
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10"
                  onClick={handleIncorrect}
                >
                  <X className="h-5 w-5 text-destructive" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10"
                  onClick={handleCorrect}
                >
                  <Check className="h-5 w-5 text-green-500" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
