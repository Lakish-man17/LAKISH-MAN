
import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord } from '../types';
import { SchoolDatabase } from '../services/db';

interface AttendanceProps {
  onViewStudent: (student: Student) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ onViewStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, 'P' | 'A' | 'L'>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const s = SchoolDatabase.getStudents();
    setStudents(s);
    const existing = SchoolDatabase.getAttendance(date);
    const mapped = existing.reduce<Record<string, 'P' | 'A' | 'L'>>((acc, r) => ({ 
      ...acc, 
      [r.studentId]: r.status 
    }), {});
    setRecords(mapped);
  }, [date]);

  const updateStatus = (studentId: string, status: 'P' | 'A' | 'L') => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
    if (showSuccessToast) setShowSuccessToast(false);
  };

  const markAllPresent = () => {
    const newRecords: Record<string, 'P' | 'A' | 'L'> = {};
    students.forEach(s => {
      newRecords[s.id] = 'P';
    });
    setRecords(newRecords);
    if (showSuccessToast) setShowSuccessToast(false);
  };

  const handleSave = () => {
    if (students.length === 0) return;
    const toSave: AttendanceRecord[] = Object.entries(records).map(([studentId, status]) => ({
      studentId,
      date,
      status: status as 'P' | 'A' | 'L'
    }));
    SchoolDatabase.saveAttendance(toSave);
    setShowSuccessToast(true);
    // Auto-hide toast after 4 seconds
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="p-8 space-y-6 animate-fadeIn relative">
      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-8 z-[100] animate-bounce-subtle">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <div className="bg-white/20 p-1.5 rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Attendance Synchronized</p>
              <p className="text-xs text-emerald-100 font-medium">Records for {new Date(date).toLocaleDateString()} successfully saved.</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="ml-4 hover:bg-white/10 p-1 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Attendance Ledger</h2>
          <p className="text-slate-500">Record and monitor student presence with automated performance syncing.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-11 bg-white font-medium text-slate-700 shadow-sm transition-all cursor-pointer hover:border-slate-300"
            />
          </div>
          <button 
            onClick={markAllPresent}
            className="px-5 py-2 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-emerald-200 transition-all h-11 flex items-center gap-2 shadow-sm"
          >
            <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Mark All Present
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all h-11 active:scale-95"
          >
            Commit Records
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Identifier</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Presence Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length > 0 ? students.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs overflow-hidden border border-slate-200 group-hover:border-blue-200 transition-colors">
                      {s.profileImage ? (
                        <img src={s.profileImage} className="w-full h-full object-cover" alt={s.firstName} />
                      ) : (
                        `${s.firstName[0]}${s.lastName[0]}`
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{s.firstName} {s.lastName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">ID: {s.id}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Grade {s.grade}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => updateStatus(s.id, 'P')}
                      title="Present"
                      className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all border-2 ${
                        records[s.id] === 'P' 
                          ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100 scale-105' 
                          : 'bg-white border-slate-100 text-slate-300 hover:border-emerald-200 hover:text-emerald-500'
                      }`}
                    >
                      <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-[9px] font-black uppercase">P</span>
                    </button>

                    <button 
                      onClick={() => updateStatus(s.id, 'A')}
                      title="Absent"
                      className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all border-2 ${
                        records[s.id] === 'A' 
                          ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-100 scale-105' 
                          : 'bg-white border-slate-100 text-slate-300 hover:border-rose-200 hover:text-rose-500'
                      }`}
                    >
                      <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-[9px] font-black uppercase">A</span>
                    </button>

                    <button 
                      onClick={() => updateStatus(s.id, 'L')}
                      title="Late"
                      className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all border-2 ${
                        records[s.id] === 'L' 
                          ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-100 scale-105' 
                          : 'bg-white border-slate-100 text-slate-300 hover:border-amber-200 hover:text-amber-500'
                      }`}
                    >
                      <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[9px] font-black uppercase">L</span>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onViewStudent(s)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest group/btn"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-24 text-center">
                  <div className="max-w-xs mx-auto text-slate-400">
                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <p className="font-bold text-slate-800 text-lg mb-1">No Student Data</p>
                    <p className="text-sm">Enroll students in the directory to begin attendance tracking.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 border-dashed">
        <div className="flex gap-4 items-start">
          <div className="p-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-1">Administrative Intelligence</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Attendance data is weighted into the <strong>Student Performance Score</strong>. Consistent lateness or absence triggers a risk notification in the AI Insights panel for proactive counseling.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Attendance;
