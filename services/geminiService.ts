
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

export class AIService {
  static async analyzeStudentPerformance(student: Student): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      As an educational consultant, analyze the following student data and provide a brief performance summary and 3 specific recommendations for improvement.
      Student: ${student.firstName} ${student.lastName}
      Grade: ${student.grade}
      Performance Score: ${student.performanceScore}/100
      Attendance: ${student.attendance}%
      Status: ${student.status}
      
      Format the output in clear, professional paragraphs.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
        }
      });
      return response.text || "Unable to generate analysis at this time.";
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "An error occurred during AI analysis.";
    }
  }

  static async gradeAssignment(content: string, rubric: string, studentName: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert academic grader. Evaluate the following student assignment for "${studentName}" based on this rubric: ${rubric}.
      
      Assignment Content:
      """
      ${content}
      """
      
      Provide a structured JSON response including a numeric grade (0-100), a list of strengths, and areas for improvement.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Grade from 0 to 100" },
              summary: { type: Type.STRING, description: "Overall feedback summary" },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              letterGrade: { type: Type.STRING, description: "A, B, C, D, or F" }
            },
            required: ["score", "summary", "strengths", "improvements", "letterGrade"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Grading Error:", error);
      throw error;
    }
  }

  static async getAdminAssistantResponse(query: string, context: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are EduPulse AI, an advanced school management assistant.
      Current Context: ${JSON.stringify(context)}
      User Query: "${query}"
      
      Provide a helpful, concise response based on the school data provided in the context. If the user asks for actions (like "generate a report"), explain how the EduPulse interface helps them do that.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      return "Connection to AI failed. Please check your API configuration.";
    }
  }
}
