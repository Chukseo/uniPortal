export type UserRole =
  | "super_admin"
  | "ict_admin"
  | "school_admin"
  | "admissions_officer"
  | "registrar"
  | "bursar"
  | "faculty_officer"
  | "exam_officer"
  | "lecturer"
  | "student"
  | "applicant";

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  code: string;
  type: "University" | "Polytechnic" | "College of Education";
  state: string;
  city: string;
  motto: string;
  logoUrl?: string;
  accentColor: string;
  currentSession: string;
  currentSemester: "First Semester" | "Second Semester";
  portalStatus: "Active" | "Maintenance" | "Registration Closed";
  stats: {
    totalStudents: number;
    totalApplicants: number;
    totalStaff: number;
    totalFaculties: number;
    totalDepartments: number;
    simulatedRevenue: number;
  };
}

export interface AcademicSession {
  id: string;
  institutionId: string;
  name: string; // e.g. "2024/2025"
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Concluded";
}

export interface Semester {
  id: string;
  institutionId: string;
  sessionId: string;
  name: "First Semester" | "Second Semester";
  isCurrent: boolean;
  registrationOpen: boolean;
  examRegistrationOpen: boolean;
  resultsPublished: boolean;
}

export interface Faculty {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  deanName: string;
  description: string;
}

export interface Department {
  id: string;
  institutionId: string;
  facultyId: string;
  name: string;
  code: string;
  hodName: string;
}

export interface Programme {
  id: string;
  institutionId: string;
  departmentId: string;
  name: string;
  code: string;
  degreeType: "B.Sc" | "B.Eng" | "B.A" | "HND" | "ND" | "NCE";
  durationYears: number;
  entryRequirements: string;
}

export interface User {
  id: string;
  institutionId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  facultyId?: string;
  status: "Active" | "Suspended" | "Pending";
}

export type ApplicationStatus =
  | "Draft"
  | "Email Verification Required"
  | "Submitted"
  | "Under Review"
  | "Awaiting Documents"
  | "Approved"
  | "Offer Issued"
  | "Offer Accepted"
  | "Offer Declined"
  | "Rejected";

export interface Applicant {
  id: string;
  institutionId: string;
  applicationNumber: string; // e.g. "APP/2025/0014"
  firstName: string;
  lastName: string;
  otherNames?: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  stateOfOrigin: string;
  lga: string;
  dateOfBirth: string;
  programmeId: string;
  entryType: "UTME" | "Direct Entry" | "Postgraduate" | "Diploma";
  utmeScore?: number;
  jambRegNumber?: string;
  olevelSummary: string;
  uploadedDocuments: {
    id: string;
    title: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    verified: boolean;
  }[];
  status: ApplicationStatus;
  emailVerified: boolean;
  reviewNotes: string[];
  submittedAt: string;
  decisionTimestamp?: string;
  acceptanceFeeInvoiceId?: string;
  isOfferAccepted?: boolean;
  matricNumber?: string;
  convertedStudentId?: string;
}

export type StageEntitlementKey =
  | "application_submitted"
  | "admission_accepted"
  | "acceptance_fee_cleared"
  | "student_activated"
  | "school_fees_cleared"
  | "course_registration_unlocked"
  | "course_registration_completed"
  | "exam_eligible"
  | "results_viewable";

export interface AccessCodeCredential {
  id: string;
  institutionId: string;
  targetId: string; // applicantId or studentId
  targetType: "applicant" | "student";
  code: string; // Fictional code, e.g. "UNI-ACT-8842"
  stage: StageEntitlementKey;
  status: "Active" | "Used" | "Revoked" | "Expired";
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
  purpose: string;
}

export interface StageEntitlement {
  id: string;
  targetId: string;
  stageKey: StageEntitlementKey;
  grantedAt: string;
  reason: string;
  grantedBy: string;
  isActive: boolean;
}

export type InvoiceStatus = "Unpaid" | "Paid" | "Pending" | "Reversed" | "Failed";

export type FeeCategory =
  | "Acceptance Fee"
  | "School Fees"
  | "Departmental Charges"
  | "Examination Fee"
  | "Transcript Fee"
  | "Hostel Accommodation";

export interface Invoice {
  id: string;
  institutionId: string;
  invoiceNumber: string;
  targetId: string; // studentId or applicantId
  targetName: string;
  targetEmail: string;
  targetType: "student" | "applicant";
  feeCategory: FeeCategory;
  description: string;
  amount: number;
  academicSession: string;
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
  paidAt?: string;
  paymentReference?: string;
}

export interface PaymentTransaction {
  id: string;
  institutionId: string;
  invoiceId: string;
  reference: string;
  amount: number;
  channel: "Simulated Bank Transfer" | "Simulated Card (Demo)" | "Simulated Campus Pay";
  status: "Successful" | "Failed" | "Reversed";
  payerName: string;
  payerEmail: string;
  timestamp: string;
  narration: string;
  reversalReason?: string;
}

