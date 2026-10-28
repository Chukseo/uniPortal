"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
import { Student } from "@/types";
import {
  GraduationCap,
  CreditCard,
  BookOpen,
  Award,
  KeyRound,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  FileCheck,
  Copy,
  ChevronRight,
  Calendar,
  Building,
  TrendingUp,
  UserCheck,
  Download,
  ShieldCheck,
  X,
  Printer,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function StudentView() {
  const {
    currentStudent,
    students,
    currentInstitution,
    invoices,
    courses,
    registrations,
    scores,
    examSchedules,
    accessCodes,
    simulatePayment,
    submitCourseRegistration,
    setActiveStudentId,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "courses" | "results" | "exams">("overview");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    "crs-1",
    "crs-2",
    "crs-3",
    "crs-4",
    "crs-5",
    "crs-6",
  ]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [regFeedback, setRegFeedback] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<any | null>(null);
  const [showCourseSlipModal, setShowCourseSlipModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const student = currentStudent || students[0] || {
    id: "std-1",
    matricNumber: "GUT/CMP/22/0452",
    firstName: "Chinonso",
    lastName: "Okonkwo",
    otherNames: "Emeka",
    email: "chinonso.okonkwo@student.greenfield.edu.ng",
    level: "300L",
    cgpa: 4.62,
    academicStanding: "First Class",
    isAccountActivated: true,
    isCourseRegistered: true,
    currentAccessCode: "UNI-CRS-8921-X9K",
  };

  const studentInvoices = invoices.filter((i) => i.targetId === student.id);
  const studentScores = scores.filter((s) => s.studentId === student.id);
  const studentReg = registrations.find((r) => r.studentId === student.id);

  // Dynamic CGPA trajectory
  const isSenior = student.level === "300L" || student.level === "400L";
  const cgpaHistory = isSenior
    ? [
        { semester: "100L 1st", cgpa: 4.45, gpa: 4.45 },
        { semester: "100L 2nd", cgpa: 4.52, gpa: 4.60 },
        { semester: "200L 1st", cgpa: 4.58, gpa: 4.68 },
        { semester: "200L 2nd", cgpa: 4.60, gpa: 4.64 },
        { semester: "300L 1st (Current)", cgpa: student.cgpa, gpa: 4.70 },
      ]
    : [
        { semester: "100L 1st (In Progress)", cgpa: student.cgpa || 0, gpa: student.cgpa || 0 },
      ];

  // Available courses
  const selectedCourseObjs = courses.filter((c) => selectedCourses.includes(c.id));
  const currentCreditTotal = selectedCourseObjs.reduce((sum, c) => sum + c.creditUnits, 0);

  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleRegisterCourses = () => {
    const res = submitCourseRegistration(student.id, selectedCourses);
    setRegFeedback(res.message);
    setTimeout(() => setRegFeedback(null), 4000);
  };

  const handlePayTuition = (invoiceId: string) => {
    const res = simulatePayment(invoiceId, "Simulated Campus Pay");
    setRegFeedback(res.message);
    setTimeout(() => setRegFeedback(null), 4000);
  };

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Progression Checklist
  const stages = [
    { key: "admission_accepted", label: "Provisional Admission Cleared", done: true },
    { key: "acceptance_fee_cleared", label: "Acceptance Fee Paid", done: true },
    { key: "student_activated", label: "Matriculation Activated", done: student.isAccountActivated },
    {
      key: "school_fees_cleared",
      label: "Session Tuition Cleared",
      done: !studentInvoices.some((i) => i.feeCategory === "School Fees" && i.status === "Unpaid"),
    },
    { key: "course_registration_completed", label: "Course Registration Vetted", done: student.isCourseRegistered },
    { key: "exam_eligible", label: "Examination Docket Cleared", done: student.isCourseRegistered },
    { key: "results_viewable", label: "Senate Results Published", done: studentScores.some((s) => s.state === "Published") },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {regFeedback && (
        <div className="p-3.5 bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{regFeedback}</span>
          </div>
          <button onClick={() => setRegFeedback(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Profile Card & Student Switcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-brand-950 to-navy-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-brand-400">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {student.firstName} {student.lastName} {student.otherNames}
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  {student.academicStanding}
                </span>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 font-bold px-2 py-0.5 rounded border border-brand-400/30">
                  {student.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Matriculation: <span className="text-amber-400 font-bold">{student.matricNumber}</span> • B.Sc Computer Science
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentInstitution.name} • Session: {currentInstitution.currentSession} ({currentInstitution.currentSemester})
              </p>
            </div>
          </div>

          {/* Student Switcher & Current Access Code */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-navy-900/80 border border-navy-700 rounded-xl px-2.5 py-1.5 flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Active Student:</span>
              <select
                value={student.id}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-navy-950 text-white">
                    {s.firstName} {s.lastName} ({s.level} - {s.matricNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 min-w-[200px]">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">
                Stage Access Code:
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-black text-amber-400 text-xs tracking-wide">
                  {student.currentAccessCode || "UNI-REG-4412-M2P"}
                </span>
                <button
                  onClick={() => copyCode(student.currentAccessCode || "UNI-REG-4412-M2P")}
                  className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white transition-colors"
                  title="Copy Access Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copiedCode && <span className="text-[9px] text-emerald-300 font-bold block mt-0.5">Copied to clipboard!</span>}
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 pt-6 border-t border-navy-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((st, idx) => (
            <div
              key={st.key}
              className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 transition-all ${
                st.done
                  ? "bg-brand-900/60 border-brand-500/50 text-white font-bold"
                  : "bg-navy-900/40 border-navy-800 text-slate-400"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  st.done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                {st.done ? "✓" : idx + 1}
              </div>
              <span className="truncate">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Student Bio & Academic Overview
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "payments"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tuition & Fee Ledger ({studentInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "courses"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Course Registration {student.isCourseRegistered ? "(Vetted)" : "(Pending)"}
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "results"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Results, CGPA & Transcript
        </button>
        <button
          onClick={() => setActiveTab("exams")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "exams"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Examination Timetable & Clearance
        </button>
      </div>

      {/* TAB 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Cumulative GPA</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-navy-950 font-mono">{student.cgpa.toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-500">/ 5.00</span>
              </div>
              <span className="text-xs font-bold text-purple-700 block bg-purple-50 px-2.5 py-1 rounded-lg">
                {student.academicStanding} (NUC Scale)
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Course Registration</span>
              <div className="text-xl font-black text-navy-950">
                {student.isCourseRegistered ? (
                  <span className="text-emerald-700 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Concluded & Vetted</span>
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center space-x-1.5">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>Pending Submission</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 block">
                Session: {student.currentSession} • {student.currentSemester}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Bursary Clearance Status</span>
              <div className="text-xl font-black text-navy-950">
                {studentInvoices.some((i) => i.feeCategory === "School Fees" && i.status === "Unpaid") ? (
                  <span className="text-amber-600 flex items-center space-x-1.5">
                    <AlertCircle className="w-5 h-5" />
                    <span>Fees Outstanding</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Tuition 100% Cleared</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 block">
                Eligible for Course Enrollment & Examination
              </span>
            </div>
          </div>

          {/* Academic Details Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-navy-950">Institutional Registry Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Faculty:</span>
                <span className="font-bold text-navy-950">Faculty of Computing & IT</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Department:</span>
                <span className="font-bold text-navy-950">Computer Science</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Degree Programme:</span>
                <span className="font-bold text-navy-950">B.Sc Computer Science</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 block">Level & Standing:</span>
                <span className="font-bold text-navy-950">{student.level} • {student.enrollmentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tuition & Fee Ledger */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">Tuition & Institutional Invoices</h3>
                <p className="text-xs text-slate-500">Official student account ledger and simulated payment portal</p>
              </div>
              <span className="text-xs bg-brand-50 text-brand-800 font-bold px-3 py-1 rounded-lg border border-brand-200">
                {studentInvoices.length} Invoices Found
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {studentInvoices.map((inv) => (
                <div key={inv.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-brand-700 text-xs">{inv.invoiceNumber}</span>
                      <span className="font-bold text-navy-950 text-sm">{inv.description}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Category: <strong>{inv.feeCategory}</strong> • Session: {inv.academicSession} • Due: {inv.dueDate}
                    </p>
                    {inv.paymentReference && (
                      <p className="text-[11px] font-mono text-emerald-700">Ref: {inv.paymentReference}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-black text-navy-950">
                      {formatCurrency(inv.amount)}
                    </span>
                    {inv.status === "Unpaid" ? (
                      <button
                        onClick={() => handlePayTuition(inv.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Now (Demo)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowReceiptModal(inv)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Course Registration */}
      {activeTab === "courses" && (
        <div className="space-y-5">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Semester Course Enrollment Portal</h3>
              <p className="text-xs text-slate-500">
                Minimum: 15 credit units • Maximum: 24 credit units (NUC Senate Guideline)
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-xs px-3 py-1.5 bg-slate-100 rounded-xl font-bold">
                Selected Units: <span className="text-brand-700 font-mono text-sm">{currentCreditTotal}</span> / 24 Max
              </div>
              <button
                onClick={handleRegisterCourses}
                disabled={currentCreditTotal < 15 || currentCreditTotal > 24}
                className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Form to Faculty Officer</span>
              </button>
              {student.isCourseRegistered && (
                <button
                  onClick={() => setShowCourseSlipModal(true)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3.5 text-center">Select</th>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Units</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Assigned Lecturer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => {
                    const isSelected = selectedCourses.includes(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourse(c.id)}
                            className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold text-brand-700">{c.code}</td>
                        <td className="p-3.5 font-bold text-navy-950">{c.title}</td>
                        <td className="p-3.5 font-mono font-semibold">{c.creditUnits} Units</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.type === "Compulsory" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{c.lecturerName || "Unassigned"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Results & CGPA Trajectory */}
      {activeTab === "results" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-sm text-navy-950">CGPA Progression Trajectory (NUC 5.0 Scale)</h3>
                <p className="text-xs text-slate-500">Historical performance curve across academic semesters</p>
              </div>
              <button
                onClick={() => setShowTranscriptModal(true)}
                className="px-3.5 py-1.5 bg-brand-50 text-brand-800 hover:bg-brand-100 rounded-xl text-xs font-bold border border-brand-200 flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unofficial Transcript</span>
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cgpaHistory}>
                  <defs>
                    <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cgpa" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#cgpaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-navy-950">Senate Published Semester Results</h3>
              <span className="text-xs text-slate-500">{studentScores.length} Course Results Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Units</th>
                    <th className="p-3.5 text-center">CA (30)</th>
                    <th className="p-3.5 text-center">Exam (70)</th>
                    <th className="p-3.5 text-center">Total (100)</th>
                    <th className="p-3.5 text-center">Letter Grade</th>
                    <th className="p-3.5 text-center">Points (5.0)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentScores.map((sc) => {
                    const course = courses.find((c) => c.id === sc.courseId);
                    return (
                      <tr key={sc.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-brand-700">{course?.code || "CSC 301"}</td>
                        <td className="p-3.5 font-bold text-navy-950">{course?.title || "Computer Science Core"}</td>
                        <td className="p-3.5 font-mono font-semibold">{course?.creditUnits || 3}</td>
                        <td className="p-3.5 text-center font-mono">{sc.caScore}</td>
                        <td className="p-3.5 text-center font-mono">{sc.examScore}</td>
                        <td className="p-3.5 text-center font-mono font-bold text-slate-900">{sc.totalScore}</td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-black text-xs ${
                              sc.grade === "A"
                                ? "bg-purple-100 text-purple-800"
                                : sc.grade === "B"
                                ? "bg-blue-100 text-blue-800"
                                : sc.grade === "C"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {sc.grade}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold">{sc.gradePoints}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Examination Timetable & Docket */}
      {activeTab === "exams" && (
        <div className="space-y-5">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Official Senate Examination Docket & Schedule</h3>
              <p className="text-xs text-slate-500">First Semester Examinations 2024/2025</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EXAMINATION DOCKET CLEARED</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Time Window</th>
                    <th className="p-3.5">Examination Venue</th>
                    <th className="p-3.5">Assigned Seat</th>
                    <th className="p-3.5">Chief Invigilator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examSchedules.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-brand-700">{ex.courseCode}</td>
                      <td className="p-3.5 font-bold text-navy-950">{ex.courseTitle}</td>
                      <td className="p-3.5 font-semibold text-slate-700">{ex.date}</td>
                      <td className="p-3.5 font-mono text-slate-600">{ex.startTime} - {ex.endTime}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{ex.venue}</td>
                      <td className="p-3.5 font-mono font-bold text-brand-800">Seat #042</td>
                      <td className="p-3.5 text-slate-600">{ex.invigilatorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Official Bursary Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 bg-slate-50 border rounded-2xl text-xs space-y-3 font-mono">
              <div className="text-center pb-2 border-b">
                <h4 className="font-bold text-sm text-navy-950">{currentInstitution.name}</h4>
                <p className="text-[10px] text-slate-500">Bursary Department • Electronic Payment Receipt</p>
              </div>
              <div className="flex justify-between"><span>Receipt No:</span><strong className="text-brand-700">{showReceiptModal.paymentReference || "PAY-2025-GUT-001"}</strong></div>
              <div className="flex justify-between"><span>Student:</span><strong>{student.firstName} {student.lastName}</strong></div>
              <div className="flex justify-between"><span>Matric No:</span><strong>{student.matricNumber}</strong></div>
              <div className="flex justify-between"><span>Description:</span><span>{showReceiptModal.description}</span></div>
              <div className="flex justify-between"><span>Amount Paid:</span><strong className="text-sm font-black text-emerald-700">{formatCurrency(showReceiptModal.amount)}</strong></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-emerald-700 font-bold">SUCCESSFUL & VERIFIED</span></div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowReceiptModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURSE REGISTRATION SLIP MODAL */}
      {showCourseSlipModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Official Course Registration Slip (Form 01)</h3>
              <button onClick={() => setShowCourseSlipModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 bg-white border border-slate-300 rounded-2xl text-xs space-y-4 font-serif text-slate-900 shadow-inner">
              <div className="text-center pb-3 border-b space-y-1">
                <h4 className="font-bold text-base font-sans">{currentInstitution.name}</h4>
                <p className="text-[10px] font-sans text-slate-500">Academic Affairs & Course Registration Form</p>
                <div className="text-xs font-sans font-bold">Session: 2024/2025 • First Semester</div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                <div><strong>Student:</strong> {student.firstName} {student.lastName}</div>
                <div><strong>Matric No:</strong> <span className="font-mono font-bold text-brand-700">{student.matricNumber}</span></div>
                <div><strong>Faculty:</strong> Faculty of Computing & IT</div>
                <div><strong>Department:</strong> Computer Science</div>
              </div>

              <div className="pt-2 font-sans">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-2 border">Code</th>
                      <th className="p-2 border">Course Title</th>
                      <th className="p-2 border text-center">Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourseObjs.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2 border font-mono font-bold">{c.code}</td>
                        <td className="p-2 border">{c.title}</td>
                        <td className="p-2 border text-center font-mono">{c.creditUnits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t flex justify-between font-sans text-[11px] text-slate-600">
                <div>___________________<br/>Course Adviser</div>
                <div>___________________<br/>Head of Department</div>
                <div>___________________<br/>Dean of Faculty</div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowCourseSlipModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNOFFICIAL TRANSCRIPT MODAL */}
      {showTranscriptModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Unofficial Academic Transcript Statement</h3>
              <button onClick={() => setShowTranscriptModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 bg-amber-50/30 border border-amber-200 rounded-2xl text-xs space-y-4 font-serif text-slate-900 shadow-inner">
              <div className="text-center pb-3 border-b border-amber-200 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500">Registry Division</span>
                <h4 className="font-bold text-base font-sans">{currentInstitution.name}</h4>
                <p className="text-[10px] font-sans text-slate-500">Student Academic Transcript & Grading Statement</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-sans text-xs">
                <div><strong>Candidate:</strong> {student.firstName} {student.lastName}</div>
                <div><strong>Matric No:</strong> <span className="font-mono font-bold text-brand-700">{student.matricNumber}</span></div>
                <div><strong>Cumulative GPA:</strong> <span className="font-mono font-bold">{student.cgpa.toFixed(2)} / 5.00</span></div>
                <div><strong>Class of Degree:</strong> <span className="font-bold text-purple-800">{student.academicStanding}</span></div>
              </div>

              <div className="pt-2 font-sans">
                <table className="w-full text-left text-xs border border-amber-200">
                  <thead className="bg-amber-100/60 font-bold">
                    <tr>
                      <th className="p-2 border border-amber-200">Course Code</th>
                      <th className="p-2 border border-amber-200">Title</th>
                      <th className="p-2 border border-amber-200 text-center">Units</th>
                      <th className="p-2 border border-amber-200 text-center">Score</th>
                      <th className="p-2 border border-amber-200 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentScores.map((s) => {
                      const course = courses.find((c) => c.id === s.courseId);
                      return (
                        <tr key={s.id}>
                          <td className="p-2 border border-amber-200 font-mono font-bold">{course?.code || "CSC 301"}</td>
                          <td className="p-2 border border-amber-200">{course?.title || "Computer Science Core"}</td>
                          <td className="p-2 border border-amber-200 text-center font-mono">{course?.creditUnits || 3}</td>
                          <td className="p-2 border border-amber-200 text-center font-mono">{s.totalScore}</td>
                          <td className="p-2 border border-amber-200 text-center font-bold">{s.grade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-amber-200 flex justify-between font-sans text-[10px] text-slate-500">
                <span>Certified by Senate Examinations Board</span>
                <span className="font-mono text-emerald-700 font-bold">OFFICIAL SEAL VERIFIED</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowTranscriptModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
