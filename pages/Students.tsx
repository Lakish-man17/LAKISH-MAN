
import React, { useState } from 'react';
import { Student } from '../types';
import { ICONS } from '../constants';
import AdmissionForm from './AdmissionForm';

interface StudentsProps {
  students: Student[];
  onAddStudent: () => void;
  onViewStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const Students: React.FC<StudentsProps> = ({ students, onAddStudent, onViewStudent, onUpdateStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const grades = ['All', '9th', '10th', '11th', '12th'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'All' || s.grade === filterGrade;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Grade', 'Class', 'Attendance', 'Performance', 'Status', 'Enrollment Date'];
    const csvRows = filteredStudents.map(s => [
      s.id, s.firstName, s.lastName, s.email, s.grade, s.class, `${s.attendance}%`, `${s.performanceScore}%`, s.status, s.enrollmentDate
    ].map(field => `"${field}"`).join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduPulse_Students_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmDelete = () => {
    if (deletingStudent) {
      onDeleteStudent(deletingStudent.id);
      setDeletingStudent(null);
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
          <p className="text-slate-500">Manage student profiles, attendance, and performance.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button 
            onClick={onAddStudent}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <span>+ Enroll New Student</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px] shadow-sm font-medium text-slate-600"
          >
            {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px] shadow-sm font-medium text-slate-600"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredStudents.length > 0 ? filteredStudents.map((s) => (
          <div key={s.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden flex flex-col sm:flex-row">
            {/* Identity Column (Left) */}
            <div className="p-6 sm:w-1/3 flex flex-col items-center justify-center text-center bg-slate-50/50 border-b sm:border-b-0 sm:border-r border-slate-100">
              <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden border-2 border-white shadow-sm mb-4">
                {s.profileImage ? (
                  <img src={s.profileImage} className="w-full h-full object-cover" alt={s.firstName} />
                ) : (
                  <span>{s.firstName[0]}</span>
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">{s.firstName} {s.lastName}</h3>
              <p className="text-xs font-black text-blue-600 mt-1 uppercase tracking-widest">ID: {s.id}</p>
              
              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setEditingStudent(s)}
                  className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-amber-100"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setDeletingStudent(s)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => onViewStudent(s)}
                  className="p-2.5 text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                  title="View Profile"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Details Grid (Right) */}
            <div className="p-6 sm:w-2/3 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-xs font-semibold text-slate-700 truncate">{s.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade & Class</p>
                  <p className="text-xs font-semibold text-slate-700">{s.grade} — {s.class}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${s.attendance > 90 ? 'bg-emerald-500' : s.attendance > 75 ? 'bg-orange-400' : 'bg-rose-500'}`} 
                        style={{ width: `${s.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{s.attendance}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                    s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                    s.status === 'Suspended' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Enrolled: {s.enrollmentDate}</p>
                </div>
                <button 
                  onClick={() => onViewStudent(s)}
                  className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                >
                  View Performance →
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="xl:col-span-2 py-24 text-center">
            <div className="max-w-xs mx-auto text-slate-400">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ICONS.Search className="w-10 h-10" />
              </div>
              <p className="font-bold text-slate-800 text-xl mb-1">No Results Found</p>
              <p className="text-sm">We couldn't find any students matching your current search or filters.</p>
            </div>
          </div>
        )}
      </div>

      {editingStudent && (
        <AdmissionForm 
          initialData={editingStudent}
          onClose={() => setEditingStudent(null)} 
          onSave={(updated) => {
            onUpdateStudent(updated);
            setEditingStudent(null);
          }} 
        />
      )}

      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Student Record?</h3>
              <p className="text-slate-500 mb-8">
                You are about to permanently delete the record for <span className="font-bold text-slate-800">{deletingStudent.firstName} {deletingStudent.lastName}</span>. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingStudent(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
