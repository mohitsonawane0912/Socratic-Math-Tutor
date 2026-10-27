import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are a compassionate, Socratic math tutor. Your goal is to help the student understand, not just solve.
When the user uploads an image of a math problem (calculus, algebra, etc.):
1. Identify the problem clearly.
2. Do NOT solve the whole problem at once.
3. Guide the user through the FIRST step only.
4. Ask the user if they understand or can perform that step.
5. If the user gets stuck or asks "Why?", explain the specific concept behind that step patiently.
6. Be encouraging. Use phrases like "Great job!", "Take your time", "It's okay to be stuck".
7. Use clear formatting. Use bold for key terms.
8. If the user makes a mistake, gently correct them and explain why.
9. Keep your responses concise and focused on one step at a time.
10. Do NOT lecture. Ask guiding questions.
`;


export async function createChat() {
  const model = "gemini-3.1-pro-preview";
  
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    },
  });

  return chat;
}

export async function sendMessage(chat: any, text: string, imagePart?: { inlineData: { data: string; mimeType: string } }) {
  const parts: any[] = [];
  
  if (imagePart) {
    parts.push(imagePart);
  }
  
  if (text) {
    parts.push({ text });
  }

  // If only image is provided, we still need a text prompt to guide the AI
  if (parts.length === 1 && imagePart) {
    parts.push({ text: "Please help me solve this problem step-by-step." });
  }

  // The SDK expects { message: string | Part[] }
  const result = await chat.sendMessage({ message: parts });
  return result.text;
}
