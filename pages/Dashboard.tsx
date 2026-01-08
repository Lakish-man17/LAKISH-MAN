
import React, { useMemo } from 'react';
import { SchoolStats, Student } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  stats: SchoolStats;
  recentStudents: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, recentStudents }) => {
  // Mock data for School Activity
  const activityData = [
    { name: 'Mon', activity: 82 },
    { name: 'Tue', activity: 85 },
    { name: 'Wed', activity: 89 },
    { name: 'Thu', activity: 84 },
    { name: 'Fri', activity: 91 },
  ];

  // Performance Trends by Grade Level
  const gradeTrendsData = [
    { month: 'Sep', '9th': 72, '10th': 78, '11th': 82, '12th': 85 },
    { month: 'Oct', '9th': 75, '10th': 76, '11th': 84, '12th': 88 },
    { month: 'Nov', '9th': 78, '10th': 81, '11th': 85, '12th': 87 },
    { month: 'Dec', '9th': 82, '10th': 84, '11th': 88, '12th': 92 },
  ];

  // Subject Performance Trends
  const subjectTrendsData = [
    { month: 'Sep', Math: 80, Science: 70, Literature: 85, History: 75 },
    { month: 'Oct', Math: 82, Science: 74, Literature: 88, History: 78 },
    { month: 'Nov', Math: 85, Science: 72, Literature: 90, History: 81 },
    { month: 'Dec', Math: 88, Science: 78, Literature: 92, History: 84 },
  ];

  // Calculate real-time Grade Distribution
  const gradeDistributionData = useMemo(() => {
    const counts: Record<string, number> = { '9th': 0, '10th': 0, '11th': 0, '12th': 0 };
    recentStudents.forEach(s => {
      if (counts[s.grade] !== undefined) {
        counts[s.grade]++;
      }
    });
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }));
  }, [recentStudents]);

  const barColors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">System Overview</h2>
          <p className="text-slate-500 mt-1">Real-time academic and operational metrics for EduPulse.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Academic Year</p>
          <p className="text-lg font-semibold text-slate-700">2023 - 2024</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats.totalStudents, color: 'bg-blue-500', trend: '+12%' },
          { label: 'Avg Attendance', value: `${stats.averageAttendance}%`, color: 'bg-emerald-500', trend: '+2.4%' },
          { label: 'Total Faculty', value: stats.totalTeachers, color: 'bg-purple-500', trend: 'Stable' },
          { label: 'Active Classes', value: stats.activeClasses, color: 'bg-orange-500', trend: 'Updated' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.color} bg-opacity-10 text-slate-800`}>
                <span className={`w-3 h-3 block rounded-full ${stat.color}`}></span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="mt-4 text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Main Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:col-span-2">
            {/* Chart 1: School Activity Trend */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Engagement Activity</h3>
            <div className="h-64 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                    <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </div>

            {/* Chart 4: Grade Distribution Bar Chart */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Grade Distribution</h3>
            <div className="h-64 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                    <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                        {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        </div>

        {/* Chart 2: Grade Performance Trends */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Grade Performance History</h3>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeTrendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="9th" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                <Line type="monotone" dataKey="10th" stroke="#10b981" strokeWidth={2} dot={{r: 3}} />
                <Line type="monotone" dataKey="11th" stroke="#a855f7" strokeWidth={2} dot={{r: 3}} />
                <Line type="monotone" dataKey="12th" stroke="#f97316" strokeWidth={2} dot={{r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Subject Performance Trends */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Subject Trends</h3>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subjectTrendsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Line name="Math" type="monotone" dataKey="Math" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                <Line name="Science" type="monotone" dataKey="Science" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                <Line name="Literature" type="monotone" dataKey="Literature" stroke="#a855f7" strokeWidth={3} dot={{r: 4}} />
                <Line name="History" type="monotone" dataKey="History" stroke="#f97316" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Achievement Leaderboard */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Top Performing Students</h3>
            <button className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">Generate Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Grade</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentStudents.slice(0, 5).sort((a,b) => b.performanceScore - a.performanceScore).map((student, idx) => (
                  <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-400">#0{idx + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} className="w-full h-full object-cover" alt={student.firstName} />
                          ) : (
                            student.firstName[0]
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-slate-400">ID: {student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{student.grade}</span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-block">
                        <p className="text-sm font-bold text-emerald-600">{student.performanceScore}%</p>
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div className="bg-emerald-500 h-full" style={{ width: `${student.performanceScore}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Proficiency Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Department Proficiency</h3>
          <div className="space-y-6 flex-1">
            {[
              { subject: 'Mathematics', percent: 88, color: 'bg-blue-500' },
              { subject: 'Science', percent: 74, color: 'bg-emerald-500' },
              { subject: 'Literature', percent: 92, color: 'bg-purple-500' },
              { subject: 'History', percent: 81, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{item.subject}</span>
                  <span className="font-bold text-slate-400">{item.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-bold text-blue-600">Observation:</span> Humanities performance is leading this term with an average of 86.5%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
