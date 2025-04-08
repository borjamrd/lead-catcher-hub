import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import OnboardingSummary from "./OnboardingSummary";
import Markdown from "react-markdown";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const OnboardingChat = ({ onComplete }: { onComplete?: () => void }) => {
  const { currentSelectedOpposition } = useOppositionStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `¡Hola! Soy Janiro, tu asistente en Opositaplace. ¿Te gustaría que te ayudara a configurar tu plan de estudio para ${currentSelectedOpposition} ?`,
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getGeminiHistory = () => {
    const trimmed = [...messages];
    if (trimmed[0]?.role === "assistant") {
      trimmed.shift(); // evita error: el primer mensaje debe ser del user
    }
    return trimmed.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
  };

  const handleSend = async () => {
    if (!currentMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentMessage("");
    setInputDisabled(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/google-genai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            history: getGeminiHistory(),
            message: currentMessage,
          }),
        }
      );

      if (!response.ok) throw new Error("Error desde el servidor");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let firstChunk = true;

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        console.log({ chunk });

        console.log("[chunk recibido]", chunk);

        // ✅ Detecta finalización del onboarding sin mostrar al usuario
        if (chunk.includes("<<ONBOARDING_DONE>>:true")) {
          setIsCompleted(true);
          continue;
        }

        assistantMessage += chunk;

        if (firstChunk) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: chunk },
          ]);
          firstChunk = false;
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantMessage,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      toast.error("Error al comunicarse con el asistente.");
    } finally {
      setInputDisabled(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[500px] rounded-t-md">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                message.role === "user" ? "bg-indigo-100" : "bg-gray-200"
              }`}
            >
              <Markdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 text-sm">{children}</p>
                  ),
                  li: ({ children }) => (
                    <li className="ml-4 list-disc text-sm">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                }}
              >
                {message.content}
              </Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isCompleted ? (
        <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
          <p className="text-lg font-semibold text-center">
            🎉 ¡Gracias por completar el onboarding!
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => {
                console.log("Confirmado");
                onComplete?.();
              }}
            >
              Confirmar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "¡Hola! Soy Janiro, tu asistente en Opositaplace. ¿Te gustaría que te ayudara a configurar tu plan de estudio?",
                  },
                ]);
                setCurrentMessage("");
                setIsCompleted(false);
              }}
            >
              Comenzar de nuevo
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t bg-background rounded-b-md">
          <div className="flex space-x-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 resize-none focus-visible:ring-0"
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
      )}
    </div>
  );
};

export default OnboardingChat;
