"use client";

import React from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { UserRole } from "@/types";
import {
  X,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Building2,
  Users,
  CreditCard,
  KeyRound,
  BookOpen,
  Award,
  History,
  FileCheck,
} from "lucide-react";

interface TourStep {
  step: number;
  title: string;
  targetRole?: UserRole;
  description: string;
  actionHint: string;
  icon: any;
  buttonLabel?: string;
  onExecute?: (store: ReturnType<typeof useDemoStore>) => void;
}

export const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: "1. Public Product Homepage",
    description:
      "Welcome to UniCore. This enterprise SaaS platform manages Nigerian higher institutions from applicant screening to senate result publication.",
    actionHint: "Notice the marketing architecture, role showcase, and compliance highlights.",
    icon: Compass,
  },
  {
    step: 2,
    title: "2. Super Administrator Dashboard",
    targetRole: "super_admin",
    description:
      "Enter as Super Administrator to monitor multi-tenant KPIs: aggregate enrollment, multi-campus revenue, and institution health metrics.",
    actionHint: "Switching role to Super Administrator...",
    icon: Building2,
    buttonLabel: "Switch to Super Admin",
    onExecute: (store) => store.setCurrentRole("super_admin"),
  },
  {
    step: 3,
    title: "3. Multi-Tenant Institution Switching",
    targetRole: "super_admin",
    description:
      "Demonstrate instant tenant isolation. UniCore can manage Greenfield University, Royal Crest Polytechnic, and Excellence College of Education simultaneously.",
    actionHint: "Open the institution switcher in the top bar to observe tenant-specific statistics and color accents.",
    icon: Building2,
  },
  {
    step: 4,
    title: "4. School ICT Administrator Workspace",
    targetRole: "ict_admin",
    description:
      "Configure academic sessions (e.g. 2024/2025), semester registration deadlines, faculties, departments, degree programmes, and access-code policies.",
    actionHint: "Switching to ICT Administrator...",
    icon: Users,
    buttonLabel: "Switch to ICT Admin",
    onExecute: (store) => store.setCurrentRole("ict_admin"),
  },
  {
    step: 5,
    title: "5. Admissions Officer Workspace",
    targetRole: "admissions_officer",
    description:
      "Admissions officers screen candidate UTME scores, O'Level credentials, JAMB registration numbers, and state of origin allocations.",
    actionHint: "Switching to Admissions Officer view...",
    icon: FileCheck,
    buttonLabel: "Switch to Admissions Officer",
    onExecute: (store) => store.setCurrentRole("admissions_officer"),
  },
  {
    step: 6,
    title: "6. Review Applicant & Issue Provisional Offer",
    targetRole: "admissions_officer",
    description:
      "Review Amina Yusuf (UTME 284). Vetting committee approves her B.Sc Computer Science application and issues a formal admission offer.",
    actionHint: "Clicking 'Issue Offer' automatically generates an acceptance-fee invoice and logs an audit event.",
    icon: Award,
    buttonLabel: "Auto-Issue Offer to Amina",
    onExecute: (store) => {
      store.setCurrentRole("admissions_officer");
      const app = store.applicants.find((a) => a.id === "app-1");
      if (app && app.status !== "Offer Issued" && app.status !== "Offer Accepted") {
        store.issueAdmissionOffer("app-1");
      }
    },
  },
  {
    step: 7,
    title: "7. Switch to Applicant Portal",
    targetRole: "applicant",
    description:
      "Now switch to the prospective student's phone/desktop view. The applicant sees their real-time application status change from Submitted to Offer Issued.",
    actionHint: "Switching to Applicant Portal...",
    icon: Users,
    buttonLabel: "Switch to Applicant Portal",
    onExecute: (store) => store.setCurrentRole("applicant"),
  },
  {
    step: 8,
    title: "8. Accept Offer & Download Offer Letter",
    targetRole: "applicant",
    description:
      "The applicant reviews the provisional admission conditions and formally clicks 'Accept Offer'.",
    actionHint: "Acceptance is logged and unlocks the acceptance-fee payment step.",
    icon: CheckCircle2,
    buttonLabel: "Simulate Offer Acceptance",
    onExecute: (store) => {
      store.setCurrentRole("applicant");
      store.acceptAdmissionOffer("app-1");
    },
  },
  {
    step: 9,
    title: "9. Simulate Acceptance-Fee Payment",
    targetRole: "applicant",
    description:
      "Simulate payment of the NGN 65,000 acceptance fee via Simulated Campus Pay. No real bank or card is charged.",
    actionHint: "Click to simulate successful settlement...",
    icon: CreditCard,
    buttonLabel: "Simulate Acceptance Payment",
    onExecute: (store) => {
      store.setCurrentRole("applicant");
      const inv = store.invoices.find((i) => i.targetId === "app-1" && i.feeCategory === "Acceptance Fee");
      if (inv) store.simulatePayment(inv.id);
    },
  },
  {
    step: 10,
    title: "10. Access-Code Issuance & Student Matriculation",
    targetRole: "applicant",
    description:
      "Upon payment verification, the progression engine instantly issues a Student Activation Access Code and assigns an official matriculation number.",
    actionHint: "Notice the new Access Code generated with prefix UNI-ACT-....",
    icon: KeyRound,
  },
  {
    step: 11,
    title: "11. Switch to Student Portal",
    targetRole: "student",
    description:
      "Switch to the Undergraduate Student Portal (Chinonso Okonkwo, 300L Computer Science). Students check academic standing, GPA, and stage entitlements.",
    actionHint: "Switching to Student Portal...",
    icon: Users,
    buttonLabel: "Switch to Student Portal",
    onExecute: (store) => store.setCurrentRole("student"),
  },
  {
    step: 12,
    title: "12. Simulate School Fees Settlement",
    targetRole: "student",
    description:
      "Course registration requires school fees clearance. Students view their tuition invoice (NGN 245,000) and simulate settlement.",
    actionHint: "Check tuition invoices and payment receipts in the Bursary tab.",
    icon: CreditCard,
  },
  {
    step: 13,
    title: "13. Next-Stage Entitlement Unlocked",
    targetRole: "student",
    description:
      "The access-code progression engine issues code UNI-REG-... granting course-registration eligibility while preserving all previous matriculation entitlements.",
    actionHint: "Previous entitlements are never wiped out by subsequent stage transitions.",
    icon: KeyRound,
  },
  {
    step: 14,
    title: "14. Course Registration Workflow",
    targetRole: "student",
    description:
      "Select core and elective courses (19 units: CSC 301, CSC 303, CSC 305, etc.) adhering to the NUC credit limit (12-24 units).",
    actionHint: "Submit registration to generate the printable course slip.",
    icon: BookOpen,
  },
  {
    step: 15,
    title: "15. Switch to Lecturer Dashboard",
    targetRole: "lecturer",
    description:
      "Switch to Dr. Ayodeji Ogunleye. Lecturers view assigned course rosters and enter continuous assessment (30 marks) and exam marks (70 marks).",
    actionHint: "Switching to Lecturer view...",
    icon: Users,
    buttonLabel: "Switch to Lecturer",
    onExecute: (store) => store.setCurrentRole("lecturer"),
  },
  {
    step: 16,
    title: "16. Score Entry, Validation & Submission",
    targetRole: "lecturer",
    description:
      "Validation ensures CA scores <= 30 and Exam scores <= 70. Lecturer saves drafts, validates ranges, and submits the grade sheet for Senate vetting.",
    actionHint: "Submitting marks moves state from 'Draft' to 'Submitted' and alerts the Examination Officer.",
    icon: Award,
    buttonLabel: "Submit CSC 301 Scores",
    onExecute: (store) => {
      store.setCurrentRole("lecturer");
      store.submitCourseScores("crs-1");
    },
  },
  {
    step: 17,
    title: "17. Switch to Examination Officer Dashboard",
    targetRole: "exam_officer",
    description:
      "The Examination Officer reviews grade distributions, verifies pass/fail thresholds, and queues results for Senate approval.",
    actionHint: "Switching to Examination Officer view...",
    icon: Users,
    buttonLabel: "Switch to Exam Officer",
    onExecute: (store) => store.setCurrentRole("exam_officer"),
  },
  {
    step: 18,
    title: "18. Approve & Publish Official Results",
    targetRole: "exam_officer",
    description:
      "Exam Officer approves scores. With one click, results are published to students. Any subsequent amendment requires a documented Senate reason.",
    actionHint: "Clicking publish moves status to 'Published' and calculates semester GPA.",
    icon: CheckCircle2,
    buttonLabel: "Approve & Publish CSC 301",
    onExecute: (store) => {
      store.setCurrentRole("exam_officer");
      store.approveCourseScores("crs-1");
      store.publishCourseScores("crs-1");
    },
  },
  {
    step: 19,
    title: "19. View Student Results & Live GPA / CGPA",
    targetRole: "student",
    description:
      "Switch back to Student. The student immediately sees their updated grade (A in CSC 301, 89%), First Class standing, and updated cumulative GPA (4.62).",
    actionHint: "Switching to Student to view published grades...",
    icon: Award,
    buttonLabel: "Return to Student Portal",
    onExecute: (store) => store.setCurrentRole("student"),
  },
  {
    step: 20,
    title: "20. Global Audit Log & Compliance Trail",
    targetRole: "super_admin",
    description:
      "Inspect the tamper-evident simulated audit trail. Every action during this tour (payments, offers, code generation, score amendments) is timestamped with actor IDs.",
    actionHint: "Switch to Super Admin to inspect the complete audit trail and export CSV.",
    icon: History,
    buttonLabel: "View Audit Log in Super Admin",
    onExecute: (store) => store.setCurrentRole("super_admin"),
  },
];

