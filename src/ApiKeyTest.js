import { GoogleGenerativeAI } from '@google/generative-ai';

// Test function to verify API key
export const testApiKey = async (apiKey) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};