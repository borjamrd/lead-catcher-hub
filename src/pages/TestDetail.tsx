
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTestDetail } from "@/hooks/useTestDetail";
import { useTestQuestions } from "@/hooks/useTestQuestions";
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { Checkbox } from "@/components/ui/checkbox";
import { TestTimer } from "@/components/test/TestTimer";
import { QuestionDisplay } from "@/components/test/QuestionDisplay";
import { TestFinished } from "@/components/test/TestFinished";
import { Skeleton } from "@/components/ui/skeleton";

const TestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: test, isLoading: isLoadingTest } = useTestDetail(id);
  const { data: questions, isLoading: isLoadingQuestions } = useTestQuestions(id);
  
  const { 
    isExamMode, 
    startExam, 
    setQuestions,
    resetTest,
    isFinished
  } = useCurrentTestState();

  // Reset test state when unmounting or changing test
  useEffect(() => {
    return () => {
      resetTest();
    };
  }, [id, resetTest]);
  
  // Set questions when they're loaded
  useEffect(() => {
    if (questions && questions.length > 0) {
      setQuestions(questions);
    }
  }, [questions, setQuestions]);

  if (isLoadingTest || isLoadingQuestions) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!test) {
    return <div>No se encontró el test</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
        
        {!isExamMode && (
          <div className="flex items-center space-x-2 mb-8">
            <Checkbox id="exam-mode" onCheckedChange={(checked) => checked && startExam()} />
            <label
              htmlFor="exam-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Iniciar en modo examen (con cronómetro)
            </label>
          </div>
        )}
      </div>
      
      {isExamMode && (
        <>
          <TestTimer />
          
          {isFinished ? (
            <TestFinished />
          ) : (
            <QuestionDisplay />
          )}
        </>
      )}
      
      {!isExamMode && questions && questions.length > 0 && (
        <div className="p-8 border rounded-lg flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-2">Test en modo práctica</h3>
          <p className="text-muted-foreground mb-4">
            Marca la casilla de "modo examen" para comenzar el test con cronómetro.
          </p>
          <p className="text-sm text-muted-foreground">
            Este test contiene {questions.length} preguntas.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestDetail;
