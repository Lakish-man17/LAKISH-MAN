
import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface AdmissionFormProps {
  onClose: () => void;
  onSave: (student: Student) => void;
  initialData?: Student | null;
}

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    grade: '9th',
    class: 'A',
    parentContact: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Suspended'
  });

  useEffect(() => {
    if (initialData) {
      // Extract section from "10-A" style class string
      const section = initialData.class.split('-')[1] || 'A';
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        grade: initialData.grade,
        class: section,
        parentContact: initialData.parentContact,
        status: initialData.status
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData: Student = {
      id: initialData?.id || `S${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      class: `${formData.grade.replace('th', '')}-${formData.class}`,
      attendance: initialData?.attendance ?? 100,
      performanceScore: initialData?.performanceScore ?? 0,
      enrollmentDate: initialData?.enrollmentDate ?? new Date().toISOString().split('T')[0],
      profileImage: initialData?.profileImage,
      status: formData.status
    };
    onSave(studentData);
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className={`p-8 border-b border-slate-100 flex justify-between items-center ${isEdit ? 'bg-amber-50' : 'bg-blue-50'}`}>
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Edit Student Details' : 'Student Admission Form'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">First Name</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Last Name</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">School Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john.doe@school.edu" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Grade</label>
              <select value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Section/Class</label>
              <select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Parent Contact</label>
              <input required type="tel" value={formData.parentContact} onChange={e => setFormData({...formData, parentContact: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Current Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all ${isEdit ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
              {isEdit ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
