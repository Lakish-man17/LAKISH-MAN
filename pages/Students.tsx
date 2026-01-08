
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
            className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <span>+ Enroll New Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Grade/Class</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden border border-slate-100">
                        {s.profileImage ? (
                          <img src={s.profileImage} className="w-full h-full object-cover" alt={s.firstName} />
                        ) : (
                          <span>{s.firstName[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">#{s.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">{s.grade}</span>
                    <span className="text-xs text-slate-400 block">{s.class}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${s.attendance > 90 ? 'bg-emerald-500' : s.attendance > 75 ? 'bg-orange-400' : 'bg-rose-500'}`} 
                        style={{ width: `${s.attendance}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-1 block">{s.attendance}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                      s.status === 'Suspended' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => setEditingStudent(s)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Edit Student"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setDeletingStudent(s)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Student"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onViewStudent(s)}
                        className="px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl font-bold text-sm transition-all"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
