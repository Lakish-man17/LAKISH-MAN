
import React, { useState, useEffect } from 'react';
import { Course } from '../types';

interface CourseFormProps {
  onClose: () => void;
  onSave: (course: Course) => void;
  teachers: string[];
  initialData?: Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ onClose, onSave, teachers, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    teacherName: teachers[0] || 'Unassigned',
    schedule: '',
    credits: 3,
    room: '',
    capacity: 30,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        teacherName: initialData.teacherName,
        schedule: initialData.schedule,
        credits: initialData.credits,
        room: initialData.room,
        capacity: initialData.capacity,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData: Course = {
      id: initialData?.id || `C${Math.floor(300 + Math.random() * 600)}`,
      ...formData,
    };
    onSave(courseData);
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-scaleIn">
        <div className={`p-8 border-b border-slate-100 flex justify-between items-center ${isEdit ? 'bg-amber-50' : 'bg-blue-50'}`}>
          <h3 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Edit Course Details' : 'Add New Course'}
          </h3>
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
            <select value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
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
            <button type="submit" className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all ${isEdit ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
              {isEdit ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
