import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const createNewInterview = () => ({
  status: 'AWAITING_RESUME',
  questions: [],
  currentQuestionIndex: 0,
  finalScore: null,
  summary: '',
});

export const useInterviewStore = create(
  persist(
    (set, get) => ({
      candidates: [],
      currentCandidateId: null,
      activeTab: 'interviewee',

      addCandidate: (candidateData) => {
        const newCandidate = {
          id: `cand_${Date.now()}`,
          name: candidateData.name || '',
          email: candidateData.email || '',
          phone: candidateData.phone || '',
          resumeText: candidateData.resumeText || '',
          interview: createNewInterview(),
        };
        set((state) => ({
          candidates: [...state.candidates, newCandidate],
        }));
        return newCandidate;
      },

      updateCandidate: (id, updates) => {
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      setCurrentCandidateId: (id) => {
        set({ currentCandidateId: id });
      },

      startInterview: (id) => {
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id
              ? {
                  ...c,
                  interview: {
                    ...c.interview,
                    status: 'IN_PROGRESS',
                    currentQuestionIndex: 0,
                  },
                }
              : c
          ),
        }));
      },

      setNextQuestion: (candidateId, question) => {
        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (c.id === candidateId) {
              const newQuestions = [...c.interview.questions, question];
              return {
                ...c,
                interview: {
                  ...c.interview,
                  questions: newQuestions,
                },
              };
            }
            return c;
          }),
        }));
      },

      submitAnswer: (candidateId, questionId, answer, score, feedback) => {
        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (c.id === candidateId) {
              const updatedQuestions = c.interview.questions.map((q) =>
                q.id === questionId ? { ...q, answer, score, feedback } : q
              );
              return {
                ...c,
                interview: {
                  ...c.interview,
                  questions: updatedQuestions,
                  currentQuestionIndex: c.interview.currentQuestionIndex + 1,
                },
              };
            }
            return c;
          }),
        }));
      },

      finishInterview: (candidateId, finalScore, summary) => {
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === candidateId
              ? {
                  ...c,
                  interview: {
                    ...c.interview,
                    status: 'COMPLETED',
                    finalScore,
                    summary,
                  },
                }
              : c
          ),
        }));
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      resetCurrentInterview: () => {
        set({ currentCandidateId: null });
      },
    }),
    {
      name: 'interview-assistant-storage', // Generate Unique name lol
    }
  )
);
