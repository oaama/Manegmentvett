import type { User, Course, CarnetRequest, Notification, ActivityLog } from './types';

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', phone: '123-456-7890', academicYear: 2, carnetStatus: 'approved', createdAt: new Date('2023-01-15') },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'student', phone: '123-456-7891', academicYear: 3, carnetStatus: 'pending', carnetImage: 'https://placehold.co/400x250.png', createdAt: new Date('2023-02-20') },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'instructor', phone: '123-456-7892', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-09-10') },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', role: 'admin', phone: '123-456-7893', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-08-01') },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'student', phone: '123-456-7894', academicYear: 1, carnetStatus: 'rejected', rejectionReason: 'Image was blurry.', createdAt: new Date('2023-03-05') },
  { id: '6', name: 'Frank White', email: 'frank@example.com', role: 'instructor', phone: '123-456-7895', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-10-11') },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'student', phone: '123-456-7896', academicYear: 4, carnetStatus: 'pending', carnetImage: 'https://placehold.co/400x250.png', createdAt: new Date('2023-04-12') },
  { id: '8', name: 'Henry Harris', email: 'henry@example.com', role: 'student', phone: '123-456-7897', academicYear: 2, carnetStatus: 'approved', createdAt: new Date('2023-01-18') },
];

export const carnetRequests: CarnetRequest[] = users
  .filter(u => u.carnetStatus === 'pending' || u.carnetStatus === 'rejected')
  .map(u => ({
    id: u.id,
    user: { id: u.id, name: u.name, email: u.email, academicYear: u.academicYear },
    carnetImage: u.carnetImage || 'https://placehold.co/400x250.png',
    status: u.carnetStatus,
    rejectionReason: u.rejectionReason,
    requestedAt: u.createdAt,
  }));


export const courses: Course[] = [
  { id: 'c1', name: 'Introduction to React', instructor: 'Charlie Brown', year: 2, sections: 10, createdAt: new Date('2023-01-10') },
  { id: 'c2', name: 'Advanced NodeJS', instructor: 'Frank White', year: 3, sections: 15, createdAt: new Date('2023-02-01') },
  { id: 'c3', name: 'UI/UX Design Principles', instructor: 'Charlie Brown', year: 1, sections: 8, createdAt: new Date('2023-03-15') },
  { id: 'c4', name: 'Database Management', instructor: 'Frank White', year: 2, sections: 12, createdAt: new Date('2023-04-02') },
  { id: 'c5', name: 'Data Structures & Algorithms', instructor: 'Frank White', year: 2, sections: 20, createdAt: new Date('2023-01-20') },
];

export const notifications: Notification[] = [
  { id: 'n1', title: 'Welcome Week', message: 'Welcome to the new academic year! Check out the events for the welcome week.', target: 'all', sentAt: new Date('2023-09-01T10:00:00Z') },
  { id: 'n2', title: 'Mid-term Exams Schedule', message: 'The mid-term exam schedule has been released. Please check the student portal.', target: 'students', sentAt: new Date('2023-10-15T14:30:00Z') },
  { id: 'n3', title: 'Faculty Meeting', message: 'A mandatory faculty meeting is scheduled for this Friday at 3 PM.', target: 'instructors', sentAt: new Date('2023-11-02T09:00:00Z') },
];

export const activityLogs: ActivityLog[] = [
    { id: 'l1', user: 'Diana Miller', action: 'LOGIN', details: 'Logged in successfully', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 'l2', user: 'Diana Miller', action: 'UPDATE_USER', details: 'Updated profile for user Alice Johnson (ID: 1)', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 'l3', user: 'Charlie Brown', action: 'CREATE_COURSE', details: 'Created new course "Advanced React Hooks"', timestamp: new Date(Date.now() - 1000 * 60 * 55) },
    { id: 'l4', user: 'Diana Miller', action: 'APPROVE_CARNET', details: 'Approved carnet request for Bob Williams (ID: 2)', timestamp: new Date(Date.now() - 1000 * 60 * 125) },
    { id: 'l5', user: 'Diana Miller', action: 'DELETE_USER', details: 'Deleted user (ID: 99)', timestamp: new Date(Date.now() - 1000 * 60 * 180) },
];
