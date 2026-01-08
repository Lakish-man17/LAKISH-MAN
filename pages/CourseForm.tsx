
import React, { useState } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  onClose: () => void;
  onSave: (course: Course) => void;
  teachers: string[];
}

const CourseForm: React.FC<CourseFormProps> = ({ onClose, onSave, teachers }) => {
  const [formData, setFormData] = useState({
    title: '',
    teacherName: teachers[0] || 'Unassigned',
    schedule: '',
    credits: 3,
    room: '',
    capacity: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `C${Math.floor(300 + Math.random() * 600)}`,
      ...formData,
    };
    onSave(newCourse);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-50">
          <h3 className="text-xl font-bold text-slate-800">Add New Course</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Course Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Modern World History" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Assigned Teacher</label>
            <select value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
              {teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Room No.</label>
              <input required type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Room 204" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Credits</label>
              <input required type="number" min="1" max="5" value={formData.credits} onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Capacity</label>
              <input required type="number" min="1" max="200" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 ml-1">Weekly Schedule</label>
            <input required type="text" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mon, Wed 10:00 AM" />
          </div>

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Create Course</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Default export added to resolve import error in App.tsx
export default CourseForm;
