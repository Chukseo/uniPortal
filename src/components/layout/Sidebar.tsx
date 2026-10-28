"use client";

import React from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo-data/store";
import { ROLE_CONFIGS, PLATFORM_INFO } from "@/config/platform";
import {
  LayoutDashboard,
  Building,
  GraduationCap,
  FileCheck,
  CreditCard,
  BookOpen,
  Award,
  KeyRound,
  History,
  Megaphone,
  FileText,
  FileBadge,
  ShieldCheck,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenDocModal?: (docType: string) => void;
}

export function Sidebar({ currentTab, onTabChange, onOpenDocModal }: SidebarProps) {
  const { currentRole, currentInstitution, setGuidedTourOpen } = useDemoStore();
  const roleMeta = ROLE_CONFIGS[currentRole];

  // Role-specific navigation items
  const getNavItems = () => {
    switch (currentRole) {
      case "super_admin":
        return [
          { id: "overview", label: "Executive Overview", icon: LayoutDashboard },
          { id: "institutions", label: "Institutions & Tenants", icon: Building },
          { id: "revenue", label: "Revenue & Finance", icon: CreditCard },
          { id: "roles", label: "Role Directory", icon: ShieldCheck },
          { id: "audit", label: "Global Audit Log", icon: History },
        ];
      case "ict_admin":
        return [
          { id: "overview", label: "ICT Overview", icon: LayoutDashboard },
          { id: "sessions", label: "Sessions & Semesters", icon: Settings },
          { id: "faculties", label: "Faculties & Depts", icon: Building },
          { id: "programmes", label: "Curricula / Programmes", icon: GraduationCap },
          { id: "access_policy", label: "Access-Code Policy", icon: KeyRound },
          { id: "announcements", label: "Campus Announcements", icon: Megaphone },
        ];
      case "school_admin":
      case "registrar":
        return [
          { id: "overview", label: "Registry Overview", icon: LayoutDashboard },
          { id: "students", label: "Student Directory", icon: GraduationCap },
          { id: "admissions", label: "Admissions Registry", icon: FileCheck },
          { id: "matriculation", label: "Matriculation Numbers", icon: KeyRound },
          { id: "reports", label: "Senate Reports", icon: FileText },
        ];
      case "admissions_officer":
        return [
          { id: "overview", label: "Admissions Dashboard", icon: LayoutDashboard },
          { id: "applicants", label: "Application Screening", icon: FileCheck },
          { id: "offers", label: "Offer Issuance", icon: Award },
          { id: "acceptance", label: "Acceptance Clearance", icon: CreditCard },
        ];
      case "bursar":
        return [
          { id: "overview", label: "Bursary Dashboard", icon: LayoutDashboard },
          { id: "invoices", label: "Invoices & Tuition", icon: FileText },
          { id: "transactions", label: "Payment Transactions", icon: CreditCard },
          { id: "reversals", label: "Refunds & Reversals", icon: History },
        ];
      case "faculty_officer":
        return [
          { id: "overview", label: "Faculty Dashboard", icon: LayoutDashboard },
          { id: "departments", label: "Departments & Courses", icon: Building },
          { id: "allocations", label: "Lecturer Allocations", icon: BookOpen },
          { id: "vetting", label: "Registration Vetting", icon: FileCheck },
        ];
      case "lecturer":
        return [
          { id: "overview", label: "Lecturer Courses", icon: LayoutDashboard },
          { id: "score_entry", label: "CA & Exam Marks", icon: Award },
          { id: "submissions", label: "Submission History", icon: History },
        ];
      case "exam_officer":
        return [
          { id: "overview", label: "Examination Office", icon: LayoutDashboard },
          { id: "approval_queue", label: "Score Approval Queue", icon: Award },
          { id: "publishing", label: "Senate Publishing", icon: FileCheck },
          { id: "amendments", label: "Result Amendments", icon: History },
        ];
      case "student":
        return [
          { id: "overview", label: "Student Portal", icon: LayoutDashboard },
          { id: "payments", label: "Tuition & Invoices", icon: CreditCard },
          { id: "courses", label: "Course Registration", icon: BookOpen },
          { id: "results", label: "Results & CGPA", icon: Award },
          { id: "access_code", label: "Stage Access Code", icon: KeyRound },
        ];
      case "applicant":
        return [
          { id: "overview", label: "Application Journey", icon: LayoutDashboard },
          { id: "offer", label: "Admission Offer", icon: Award },
          { id: "acceptance_fee", label: "Acceptance Fee", icon: CreditCard },
          { id: "documents", label: "Uploaded Credentials", icon: FileText },
        ];
      default:
        return [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-navy-950 text-slate-300 flex flex-col shrink-0 border-r border-navy-900 select-none min-h-[calc(100vh-4rem)]">
      {/* Institution Mini Card */}
      <div className="p-4 border-b border-navy-900 bg-navy-900/40">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-lg"
            style={{ backgroundColor: currentInstitution.accentColor || "#1e40af" }}
          >
            {currentInstitution.code.substring(0, 3)}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-white text-xs truncate leading-tight">
              {currentInstitution.name}
            </h3>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">
              {currentInstitution.motto}
            </p>
          </div>
        </div>

        {/* Current Academic Session Tag */}
        <div className="mt-3 flex items-center justify-between text-[11px] bg-navy-950/80 px-2.5 py-1.5 rounded-lg border border-navy-800">
          <span className="text-slate-400">Session:</span>
          <span className="font-semibold text-amber-400">
            {currentInstitution.currentSession} • {currentInstitution.currentSemester}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          {roleMeta.title} Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand-700 text-white shadow-md shadow-brand-900/40"
                  : "text-slate-300 hover:bg-navy-900 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />}
            </button>
          );
        })}

        {/* Printable Demo Slips & Credentials */}
        {onOpenDocModal && (
          <div className="pt-4 border-t border-navy-900 mt-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Sample Document Previews
            </div>
            <button
              onClick={() => onOpenDocModal("offer_letter")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-amber-300 transition-colors"
            >
              <FileBadge className="w-3.5 h-3.5 text-amber-400" />
              <span>Admission Offer Slip</span>
            </button>
            <button
              onClick={() => onOpenDocModal("receipt")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-emerald-300 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tuition Payment Receipt</span>
            </button>
            <button
              onClick={() => onOpenDocModal("registration_slip")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-sky-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Course Registration Slip</span>
            </button>
            <button
              onClick={() => onOpenDocModal("transcript")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-purple-300 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Unofficial Result Slip</span>
            </button>
            <button
              onClick={() => onOpenDocModal("exam_docket")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-rose-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Examination Docket Pass</span>
            </button>
            <button
              onClick={() => onOpenDocModal("convocation_certificate")}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-navy-900 hover:text-amber-300 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Convocation Degree Award</span>
            </button>
          </div>
        )}
      </nav>

      {/* Guided Tour Launcher Card at Bottom */}
      <div className="p-3 border-t border-navy-900 bg-navy-900/60">
        <div className="bg-gradient-to-br from-brand-900 to-navy-900 p-3 rounded-xl border border-brand-800/60">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sales Presentation Tour</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            Step-by-step 20-stage walkthrough covering admissions to graduation.
          </p>
          <button
            onClick={() => setGuidedTourOpen(true)}
            className="mt-2.5 w-full py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Launch Tour
          </button>
        </div>
      </div>
    </aside>
  );
}
