import React from "react";
import { Card, CardContent } from "../ui/Card.jsx";
import { Mail, Phone, BarChart, MessageSquare } from "lucide-react";

export const CandidateDetailView = ({ candidate }) => {
 return (
  <Card>
    <CardContent className="p-0">
      <div className="p-6 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
        <div className="flex space-x-6 mt-2 text-sm text-gray-600">
          <span className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-blue-600" />
            {candidate.email}
          </span>
          <span className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-blue-600" />
            {candidate.phone}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-2 text-blue-700">
            <BarChart className="w-5 h-5 mr-2 text-teal-600" />
            AI Summary & Score
          </h3>
          <p className="font-bold text-2xl mb-2 text-gray-400">
            {candidate.interview.finalScore}/100
          </p>
          <p className="text-gray-700">
            {candidate.interview.summary}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center mb-4 text-blue-700">
            <MessageSquare className="w-5 h-5 mr-2 text-teal-600" />
            Interview Transcript
          </h3>
          <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
            {candidate.interview.questions.map((q, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-700"
              >
                <p className="font-semibold text-white">
                  Q: {q.text}
                </p>
                <p className="mt-2 text-white italic">
                  A: {q.answer}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between items-center text-sm">
                  <span className="font-bold text-teal-600">
                    Score: {q.score}/10
                  </span>
                  <p className="text-gray-500 text-right">{q.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

};
