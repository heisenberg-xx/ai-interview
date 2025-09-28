import React, { useState, useEffect, useCallback } from "react";
import { useInterviewStore } from "../../store/useStore.js";
import {
  generateQuestion,
  evaluateAnswer,
  generateSummary,
} from "../../services/geminiService.js";
import { Button } from "../ui/Button.jsx";
import { Spinner } from "../ui/Spinner.jsx";
import { Timer } from "../ui/Timer.jsx";
import { Send } from "lucide-react";
import { Card, CardContent } from "../ui/Card.jsx";
import { Modal } from "../ui/Modal.jsx";

const INTERVIEW_LENGTH = 6;

const getDifficulty = (index) => {
  if (index < 2) return "Easy";
  if (index < 4) return "Medium";
  return "Hard";
};

const getTimeLimit = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return 20;
    case "Medium":
      return 60;
    case "Hard":
      return 120;
    default:
      return 60;
  }
};

 const ChatScreen = ({ candidate }) => {
  const [showStopModal, setShowStopModal] = useState(false);

  const { setNextQuestion, submitAnswer, finishInterview } =
    useInterviewStore();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { interview, resumeText, role } = candidate;

  const { questions, currentQuestionIndex } = interview;
  const currentQuestion = questions[currentQuestionIndex];
  const { resetCurrentInterview } = useInterviewStore();

  const fetchNextQuestion = useCallback(async () => {
    if (currentQuestionIndex >= INTERVIEW_LENGTH) return;

    setIsLoading(true);

    const difficulty = getDifficulty(currentQuestionIndex);
    const existingQuestionTexts = questions.map((q) => q.text);
    const questionText = await generateQuestion(
      difficulty,
      existingQuestionTexts,
      resumeText,
      role
    );

    if (questions.length >= INTERVIEW_LENGTH) {
      setIsLoading(false);
      return;
    }

    const newQuestion = {
      id: Date.now(),
      difficulty,
      text: questionText,
      answer: "",
      score: null,
      feedback: "",
      timeLimit: getTimeLimit(difficulty),
    };

    setNextQuestion(candidate.id, newQuestion);
    setIsLoading(false);
  }, [
    candidate.id,
    currentQuestionIndex,
    questions,
    resumeText,
    setNextQuestion,
  ]);

  useEffect(() => {
    if (
      interview.status === "IN_PROGRESS" &&
      questions.length === currentQuestionIndex &&
      currentQuestionIndex < INTERVIEW_LENGTH
    ) {
      fetchNextQuestion();
    }
  }, [
    fetchNextQuestion,
    questions.length,
    currentQuestionIndex,
    interview.status,
  ]);

  const handleFinishInterview = useCallback(async () => {
    const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
    const finalScore = Math.round((totalScore / (questions.length * 10)) * 100);
    const summary = await generateSummary(interview);
    finishInterview(candidate.id, finalScore, summary);
    setIsLoading(false);
  }, [candidate.id, finishInterview, interview, questions]);

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || isLoading) return;

    setIsLoading(true);
    const { score, feedback } = await evaluateAnswer(
      currentQuestion.text,
      currentAnswer
    );
    submitAnswer(
      candidate.id,
      currentQuestion.id,
      currentAnswer,
      score,
      feedback
    );
    setCurrentAnswer("");

    if (currentQuestionIndex + 1 >= INTERVIEW_LENGTH) {
      await handleFinishInterview();
    }
  }, [
    currentAnswer,
    currentQuestion,
    candidate.id,
    submitAnswer,
    currentQuestionIndex,
    handleFinishInterview,
    isLoading,
  ]);

  const renderContent = () => {
    if (interview.status === "COMPLETED") {
      return (
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-gray-700">
            Interview complete.
          </p>
        </div>
      );
    }

    if (isLoading && !currentQuestion) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner />
          <p className="mt-4 text-gray-500">Generating your questions...</p>
        </div>
      );
    }

    if (!currentQuestion && interview.status === "IN_PROGRESS") {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner />
          <p className="mt-4 text-gray-500">Preparing next question...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center">
        <p className="font-semibold text-indigo-600">
          Question {currentQuestionIndex + 1} / {INTERVIEW_LENGTH} (
          {currentQuestion.difficulty})
        </p>

        <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">
          {currentQuestion.text}
        </h2>

        <div className="w-full max-w-md my-8">
          <Timer
            duration={currentQuestion.timeLimit}
            onTimeUp={handleSubmit}
            isPaused={isLoading}
          />
        </div>

        <div className="w-full space-y-4">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            disabled={isLoading}
          />

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span className="ml-2">Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Answer
              </>
            )}
          </Button>

          {/* 🔴 Stop Interview Button */}
          <Button
            variant="outline"
            onClick={() => setShowStopModal(true)}
            className="w-full text-red-600 border-red-300 hover:border-red-500"
          >
            Stop Interview
          </Button>

          {/* 🔒 Confirmation Modal */}
          {showStopModal && (
            <Modal isOpen={true} title="Are you sure?">
              <p className="text-gray-500 mb-6 text-left">
                You have an interview in progress. Would you like to resume or
                start a new one?
              </p>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowStopModal(false)}
                >
                  Resume Interview
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    resetCurrentInterview(); // Clear interview
                    setShowStopModal(false);
                  }}
                >
                  Start New
                </Button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6 md:p-8">{renderContent()}</CardContent>
    </Card>
  );
};

export default ChatScreen;
