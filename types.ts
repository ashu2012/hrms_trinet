
export enum KycStatus {
  PENDING,
  SUBMITTING,
  VERIFYING,
  SUCCESS,
  FAILED,
}

export enum Role {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  HR_MANAGER = 'HR Manager',
  ADMIN = 'Admin',
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum EmployeeType {
  FULL_TIME = 'Full-Time',
  CONTRACT = 'Contract',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  employeeType: EmployeeType;
  managerId?: string;
  teamMemberIds?: string[];
  holidayCalendarId: string;
  leaveBalance: {
    paid: number;
    unpaid: number;
  };
}

export interface KycFormData {
  fullName: string;
  address: string;
  documentId: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  base64: string;
}

export interface VerificationResult {
  match: boolean;
  message: string;
  extractedData?: Partial<KycFormData>;
}

export interface Holiday {
  id: string;
  calendarId: string;
  date: string; // YYYY-MM-DD
  name: string;
  applicableTo: EmployeeType[];
}

export interface HolidayCalendar {
  id: string;
  name: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  reason: string;
  status: LeaveStatus;
  leaveType: 'Paid' | 'Unpaid';
  startDate: string;
  endDate: string;
}

export interface LeavePolicy {
    policyName: string;
    rules: {
        employeeType: EmployeeType;
        probationMonths: number;
        paidLeaveDays: number;
        unpaidLeaveDays: number;
        accrualRatePerMonth: number;
    }[];
}

// --- New Types for SaaS Modules ---

export interface Payslip {
  id: string;
  userId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  tax: number;
  netPay: number;
}

export interface Reimbursement {
  id: string;
  userId: string;
  date: string;
  category: 'Travel' | 'Food' | 'Internet' | 'Other';
  amount: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate: string;
  progress: number; // 0-100
}

export interface Appraisal {
  id: string;
  userId: string;
  reviewerId: string;
  period: string;
  selfReview: string;
  managerReview?: string;
  rating?: number; // 1-5
  status: 'Draft' | 'Submitted' | 'Reviewed';
}

export interface OnboardingDoc {
  id: string;
  userId: string;
  type: 'Resume' | 'Identity' | 'OfferLetter';
  fileName: string;
  status: 'Pending' | 'Verified';
}

// --- Workforce Management: Projects & Timesheets ---

export interface Project {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Completed';
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

// --- System Settings ---

export interface AppSettings {
  companyName: string;
  logoUrl: string | null;
}
