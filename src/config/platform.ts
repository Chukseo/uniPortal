import { UserRole } from "@/types";

export interface RoleMeta {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  color: string;
  defaultPath: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleMeta> = {
  super_admin: {
    role: "super_admin",
    title: "Super Administrator",
    badge: "Platform HQ",
    description: "Multi-tenant institutional governance, tenant onboarding, global revenue & system audit.",
    color: "bg-purple-700 text-white",
    defaultPath: "/demo/portal?view=super_admin",
  },
  ict_admin: {
    role: "ict_admin",
    title: "School ICT Administrator",
    badge: "Campus ICT",
    description: "Academic sessions, faculties, departments, access-code rules, grading scales & staff accounts.",
    color: "bg-indigo-700 text-white",
    defaultPath: "/demo/portal?view=ict_admin",
  },
  school_admin: {
    role: "school_admin",
    title: "School Administrator",
    badge: "Executive",
    description: "Institutional oversight, student directories, matriculation numbers & academic operations.",
    color: "bg-blue-700 text-white",
    defaultPath: "/demo/portal?view=school_admin",
  },
  admissions_officer: {
    role: "admissions_officer",
    title: "Admissions Officer",
    badge: "Admissions",
    description: "Application screening, document validation, offer issuance & acceptance fee clearance.",
    color: "bg-cyan-700 text-white",
    defaultPath: "/demo/portal?view=admissions_officer",
  },
  registrar: {
    role: "registrar",
    title: "University Registrar",
    badge: "Registry",
    description: "Matriculation management, deferments, student status, official transcripts & senate reports.",
    color: "bg-teal-700 text-white",
    defaultPath: "/demo/portal?view=registrar",
  },
  bursar: {
    role: "bursar",
    title: "Bursar / Finance Officer",
    badge: "Bursary",
    description: "Tuition collection, acceptance fees, departmental invoices, transaction reconciliations & reversals.",
    color: "bg-emerald-700 text-white",
    defaultPath: "/demo/portal?view=bursar",
  },
  faculty_officer: {
    role: "faculty_officer",
    title: "Faculty Officer",
    badge: "Faculty Board",
    description: "Faculty course allocations, lecturer assignments, departmental enrollments & registration vetting.",
    color: "bg-amber-700 text-white",
    defaultPath: "/demo/portal?view=faculty_officer",
  },
  exam_officer: {
    role: "exam_officer",
    title: "Examination Officer",
    badge: "Senate Exams",
    description: "Result approval queue, grade validation, rejection feedback, publishing & senate amendments.",
    color: "bg-rose-700 text-white",
    defaultPath: "/demo/portal?view=exam_officer",
  },
  lecturer: {
    role: "lecturer",
    title: "Academic Staff / Lecturer",
    badge: "Faculty Member",
    description: "Assigned course lists, class rosters, CA/Exam score entry, range validation & submission.",
    color: "bg-sky-700 text-white",
    defaultPath: "/demo/portal?view=lecturer",
  },
  student: {
    role: "student",
    title: "Undergraduate Student",
    badge: "Student Portal",
    description: "Fee payment simulation, access-code progression, course registration, results & unofficial transcript.",
    color: "bg-blue-600 text-white",
    defaultPath: "/demo/portal?view=student",
  },
  applicant: {
    role: "applicant",
    title: "Prospective Applicant",
    badge: "Admissions Portal",
    description: "Application submission, document upload, offer acceptance, acceptance fee & student code issuance.",
    color: "bg-emerald-600 text-white",
    defaultPath: "/demo/portal?view=applicant",
  },
};

export const PLATFORM_INFO = {
  name: "UniCore",
  tagline: "University Management Platform",
  description:
    "An enterprise-grade, multi-tenant university management SaaS architected for Nigerian higher education institutions, polytechnics, and colleges of education.",
  version: "v2.5-enterprise-demo",
  supportEmail: "demo@unicore.ng",
  phone: "+234 (01) 888-UNICORE",
};
