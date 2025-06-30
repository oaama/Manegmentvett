export type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  phone: string;
  academicYear: number;
  carnetStatus: 'pending' | 'approved' | 'rejected';
  carnetImage?: string;
  rejectionReason?: string;
  createdAt: Date;
};

export type Course = {
  id: string;
  name:string;
  instructorName: string; // Changed from 'instructor' to match API
  instructorId: string;
  academicYear: number; // Changed from 'year'
  sections: number;
  price: number;
  coverImage?: string;
  createdAt: Date;
};

export type CarnetRequest = {
  id: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'academicYear'>;
  carnetImage: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  requestedAt: Date;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'students' | 'instructors' | string; // user id
  sentAt: Date;
};

export type ActivityLog = {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: Date;
};

// Subscription is no longer used as there's no API endpoint for it.
// export type Subscription = {
//   id: string;
//   user: Pick<User, 'id' | 'name' | 'email'>;
//   course: Pick<Course, 'id' | 'name'>;
//   subscribedAt: Date;
// };
