import React, { useState } from "react";
import { useInterviewStore } from "../../store/useStore.js";
import { parseResumeFile } from "../../services/resumeParserService.js";
import { extractInfoFromResumeText } from "../../services/geminiService.js";
import { Button } from "../ui/Button.jsx";
import { Spinner } from "../ui/Spinner.jsx";
import { UploadCloud } from "lucide-react";

const UploaddResume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addCandidate, setCurrentCandidateId, updateCandidate } =
    useInterviewStore();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const resumeText = await parseResumeFile(file);
      const extractedInfo = await extractInfoFromResumeText(resumeText);

      const newCandidate = addCandidate({ resumeText, ...extractedInfo });
      setCurrentCandidateId(newCandidate.id);

      const status =
        !extractedInfo.name || !extractedInfo.email || !extractedInfo.phone
          ? "AWAITING_MISSING_INFO"
          : "IN_PROGRESS";

      updateCandidate(newCandidate.id, {
        interview: { ...newCandidate.interview, status },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-[#171717] rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col items-center space-y-5">
        <label
          htmlFor="resume-upload"
          className="cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors"
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-3 block text-sm font-medium text-gray-700">
            {file ? file.name : "Click to upload your Resume (PDF or DOCX)"}
          </span>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button onClick={handleSubmit} disabled={!file || isLoading}>
          {isLoading ? (
            <div className="flex items-center">
              <Spinner />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            "Start Interview"
          )}
        </Button>
      </div>
    </div>
  );
};
export default UploaddResume;
