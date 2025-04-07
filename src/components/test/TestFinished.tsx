
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useStudyCycles } from "@/hooks/use-study-cycle";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { useOppositionStore } from "@/stores/useOppositionStore";
import { Award, Check, Save, Star, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStudyCycleStore } from "@/stores/useStudyCycleStore";

export function TestFinished() {
  const { selectedAnswers, questions, resetTest } = useCurrentTestState();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { id: testId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { currentSelectedOppositionId } = useOppositionStore();
  const { selectedCycleId } = useStudyCycleStore();
  const { toast } = useToast();

  // Calculate test results
  const totalQuestions = questions.length;
  const correctAnswers = questions.reduce((count, question) => {
    const selectedAnswerId = selectedAnswers[question.id];
    const correctAnswer = question.answers?.find(a => a.is_correct);
    
    if (selectedAnswerId && correctAnswer && selectedAnswerId === correctAnswer.id) {
      return count + 1;
    }
    return count;
  }, 0);
  
  const wrongAnswers = totalQuestions - correctAnswers;
  const score = Math.round((correctAnswers / totalQuestions) * 10);
  const isPassed = score >= 5;

  const handleSaveResults = async () => {
    if (!user || !currentSelectedOppositionId || !testId || !selectedCycleId) return;
    
    try {
      setIsSaving(true);
      
      await supabase.from("test_attempts").insert({
        user_id: user.id,
        test_id: testId,
        opposition_id: currentSelectedOppositionId,
        study_cycle_id: selectedCycleId,
        score,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        total_questions: totalQuestions
      });
      
      setIsSaved(true);
      toast({
        title: "Resultados guardados",
        description: "Los resultados del test se han guardado correctamente.",
      });
    } catch (error) {
      console.error("Error saving test results:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados del test.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-card p-8 border rounded-lg text-center">
        <div className="mb-6">
          {isPassed ? (
            <Award className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <Star className="mx-auto h-16 w-16 text-amber-500" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {isPassed 
            ? "¡Felicidades! Has aprobado el test" 
            : "Has completado el test, pero no has alcanzado el aprobado"}
        </h2>
        
        <div className="text-lg mb-6">
          Tu puntuación: <span className="font-bold">{score}/10</span>
        </div>
        
        <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-8">
          <div>Preguntas: {totalQuestions}</div>
          <div className="text-green-600">Correctas: {correctAnswers}</div>
          <div className="text-red-600">Incorrectas: {wrongAnswers}</div>
        </div>

        <Button 
          size="lg" 
          onClick={handleSaveResults}
          disabled={isSaving || isSaved}
          className="mx-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Guardando..." : isSaved ? "Guardado" : "Guardar resultados"}
        </Button>
        
        {isSaved && (
          <div className="mt-4">
            <Button variant="outline" onClick={resetTest}>
              Volver a los tests
            </Button>
          </div>
        )}
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="questions">
          <AccordionTrigger className="text-lg font-medium">
            Revisar preguntas y respuestas
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              {questions.map((question, index) => {
                const selectedAnswerId = selectedAnswers[question.id];
                const correctAnswer = question.answers?.find(a => a.is_correct);
                const isCorrect = selectedAnswerId === correctAnswer?.id;
                
                return (
                  <div 
                    key={question.id} 
                    className={`p-4 border rounded-md ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`rounded-full p-1 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isCorrect ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          Pregunta {index + 1}: {question.text}
                        </h4>
                        
                        <div className="ml-6 space-y-2">
                          {question.answers?.map(answer => {
                            const isSelected = selectedAnswerId === answer.id;
                            const isCorrectAnswer = answer.is_correct;
                            
                            return (
                              <div 
                                key={answer.id}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  isSelected && isCorrectAnswer 
                                    ? 'bg-green-100' 
                                    : isSelected && !isCorrectAnswer 
                                    ? 'bg-red-100'
                                    : !isSelected && isCorrectAnswer
                                    ? 'bg-green-100'
                                    : ''
                                }`}
                              >
                                <div className={`w-4 h-4 flex-shrink-0 rounded-full ${
                                  isSelected 
                                    ? (isCorrectAnswer ? 'bg-green-500' : 'bg-red-500') 
                                    : isCorrectAnswer
                                    ? 'bg-green-500'
                                    : 'border border-gray-300'
                                }`}/>
                                <span>{answer.text}</span>
                                {(isSelected || isCorrectAnswer) && (
                                  <span className="text-xs ml-auto">
                                    {isSelected && isCorrectAnswer && "Tu respuesta (correcta)"}
                                    {isSelected && !isCorrectAnswer && "Tu respuesta (incorrecta)"}
                                    {!isSelected && isCorrectAnswer && "Respuesta correcta"}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
