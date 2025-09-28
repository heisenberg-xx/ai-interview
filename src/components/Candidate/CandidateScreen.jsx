import React from "react";
import { useInterviewStore } from "../../store/useStore.js";
import MissingInfoForm from "./MissingInfoForm.jsx";
import { Card, CardContent } from "../ui/Card.jsx";
import { Award, CheckCircle, FileText } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import ChatScreen from "./ChatScreen.jsx";
import UploaddResume from "./UploadResume.jsx";

 const CandidateScreen = () => {
  const { candidates, currentCandidateId, resetCurrentInterview } =
    useInterviewStore();
  const currentCandidate = candidates.find((c) => c.id === currentCandidateId);

  const renderContent = () => {
    if (!currentCandidate) {
      return (
        <div className="text-center p-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-white">
            Start your interview
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume to begin.
          </p>
          <div className="mt-6">
            <UploaddResume />
          </div>
        </div>
      );
    }

    switch (currentCandidate.interview.status) {
      case "AWAITING_MISSING_INFO":
        return <MissingInfoForm candidate={currentCandidate} />;

      case "IN_PROGRESS":
        return <ChatScreen candidate={currentCandidate} />;

      case "COMPLETED":
        return (
          <div className="text-center p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-200">
              Interview Completed!
            </h2>
            <p className="mt-2 text-gray-600">
              Thank you for your time. The hiring team will be in touch.
            </p>

            <div className="mt-8">
              <Card className="max-w-md mx-auto">
                <CardContent>
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg text-white font-semibold">
                      Final Score: {currentCandidate.interview.finalScore}/100
                    </h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 text-left">
                    <strong>AI Summary:</strong>{" "}
                    {currentCandidate.interview.summary}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Button  onClick={resetCurrentInterview}>
                Start New Interview
              </Button>
            </div>
          </div>
        );

      default:
        return <ResumeUpload />;
    }
  };

  return <div className="max-w-3xl mx-auto">{renderContent()}</div>;
};

export default CandidateScreen;