export interface Student {
  id: string;
  institutionId: string;
  applicantId?: string;
  matricNumber: string; // e.g. "RUN/CMP/21/0452"
  firstName: string;
  lastName: string;
  otherNames?: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  facultyId: string;
  departmentId: string;
  programmeId: string;
  level: "100L" | "200L" | "300L" | "400L" | "500L";
  currentSession: string;
  currentSemester: "First Semester" | "Second Semester";
  enrollmentStatus: "Enrolled" | "Deferred" | "Withdrawn" | "Graduated";
  cgpa: number;
  totalCreditsEarned: number;
  academicStanding: "First Class" | "Second Class Upper" | "Second Class Lower" | "Third Class" | "Probation" | "Distinction" | "Upper Credit" | "Lower Credit" | "Pass" | "Merit";
  currentAccessCode?: string;
  isAccountActivated: boolean;
  isCourseRegistered: boolean;
  avatarUrl?: string;
  stateOfOrigin: string;
}

export interface Course {
  id: string;
  institutionId: string;
  departmentId: string;
  code: string; // e.g. "CSC 201"
  title: string; // e.g. "Computer Programming I"
  creditUnits: number;
  level: "100L" | "200L" | "300L" | "400L" | "500L";
  semester: "First Semester" | "Second Semester";
  type: "Compulsory" | "Elective";
  lecturerId?: string;
  lecturerName?: string;
  description: string;
}

export interface CourseRegistrationItem {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  type: "Compulsory" | "Elective";
}

export interface CourseRegistration {
  id: string;
  institutionId: string;
  studentId: string;
  sessionId: string;
  semester: "First Semester" | "Second Semester";
  level: string;
  courses: CourseRegistrationItem[];
  totalCredits: number;
  submittedAt: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  approvedBy?: string;
}

export type ResultState =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Rejected"
  | "Approved"
  | "Published"
  | "Amended";

export interface StudentScore {
  id: string;
  institutionId: string;
  courseId: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  sessionId: string;
  semester: "First Semester" | "Second Semester";
  caScore: number; // max 30
  examScore: number; // max 70
  totalScore: number; // max 100
  grade: "A" | "B" | "C" | "D" | "E" | "F";
  gradePoints: number; // A=5, B=4, C=3, D=2, E=1, F=0
  state: ResultState;
  rejectionReason?: string;
  lecturerComments?: string;
  amendmentHistory?: {
    version: number;
    caScore: number;
    examScore: number;
    reason: string;
    amendedBy: string;
    amendedAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  institutionId: string;
  targetRole?: UserRole | "all";
  targetUserId?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  institutionId: string;
  institutionName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: "Success" | "Failure" | "Warning";
  reason: string;
  correlationId: string;
}

export interface Announcement {
  id: string;
  institutionId: string;
  title: string;
  content: string;
  targetAudience: "All" | "Students" | "Lecturers" | "Staff" | "Applicants";
  publishedAt: string;
  authorName: string;
  authorRole: string;
  isPinned: boolean;
}

export interface GradingPolicy {
  institutionId: string;
  maxCaMarks: number;
  maxExamMarks: number;
  minPassScore: number;
  scales: {
    grade: "A" | "B" | "C" | "D" | "E" | "F";
    minScore: number;
    maxScore: number;
    points: number;
    remark: string;
  }[];
}

export interface ExaminationScheduleItem {
  id: string;
  institutionId: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  date: string; // e.g. "2025-02-18"
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "12:00 PM"
  venue: string; // e.g. "Twin ICT Hall A"
  invigilatorName: string;
  capacity: number;
}

export interface GraduationCandidate {
  id: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  facultyName: string;
  departmentName: string;
  programmeName: string;
  cgpa: number;
  classOfDegree: "First Class" | "Second Class Upper" | "Second Class Lower" | "Third Class";
  libraryClearance: boolean;
  bursaryClearance: boolean;
  departmentClearance: boolean;
  senateApproval: boolean;
  convocationSession: string;
}

export interface DefermentRequest {
  id: string;
  studentId: string;
  matricNumber: string;
  studentName: string;
  academicSession: string;
  semester: string;
  reason: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Declined";
  decisionNote?: string;
}

export interface StaffMember {
  id: string;
  institutionId: string;
  staffId: string; // e.g. "STF/2021/004"
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  facultyId?: string;
  departmentId?: string;
  rank: string; // e.g. "Senior Lecturer", "Associate Professor", "Higher Executive Officer"
  status: "Active" | "On Leave" | "Suspended";
  appointmentDate: string;
}

