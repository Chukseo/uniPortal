"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Institution,
  AcademicSession,
  Faculty,
  Department,
  Programme,
  User,
  Student,
  Applicant,
  Invoice,
  PaymentTransaction,
  AccessCodeCredential,
  StageEntitlement,
  Course,
  CourseRegistration,
  StudentScore,
  NotificationItem,
  AuditEvent,
  Announcement,
  GradingPolicy,
  UserRole,
  StageEntitlementKey,
  ApplicationStatus,
  ExaminationScheduleItem,
  GraduationCandidate,
  DefermentRequest,
  StaffMember,
  FeeCategory,
} from "@/types";
import {
  SEED_INSTITUTIONS,
  SEED_SESSIONS,
  SEED_FACULTIES,
  SEED_DEPARTMENTS,
  SEED_PROGRAMMES,
  SEED_USERS,
  SEED_STUDENTS,
  SEED_APPLICANTS,
  SEED_INVOICES,
  SEED_PAYMENTS,
  SEED_ACCESS_CODES,
  SEED_STAGE_ENTITLEMENTS,
  SEED_COURSES,
  SEED_COURSE_REGISTRATIONS,
  SEED_SCORES,
  SEED_NOTIFICATIONS,
  SEED_ANNOUNCEMENTS,
  SEED_AUDIT_EVENTS,
  SEED_GRADING_POLICY,
  SEED_EXAM_SCHEDULES,
  SEED_GRADUATION_CANDIDATES,
  SEED_DEFERMENT_REQUESTS,
  SEED_STAFF_MEMBERS,
} from "./seed";
import { createAccessCodeCredential } from "../demo-engine/access-code";
import { calculateGrade } from "../demo-engine/gpa";

interface DemoState {
  currentRole: UserRole;
  currentInstitutionId: string;
  institutions: Institution[];
  sessions: AcademicSession[];
  faculties: Faculty[];
  departments: Department[];
  programmes: Programme[];
  users: User[];
  students: Student[];
  applicants: Applicant[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  accessCodes: AccessCodeCredential[];
  entitlements: StageEntitlement[];
  courses: Course[];
  registrations: CourseRegistration[];
  scores: StudentScore[];
  notifications: NotificationItem[];
  announcements: Announcement[];
  auditEvents: AuditEvent[];
  gradingPolicy: GradingPolicy;
  examSchedules: ExaminationScheduleItem[];
  graduationCandidates: GraduationCandidate[];
  defermentRequests: DefermentRequest[];
  staffMembers: StaffMember[];
  guidedTourOpen: boolean;
  guidedTourStep: number;
  activeStudentId?: string | null;
  activeApplicantId?: string | null;
}

interface DemoContextType extends DemoState {
  // Navigation & context
  setCurrentRole: (role: UserRole) => void;
  setCurrentInstitutionId: (id: string) => void;
  setActiveStudentId: (id: string | null) => void;
  setActiveApplicantId: (id: string | null) => void;
  currentInstitution: Institution;
  currentUser: User;
  currentStudent: Student | undefined;
  currentApplicant: Applicant | undefined;
  resetDemoData: () => void;

  // Tour controls
  setGuidedTourOpen: (open: boolean) => void;
  setGuidedTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;

  // Institution & config management
  createInstitution: (inst: Omit<Institution, "id" | "stats">) => void;
  updateInstitution: (id: string, updates: Partial<Institution>) => void;
  toggleInstitutionStatus: (id: string) => void;
  addFaculty: (faculty: Omit<Faculty, "id">) => void;
  addDepartment: (dept: Omit<Department, "id">) => void;
  addProgramme: (prog: Omit<Programme, "id">) => void;
  addSession: (name: string, startDate: string, endDate: string) => void;

  // Admissions workflow
  submitNewApplication: (data: Partial<Applicant>) => string;
  updateApplicationStatus: (id: string, status: ApplicationStatus, note?: string) => void;
  issueAdmissionOffer: (applicantId: string) => void;
  acceptAdmissionOffer: (applicantId: string) => void;
  convertApplicantToStudent: (applicantId: string) => string;

  // Finance & payment simulation
  simulatePayment: (invoiceId: string, channel?: string) => { success: boolean; message: string };
  simulateFailedPayment: (invoiceId: string) => void;
  simulateRefundReversal: (invoiceId: string, reason: string) => void;
  createCustomInvoice: (params: { targetId: string; targetName: string; targetEmail: string; targetType: "student" | "applicant"; feeCategory: FeeCategory; description: string; amount: number; dueDate: string }) => void;

  // Student directory & Senate status
  updateStudentStatus: (studentId: string, status: "Enrolled" | "Deferred" | "Withdrawn" | "Graduated") => void;
  assignMatriculationNumber: (studentId: string, newMatric: string) => void;

  // Deferments & Graduation
  approveDeferment: (id: string, note?: string) => void;
  rejectDeferment: (id: string, note?: string) => void;
  toggleGraduationClearance: (candidateId: string, field: "libraryClearance" | "bursaryClearance" | "departmentClearance" | "senateApproval") => void;

  // Staff & Faculty assignments
  addStaffMember: (staff: Omit<StaffMember, "id">) => void;
  updateStaffRole: (staffId: string, newRole: UserRole, departmentId?: string) => void;
  assignLecturerToCourse: (courseId: string, lecturerId: string, lecturerName: string) => void;

  // Examination schedule & Grading Policy
  addExamSchedule: (item: Omit<ExaminationScheduleItem, "id">) => void;
  deleteExamSchedule: (id: string) => void;
  updateGradingPolicy: (policy: Partial<GradingPolicy>) => void;

