export type UserRole = "STUDENT" | "STAFF" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  staffId?: string;
  assignedTo?: User;
  category?: Category;
  createdAt: string;
  updatedAt?: string;
  attachmentUrl?: string;
  student?: User;
  remarks?: Remark[];
}

export interface Remark {
  id: string;
  text: string;
  createdAt: string;
  author?: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardAnalytics {
  totalComplaints: number;
  complaintsByStatus: { status: ComplaintStatus; count: number }[];
  complaintsByCategory: { category: string; count: number }[];
  resolutionRate: number;
  submissionsPerDay: { day: string; count: number }[];
}
