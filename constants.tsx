
import React from 'react';
import { Student, Teacher, Course } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 'S1001', firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@school.edu', grade: '10th', class: '10-A', attendance: 95, performanceScore: 88, enrollmentDate: '2023-09-01', parentContact: '+1234567890', status: 'Active' },
  { id: 'S1002', firstName: 'Bob', lastName: 'Smith', email: 'bob.s@school.edu', grade: '11th', class: '11-B', attendance: 82, performanceScore: 74, enrollmentDate: '2023-09-01', parentContact: '+1234567891', status: 'Active' },
  { id: 'S1003', firstName: 'Charlie', lastName: 'Davis', email: 'charlie.d@school.edu', grade: '9th', class: '9-C', attendance: 98, performanceScore: 92, enrollmentDate: '2023-09-01', parentContact: '+1234567892', status: 'Active' },
  { id: 'S1004', firstName: 'Diana', lastName: 'Prince', email: 'diana.p@school.edu', grade: '12th', class: '12-A', attendance: 65, performanceScore: 45, enrollmentDate: '2022-09-01', parentContact: '+1234567893', status: 'Inactive' },
  { id: 'S1005', firstName: 'Ethan', lastName: 'Hunt', email: 'ethan.h@school.edu', grade: '10th', class: '10-A', attendance: 89, performanceScore: 81, enrollmentDate: '2023-09-01', parentContact: '+1234567894', status: 'Active' },
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: 'T2001', name: 'Dr. Sarah Connor', subject: 'Mathematics', email: 's.connor@school.edu', experience: 12, assignedClasses: ['10-A', '11-A'], status: 'Available' },
  { id: 'T2002', name: 'Prof. James Wilson', subject: 'Physics', email: 'j.wilson@school.edu', experience: 15, assignedClasses: ['11-B', '12-A'], status: 'Available' },
  { id: 'T2003', name: 'Ms. Elena Gilbert', subject: 'English', email: 'e.gilbert@school.edu', experience: 8, assignedClasses: ['9-C', '10-A'], status: 'Available' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'C301', title: 'Advanced Algebra', teacherName: 'Dr. Sarah Connor', schedule: 'Mon, Wed 09:00 AM', credits: 4, room: 'Room 102', capacity: 30 },
  { id: 'C302', title: 'Quantum Physics', teacherName: 'Prof. James Wilson', schedule: 'Tue, Thu 11:00 AM', credits: 5, room: 'Lab A', capacity: 25 },
  { id: 'C303', title: 'Creative Writing', teacherName: 'Ms. Elena Gilbert', schedule: 'Fri 02:00 PM', credits: 3, room: 'Library Annex', capacity: 20 },
];

export const ICONS = {
  Dashboard: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Students: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Teachers: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  AI: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Attendance: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  Academics: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Search: (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
};
