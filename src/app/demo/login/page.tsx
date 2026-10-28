"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoStore } from "@/lib/demo-data/store";
import { ROLE_CONFIGS, PLATFORM_INFO } from "@/config/platform";
import { UserRole } from "@/types";
import {
  Shield,
  KeyRound,
  GraduationCap,
  Users,
  Building2,
  Lock,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function DemoLoginPage() {
  const router = useRouter();
  const { setCurrentRole, setGuidedTourOpen } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"quick" | "staff" | "student" | "applicant">("quick");

  // Simulated Form State
  const [staffEmail, setStaffEmail] = useState("superadmin@unicore.ng");
  const [staffPass, setStaffPass] = useState("demo1234");

  const [studentMatric, setStudentMatric] = useState("GUT/CMP/22/0452");
  const [studentCode, setStudentCode] = useState("UNI-CRS-8921-X9K");

  const [appNumber, setAppNumber] = useState("APP/2025/0014");
  const [appSurname, setAppSurname] = useState("Yusuf");

  const enterRole = (role: UserRole) => {
    setCurrentRole(role);
    router.push(`/demo/portal?view=${role}`);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterRole("super_admin");
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterRole("student");
  };

  const handleApplicantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterRole("applicant");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between font-sans">
      {/* Notice Banner */}
      <div className="bg-amber-500 text-navy-950 font-medium text-xs px-4 py-2 text-center shadow-inner">
        <span className="font-bold">DEMO MODE:</span> Sample data only. No real payments, accounts, or academic records are processed.
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Info & Role Launcher */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-r lg:pr-8">
            <div>
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center font-black text-xl shadow-md">
                  U
                </div>
                <div className="leading-tight">
                  <span className="font-extrabold text-navy-950 text-lg tracking-tight block">
                    {PLATFORM_INFO.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Institutional SaaS Suite
                  </span>
                </div>
              </Link>

              <h2 className="text-xl font-black text-navy-950 mt-6 tracking-tight">
                Enterprise Demonstration Access
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Choose a demonstration profile to enter the management suite from any institutional perspective.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-navy-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Sales Presenter Quick Start:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Click any role on the right to enter directly, or trigger the 20-stage guided walkthrough.
                </p>
                <button
                  onClick={() => {
                    setGuidedTourOpen(true);
                    enterRole("super_admin");
                  }}
                  className="mt-1 w-full py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Launch Guided Sales Tour</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Frontend Demonstration MVP • Greenfield University Context
            </div>
          </div>

          {/* Right Column: Tabbed Direct Login vs Form */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Tabs */}
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab("quick")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "quick" ? "bg-white text-navy-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1-Click Direct Access
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "staff" ? "bg-white text-navy-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Staff Login Form
              </button>
              <button
                onClick={() => setActiveTab("student")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "student" ? "bg-white text-navy-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Student Access
              </button>
              <button
                onClick={() => setActiveTab("applicant")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "applicant" ? "bg-white text-navy-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Applicant
              </button>
            </div>

            {/* Tab: Quick 1-Click Role Selection */}
            {activeTab === "quick" && (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {[
                  { role: "super_admin", label: "Enter as Super Administrator", badge: "Platform HQ", color: "bg-purple-700" },
                  { role: "ict_admin", label: "Enter as School ICT Administrator", badge: "Campus ICT", color: "bg-indigo-700" },
                  { role: "admissions_officer", label: "Enter as Admissions Officer", badge: "Admissions", color: "bg-cyan-700" },
                  { role: "bursar", label: "Enter as Bursar / Finance Officer", badge: "Bursary", color: "bg-emerald-700" },
                  { role: "registrar", label: "Enter as University Registrar", badge: "Registry", color: "bg-teal-700" },
                  { role: "faculty_officer", label: "Enter as Faculty Officer", badge: "Faculty Board", color: "bg-amber-700" },
                  { role: "exam_officer", label: "Enter as Examination Officer", badge: "Senate Exams", color: "bg-rose-700" },
                  { role: "lecturer", label: "Enter as Lecturer / Academic Staff", badge: "Faculty Member", color: "bg-sky-700" },
                  { role: "student", label: "Enter as Undergraduate Student", badge: "Student Portal", color: "bg-blue-600" },
                  { role: "applicant", label: "Enter as Prospective Applicant", badge: "Admissions Portal", color: "bg-emerald-600" },
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => enterRole(item.role as UserRole)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between group text-left"
                  >
                    <div>
                      <span className="text-xs font-bold text-navy-950 block group-hover:text-brand-700">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Preconfigured test profile with realistic mock privileges
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-sm ${item.color}`}>
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab: Staff Login Form */}
            {activeTab === "staff" && (
              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                  Production Authentication Prototype: Institutional Email + Password
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Staff Password
                  </label>
                  <input
                    type="password"
                    required
                    value={staffPass}
                    onChange={(e) => setStaffPass(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1"
                >
                  <span>Enter Staff Portal (Demo Mode)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Tab: Student Login Form */}
            {activeTab === "student" && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs">
                  Production Authentication Prototype: Matriculation Number + Current Stage Access Code
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Matriculation Number
                  </label>
                  <input
                    type="text"
                    required
                    value={studentMatric}
                    onChange={(e) => setStudentMatric(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Current Stage Access Code
                  </label>
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1"
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Tab: Applicant Login Form */}
            {activeTab === "applicant" && (
              <form onSubmit={handleApplicantSubmit} className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                  Production Authentication Prototype: Application Number + Surname
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Application Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-xs text-slate-700 block mb-1">
                    Candidate Surname
                  </label>
                  <input
                    type="text"
                    required
                    value={appSurname}
                    onChange={(e) => setAppSurname(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1"
                >
                  <span>Enter Applicant Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 text-center text-xs text-slate-400">
        UniCore University Management SaaS • Designed for Nigerian & African Higher Education
      </div>
    </div>
  );
}
