
// بيانات Mock للاستخدام المحلي فقط (fallback)
import type { User, Course, CarnetRequest, Notification, ActivityLog, Subscription } from './types';

export function getMockUsers(): User[] {
  return [
    { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', phone: '123-456-7890', academicYear: 2, carnetStatus: 'approved', createdAt: new Date('2023-01-15') },
    { _id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'student', phone: '123-456-7891', academicYear: 3, carnetStatus: 'pending', carnetImage: 'https://placehold.co/400x250.png', createdAt: new Date('2023-02-20') },
    { _id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'teacher', phone: '123-456-7892', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-09-10') },
    { _id: '4', name: 'Diana Miller', email: 'diana@example.com', role: 'admin', phone: '123-456-7893', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-08-01') },
    { _id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'student', phone: '123-456-7894', academicYear: 1, carnetStatus: 'rejected', rejectionReason: 'Image was blurry.', createdAt: new Date('2023-03-05') },
    { _id: '6', name: 'Frank White', email: 'frank@example.com', role: 'teacher', phone: '123-456-7895', academicYear: 0, carnetStatus: 'approved', createdAt: new Date('2022-10-11') },
    { _id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'student', phone: '123-456-7896', academicYear: 4, carnetStatus: 'pending', carnetImage: 'https://placehold.co/400x250.png', createdAt: new Date('2023-04-12') },
    { _id: '8', name: 'Henry Harris', email: 'henry@example.com', role: 'student', phone: '123-456-7897', academicYear: 2, carnetStatus: 'approved', createdAt: new Date('2023-01-18') },
  ];
}

export function getMockCourses(): Course[] {
  return [
    { _id: 'c1', name: 'Introduction to React', teacherName: 'Charlie Brown', teacherId: '3', academicYear: 2, sections: 10, price: 150, coverImage: 'https://placehold.co/600x400.png', createdAt: new Date('2023-01-10') },
    { _id: 'c2', name: 'Advanced NodeJS', teacherName: 'Frank White', teacherId: '6', academicYear: 3, sections: 15, price: 200, coverImage: 'https://placehold.co/600x400.png', createdAt: new Date('2023-02-01') },
    { _id: 'c3', name: 'UI/UX Design Principles', teacherName: 'Charlie Brown', teacherId: '3', academicYear: 1, sections: 8, price: 120, coverImage: 'https://placehold.co/600x400.png', createdAt: new Date('2023-03-15') },
    { _id: 'c4', name: 'Database Management', teacherName: 'Frank White', teacherId: '6', academicYear: 2, sections: 12, price: 180, coverImage: 'https://placehold.co/600x400.png', createdAt: new Date('2023-04-02') },
    { _id: 'c5', name: 'Data Structures & Algorithms', teacherName: 'Frank White', teacherId: '6', academicYear: 2, sections: 20, price: 250, coverImage: 'https://placehold.co/600x400.png', createdAt: new Date('2023-01-20') },
  ];
}

// أضف دوال مماثلة لأي بيانات أخرى تحتاجها كـ fallback
