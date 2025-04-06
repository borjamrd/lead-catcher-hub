
import { create } from "zustand";

export interface Answer {
  id: string;
  question_id: string;
  is_correct: boolean;
  text: string;
}

export interface Question {
  id: string;
  test_id: string;
  text: string;
  answers?: Answer[];
}

export interface TestState {
  isExamMode: boolean;
  isTimerRunning: boolean;
  currentQuestionIndex: number;
  elapsedTime: number;
  selectedAnswers: Record<string, string>;
  questions: Question[];
  isLastQuestion: boolean;
  isFinished: boolean;

  // Actions
  startExam: () => void;
  stopExam: () => void;
  toggleTimer: () => void;
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  selectAnswer: (questionId: string, answerId: string) => void;
  resetTest: () => void;
  addAnswersToQuestion: (questionId: string, answers: Answer[]) => void;
  finishTest: () => void;
}

export const useCurrentTestState = create<TestState>()((set, get) => ({
  isExamMode: false,
  isTimerRunning: false,
  currentQuestionIndex: 0,
  elapsedTime: 0,
  selectedAnswers: {},
  questions: [],
  isLastQuestion: false,
  isFinished: false,

  startExam: () => set({ isExamMode: true, isTimerRunning: true }),
  
  stopExam: () => set({ isExamMode: false, isTimerRunning: false }),
  
  toggleTimer: () => set((state) => ({ isTimerRunning: !state.isTimerRunning })),
  
  setQuestions: (questions) => set({ questions }),
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    
    if (currentQuestionIndex === questions.length - 1) {
      // If we're on the last question, mark the test as finished
      set({ isFinished: true });
    } else if (currentQuestionIndex < questions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        // Set isLastQuestion true when on the second-to-last question (about to go to last)
        isLastQuestion: currentQuestionIndex + 1 === questions.length - 1
      });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1,
        isLastQuestion: false
      });
    }
  },
  
  selectAnswer: (questionId, answerId) => {
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answerId
      }
    }));
  },
  
  resetTest: () => set({
    isExamMode: false,
    isTimerRunning: false,
    currentQuestionIndex: 0,
    elapsedTime: 0,
    selectedAnswers: {},
    isLastQuestion: false,
    isFinished: false
  }),
  
  addAnswersToQuestion: (questionId, answers) => {
    set((state) => ({
      questions: state.questions.map(q => 
        q.id === questionId ? { ...q, answers } : q
      )
    }));
  },
  
  finishTest: () => set({ isFinished: true })
}));
