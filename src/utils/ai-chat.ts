import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

  const apiKey = process.env.GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  const codeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const codeChatSession = model.startChat({
      generationConfig: codeGenerationConfig,
      history: []
    })
export {
  chatSession,
  codeChatSession
}
