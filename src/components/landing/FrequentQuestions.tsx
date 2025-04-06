import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import TypewriterText from "../TypewritterText";

// Definición de los mensajes de preguntas frecuentes
const questions = [
  "¿Y si tengo familia?",
  "¿Sólo puedo estudiar 2 veces por semana?",
  "No tengo mucho tiempo para estudiar.",
  "¿Cuánto tarda una persona en aprobar?",
];

const answers = [
  "Nuestro sistema adapta tu plan de estudio para equilibrar tu vida personal.",
  "¡Sin problema! Optimizamos tu plan para sacar el máximo rendimiento.",
  "Te ayudamos a crear un plan efectivo con el tiempo que dispongas.",
  "Depende de cada oposición, pero te guiaremos en todo el proceso.",
];

const FrequentQuestions = () => {
  const controls = useAnimation();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Start animation when component mounts or becomes visible
    const startAnimation = async () => {
      if (animationStarted) return;
      setAnimationStarted(true);

      // Sequence for showing typing indicators and then messages
      const totalMessages = conversation.length;
      let currentIndex = 0;

      const showNextMessage = () => {
        if (currentIndex >= totalMessages) return;

        // Show typing indicator for this message
        setTypingIndex(currentIndex);

        // After a delay, show the actual message
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, currentIndex]);
          setTypingIndex(null);

          // Prepare to show the next message after a delay
          setTimeout(() => {
            currentIndex++;
            showNextMessage();
          }, 100);
        }, 2200);
      };

      showNextMessage();

      await controls.start((i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.4, duration: 0.5 },
      }));
    };

    const handleScroll = () => {
      const section = document.getElementById("preguntas-frecuentes");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          startAnimation();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Check on mount too
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, animationStarted]);

  // Typing animation component
  const TypingDots = () => (
    <div className="flex space-x-1">
      <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-[pulse_1s_infinite_0ms]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-[pulse_1s_infinite_300ms]"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-[pulse_1s_infinite_600ms]"></div>
    </div>
  );

  // Check if a message should be visible with typing animation or content
  const isTyping = (index: number) => typingIndex === index;
  const isVisible = (index: number) => visibleMessages.includes(index);
  const shouldShowMessage = (index: number) =>
    typingIndex !== null || visibleMessages.length > 0
      ? index <= Math.max(typingIndex || 0, ...visibleMessages)
      : false;

  // Framer Motion variants for smooth transitions
  const messageVariants = {
    typing: { opacity: 1 },
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  // Variants for the message container's vertical movement
  const containerVariants = {
    initial: { y: 0 },
    animate: { y: 0, transition: { staggerChildren: 0.3 } },
  };

  const conversation = questions.flatMap((q, i) => [
    { type: "question", content: q },
    { type: "answer", content: answers[i] },
  ]);

  return (
    <section
      id="preguntas-frecuentes"
      className="pb-12 md:pb-20 mx-auto flex flex-col gap-12 md:gap-20 px-4 sm:px-6"
    >
      <div className="bg-yinmn_blue-500 rounded-3xl text-white text-center px-6 pb-24 pt-12 flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Área de los mensajes */}
        <motion.div
          className="w-full max-w-lg mx-auto h-[255px] relative mb-8"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <div
            className="absolute w-full h-full px-4 bottom-0 flex flex-col justify-end gap-5 pb-2.5"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 60%)",
            }}
          >
            {conversation.map(
              (item, index) =>
                shouldShowMessage(index) && (
                  <motion.div
                    key={`conv-${index}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                    className={cn(
                      "rounded-3xl px-4 py-2 text-sm text-white relative text-pretty w-fit",
                      item.type === "question"
                        ? "bg-yinmn_blue-300 self-start text-left"
                        : "bg-oxford_blue-300 self-end text-left"
                    )}
                    style={{
                      transform: `rotate(${-1 + Math.random() * 2}deg)`,
                    }}
                  >
                    <div
                      className={cn(
                        "absolute bottom-[-12px] whitespace-nowrap",
                        item.type === "question"
                          ? "left-3 text-yinmn_blue-300"
                          : "right-3 text-oxford_blue-300"
                      )}
                    >
                      {item.type === "question" ? "◤" : "◥"}
                    </div>

                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="w-fit">
                        {isTyping(index) ? (
                          <TypingDots />
                        ) : isVisible(index) ? (
                          <TypewriterText text={item.content} />
                        ) : (
                          <span className="opacity-0 invisible">
                            {item.content}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )
            )}
          </div>
        </motion.div>

        {/* Textos de encabezado */}
        <div className="max-w-[588px] mx-auto flex flex-col gap-3 relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold font-lora">
            Surgen <em>dudas</em>. Es normal.
          </h2>
          <p className="text-base md:text-lg">
            Desde pequeñas preocupaciones hasta grandes interrogantes, todos
            tenemos preguntas antes de comenzar. Estamos aquí para ayudarte.
          </p>
        </div>
      </div>

      {/* Sección de respuestas */}
      <div className="max-w-[768px] mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Respuestas a tus principales dudas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question, index) => (
            <div
              key={`faq-${index}`}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-lg mb-2 text-yinmn_blue-500">
                {question}
              </h3>
              <p className="text-gray-600">{answers[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentQuestions;
