
import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';

interface TeacherFormProps {
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  initialData?: Teacher | null;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    experience: 1,
    status: 'Available' as 'Available' | 'On Leave' | 'Busy',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        subject: initialData.subject,
        email: initialData.email,
        experience: initialData.experience,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacherData: Teacher = {
      id: initialData?.id || `T${Math.floor(2000 + Math.random() * 9000)}`,
      ...formData,
      assignedClasses: initialData?.assignedClasses || [],
    };
    onSave(teacherData);
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className={`p-8 border-b border-slate-100 flex justify-between items-center ${isEdit ? 'bg-amber-50' : 'bg-indigo-50'}`}>
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Update Faculty Details' : 'Add New Faculty'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Dr. Jane Smith" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Primary Subject</label>
              <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Experience (Years)</label>
              <input required type="number" min="0" value={formData.experience} onChange={e => setFormData({...formData, experience: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Professional Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="j.smith@school.edu" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Current Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option value="Available">Available</option>
              <option value="On Leave">On Leave</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all ${isEdit ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}>
              {isEdit ? 'Save Changes' : 'Register Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
