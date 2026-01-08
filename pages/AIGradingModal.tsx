
import React, { useState } from 'react';
import { Student, Course } from '../types';
import { AIService } from '../services/geminiService';

interface AIGradingModalProps {
  course: Course;
  students: Student[];
  onClose: () => void;
}

const AIGradingModal: React.FC<AIGradingModalProps> = ({ course, students, onClose }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [content, setContent] = useState('');
  const [rubric, setRubric] = useState('Clarity of thought, accuracy of facts, and proper citation of sources.');
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGrade = async () => {
    if (!selectedStudentId || !content.trim()) return;
    
    setIsGrading(true);
    try {
      const student = students.find(s => s.id === selectedStudentId);
      const res = await AIService.gradeAssignment(content, rubric, student ? `${student.firstName} ${student.lastName}` : 'Student');
      setResult(res);
    } catch (error) {
      alert("Grading failed. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-purple-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-purple-600 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </span>
              AI Grading Assistant
            </h3>
            <p className="text-sm text-slate-500 mt-1">{course.title} • Assignment Evaluation</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {!result ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Select Student</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.id})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Grading Rubric</label>
                  <input 
                    type="text" 
                    value={rubric}
                    onChange={e => setRubric(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Focus criteria..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600">Assignment Content</label>
                <textarea 
                  rows={8}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  placeholder="Paste student's essay or quiz responses here..."
                ></textarea>
              </div>

              <button 
                onClick={handleGrade}
                disabled={isGrading || !selectedStudentId || !content.trim()}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
              >
                {isGrading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <span>Evaluate Assignment</span>
                )}
              </button>
            </>
          ) : (
            <div className="animate-fadeIn space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-8 border-purple-100 flex items-center justify-center relative">
                   <div className="text-center">
                      <p className="text-3xl font-black text-purple-600">{result.score}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                   </div>
                   <div className="absolute -top-1 -right-1 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                      {result.letterGrade}
                   </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-800">Grading Summary</h4>
                  <p className="text-slate-600 text-sm leading-relaxed italic mt-1">"{result.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                  <h5 className="text-emerald-700 font-bold text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Key Strengths
                  </h5>
                  <ul className="space-y-2">
                    {result.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-emerald-800 font-medium">• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <h5 className="text-amber-700 font-bold text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Areas for Growth
                  </h5>
                  <ul className="space-y-2">
                    {result.improvements.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-amber-800 font-medium">• {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setResult(null)} 
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Grade Another
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
                >
                  Finish Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIGradingModal;
