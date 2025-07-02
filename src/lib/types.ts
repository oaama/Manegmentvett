
export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  phone: string;
  academicYear: number;
  carnetStatus: 'pending' | 'approved' | 'rejected';
  carnetImage?: string;
  profileImage?: string;
  rejectionReason?: string;
  createdAt: Date;
};

export type Course = {
  _id: string;
  name: string;
  teacherName: string;
  teacherId: string;
  academicYear: number;
  sections: number;
  price: number;
  coverImage?: string;
  createdAt: Date;
};

export type Section = {
  _id: string;
  sectionType: string;
  sectionTitle: string;
  videos: string; // JSON Array string
  createdAt?: Date;
};

export type CarnetRequest = {
  _id: string;
  user: Pick<User, '_id' | 'name' | 'email' | 'academicYear'>;
  carnetImage: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  requestedAt: Date;
};

export type Notification = {
  _id: string;
  title: string;
  message: string;
  target: 'all' | 'students' | 'teachers' | string; // user id
  sentAt: Date;
};

export type ActivityLog = {
  _id: string;
  user: string;
  action: string;
  details: string;
  timestamp: Date;
};

export type Subscription = {
  _id: string;
  user: Pick<User, '_id' | 'name' | 'email'>;
  course: Pick<Course, '_id' | 'name'>;
  subscribedAt: Date;
};
