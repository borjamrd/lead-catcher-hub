
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { useQuestionAnswers } from "@/hooks/useQuestionAnswers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export function QuestionDisplay() {
  const { 
    questions, 
    currentQuestionIndex, 
    selectedAnswers,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    isLastQuestion
  } = useCurrentTestState();
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const { data: answers, isLoading } = useQuestionAnswers(currentQuestion?.id);
  
  if (!currentQuestion) {
    return <div>No hay preguntas disponibles</div>;
  }
  
  const isAnswerSelected = selectedAnswers[currentQuestion.id] !== undefined;
  const currentAnswers = currentQuestion.answers || answers || [];
  const isLastQuestionItem = currentQuestionIndex === questions.length - 1;
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <div className="mb-2 text-sm text-muted-foreground">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </div>
        <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>
        
        {isLoading ? (
          <div className="py-4">Cargando respuestas...</div>
        ) : (
          <div className="space-y-3">
            {currentAnswers.map(answer => (
              <label 
                key={answer.id} 
                className={`
                  flex items-start gap-2 p-3 rounded-md cursor-pointer border 
                  ${selectedAnswers[currentQuestion.id] === answer.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}
                `}
              >
                <Checkbox 
                  checked={selectedAnswers[currentQuestion.id] === answer.id}
                  onCheckedChange={() => selectAnswer(currentQuestion.id, answer.id)}
                  className="mt-0.5"
                />
                <span>{answer.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        
        <Button
          onClick={nextQuestion}
          disabled={!isAnswerSelected || (isLastQuestionItem && isLastQuestion)}
        >
          {isLastQuestionItem ? (
            <>
              Finalizar <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
