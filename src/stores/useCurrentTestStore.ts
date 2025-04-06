
import { create } from "zustand";

export interface Question {
  id: string;
  text: string;
  test_id: string;
}

export interface Answer {
  id: string;
  text: string;
  question_id: string;
  is_correct: boolean;
}

interface CurrentTestState {
  // Test data
  testId: string | null;
  testTitle: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>; // questionId -> answerId
  
  // Timer
  useTimer: boolean;
  isTimerActive: boolean;
  elapsedSeconds: number;
  timerInterval: NodeJS.Timeout | null;
  
  // Test status
  isTestStarted: boolean;
  isTestFinished: boolean;
  
  // Actions
  setTestId: (id: string) => void;
  setTestTitle: (title: string) => void;
  setQuestions: (questions: Question[]) => void;
  setUseTimer: (useTimer: boolean) => void;
  startTest: () => void;
  finishTest: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  selectAnswer: (questionId: string, answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetTest: () => void;
}

export const useCurrentTestStore = create<CurrentTestState>((set, get) => ({
  // Test data
  testId: null,
  testTitle: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  
  // Timer
  useTimer: false,
  isTimerActive: false,
  elapsedSeconds: 0,
  timerInterval: null,
  
  // Test status
  isTestStarted: false,
  isTestFinished: false,
  
  // Actions
  setTestId: (id) => set({ testId: id }),
  setTestTitle: (title) => set({ testTitle: title }),
  setQuestions: (questions) => set({ questions }),
  setUseTimer: (useTimer) => set({ useTimer }),
  
  startTest: () => {
    const { useTimer } = get();
    set({ isTestStarted: true });
    
    if (useTimer) {
      get().startTimer();
    }
  },
  
  finishTest: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    set({ 
      isTestFinished: true,
      isTimerActive: false,
      timerInterval: null
    });
  },
  
  startTimer: () => {
    const { timerInterval } = get();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
    }, 1000);
    
    set({
      isTimerActive: true,
      timerInterval: interval,
    });
  },
  
  pauseTimer: () => {
    const { timerInterval } = get();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    set({
      isTimerActive: false,
      timerInterval: null,
    });
  },
  
  resumeTimer: () => {
    get().startTimer();
  },
  
  resetTimer: () => {
    const { timerInterval } = get();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    set({
      elapsedSeconds: 0,
      isTimerActive: false,
      timerInterval: null,
    });
  },
  
  selectAnswer: (questionId, answerId) => {
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: answerId,
      },
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    
    if (currentQuestionIndex < questions.length - 1) {
      set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 }));
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    
    if (currentQuestionIndex > 0) {
      set((state) => ({ currentQuestionIndex: state.currentQuestionIndex - 1 }));
    }
  },
  
  resetTest: () => {
    const { timerInterval } = get();
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    set({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isTestStarted: false,
      isTestFinished: false,
      isTimerActive: false,
      elapsedSeconds: 0,
      timerInterval: null,
    });
  },
}));
