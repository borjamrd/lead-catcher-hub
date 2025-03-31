import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import confetti from "canvas-confetti";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface NodeSidebarContentProps {
  nodeId: string;
  onClose: () => void;
}

const mockNodeData = {
  title: "¿Qué es la Constitución Española?",
  content: `La Constitución Española de 1978 es la norma suprema del ordenamiento jurídico del Reino de España. 
Establece los derechos y deberes fundamentales de los ciudadanos, la organización de los poderes del Estado y el marco territorial del país. 
Es esencial para comprender el funcionamiento del sistema democrático español.`,

  status: "pending", // "pending" | "in_progress" | "completed"

  resources: {
    free: [
      {
        type: "Article",
        title: "Resumen de la Constitución Española",
        url: "#",
      },
      { type: "Video", title: "¿Qué es la Constitución?", url: "#" },
    ],
    premium: [
      {
        type: "Curso",
        title: "Curso avanzado sobre la Constitución",
        url: "#",
      },
    ],
  },
};

const statusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "in_progress", label: "En curso" },
  { value: "completed", label: "Finalizado" },
];

export function NodeSidebarContent({
  nodeId,
  onClose,
}: NodeSidebarContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedStatus, setSelectedStatus] = useState(mockNodeData.status);

  const handleSelectChange = (value: string) => {
    if (value === "completed") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setSelectedStatus(value);
    }
  };

  return (
    <div ref={ref} className="relative p-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>
      {/* Estado */}

      <div className="inline-flex items-center rounded-md border border-input bg-background h-7 overflow-hidden text-sm">
        {/* Estado Badge */}
        <div className="px-3 flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full text-nowrap",
              selectedStatus === "completed"
                ? "bg-green-500"
                : selectedStatus === "in_progress"
                ? "bg-yellow-500"
                : "bg-gray-400"
            )}
          />
          <span className="text-sm font-medium text-muted-foreground text-nowrap">
            {statusOptions.find((s) => s.value === selectedStatus)?.label}
          </span>
        </div>

        {/* Separador vertical */}
        <div className="h-6 w-px bg-muted mx-1" />

        {/* Selector de estado */}
        <Select
          value={selectedStatus}
          onValueChange={(value) => handleSelectChange(value)}
        >
          <SelectTrigger
            className={cn(
              "h-7 border-none px-3 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            )}
          >
            <SelectValue placeholder="Actualiza estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="in_progress">En curso</SelectItem>
            <SelectItem value="completed">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contenido */}
      <div className="mb-10 mt-4 flex flex-col items-start justify-center space-y-2">
        <h2 className="text-xl font-bold">{mockNodeData.title}</h2>
        <p className="text-muted-foreground mt-2 text-sm whitespace-pre-line">
          {mockNodeData.content}
        </p>
      </div>

      {/* Recursos */}
      <div className="space-y-3">
        {mockNodeData.resources.free.length > 0 && (
          <div>
            <p className="mb-3 font-semibold text-green-600">
              🎯 Recursos
            </p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {mockNodeData.resources.free.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {r.type} - {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
