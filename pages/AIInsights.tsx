
import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/geminiService';
import { SchoolDatabase } from '../services/db';
import { ICONS } from '../constants';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIInsights: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am EduPulse AI. I have access to your school directory, attendance records, and faculty data. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    // Prepare context for Gemini
    const students = SchoolDatabase.getStudents();
    const teachers = SchoolDatabase.getTeachers();
    const stats = SchoolDatabase.getStats();
    
    const context = {
      summary: stats,
      topStudents: students.sort((a,b) => b.performanceScore - a.performanceScore).slice(0, 3),
      atRiskStudents: students.filter(s => s.attendance < 75 || s.performanceScore < 60),
      facultyCount: teachers.length
    };

    const aiResponse = await AIService.getAdminAssistantResponse(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="p-8 h-[calc(100vh-64px)] flex flex-col animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ICONS.AI className="w-8 h-8 text-purple-600" />
          EduPulse Smart Assistant
        </h2>
        <p className="text-slate-500">Ask about student trends, request lesson plan ideas, or analyze school metrics.</p>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="E.g., 'Summarize student attendance performance for this month'..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
