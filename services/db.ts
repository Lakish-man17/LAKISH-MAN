
import { Student, Teacher, SchoolStats, AttendanceRecord, Course, CourseEnrollment } from '../types';
import { INITIAL_STUDENTS, INITIAL_TEACHERS, INITIAL_COURSES } from '../constants';

const DB_KEYS = {
  STUDENTS: 'edu_pulse_students',
  TEACHERS: 'edu_pulse_teachers',
  COURSES: 'edu_pulse_courses',
  ATTENDANCE: 'edu_pulse_attendance',
  ENROLLMENTS: 'edu_pulse_enrollments',
};

export class SchoolDatabase {
  private static init() {
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(DB_KEYS.TEACHERS)) {
      localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
    }
    if (!localStorage.getItem(DB_KEYS.COURSES)) {
      localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(DB_KEYS.ATTENDANCE)) {
      localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_KEYS.ENROLLMENTS)) {
      localStorage.setItem(DB_KEYS.ENROLLMENTS, JSON.stringify([]));
    }
  }

  static getStudents(): Student[] {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS) || '[]');
  }

  static saveStudent(student: Student) {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index > -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
  }

  static deleteStudent(id: string) {
    const students = this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(filtered));
    
    // Also remove their enrollments
    const enrollments = this.getEnrollments();
    const filteredEnrollments = enrollments.filter(e => e.studentId !== id);
    localStorage.setItem(DB_KEYS.ENROLLMENTS, JSON.stringify(filteredEnrollments));
  }

  static getCourses(): Course[] {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.COURSES) || '[]');
  }

  static saveCourse(course: Course) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index > -1) {
      courses[index] = course;
    } else {
      courses.push(course);
    }
    localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(courses));
  }

  static deleteCourse(id: string) {
    const courses = this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    localStorage.setItem(DB_KEYS.COURSES, JSON.stringify(filtered));
    
    // Cascading delete: Remove all enrollments for this course
    const enrollments = this.getEnrollments();
    const filteredEnrollments = enrollments.filter(e => e.courseId !== id);
    localStorage.setItem(DB_KEYS.ENROLLMENTS, JSON.stringify(filteredEnrollments));
  }

  static getEnrollments(): CourseEnrollment[] {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.ENROLLMENTS) || '[]');
  }

  static enrollStudent(courseId: string, studentId: string) {
    const enrollments = this.getEnrollments();
    if (!enrollments.some(e => e.courseId === courseId && e.studentId === studentId)) {
      enrollments.push({ courseId, studentId });
      localStorage.setItem(DB_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
    }
  }

  static unenrollStudent(courseId: string, studentId: string) {
    const enrollments = this.getEnrollments();
    const filtered = enrollments.filter(e => !(e.courseId === courseId && e.studentId === studentId));
    localStorage.setItem(DB_KEYS.ENROLLMENTS, JSON.stringify(filtered));
  }

  static getTeachers(): Teacher[] {
    this.init();
    return JSON.parse(localStorage.getItem(DB_KEYS.TEACHERS) || '[]');
  }

  static saveTeacher(teacher: Teacher) {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachers[index] = teacher;
    } else {
      teachers.push(teacher);
    }
    localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(teachers));
  }

  static deleteTeacher(id: string) {
    const teachers = this.getTeachers();
    const filtered = teachers.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(filtered));
  }

  static getAttendance(date: string): AttendanceRecord[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || '[]');
    return all.filter((r: AttendanceRecord) => r.date === date);
  }

  static saveAttendance(records: AttendanceRecord[]) {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.ATTENDANCE) || '[]');
    const date = records[0]?.date;
    if (!date) return;
    
    const updated = all.filter((r: AttendanceRecord) => r.date !== date).concat(records);
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(updated));
  }

  static getStats(): SchoolStats {
    const students = this.getStudents();
    const teachers = this.getTeachers();
    const totalAttendance = students.reduce((acc, s) => acc + s.attendance, 0);
    const avgAttendance = students.length > 0 ? totalAttendance / students.length : 0;

    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      averageAttendance: Math.round(avgAttendance),
      activeClasses: this.getCourses().length,
    };
  }
}