export function GuidedTourModal() {
  const store = useDemoStore();
  const { guidedTourOpen, guidedTourStep, setGuidedTourOpen, setGuidedTourStep, nextTourStep, prevTourStep } = store;

  if (!guidedTourOpen) return null;

  const currentTour = TOUR_STEPS[guidedTourStep] || TOUR_STEPS[0];
  const Icon = currentTour.icon;
  const isFirst = guidedTourStep === 0;
  const isLast = guidedTourStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setGuidedTourOpen(false);
    } else {
      nextTourStep();
    }
  };

  const handleRunAction = () => {
    if (currentTour.onExecute) {
      currentTour.onExecute(store);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-amber-500 transition-all duration-300"
            style={{ width: `${((guidedTourStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mt-2">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                Interactive Guided Sales Tour
              </span>
              <h3 className="font-extrabold text-lg text-navy-950">
                Step {currentTour.step} of {TOUR_STEPS.length}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setGuidedTourOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-6 space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-navy-950">{currentTour.title}</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {currentTour.description}
              </p>
            </div>
          </div>

          {/* Action Hint / Execution Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-700">
              <span className="font-bold text-navy-950">Workflow Insight: </span>
              <span>{currentTour.actionHint}</span>
            </div>
            {currentTour.onExecute && (
              <button
                onClick={handleRunAction}
                className="shrink-0 px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-lg shadow-sm transition-all"
              >
                {currentTour.buttonLabel || "Simulate Step"}
              </button>
            )}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center space-x-1.5 py-2 overflow-x-auto">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setGuidedTourStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === guidedTourStep
                  ? "w-6 bg-brand-700"
                  : idx < guidedTourStep
                  ? "bg-brand-300"
                  : "bg-slate-200"
              }`}
              title={`Jump to Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          <button
            onClick={() => setGuidedTourOpen(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Exit Tour
          </button>

          <div className="flex items-center space-x-2">
            {!isFirst && (
              <button
                onClick={prevTourStep}
                className="inline-flex items-center space-x-1 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-1 px-5 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <span>{isLast ? "Finish Tour" : "Next Step"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
