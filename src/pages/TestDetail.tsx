import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTestDetail } from "@/hooks/useTestDetail";
import { useTestQuestions } from "@/hooks/useTestQuestions";
import { useCurrentTestState } from "@/stores/useCurrentTestState";
import { Checkbox } from "@/components/ui/checkbox";
import { TestTimer } from "@/components/test/TestTimer";
import { QuestionDisplay } from "@/components/test/QuestionDisplay";
import { TestFinished } from "@/components/test/TestFinished";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const TestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: test, isLoading: isLoadingTest } = useTestDetail(id);
  const { data: questions, isLoading: isLoadingQuestions } =
    useTestQuestions(id);

  const { isExamMode, startExam, setQuestions, resetTest, isFinished } =
    useCurrentTestState();

  const [examTimerEnabled, setExamTimerEnabled] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    return () => {
      resetTest();
    };
  }, [id, resetTest]);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setQuestions(questions);
    }
  }, [questions, setQuestions]);

  const handleStart = () => {
    startExam();
    setExamStarted(true);
  };

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

        {!examStarted && (
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exam-timer"
                checked={examTimerEnabled}
                onCheckedChange={(checked) => setExamTimerEnabled(!!checked)}
              />
              <label
                htmlFor="exam-timer"
                className="text-sm font-medium leading-none"
              >
                Activar cronómetro durante el examen
              </label>
            </div>

            <Button className="w-fit" onClick={handleStart}>Iniciar examen</Button>
          </div>
        )}
      </div>

      {examStarted && (
        <>
          {examTimerEnabled && <TestTimer />}
          {isFinished ? <TestFinished /> : <QuestionDisplay />}
        </>
      )}

      {!examStarted && questions?.length > 0 && (
        <div className="p-8 border rounded-lg flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium mb-2">Test en modo práctica</h3>
          <p className="text-muted-foreground mb-4">
            Activa el cronómetro si deseas simular condiciones reales de examen.
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
