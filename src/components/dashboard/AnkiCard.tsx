
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface AnkiCardProps {
  front: string;
  back: string;
}

export function AnkiCard({ front, back }: AnkiCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card
      className={`cursor-pointer h-full shadow-md transition-all duration-300 ${
        isFlipped ? "bg-muted/50" : ""
      }`}
      onClick={handleFlip}
    >
      <CardContent className="p-6 flex flex-col h-full">
        {!isFlipped ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-lg">{front}</p>
          </div>
        ) : (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aquí iría la lógica para indicar que no se ha acertado
                    console.log("No acertado");
                  }}
                >
                  <X className="h-5 w-5 text-destructive" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full h-10 w-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aquí iría la lógica para indicar que se ha acertado
                    console.log("Acertado");
                  }}
                >
                  <Check className="h-5 w-5 text-green-500" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
