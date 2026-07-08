import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { StoredChatMessage } from "@/types/chat";
import type { QuizProgress, QuizResults } from "@/types/quiz";
import type { StudySpace } from "@/types/study-space";

interface AppState {
  hasHydrated: boolean;
  studySpace: StudySpace | null;
  messages: StoredChatMessage[];
  quizProgress: QuizProgress | null;
  results: QuizResults | null;

  setHasHydrated: (value: boolean) => void;

  setStudySpace: (space: StudySpace) => void;
  clearStudySpace: () => void;

  addMessage: (message: StoredChatMessage) => void;
  clearMessages: () => void;

  setQuizProgress: (progress: QuizProgress | null) => void;
  setQuizAnswer: (questionId: number, answer: string) => void;
  setQuizCurrentIndex: (index: number) => void;
  setResults: (results: QuizResults | null) => void;
}

/**
 * Single persisted app store. Uploading a new study space resets chat
 * history and quiz state, since the backend's knowledge base (a single
 * global collection) is fully replaced by every upload — old
 * conversations/quizzes are no longer grounded in anything once that
 * happens.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      studySpace: null,
      messages: [],
      quizProgress: null,
      results: null,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setStudySpace: (space) =>
        set({ studySpace: space, messages: [], quizProgress: null, results: null }),
      clearStudySpace: () =>
        set({ studySpace: null, messages: [], quizProgress: null, results: null }),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),

      setQuizProgress: (quizProgress) => set({ quizProgress }),
      setQuizAnswer: (questionId, answer) =>
        set((state) =>
          state.quizProgress
            ? {
                quizProgress: {
                  ...state.quizProgress,
                  answers: { ...state.quizProgress.answers, [questionId]: answer },
                },
              }
            : state,
        ),
      setQuizCurrentIndex: (index) =>
        set((state) =>
          state.quizProgress
            ? { quizProgress: { ...state.quizProgress, currentIndex: index } }
            : state,
        ),
      setResults: (results) => set({ results }),
    }),
    {
      name: "studybuddy:app-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

// --- Small selector hooks -------------------------------------------------

export const useHasHydrated = () => useAppStore((s) => s.hasHydrated);

export const useStudySpace = () => useAppStore((s) => s.studySpace);
export const useSetStudySpace = () => useAppStore((s) => s.setStudySpace);
export const useClearStudySpace = () => useAppStore((s) => s.clearStudySpace);

export const useChatMessages = () => useAppStore((s) => s.messages);
export const useAddChatMessage = () => useAppStore((s) => s.addMessage);
export const useClearChatMessages = () => useAppStore((s) => s.clearMessages);

export const useQuizProgress = () => useAppStore((s) => s.quizProgress);
export const useSetQuizProgress = () => useAppStore((s) => s.setQuizProgress);
export const useSetQuizAnswer = () => useAppStore((s) => s.setQuizAnswer);
export const useSetQuizCurrentIndex = () => useAppStore((s) => s.setQuizCurrentIndex);

export const useQuizResults = () => useAppStore((s) => s.results);
export const useSetQuizResults = () => useAppStore((s) => s.setResults);
