import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import OnboardingSummary from "./OnboardingSummary";

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

const MOCK_CONVERSATION: ChatMessage[] = [
  {
    role: 'assistant',
    content: '¡Hola! Bienvenido a tu plataforma de preparación para oposiciones. Veo que es tu primera vez aquí. ¿Te gustaría que te ayudara a configurar un plan de estudio personalizado?'
  }
];

const MOCK_RESPONSES: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Perfecto. Para empezar, ¿podrías indicarme cuántas horas al día dispones para estudiar?'
  },
  {
    role: 'assistant',
    content: 'Entendido. ¿Y en qué días de la semana planeas estudiar? Puedes marcar aquellos en los que te sea más cómodo.'
  },
  {
    role: 'assistant',
    content: '¡Genial! ¿Prefieres estudiar en sesiones continuas o en bloques con descansos? Por ejemplo, sesiones de 25 minutos con 5 minutos de pausa.'
  },
  {
    role: 'assistant',
    content: 'Perfecto, anoto eso. Ahora, cuéntame, ¿cuáles son tus principales objetivos para esta preparación? ¿Hay algún área o tema en el que sientas que necesitas un mayor refuerzo?'
  },
  {
    role: 'assistant',
    content: 'Muy bien, eso me ayuda a personalizar aún más tu plan. ¿Te gustaría recibir recomendaciones semanales para optimizar tus sesiones de estudio, o prefieres que sean diarias?'
  },
  {
    role: 'assistant',
    content: 'Excelente. Con toda esta información, podré generar un plan de estudio personalizado que se ajuste a tu disponibilidad y necesidades. Toda la información quedará registrada para que, en futuras interacciones, el sistema pueda ofrecerte sugerencias y ajustes en función de tu progreso. ¿Hay algo más que te gustaría agregar o alguna duda que tengas?'
  },
  {
    role: 'assistant',
    content: '¡Genial! En breve verás tu plan de estudio personalizado en el calendario. Si en algún momento deseas modificar tus preferencias o necesitas ayuda adicional, solo dímelo. ¡Mucho éxito en tu preparación!'
  }
];

interface OnboardingChatProps {
  onComplete?: () => void;
}

const OnboardingChat = ({ onComplete }: OnboardingChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CONVERSATION);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [availableHours, setAvailableHours] = useState<number>(0);
  const [studyDays, setStudyDays] = useState<number>(0);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setInputDisabled(true);

    setTimeout(() => {
      switch (currentStep) {
        case 0:
          break;
        case 1:
          setAvailableHours(parseInt(currentMessage) || 2);
          break;
        case 2:
          const daysCount = currentMessage.toLowerCase().split(/[,\s]+/).filter(
            word => ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].includes(word)
          ).length;
          setStudyDays(daysCount || 4);
          break;
        case 3:
          break;
        case 4:
          setObjectives([currentMessage]);
          break;
        case 5:
          break;
        case 6:
          setIsCompleted(true);
          break;
      }

      if (currentStep < MOCK_RESPONSES.length) {
        setTimeout(() => {
          setMessages(prev => [...prev, MOCK_RESPONSES[currentStep]]);
          setCurrentStep(prevStep => prevStep + 1);
          setInputDisabled(false);
        }, 1000);
      } else {
        saveOnboardingData();
      }
    }, 500);
  };

  const saveOnboardingData = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('onboarding_info')
        .insert({
          user_id: user.id,
          available_hours: availableHours,
          study_days: studyDays,
          objectives: { areas: objectives }
        });

      if (error) {
        console.error('Error saving onboarding data:', error);
        toast.error('Error al guardar tus preferencias');
        return;
      }

      toast.success('¡Configuración completada con éxito!');
    } catch (err) {
      console.error('Error during onboarding data save:', err);
      toast.error('Ha ocurrido un error inesperado');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isCompleted) {
    return (
      <OnboardingSummary
        availableHours={availableHours}
        studyDays={studyDays}
        onConfirm={onComplete || (() => {})} 
      />
    );
  }
  
  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-md">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-indigo-100' 
                  : 'bg-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background rounded-b-md">
        <div className="flex space-x-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 resize-none  focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none"
            disabled={inputDisabled || isCompleted}
          />
          <Button 
            onClick={handleSend} 
            className="rounded-full p-2 h-10 w-10 flex items-center justify-center mt-auto"
            disabled={!currentMessage.trim() || inputDisabled || isCompleted}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChat;
