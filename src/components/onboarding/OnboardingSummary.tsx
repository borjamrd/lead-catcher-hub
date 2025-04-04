import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const dayNames = [
  "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
];

interface Props {
  availableHours: number;
  studyDays: number;
  onConfirm: () => void;
}

const OnboardingSummary = ({ availableHours, studyDays, onConfirm }: Props) => {
  const recommendedDays = dayNames.slice(0, studyDays); // Mock básico

  return (
    <div className="flex flex-col justify-between h-full p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          ¡Muchas gracias! 🎉
        </h2>
        <p className="text-center">
          Basándome en tu perfil y situación personal, te recomiendo lo siguiente:
        </p>

        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            Estudiar <strong>{availableHours}</strong> horas al día
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            Días de estudio recomendados:{" "}
            <strong>{recommendedDays.join(", ")}</strong>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <Button onClick={onConfirm}>Comenzar ahora</Button>
      </div>
    </div>
  );
};

export default OnboardingSummary;
