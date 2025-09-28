import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const MOCK_DELAY = 1000;

export const extractInfoFromResumeText = async (resumeText) => {
  if (!API_KEY) {
      console.log("SIMULATING resume parsing due to missing API Key.");
      await new Promise(res => setTimeout(res, MOCK_DELAY));
      const nameMatch = resumeText.match(/Name:\s*(.*)/i);
      const emailMatch = resumeText.match(/Email:\s*(.*)/i);
      const phoneMatch = resumeText.match(/Phone:\s*(.*)/i);
      return {
          name: nameMatch ? nameMatch[1].trim() : '',
          email: emailMatch ? emailMatch[1].trim() : '',
          phone: phoneMatch ? phoneMatch[1].trim() : '',
      };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the full name, email address, and phone number from the following resume text. Respond ONLY with a JSON object. If a field is not found, its value should be an empty string. Resume Text: "${resumeText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            email: { type: 'STRING' },
            phone: { type: 'STRING' },
          },
        },
      },
    });
    const result = JSON.parse(response.text);
    return {
      name: result.name || '',
      email: result.email || '',
      phone: result.phone || '',
    };
  } catch (error) {
    console.error("Error extracting resume info:", error);
    return { name: '', email: '', phone: '' };
  }
};

export const generateQuestion = async (difficulty, existingQuestions, resumeText, role) => {
  if (!API_KEY) {
    console.log("SIMULATING question generation due to missing API Key.");
    await new Promise(res => setTimeout(res, MOCK_DELAY));
    return `This is a mock ${difficulty} question for a ${role || "candidate"}.`;
  }

  const prompt = `
You are generating a job interview question for a candidate applying for the role of **${role || 'professional'}**.

Guidelines:
- Focus on the candidate's experience and skills in the resume below.
- Tailor the question to the role: ${role}.
- The difficulty level is: ${difficulty}.
- Keep the question concise (1–3 sentences).
- Do NOT repeat questions from this list: ${existingQuestions.join(', ')}

Resume: """${resumeText}"""

Respond ONLY with the question text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    return "Describe a challenge you faced in your professional field and how you overcame it.";
  }
};



export const evaluateAnswer = async (question, answer) => {
  if (!API_KEY) {
      console.log("SIMULATING answer evaluation due to missing API Key.");
      await new Promise(res => setTimeout(res, MOCK_DELAY));
      return { score: Math.floor(Math.random() * 4) + 6, feedback: "This is mock feedback. The answer shows good understanding." };
  }
  const prompt = `An interview candidate was asked: "${question}". They answered: "${answer}". Evaluate the answer's technical accuracy, clarity, and depth. Provide a score from 1-10 and brief feedback. Respond with a JSON object containing "score" (number) and "feedback" (string).`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: 'OBJECT',
          properties: {
            score: { type: 'NUMBER' },
            feedback: { type: 'STRING' },
          },
          required: ['score', 'feedback']
        },
      },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return { score: 5, feedback: "AI evaluation failed. Manual review needed." };
  }
};

export const generateSummary = async (interviewData) => {
  if (!API_KEY) {
      console.log("SIMULATING summary generation due to missing API Key.");
      await new Promise(res => setTimeout(res, MOCK_DELAY));
      return "This is a mock summary. The candidate performed well overall, demonstrating strong skills in key areas.";
  }
  const transcript = interviewData.questions.map(q => `Q: ${q.text}\nA: ${q.answer}\nScore: ${q.score}\nFeedback: ${q.feedback}`).join('\n\n');
  const prompt = `Based on the following interview transcript, write a short, professional summary of the candidate's performance, strengths, and weaknesses. \n\nTranscript:\n${transcript}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate AI summary.";
  }
};
