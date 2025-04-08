import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

const OnboardingChat = ({ onComplete }: { onComplete?: () => void }) => {
  const { user } = useAuth();
  const { currentSelectedOpposition, currentSelectedOppositionId } =
    useOppositionStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `¡Hola! Soy Janiro, tu asistente en Opositaplace. ¿Te gustaría que te ayudara a configurar tu plan de estudio para ${currentSelectedOpposition}?`,
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [inputDisabled]);

  const getGeminiHistory = () => {
    const trimmed = [...messages];
    if (trimmed[0]?.role === "assistant") trimmed.shift();
    return trimmed.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
  };

  const handleSend = async () => {
    if (!currentMessage.trim()) return;

    const newUserMessage = { role: "user", content: currentMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setCurrentMessage("");
    setInputDisabled(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-genai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            history: getGeminiHistory(),
            message: currentMessage,
            user_id: user?.id,
            opposition_id: currentSelectedOppositionId,
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

        // Intenta parsear como JSON estructurado
        try {
          const maybeJson = JSON.parse(chunk);
          if (maybeJson.done) {
            if (maybeJson.success) {
              setIsCompleted(true);
            } else {
              console.error("Error en Supabase:", maybeJson.error);
              toast({
                title: "Error",
                description: "Hubo un error al enviar tu mensaje.",
                variant: "destructive",
              });
            }
            continue;
          }
        } catch {
          // No es JSON, continúa
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
      console.error(err);
      toast({
        title: "Error",
        description: "Hubo un error al enviar tu mensaje.",
        variant: "destructive",
      });
    } finally {
      setInputDisabled(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-md min-h-[500px]">
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
              <Markdown>{message.content}</Markdown>
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
            <Button onClick={onComplete}>Confirmar</Button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t bg-background rounded-b-md">
          <div className="flex space-x-2">
            <Textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
