import { Progress } from "@/components/ui/progress";
import { FlameIcon, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export function TuProgreso() {
  // Mock data
  const progressData = {
    temarioCompletado: 65,
    testsRealizados: 78,
    testsAprobados: 82,
    rachaEstudio: 7,
    tiempoEstudioSemana: "12h 30m",
  };
  return (
    <Card className="col-span-8 row-span-1 ">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-2xl">
          📊 Tu progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">% de temario completado</span>
            <span className="text-sm font-semibold">
              {progressData.temarioCompletado}%
            </span>
          </div>
          <Progress value={progressData.temarioCompletado} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">% de tests aprobados</span>
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
  );
}