  // Access codes & progression
  issueAccessCode: (targetId: string, targetType: "applicant" | "student", stage: StageEntitlementKey, purpose: string) => string;
  revokeAccessCode: (codeId: string) => void;
  verifyAccessCode: (code: string) => { valid: boolean; credential?: AccessCodeCredential; error?: string };

  // Course registration
  submitCourseRegistration: (studentId: string, courseIds: string[]) => { success: boolean; message: string };
  approveCourseRegistration: (registrationId: string) => void;

  // Examination & scoring workflow
  updateScoreEntry: (scoreId: string, caScore: number, examScore: number) => void;
  submitCourseScores: (courseId: string) => void;
  approveCourseScores: (courseId: string) => void;
  rejectCourseScores: (courseId: string, reason: string) => void;
  publishCourseScores: (courseId: string) => void;
  amendPublishedScore: (scoreId: string, ca: number, exam: number, reason: string) => void;

  // Notifications & Announcements
  addAnnouncement: (title: string, content: string, targetAudience: Announcement["targetAudience"]) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Audit
  logAuditEvent: (action: string, resourceType: string, resourceId: string, outcome: "Success" | "Failure" | "Warning", reason: string) => void;
}

const STORAGE_KEY = "UNICORE_DEMO_STATE_V2";

const initialDefaultState: DemoState = {
  currentRole: "super_admin",
  currentInstitutionId: "inst-1",
  institutions: SEED_INSTITUTIONS,
  sessions: SEED_SESSIONS,
  faculties: SEED_FACULTIES,
  departments: SEED_DEPARTMENTS,
  programmes: SEED_PROGRAMMES,
  users: SEED_USERS,
  students: SEED_STUDENTS,
  applicants: SEED_APPLICANTS,
  invoices: SEED_INVOICES,
  payments: SEED_PAYMENTS,
  accessCodes: SEED_ACCESS_CODES,
  entitlements: SEED_STAGE_ENTITLEMENTS,
  courses: SEED_COURSES,
  registrations: SEED_COURSE_REGISTRATIONS,
  scores: SEED_SCORES,
  notifications: SEED_NOTIFICATIONS,
  announcements: SEED_ANNOUNCEMENTS,
  auditEvents: SEED_AUDIT_EVENTS,
  gradingPolicy: SEED_GRADING_POLICY,
  examSchedules: SEED_EXAM_SCHEDULES,
  graduationCandidates: SEED_GRADUATION_CANDIDATES,
  defermentRequests: SEED_DEFERMENT_REQUESTS,
  staffMembers: SEED_STAFF_MEMBERS,
  guidedTourOpen: false,
  guidedTourStep: 0,
  activeStudentId: null,
  activeApplicantId: null,
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDefaultState);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          guidedTourOpen: false, // keep tour closed on fresh load
        }));
      }
    } catch (e) {
      console.warn("Failed to parse saved demo state, using defaults:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Failed to persist demo state to localStorage:", e);
      }
    }
  }, [state, mounted]);

  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({
      ...initialDefaultState,
      currentRole: state.currentRole,
      currentInstitutionId: "inst-1",
      activeStudentId: null,
      activeApplicantId: null,
    });
    logAuditEvent(
      "Demo Data Reset",
      "System",
      "ALL_MOCK_TABLES",
      "Success",
      "Restored pristine default seed dataset across all institutions and modules."
    );
  };

  const setCurrentRole = (role: UserRole) => {
    setState((prev) => ({ ...prev, currentRole: role }));
    logAuditEvent("Role Switch", "UserRole", role, "Success", `Switched active dashboard view to ${role}`);
  };

  const setCurrentInstitutionId = (id: string) => {
    const inst = state.institutions.find((i) => i.id === id);
    setState((prev) => ({
      ...prev,
      currentInstitutionId: id,
      activeStudentId: null,
      activeApplicantId: null,
    }));
    logAuditEvent(
      "Institution Context Switch",
      "Institution",
      id,
      "Success",
      `Switched multi-tenant active context to ${inst?.name || id}`
    );
  };

  const setActiveStudentId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeStudentId: id }));
  };

  const setActiveApplicantId = (id: string | null) => {
    setState((prev) => ({ ...prev, activeApplicantId: id }));
  };

  const currentInstitution =
    state.institutions.find((i) => i.id === state.currentInstitutionId) || state.institutions[0];

  const currentUser =
    state.users.find(
      (u) => u.institutionId === state.currentInstitutionId && u.role === state.currentRole
    ) ||
    state.users.find((u) => u.role === state.currentRole) ||
    state.users[0];

  const currentStudent =
    (state.activeStudentId
      ? state.students.find((s) => s.id === state.activeStudentId)
      : null) ||
    state.students.find((s) => s.institutionId === state.currentInstitutionId) ||
    state.students[0];

  const currentApplicant =
    (state.activeApplicantId
      ? state.applicants.find((a) => a.id === state.activeApplicantId)
      : null) ||
    state.applicants.find((a) => a.institutionId === state.currentInstitutionId) ||
    state.applicants[0];

  const logAuditEvent = (
    action: string,
    resourceType: string,
    resourceId: string,
    outcome: "Success" | "Failure" | "Warning",
    reason: string
  ) => {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.fullName,
      actorRole: state.currentRole,
      institutionId: state.currentInstitutionId,
      institutionName: currentInstitution.name,
      action,
      resourceType,
      resourceId,
      outcome,
      reason,
      correlationId: `REQ-${Math.floor(10000 + Math.random() * 90000)}-DEMO`,
    };

    setState((prev) => ({
      ...prev,
      auditEvents: [newEvent, ...prev.auditEvents.slice(0, 99)],
    }));
  };

  // Guided Tour
  const setGuidedTourOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, guidedTourOpen: open }));
  };

  const setGuidedTourStep = (step: number) => {
    setState((prev) => ({ ...prev, guidedTourStep: step }));
  };

  const nextTourStep = () => {
    setState((prev) => ({ ...prev, guidedTourStep: prev.guidedTourStep + 1 }));
  };

  const prevTourStep = () => {
    setState((prev) => ({
      ...prev,
      guidedTourStep: Math.max(0, prev.guidedTourStep - 1),
    }));
  };

  // Institutions & setup
  const createInstitution = (instData: Omit<Institution, "id" | "stats">) => {
    const newInst: Institution = {
      ...instData,
      id: `inst-${Date.now()}`,
      stats: {
        totalStudents: 0,
        totalApplicants: 0,
        totalStaff: 1,
        totalFaculties: 0,
        totalDepartments: 0,
        simulatedRevenue: 0,
      },
    };
    setState((prev) => ({
      ...prev,
      institutions: [...prev.institutions, newInst],
    }));
    logAuditEvent("Institution Created", "Institution", newInst.id, "Success", `Onboarded new tenant: ${newInst.name}`);
  };

  const updateInstitution = (id: string, updates: Partial<Institution>) => {
    setState((prev) => ({
      ...prev,
      institutions: prev.institutions.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
    logAuditEvent("Institution Updated", "Institution", id, "Success", "Modified institution parameters.");
  };

  const toggleInstitutionStatus = (id: string) => {
    setState((prev) => ({
      ...prev,
      institutions: prev.institutions.map((i) => {
        if (i.id === id) {
          const nextStatus = i.portalStatus === "Active" ? "Maintenance" : "Active";
          return { ...i, portalStatus: nextStatus };
        }
        return i;
      }),
    }));
    logAuditEvent("Institution Status Toggled", "Institution", id, "Warning", "Modified tenant portal status.");
  };

  const addFaculty = (facultyData: Omit<Faculty, "id">) => {
    const newFac: Faculty = { ...facultyData, id: `fac-${Date.now()}` };
    setState((prev) => ({ ...prev, faculties: [...prev.faculties, newFac] }));
    logAuditEvent("Faculty Added", "Faculty", newFac.id, "Success", `Created faculty ${newFac.name}`);
  };

  const addDepartment = (deptData: Omit<Department, "id">) => {
    const newDept: Department = { ...deptData, id: `dept-${Date.now()}` };
    setState((prev) => ({ ...prev, departments: [...prev.departments, newDept] }));
    logAuditEvent("Department Added", "Department", newDept.id, "Success", `Created department ${newDept.name}`);
  };

  const addProgramme = (progData: Omit<Programme, "id">) => {
    const newProg: Programme = { ...progData, id: `prog-${Date.now()}` };
    setState((prev) => ({ ...prev, programmes: [...prev.programmes, newProg] }));
    logAuditEvent("Programme Added", "Programme", newProg.id, "Success", `Added degree curriculum: ${newProg.name}`);
  };

  const addSession = (name: string, startDate: string, endDate: string) => {
    const newSession: AcademicSession = {
      id: `sess-${Date.now()}`,
      institutionId: state.currentInstitutionId,
      name,
      startDate,
      endDate,
      isCurrent: true,
      status: "Active",
    };
    setState((prev) => ({
      ...prev,
      sessions: [
        newSession,
        ...prev.sessions.map((s) =>
          s.institutionId === state.currentInstitutionId ? { ...s, isCurrent: false } : s
        ),
      ],
    }));
    logAuditEvent("Academic Session Created", "AcademicSession", newSession.id, "Success", `Set active session to ${name}`);
  };

  // Admissions
  const submitNewApplication = (data: Partial<Applicant>): string => {
    const appNum = `APP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: Applicant = {
      id: `app-${Date.now()}`,
      institutionId: state.currentInstitutionId,
      applicationNumber: appNum,
      firstName: data.firstName || "Applicant",
      lastName: data.lastName || "Candidate",
      otherNames: data.otherNames || "",
      email: data.email || "applicant@example.com",
      phone: data.phone || "+234 800 000 0000",
      gender: data.gender || "Female",
      stateOfOrigin: data.stateOfOrigin || "Lagos State",
      lga: data.lga || "Ikeja",
      dateOfBirth: data.dateOfBirth || "2006-05-15",
      programmeId: data.programmeId || state.programmes[0]?.id || "prog-1",
      entryType: data.entryType || "UTME",
      utmeScore: data.utmeScore || 250,
      jambRegNumber: data.jambRegNumber || `2025${Math.floor(10000000 + Math.random() * 90000000)}AB`,
      olevelSummary: data.olevelSummary || "WAEC: 5 Credits (Eng, Math, Phys, Chem, Bio)",
      uploadedDocuments: [
        {
          id: `doc-${Date.now()}-1`,
          title: "O'Level Certificate",
          fileName: "olevel_certificate_verified.pdf",
          fileSize: "1.2 MB",
          uploadedAt: new Date().toISOString(),
          verified: true,
        },
        {
          id: `doc-${Date.now()}-2`,
          title: "JAMB Result Slip",
          fileName: "jamb_utme_2025.pdf",
          fileSize: "680 KB",
          uploadedAt: new Date().toISOString(),
          verified: true,
        },
      ],
      status: "Submitted",
      emailVerified: true,
      reviewNotes: ["Application received and placed in review queue."],
      submittedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      applicants: [newApp, ...prev.applicants],
    }));

    logAuditEvent("Application Submitted", "Applicant", newApp.id, "Success", `Generated ${appNum} for ${newApp.firstName} ${newApp.lastName}`);
    return newApp.id;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, note?: string) => {
    setState((prev) => ({
      ...prev,
      applicants: prev.applicants.map((a) => {
        if (a.id === id) {
          const notes = note ? [...a.reviewNotes, `${new Date().toLocaleDateString()}: ${note}`] : a.reviewNotes;
          return {
            ...a,
            status,
            decisionTimestamp: new Date().toISOString(),
            reviewNotes: notes,
          };
        }
        return a;
      }),
    }));
    logAuditEvent("Application Status Updated", "Applicant", id, "Success", `Transitioned to: ${status}`);
  };

  const issueAdmissionOffer = (applicantId: string) => {
    const applicant = state.applicants.find((a) => a.id === applicantId);
    if (!applicant) return;

    // Create acceptance fee invoice
    const invoiceId = `inv-acc-${Date.now()}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      institutionId: applicant.institutionId,
      invoiceNumber: `INV-${new Date().getFullYear()}-ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      targetId: applicant.id,
      targetName: `${applicant.firstName} ${applicant.lastName}`,
      targetEmail: applicant.email,
      targetType: "applicant",
      feeCategory: "Acceptance Fee",
      description: "Provisional Admission Acceptance Fee (2024/2025)",
      amount: 65000,
      academicSession: "2024/2025",
      dueDate: "2025-03-31",
      status: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    // Issue acceptance access code
    const newCred = createAccessCodeCredential({
      institutionId: applicant.institutionId,
      targetId: applicant.id,
      targetType: "applicant",
      stage: "admission_accepted",
      purpose: "Provisional admission offer verification access code",
    });

    setState((prev) => ({
      ...prev,
      invoices: [newInvoice, ...prev.invoices],
      accessCodes: [newCred, ...prev.accessCodes],
      applicants: prev.applicants.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              status: "Offer Issued",
              decisionTimestamp: new Date().toISOString(),
              acceptanceFeeInvoiceId: invoiceId,
              reviewNotes: [...a.reviewNotes, "Formal provisional admission offer issued with acceptance invoice."],
            }
          : a
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          institutionId: applicant.institutionId,
          targetRole: "applicant",
          targetUserId: applicant.id,
          title: "Provisional Admission Offer Issued!",
          message: `Congratulations ${applicant.firstName}! Formal offer issued. Please review offer letter and clear acceptance fee.`,
          type: "success",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        ...prev.notifications,
      ],
    }));

    logAuditEvent("Admission Offer Issued", "Applicant", applicantId, "Success", `Offer issued to ${applicant.firstName} ${applicant.lastName}`);
  };

  const acceptAdmissionOffer = (applicantId: string) => {
    const applicant = state.applicants.find((a) => a.id === applicantId);
    if (!applicant) return;

    // Record entitlement
    const entitlement: StageEntitlement = {
      id: `ent-${Date.now()}`,
      targetId: applicantId,
      stageKey: "admission_accepted",
      grantedAt: new Date().toISOString(),
      reason: "Applicant formally clicked Accept Offer in the admissions portal.",
      grantedBy: "Applicant Self-Service",
      isActive: true,
    };

    setState((prev) => ({
      ...prev,
      entitlements: [...prev.entitlements, entitlement],
      applicants: prev.applicants.map((a) =>
        a.id === applicantId
          ? { ...a, status: "Offer Accepted", isOfferAccepted: true }
          : a
      ),
    }));

    logAuditEvent("Offer Accepted", "Applicant", applicantId, "Success", "Applicant accepted provisional offer.");
  };

  const convertApplicantToStudent = (applicantId: string): string => {
    const applicant = state.applicants.find((a) => a.id === applicantId);
    if (!applicant) return "";

    const existingStudent = state.students.find((s) => s.applicantId === applicantId);
    if (existingStudent) {
      setState((prev) => ({ ...prev, activeStudentId: existingStudent.id }));
      return existingStudent.id;
    }

    const yearSuffix = new Date().getFullYear().toString().substring(2);
    const matricNum = `${currentInstitution.code}/CMP/${yearSuffix}/${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = `std-new-${Date.now()}`;

    const nextStageCode = createAccessCodeCredential({
      institutionId: applicant.institutionId,
      targetId: applicant.id,
      targetType: "student",
      stage: "student_activated",
      purpose: "Matriculation confirmation and student portal access code",
    });

    const newStudentObj: Student = {
      id: studentId,
      institutionId: applicant.institutionId,
      applicantId: applicant.id,
      matricNumber: matricNum,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      otherNames: applicant.otherNames,
      email: `${applicant.firstName.toLowerCase()}.${applicant.lastName.toLowerCase()}@student.${currentInstitution.shortName.toLowerCase().replace(/\s+/g, "")}.edu.ng`,
      phone: applicant.phone,
      gender: applicant.gender,
      facultyId: "fac-1",
      departmentId: "dept-1",
      programmeId: applicant.programmeId,
      level: "100L",
      currentSession: "2024/2025",
      currentSemester: "First Semester",
      enrollmentStatus: "Enrolled",
      cgpa: 0,
      totalCreditsEarned: 0,
      academicStanding: "First Class",
      currentAccessCode: nextStageCode.code,
      isAccountActivated: true,
      isCourseRegistered: false,
      stateOfOrigin: applicant.stateOfOrigin,
    };

    const tuitionInvoice: Invoice = {
      id: `inv-sch-${Date.now()}`,
      institutionId: applicant.institutionId,
      invoiceNumber: `INV-${new Date().getFullYear()}-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
      targetId: newStudentObj.id,
      targetName: `${applicant.firstName} ${applicant.lastName}`,
      targetEmail: newStudentObj.email,
      targetType: "student",
      feeCategory: "School Fees",
      description: "100L First Semester Tuition & ICT Services",
      amount: 220000,
      academicSession: "2024/2025",
      dueDate: "2025-03-15",
      status: "Unpaid",
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      students: [newStudentObj, ...prev.students],
      invoices: [tuitionInvoice, ...prev.invoices],
      accessCodes: [nextStageCode, ...prev.accessCodes],
      activeStudentId: studentId,
      applicants: prev.applicants.map((a) =>
        a.id === applicantId
          ? {
              ...a,
              status: "Offer Accepted",
              isOfferAccepted: true,
              matricNumber: matricNum,
              convertedStudentId: studentId,
            }
          : a
      ),
    }));

    logAuditEvent(
      "Applicant Converted to Student",
      "Student",
      studentId,
      "Success",
      `Matriculated applicant ${applicant.firstName} ${applicant.lastName} as ${matricNum}`
    );

    return studentId;
  };

  // Payments & Finance Simulation
  const simulatePayment = (invoiceId: string, channel = "Simulated Campus Pay") => {
    const invoice = state.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return { success: false, message: "Invoice not found" };
    if (invoice.status === "Paid") return { success: false, message: "Invoice is already settled." };

    const txRef = `PAY-${new Date().getFullYear()}-${currentInstitution.code}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      institutionId: invoice.institutionId,
      invoiceId: invoice.id,
      reference: txRef,
      amount: invoice.amount,
      channel: channel as any,
      status: "Successful",
      payerName: invoice.targetName,
      payerEmail: invoice.targetEmail,
      timestamp: now,
      narration: `Simulated payment for ${invoice.feeCategory} (${invoice.invoiceNumber})`,
    };

    // Progression logic depending on feeCategory
    let newEntitlementKey: StageEntitlementKey | null = null;
    let nextStageCode: AccessCodeCredential | null = null;
    let newStudentObj: Student | null = null;
    let tuitionInvoice: Invoice | null = null;

    if (invoice.feeCategory === "Acceptance Fee") {
      newEntitlementKey = "acceptance_fee_cleared";

      // Also auto-activate student matriculation
      const matricNum = `${currentInstitution.code}/CMP/${new Date().getFullYear().toString().substring(2)}/${Math.floor(1000 + Math.random() * 9000)}`;
      const applicant = state.applicants.find((a) => a.id === invoice.targetId);

      nextStageCode = createAccessCodeCredential({
        institutionId: invoice.institutionId,
        targetId: invoice.targetId,
        targetType: "student",
        stage: "student_activated",
        purpose: "Matriculation confirmation and student portal access code",
      });

      if (applicant) {
        newStudentObj = {
          id: `std-new-${Date.now()}`,
          institutionId: invoice.institutionId,
          applicantId: applicant.id,
          matricNumber: matricNum,
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          otherNames: applicant.otherNames,
          email: `${applicant.firstName.toLowerCase()}.${applicant.lastName.toLowerCase()}@student.${currentInstitution.shortName.toLowerCase().replace(/\s+/g, "")}.edu.ng`,
          phone: applicant.phone,
          gender: applicant.gender,
          facultyId: "fac-1",
          departmentId: "dept-1",
          programmeId: applicant.programmeId,
          level: "100L",
          currentSession: "2024/2025",
          currentSemester: "First Semester",
          enrollmentStatus: "Enrolled",
          cgpa: 0,
          totalCreditsEarned: 0,
          academicStanding: "First Class",
          currentAccessCode: nextStageCode.code,
          isAccountActivated: true,
          isCourseRegistered: false,
          stateOfOrigin: applicant.stateOfOrigin,
        };

        // Create tuition invoice for 100L
        tuitionInvoice = {
          id: `inv-sch-${Date.now()}`,
          institutionId: invoice.institutionId,
          invoiceNumber: `INV-${new Date().getFullYear()}-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
          targetId: newStudentObj.id,
          targetName: `${applicant.firstName} ${applicant.lastName}`,
          targetEmail: newStudentObj.email,
          targetType: "student",
          feeCategory: "School Fees",
          description: "100L First Semester Tuition & ICT Services",
          amount: 220000,
          academicSession: "2024/2025",
          dueDate: "2025-03-15",
          status: "Unpaid",
          createdAt: now,
        };
      }
    } else if (invoice.feeCategory === "School Fees") {
      newEntitlementKey = "school_fees_cleared";

      // Issue course registration access code
      nextStageCode = createAccessCodeCredential({
        institutionId: invoice.institutionId,
        targetId: invoice.targetId,
        targetType: "student",
        stage: "course_registration_unlocked",
        purpose: "Course registration portal authorization code",
      });
    }

    setState((prev) => {
      const updatedInvoices = prev.invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: "Paid" as const, paidAt: now, paymentReference: txRef }
          : inv
      );

      const updatedEntitlements = newEntitlementKey
        ? [
            ...prev.entitlements,
            {
              id: `ent-${Date.now()}`,
              targetId: invoice.targetId,
              stageKey: newEntitlementKey,
              grantedAt: now,
              reason: `Simulated settlement of ${invoice.feeCategory} (${invoice.invoiceNumber})`,
              grantedBy: "Simulated Payment Engine",
              isActive: true,
            },
          ]
        : prev.entitlements;

      const updatedCodes = nextStageCode ? [nextStageCode, ...prev.accessCodes] : prev.accessCodes;
      const updatedStudents = newStudentObj ? [newStudentObj, ...prev.students] : prev.students;
      const finalInvoices = tuitionInvoice ? [tuitionInvoice, ...updatedInvoices] : updatedInvoices;
      const updatedApplicants = newStudentObj
        ? prev.applicants.map((a) =>
            a.id === invoice.targetId
              ? {
                  ...a,
                  status: "Offer Accepted" as const,
                  isOfferAccepted: true,
                  matricNumber: newStudentObj?.matricNumber,
                  convertedStudentId: newStudentObj?.id,
                }
              : a
          )
        : prev.applicants;

      return {
        ...prev,
        invoices: finalInvoices,
        payments: [newPayment, ...prev.payments],
        entitlements: updatedEntitlements,
        accessCodes: updatedCodes,
        students: updatedStudents,
        applicants: updatedApplicants,
        activeStudentId: newStudentObj ? newStudentObj.id : prev.activeStudentId,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            institutionId: invoice.institutionId,
            targetRole: invoice.targetType,
            targetUserId: invoice.targetId,
            title: "Simulated Payment Successful",
            message: `Recorded payment of NGN ${invoice.amount.toLocaleString()} for ${invoice.feeCategory}.`,
            type: "success",
            timestamp: now,
            isRead: false,
          },
          ...prev.notifications,
        ],
      };
    });

    logAuditEvent("Simulated Payment", "Invoice", invoiceId, "Success", `Simulated payment of NGN ${invoice.amount.toLocaleString()} (${txRef})`);
    return { success: true, message: `Payment simulated successfully. Reference: ${txRef}` };
  };

  const simulateFailedPayment = (invoiceId: string) => {
    const invoice = state.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    logAuditEvent("Simulated Payment Failed", "Invoice", invoiceId, "Failure", "Simulated card authorization error or network rejection.");
  };

  const simulateRefundReversal = (invoiceId: string, reason: string) => {
    const invoice = state.invoices.find((i) => i.id === invoiceId);
    if (!invoice || invoice.status !== "Paid") return;

    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "Reversed" } : inv
      ),
      payments: prev.payments.map((p) =>
        p.invoiceId === invoiceId ? { ...p, status: "Reversed", reversalReason: reason } : p
      ),
    }));

    logAuditEvent("Payment Reversal", "Invoice", invoiceId, "Warning", `Reversed transaction: ${reason}`);
  };

  // Access code issuance
  const issueAccessCode = (
    targetId: string,
    targetType: "applicant" | "student",
    stage: StageEntitlementKey,
    purpose: string
  ): string => {
    // Revoke previous active code for same stage & target
    const newCred = createAccessCodeCredential({
      institutionId: state.currentInstitutionId,
      targetId,
      targetType,
      stage,
      purpose,
    });

    setState((prev) => ({
      ...prev,
      accessCodes: [
        newCred,
        ...prev.accessCodes.map((c) =>
          c.targetId === targetId && c.stage === stage && c.status === "Active"
            ? { ...c, status: "Revoked" as const }
            : c
        ),
      ],
    }));

    logAuditEvent("Access Code Issued", "AccessCodeCredential", newCred.code, "Success", `Issued code for stage: ${stage}`);
    return newCred.code;
  };

  const revokeAccessCode = (codeId: string) => {
    setState((prev) => ({
      ...prev,
      accessCodes: prev.accessCodes.map((c) => (c.id === codeId ? { ...c, status: "Revoked" } : c)),
    }));
    logAuditEvent("Access Code Revoked", "AccessCodeCredential", codeId, "Warning", "Manual revocation by administrator.");
  };

  const verifyAccessCode = (code: string) => {
    const cred = state.accessCodes.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase());
    if (!cred) return { valid: false, error: "Access code not recognized or invalid format." };
    if (cred.status !== "Active") return { valid: false, error: `This access code is ${cred.status.toLowerCase()}.` };
    return { valid: true, credential: cred };
  };

  // Course registration
  const submitCourseRegistration = (studentId: string, courseIds: string[]) => {
    const student = state.students.find((s) => s.id === studentId);
    if (!student) return { success: false, message: "Student record not found." };

    const selectedCourses = state.courses.filter((c) => courseIds.includes(c.id));
    const totalCredits = selectedCourses.reduce((sum, c) => sum + c.creditUnits, 0);

    if (totalCredits < 12) {
      return { success: false, message: "Minimum semester load is 12 credit units." };
    }
    if (totalCredits > 24) {
      return { success: false, message: "Maximum semester load allowed is 24 credit units." };
    }

    const newReg: CourseRegistration = {
      id: `reg-${Date.now()}`,
      institutionId: student.institutionId,
      studentId: student.id,
      sessionId: "sess-1",
      semester: "First Semester",
      level: student.level,
      totalCredits,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      courses: selectedCourses.map((c) => ({
        courseId: c.id,
        courseCode: c.code,
        courseTitle: c.title,
        creditUnits: c.creditUnits,
        type: c.type,
      })),
    };

    // Also issue examination eligibility access code
    const examCode = createAccessCodeCredential({
      institutionId: student.institutionId,
      targetId: student.id,
      targetType: "student",
      stage: "exam_eligible",
      purpose: "Course registration concluded; authorization to sit examinations.",
    });

    setState((prev) => ({
      ...prev,
      registrations: [newReg, ...prev.registrations.filter((r) => r.studentId !== studentId)],
      accessCodes: [examCode, ...prev.accessCodes],
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, isCourseRegistered: true, currentAccessCode: examCode.code } : s
      ),
      entitlements: [
        ...prev.entitlements,
        {
          id: `ent-${Date.now()}`,
          targetId: studentId,
          stageKey: "course_registration_completed",
          grantedAt: new Date().toISOString(),
          reason: `Registered ${selectedCourses.length} courses (${totalCredits} credits).`,
          grantedBy: "Student Registration Engine",
          isActive: true,
        },
      ],
    }));

    logAuditEvent("Course Registration Submitted", "CourseRegistration", newReg.id, "Success", `Student registered ${totalCredits} units.`);
    return { success: true, message: `Registration submitted successfully for ${totalCredits} credit units!` };
  };

  const approveCourseRegistration = (registrationId: string) => {
    setState((prev) => ({
      ...prev,
      registrations: prev.registrations.map((r) =>
        r.id === registrationId
          ? { ...r, status: "Approved", approvedBy: `${currentUser.fullName} (Faculty Officer)` }
          : r
      ),
    }));
    logAuditEvent("Course Registration Approved", "CourseRegistration", registrationId, "Success", "Approved by Faculty Officer.");
  };

  // Scores & Examinations
  const updateScoreEntry = (scoreId: string, caScore: number, examScore: number) => {
    const total = caScore + examScore;
    const { grade, points } = calculateGrade(total);

    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) =>
        sc.id === scoreId
          ? {
              ...sc,
              caScore,
              examScore,
              totalScore: total,
              grade,
              gradePoints: points,
              state: "Draft",
            }
          : sc
      ),
    }));
  };

  const submitCourseScores = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) =>
        sc.courseId === courseId ? { ...sc, state: "Submitted" } : sc
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          institutionId: state.currentInstitutionId,
          targetRole: "exam_officer",
          title: "New Scores Submitted for Review",
          message: `Lecturer submitted assessment grades for review.`,
          type: "info",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        ...prev.notifications,
      ],
    }));
    logAuditEvent("Scores Submitted", "Course", courseId, "Success", "Submitted by Lecturer for Senate vetting.");
  };

  const approveCourseScores = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) =>
        sc.courseId === courseId ? { ...sc, state: "Approved" } : sc
      ),
    }));
    logAuditEvent("Scores Approved", "Course", courseId, "Success", "Approved by Senate Examination Officer.");
  };

  const rejectCourseScores = (courseId: string, reason: string) => {
    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) =>
        sc.courseId === courseId ? { ...sc, state: "Rejected", rejectionReason: reason } : sc
      ),
    }));
    logAuditEvent("Scores Rejected", "Course", courseId, "Warning", `Rejected by Exam Officer: ${reason}`);
  };

  const publishCourseScores = (courseId: string) => {
    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) =>
        sc.courseId === courseId ? { ...sc, state: "Published" } : sc
      ),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          institutionId: state.currentInstitutionId,
          targetRole: "student",
          title: "Semester Results Published",
          message: "Senate Examination Board has published approved course grades.",
          type: "success",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        ...prev.notifications,
      ],
    }));
    logAuditEvent("Results Published", "Course", courseId, "Success", "Officially published by Examination Board.");
  };

  const amendPublishedScore = (
    scoreId: string,
    ca: number,
    exam: number,
    reason: string
  ) => {
    const total = ca + exam;
    const { grade, points } = calculateGrade(total);

    setState((prev) => ({
      ...prev,
      scores: prev.scores.map((sc) => {
        if (sc.id === scoreId) {
          const history = sc.amendmentHistory || [];
          return {
            ...sc,
            caScore: ca,
            examScore: exam,
            totalScore: total,
            grade,
            gradePoints: points,
            state: "Amended",
            amendmentHistory: [
              ...history,
              {
                version: history.length + 1,
                caScore: sc.caScore,
                examScore: sc.examScore,
                reason,
                amendedBy: currentUser.fullName,
                amendedAt: new Date().toISOString(),
              },
            ],
          };
        }
        return sc;
      }),
    }));
    logAuditEvent("Result Amended", "StudentScore", scoreId, "Warning", `Senate amendment: ${reason}`);
  };

  // Announcements & Notifications
  const addAnnouncement = (
    title: string,
    content: string,
    targetAudience: Announcement["targetAudience"]
  ) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      institutionId: state.currentInstitutionId,
      title,
      content,
      targetAudience,
      publishedAt: new Date().toISOString(),
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      isPinned: false,
    };
    setState((prev) => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
    logAuditEvent("Announcement Published", "Announcement", newAnn.id, "Success", title);
  };

  const markNotificationAsRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  };

  const markAllNotificationsAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const createCustomInvoice = (params: {
    targetId: string;
    targetName: string;
    targetEmail: string;
    targetType: "student" | "applicant";
    feeCategory: FeeCategory;
    description: string;
    amount: number;
    dueDate: string;
  }) => {
    const newInv: Invoice = {
      id: `inv-custom-${Date.now()}`,
      institutionId: state.currentInstitutionId,
      invoiceNumber: `INV-${new Date().getFullYear()}-${params.feeCategory.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      targetId: params.targetId,
      targetName: params.targetName,
      targetEmail: params.targetEmail,
      targetType: params.targetType,
      feeCategory: params.feeCategory,
      description: params.description,
      amount: params.amount,
      academicSession: currentInstitution.currentSession,
      dueDate: params.dueDate,
      status: "Unpaid",
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, invoices: [newInv, ...prev.invoices] }));
    logAuditEvent("Invoice Generated", "Invoice", newInv.id, "Success", `Generated ${params.feeCategory} invoice for ${params.targetName}`);
  };

  const updateStudentStatus = (studentId: string, status: "Enrolled" | "Deferred" | "Withdrawn" | "Graduated") => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, enrollmentStatus: status } : s)),
    }));
    logAuditEvent("Student Status Updated", "Student", studentId, "Warning", `Updated enrollment standing to ${status}`);
  };

  const assignMatriculationNumber = (studentId: string, newMatric: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, matricNumber: newMatric } : s)),
    }));
    logAuditEvent("Matriculation Number Assigned", "Student", studentId, "Success", `Registry assigned ${newMatric}`);
  };

  const approveDeferment = (id: string, note?: string) => {
    setState((prev) => ({
      ...prev,
      defermentRequests: prev.defermentRequests.map((d) =>
        d.id === id ? { ...d, status: "Approved", decisionNote: note || "Approved by Senate Board" } : d
      ),
    }));
    logAuditEvent("Deferment Approved", "DefermentRequest", id, "Success", "Senate approved academic session deferment.");
  };

  const rejectDeferment = (id: string, note?: string) => {
    setState((prev) => ({
      ...prev,
      defermentRequests: prev.defermentRequests.map((d) =>
        d.id === id ? { ...d, status: "Declined", decisionNote: note || "Declined by Senate Board" } : d
      ),
    }));
    logAuditEvent("Deferment Declined", "DefermentRequest", id, "Warning", "Senate declined deferment request.");
  };

  const toggleGraduationClearance = (
    candidateId: string,
    field: "libraryClearance" | "bursaryClearance" | "departmentClearance" | "senateApproval"
  ) => {
    setState((prev) => ({
      ...prev,
      graduationCandidates: prev.graduationCandidates.map((c) =>
        c.id === candidateId ? { ...c, [field]: !c[field] } : c
      ),
    }));
    logAuditEvent("Graduation Clearance Updated", "GraduationCandidate", candidateId, "Success", `Toggled ${field}`);
  };

  const addStaffMember = (staff: Omit<StaffMember, "id">) => {
    const newStaff: StaffMember = {
      ...staff,
      id: `stf-${Date.now()}`,
    };
    setState((prev) => ({ ...prev, staffMembers: [newStaff, ...prev.staffMembers] }));
    logAuditEvent("Staff Appointed", "StaffMember", newStaff.id, "Success", `Onboarded ${newStaff.fullName} (${newStaff.rank})`);
  };

  const updateStaffRole = (staffId: string, newRole: UserRole, departmentId?: string) => {
    setState((prev) => ({
      ...prev,
      staffMembers: prev.staffMembers.map((s) =>
        s.id === staffId ? { ...s, role: newRole, departmentId: departmentId || s.departmentId } : s
      ),
    }));
    logAuditEvent("Staff Role Updated", "StaffMember", staffId, "Warning", `Reassigned role to ${newRole}`);
  };

  const assignLecturerToCourse = (courseId: string, lecturerId: string, lecturerName: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId ? { ...c, lecturerId, lecturerName } : c
      ),
    }));
    logAuditEvent("Course Assigned", "Course", courseId, "Success", `Allocated teaching lead: ${lecturerName}`);
  };

  const addExamSchedule = (item: Omit<ExaminationScheduleItem, "id">) => {
    const newExm: ExaminationScheduleItem = {
      ...item,
      id: `exm-${Date.now()}`,
    };
    setState((prev) => ({ ...prev, examSchedules: [newExm, ...prev.examSchedules] }));
    logAuditEvent("Exam Timetable Scheduled", "ExaminationScheduleItem", newExm.id, "Success", `Scheduled ${newExm.courseCode} on ${newExm.date}`);
  };

  const deleteExamSchedule = (id: string) => {
    setState((prev) => ({
      ...prev,
      examSchedules: prev.examSchedules.filter((e) => e.id !== id),
    }));
    logAuditEvent("Exam Timetable Item Removed", "ExaminationScheduleItem", id, "Warning", "Removed from schedule.");
  };

  const updateGradingPolicy = (policy: Partial<GradingPolicy>) => {
    setState((prev) => ({
      ...prev,
      gradingPolicy: { ...prev.gradingPolicy, ...policy },
    }));
    logAuditEvent("Grading Policy Updated", "GradingPolicy", "POLICY", "Warning", "Modified Senate score boundary rules.");
  };

  return (
    <DemoContext.Provider
      value={{
        ...state,
        setCurrentRole,
        setCurrentInstitutionId,
        currentInstitution,
        currentUser,
        currentStudent,
        currentApplicant,
        resetDemoData,
        setGuidedTourOpen,
        setGuidedTourStep,
        nextTourStep,
        prevTourStep,
        setActiveStudentId,
        setActiveApplicantId,
        createInstitution,
        updateInstitution,
        toggleInstitutionStatus,
        addFaculty,
        addDepartment,
        addProgramme,
        addSession,
        submitNewApplication,
        updateApplicationStatus,
        issueAdmissionOffer,
        acceptAdmissionOffer,
        convertApplicantToStudent,
        simulatePayment,
        simulateFailedPayment,
        simulateRefundReversal,
        issueAccessCode,
        revokeAccessCode,
        verifyAccessCode,
        submitCourseRegistration,
        approveCourseRegistration,
        updateScoreEntry,
        submitCourseScores,
        approveCourseScores,
        rejectCourseScores,
        publishCourseScores,
        amendPublishedScore,
        addAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logAuditEvent,
        createCustomInvoice,
        updateStudentStatus,
        assignMatriculationNumber,
        approveDeferment,
        rejectDeferment,
        toggleGraduationClearance,
        addStaffMember,
        updateStaffRole,
        assignLecturerToCourse,
        addExamSchedule,
        deleteExamSchedule,
        updateGradingPolicy,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoStore() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoStore must be used within a DemoProvider");
  }
  return context;
}
