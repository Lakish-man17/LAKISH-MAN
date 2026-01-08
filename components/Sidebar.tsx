
import React from 'react';
import { AppRoute } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const menuItems = [
    { id: AppRoute.DASHBOARD, label: 'Dashboard', icon: ICONS.Dashboard },
    { id: AppRoute.STUDENTS, label: 'Students', icon: ICONS.Students },
    { id: AppRoute.ATTENDANCE, label: 'Attendance', icon: ICONS.Attendance },
    { id: AppRoute.TEACHERS, label: 'Teachers', icon: ICONS.Teachers },
    { id: AppRoute.ACADEMICS, label: 'Courses', icon: ICONS.Academics },
    { id: AppRoute.AI_INSIGHTS, label: 'AI Assistant', icon: ICONS.AI },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col transition-all duration-300 z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">E</div>
        <h1 className="text-xl font-bold text-white tracking-tight">EduPulse</h1>
      </div>

      <nav className="mt-6 flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-2 ${
              currentRoute === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800" alt="Admin" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Principal Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@edupulse.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
