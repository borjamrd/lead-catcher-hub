
import { useQuestionAnswers } from "@/hooks/useQuestionAnswers";
import { useCurrentTestStore } from "@/stores/useCurrentTestStore";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionItemProps {
  questionId: string;
}

export const QuestionItem = ({ questionId }: QuestionItemProps) => {
  const { data: answers, isLoading } = useQuestionAnswers(questionId);
  const { selectAnswer, selectedAnswers, nextQuestion } = useCurrentTestStore();
  
  const selectedAnswerId = selectedAnswers[questionId];
  const canContinue = !!selectedAnswerId;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full max-w-md" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-6 w-full max-w-sm" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!answers || answers.length === 0) {
    return <p>No hay respuestas disponibles para esta pregunta.</p>;
  }
  
  const handleAnswerSelect = (answerId: string) => {
    selectAnswer(questionId, answerId);
  };
  
  return (
    <div className="space-y-6">
      <RadioGroup 
        value={selectedAnswerId} 
        onValueChange={handleAnswerSelect}
        className="space-y-4"
      >
        {answers.map((answer) => (
          <div key={answer.id} className="flex items-start space-x-3">
            <RadioGroupItem 
              value={answer.id} 
              id={answer.id} 
              className="mt-1"
            />
            <Label 
              htmlFor={answer.id} 
              className="text-base font-normal leading-relaxed cursor-pointer"
            >
              {answer.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="flex justify-end">
        <Button 
          onClick={nextQuestion}
          disabled={!canContinue}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
