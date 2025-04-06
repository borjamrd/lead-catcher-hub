
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTest } from "@/hooks/useTest";
import { useTestQuestions } from "@/hooks/useTestQuestions";
import { useCurrentTestStore } from "@/stores/useCurrentTestStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TestTimer } from "@/components/tests/TestTimer";
import { QuestionItem } from "@/components/tests/QuestionItem";
import { Skeleton } from "@/components/ui/skeleton";

const TestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    data: test, 
    isLoading: isTestLoading 
  } = useTest(id || null);
  
  const { 
    data: questions, 
    isLoading: isQuestionsLoading 
  } = useTestQuestions(id || null);
  
  const {
    setTestId,
    setTestTitle,
    setQuestions,
    useTimer,
    setUseTimer,
    isTestStarted,
    startTest,
    currentQuestionIndex,
    questions: storeQuestions,
  } = useCurrentTestStore();
  
  // Initialize test data when loaded
  useEffect(() => {
    if (id) {
      setTestId(id);
    }
  }, [id, setTestId]);
  
  useEffect(() => {
    if (test?.title) {
      setTestTitle(test.title);
    }
  }, [test, setTestTitle]);
  
  useEffect(() => {
    if (questions && questions.length > 0) {
      setQuestions(questions);
    }
  }, [questions, setQuestions]);
  
  if (isTestLoading || isQuestionsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-20 w-full max-w-md mx-auto" />
        <div className="flex justify-center">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }
  
  if (!test) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Test no encontrado</h1>
        <p>No se pudo encontrar el test solicitado.</p>
      </div>
    );
  }
  
  const handleStartTest = () => {
    startTest();
  };
  
  const currentQuestion = storeQuestions[currentQuestionIndex];
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">{test.title}</h1>
      
      {!isTestStarted ? (
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <p className="mb-8 text-center">
            Este test puedes practicarlo con o sin temporizador. Al hacerlo te preguntarás si quieres guardarlo para tener un historial de tu progreso.
          </p>
          
          <div className="flex items-center space-x-2 justify-center mb-8">
            <Checkbox 
              id="use-timer" 
              checked={useTimer} 
              onCheckedChange={(checked) => setUseTimer(!!checked)} 
            />
            <label 
              htmlFor="use-timer"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Activar temporizador
            </label>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleStartTest}>
              Comenzar
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          {useTimer && <TestTimer />}
          
          {currentQuestion ? (
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-md">
                <h2 className="text-lg font-medium mb-2">
                  Pregunta {currentQuestionIndex + 1} de {storeQuestions.length}
                </h2>
                <p className="text-base">{currentQuestion.text}</p>
              </div>
              
              <QuestionItem questionId={currentQuestion.id} />
            </div>
          ) : (
            <p className="text-center">No hay preguntas disponibles para este test.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TestDetail;
