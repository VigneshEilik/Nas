const Groq = require("groq-sdk");
require("dotenv").config();

let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
} else {
  console.warn("⚠️ GROQ_API_KEY is missing. AI features will be disabled.");
}

const generateSummary = async (content) => {
  if (!groq) throw new Error("AI Service is not configured (missing GROQ_API_KEY)");
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert learning assistant for Nas Academy. Summarize the following lesson content into a concise, engaging 'Golden Nugget' summary with bullet points."
        },
        {
          role: "user",
          content: content
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("[ai.service] Summary generation failed:", error);
    throw new Error("AI Summary failed");
  }
};

const generateQuiz = async (lessonTitle, content) => {
  if (!groq) throw new Error("AI Service is not configured (missing GROQ_API_KEY)");
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quiz master. Based on the lesson content provided, generate 3 multiple-choice questions in JSON format: { questions: [{ question: string, options: [string], answer: number }] }. Ensure options are clear and only return the JSON."
        },
        {
          role: "user",
          content: `Lesson Title: ${lessonTitle}\n\nContent: ${content}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("[ai.service] Quiz generation failed:", error);
    throw new Error("AI Quiz failed");
  }
};

module.exports = { generateSummary, generateQuiz };
