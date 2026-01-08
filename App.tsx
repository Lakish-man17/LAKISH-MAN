
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AIInsights from './pages/AIInsights';
import Attendance from './pages/Attendance';
import AdmissionForm from './pages/AdmissionForm';
import TeacherForm from './pages/TeacherForm';
import CourseForm from './pages/CourseForm';
import AIGradingModal from './pages/AIGradingModal';
import { AppRoute, Student, SchoolStats, Teacher, Course, CourseEnrollment } from './types';
import { SchoolDatabase } from './services/db';
import { AIService } from './services/geminiService';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  
  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAdmission, setShowAdmission] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState<string | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [gradingCourse, setGradingCourse] = useState<Course | null>(null);
  
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStudents(SchoolDatabase.getStudents());
    setTeachers(SchoolDatabase.getTeachers());
    setCourses(SchoolDatabase.getCourses());
    setEnrollments(SchoolDatabase.getEnrollments());
    setStats(SchoolDatabase.getStats());
    
    if (selectedStudent) {
      const updated = SchoolDatabase.getStudents().find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
      else setSelectedStudent(null); 
    }
  };

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
  };

  const handleAddStudent = (newStudent: Student) => {
    SchoolDatabase.saveStudent(newStudent);
    refreshData();
    setShowAdmission(false);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    SchoolDatabase.saveStudent(updatedStudent);
    refreshData();
  };

  const handleDeleteStudent = (id: string) => {
    SchoolDatabase.deleteStudent(id);
    refreshData();
  };

  const handleUpdateStudentImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStudent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedStudent = { ...selectedStudent, profileImage: base64String };
        SchoolDatabase.saveStudent(updatedStudent);
        refreshData();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    SchoolDatabase.saveTeacher(teacher);
    refreshData();
    setShowTeacherForm(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm('Are you sure you want to remove this faculty member? This action cannot be undone.')) {
      SchoolDatabase.deleteTeacher(id);
      refreshData();
    }
  };

  const handleAddCourse = (newCourse: Course) => {
    SchoolDatabase.saveCourse(newCourse);
    refreshData();
    setShowCourseForm(false);
  };

  const handleEnrollStudent = (courseId: string, studentId: string) => {
    const course = courses.find(c => c.id === courseId);
    const count = enrollments.filter(e => e.courseId === courseId).length;
    
    if (course && count >= course.capacity) {
      alert("Error: Course capacity reached. Cannot enroll more students.");
      return;
    }

    SchoolDatabase.enrollStudent(courseId, studentId);
    refreshData();
    setEnrollCourseId(null);
  };

  const handleUnenroll = (courseId: string, studentId: string) => {
    if (window.confirm('Remove student from this course?')) {
      SchoolDatabase.unenrollStudent(courseId, studentId);
      refreshData();
    }
  };

  const handleViewStudent = async (student: Student) => {
    setSelectedStudent(student);
    setIsAnalyzing(true);
    setAiAnalysis('Generating AI Insight...');
    const analysis = await AIService.analyzeStudentPerformance(student);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowTeacherForm(true);
  };

  const handleLogout = () => {
    if (window.confirm('Delete current session and logout as Super Admin?')) {
       window.location.reload();
    }
  }

  const renderContent = () => {
    switch(currentRoute) {
      case AppRoute.DASHBOARD:
        return stats && <Dashboard stats={stats} recentStudents={students} />;
      case AppRoute.STUDENTS:
        return <Students 
          students={students} 
          onAddStudent={() => setShowAdmission(true)} 
          onViewStudent={handleViewStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
        />;
      case AppRoute.ATTENDANCE:
        return <Attendance onViewStudent={handleViewStudent} />;
      case AppRoute.TEACHERS:
        return (
          <div className="p-8 animate-fadeIn print:hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Faculty Directory</h2>
                <p className="text-slate-500">Manage school educators and staff information.</p>
              </div>
              <button 
                onClick={() => { setEditingTeacher(null); setShowTeacherForm(true); }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <span>+ Register Teacher</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                   <div className="flex justify-between items-start mb-4">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">{t.name[0]}</div>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => handleEditTeacher(t)}
                         className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                         title="Edit Teacher"
                       >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                         </svg>
                       </button>
                       <button 
                         onClick={() => handleDeleteTeacher(t.id)}
                         className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                         title="Delete Teacher"
                       >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                       </button>
                     </div>
                   </div>
                   <h3 className="font-bold text-lg text-slate-800">{t.name}</h3>
                   <p className="text-blue-600 font-semibold mb-2">{t.subject}</p>
                   <div className="space-y-1 text-sm text-slate-500">
                      <p>ID: {t.id}</p>
                      <p>Experience: {t.experience} years</p>
                      <p>Email: {t.email}</p>
                   </div>
                   <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        t.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                        t.status === 'On Leave' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                      }`}>{t.status}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );
      case AppRoute.ACADEMICS:
        return (
          <div className="p-8 animate-fadeIn print:hidden">
             <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Academic Courses</h2>
                <p className="text-slate-500">Curriculum schedule and credit management.</p>
              </div>
              <button 
                onClick={() => setShowCourseForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 flex items-center gap-2"
              >
                <span>+ Create Course</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {courses.length > 0 ? courses.map(c => {
                const courseEnrollments = enrollments.filter(e => e.courseId === c.id);
                const isExpanded = expandedCourseId === c.id;
                const capacityPercent = Math.min((courseEnrollments.length / (c.capacity || 1)) * 100, 100);
                const isFull = courseEnrollments.length >= (c.capacity || 1);
                
                return (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-blue-200 transition-all">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4 items-center min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                          {c.id}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{c.title}</h4>
                          <p className="text-sm text-slate-500">{c.teacherName} • {c.room}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 flex-1">
                        <div className="text-right hidden lg:block">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Schedule</p>
                          <p className="text-sm font-semibold text-slate-700">{c.schedule}</p>
                        </div>
                        
                        <div className="flex-1 max-w-[200px]">
                          <div className="flex justify-between items-end mb-1">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Capacity</p>
                             <p className={`text-xs font-bold ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
                               {courseEnrollments.length} / {c.capacity}
                             </p>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${isFull ? 'bg-rose-500' : capacityPercent > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                              style={{ width: `${capacityPercent}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 flex justify-between items-center">
                             <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${isFull ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                               {isFull ? 'Full' : 'Available'}
                             </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => setGradingCourse(c)}
                          className="flex-1 md:flex-none px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-100 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                          AI Grade
                        </button>
                        <button 
                          onClick={() => setEnrollCourseId(c.id)}
                          disabled={isFull}
                          className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-sm transition-colors ${isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                          Enroll
                        </button>
                        <button 
                          onClick={() => setExpandedCourseId(isExpanded ? null : c.id)}
                          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${isExpanded ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {isExpanded ? 'Hide Students' : 'View Students'}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-50 animate-fadeIn">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Currently Enrolled</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {courseEnrollments.map(e => {
                            const s = students.find(std => std.id === e.studentId);
                            if (!s) return null;
                            return (
                              <div key={s.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  {s.profileImage ? (
                                    <img src={s.profileImage} className="w-8 h-8 rounded-lg object-cover" alt={s.firstName} />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{s.firstName[0]}</div>
                                  )}
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">{s.firstName} {s.lastName}</p>
                                    <p className="text-[10px] text-slate-400">ID: {s.id}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleUnenroll(c.id, s.id)}
                                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            );
                          })}
                          {courseEnrollments.length === 0 && (
                            <p className="col-span-full py-8 text-center text-sm text-slate-400 italic">No students enrolled in this course yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="p-12 text-center text-slate-400">No courses registered yet.</div>
              )}
            </div>
          </div>
        );
      case AppRoute.AI_INSIGHTS:
        return <AIInsights />;
      default:
        return stats && <Dashboard stats={stats} recentStudents={students} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="print:hidden">
        <Sidebar currentRoute={currentRoute} onNavigate={handleNavigate} />
      </div>
      
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-8 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 font-medium">EduPulse</span>
            <span className="text-sm text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-700 capitalize tracking-tight">{currentRoute.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l border-slate-100 pl-6 group relative">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900">Admin User</p>
                <div className="flex items-center justify-end gap-1.5">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                   <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Super Admin</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 shadow-lg flex items-center justify-center text-white font-bold border border-slate-700">
                AU
              </div>
              {/* Administrative Quick Actions Dropdown Overlay */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-sm font-bold"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-[1600px] w-full mx-auto print:max-w-none print:w-full print:mx-0">
          {renderContent()}
        </div>
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUpdateStudentImage} 
      />

      {showAdmission && <AdmissionForm onClose={() => setShowAdmission(false)} onSave={handleAddStudent} />}
      {showTeacherForm && <TeacherForm onClose={() => { setShowTeacherForm(false); setEditingTeacher(null); }} onSave={handleSaveTeacher} initialData={editingTeacher} />}
      {showCourseForm && <CourseForm onClose={() => setShowCourseForm(false)} onSave={handleAddCourse} teachers={teachers.map(t => t.name)} />}
      
      {enrollCourseId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Enroll Student in {courses.find(c => c.id === enrollCourseId)?.title}</h3>
              <button onClick={() => setEnrollCourseId(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Select Student to Enroll</p>
              {students
                .filter(s => !enrollments.some(e => e.courseId === enrollCourseId && e.studentId === s.id))
                .map(s => (
                <button 
                  key={s.id}
                  onClick={() => handleEnrollStudent(enrollCourseId, s.id)}
                  className="w-full text-left p-4 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden">
                    {s.profileImage ? (
                      <img src={s.profileImage} className="w-full h-full object-cover" alt={s.firstName} />
                    ) : (
                      s.firstName[0]
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-slate-400">{s.grade} • {s.id}</p>
                  </div>
                  <span className="text-blue-600 opacity-0 group-hover:opacity-100 font-bold text-xs uppercase tracking-widest">Select</span>
                </button>
              ))}
              {students.filter(s => !enrollments.some(e => e.courseId === enrollCourseId && e.studentId === s.id)).length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm italic">All students are already enrolled or no students available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {gradingCourse && (
        <AIGradingModal 
          course={gradingCourse}
          students={students.filter(s => enrollments.some(e => e.courseId === gradingCourse.id && e.studentId === s.id))}
          onClose={() => setGradingCourse(null)}
        />
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:static print:bg-white print:p-0 print:z-0">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn print:rounded-none print:max-w-none print:max-h-none print:shadow-none print:w-full">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start print:border-b-2 print:border-slate-200">
              <div className="flex gap-6 items-center">
                <div 
                  className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-200 print:shadow-none relative group overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to update student photo"
                >
                  {selectedStudent.profileImage ? (
                    <img src={selectedStudent.profileImage} className="w-full h-full object-cover" alt={selectedStudent.firstName} />
                  ) : (
                    selectedStudent.firstName[0]
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase text-white print:hidden">
                    Edit Photo
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-slate-400 font-medium">#{selectedStudent.id} • {selectedStudent.grade} Grade</p>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <button 
                  onClick={handlePrintReport}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Generate PDF Report
                </button>
                <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 print:overflow-visible print:grid-cols-1">
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 print:bg-white print:border-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Attendance Rate</p>
                    <p className="text-2xl font-bold text-slate-800">{selectedStudent.attendance}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                       <div className="bg-blue-500 h-full" style={{ width: `${selectedStudent.attendance}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 print:bg-white print:border-2">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Performance Score</p>
                    <p className="text-2xl font-bold text-slate-800">{selectedStudent.performanceScore}%</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                       <div className="bg-emerald-500 h-full" style={{ width: `${selectedStudent.performanceScore}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 print:border-2">
                  <h4 className="font-bold text-slate-800 border-b border-slate-50 pb-2 uppercase tracking-wider text-xs">Official Record</h4>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-700">{selectedStudent.email}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Contact</span><span className="font-semibold text-slate-700">{selectedStudent.parentContact}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Enrollment</span><span className="font-semibold text-slate-700">{selectedStudent.enrollmentDate}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><span className="font-bold text-emerald-600">{selectedStudent.status}</span></div>
                </div>

                <div className="hidden print:block text-[10px] text-slate-400 italic pt-8 border-t border-slate-100">
                  This is an automated progress report generated by EduPulse SMS. All data is synchronized as of {new Date().toLocaleDateString()}.
                </div>
              </div>

              <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 print:bg-white print:border-2 print:border-blue-100">
                <div className="flex items-center gap-2 mb-6 text-blue-700">
                  <div className="p-2 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-200 print:hidden">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <h4 className="text-lg font-bold">AI Counselor Analysis</h4>
                </div>
                {isAnalyzing ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-blue-100 rounded w-full"></div>
                    <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                    <div className="h-4 bg-blue-100 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium prose prose-slate">
                    {aiAnalysis}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:static { position: static !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:border-2 { border-width: 2px !important; border-style: solid !important; }
          .print\\:border-b-2 { border-bottom-width: 2px !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:overflow-visible { overflow: visible !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          
          @page {
            size: A4;
            margin: 1cm;
          }
          
          main { margin: 0 !important; padding: 0 !important; }
          aside, nav, header { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
