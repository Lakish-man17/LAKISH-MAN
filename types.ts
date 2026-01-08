
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  class: string;
  attendance: number; // percentage
  performanceScore: number; // 0-100
  enrollmentDate: string;
  parentContact: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  profileImage?: string; // Base64 string
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  experience: number;
  assignedClasses: string[];
  status: 'Available' | 'On Leave' | 'Busy';
}

export interface Course {
  id: string;
  title: string;
  teacherName: string;
  schedule: string;
  credits: number;
  room: string;
  capacity: number;
}

export interface CourseEnrollment {
  courseId: string;
  studentId: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'P' | 'A' | 'L'; // Present, Absent, Late
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  activeClasses: number;
}

export enum AppRoute {
  DASHBOARD = 'dashboard',
  STUDENTS = 'students',
  TEACHERS = 'teachers',
  ACADEMICS = 'academics',
  ATTENDANCE = 'attendance',
  AI_INSIGHTS = 'ai-insights',
}
