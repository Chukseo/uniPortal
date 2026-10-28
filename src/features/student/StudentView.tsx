"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
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
  Copy,
  ChevronRight,
  Calendar,
  Building,
  TrendingUp,
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
    currentInstitution,
    invoices,
    courses,
    registrations,
    scores,
    examSchedules,
    entitlements,
    accessCodes,
    simulatePayment,
    submitCourseRegistration,
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

  const student = currentStudent || {
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

  // CGPA historical semester trajectory for Recharts
  const cgpaHistory = [
    { semester: "100L 1st", cgpa: 4.45, gpa: 4.45 },
    { semester: "100L 2nd", cgpa: 4.52, gpa: 4.60 },
    { semester: "200L 1st", cgpa: 4.58, gpa: 4.68 },
    { semester: "200L 2nd", cgpa: 4.60, gpa: 4.64 },
    { semester: "300L 1st (Current)", cgpa: 4.62, gpa: 4.70 },
  ];

  // Check which courses are selected & total credits
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

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Progression Checklist
  const stages = [
    { key: "admission_accepted", label: "Provisional Admission Cleared", done: true },
    { key: "acceptance_fee_cleared", label: "Acceptance Fee Paid", done: true },
    { key: "student_activated", label: "Student Matriculation Activated", done: true },
    {
      key: "school_fees_cleared",
      label: "First Semester Tuition Cleared",
      done: !studentInvoices.some((i) => i.feeCategory === "School Fees" && i.status === "Unpaid"),
    },
    { key: "course_registration_completed", label: "Course Registration Concluded", done: student.isCourseRegistered },
    { key: "exam_eligible", label: "Examination Clearance Issued", done: student.isCourseRegistered },
    { key: "results_viewable", label: "Senate Grades Published", done: studentScores.some((s) => s.state === "Published") },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-brand-950 to-navy-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-brand-400">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {student.firstName} {student.lastName} {student.otherNames}
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                  {student.academicStanding}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Matriculation: <span className="text-amber-400 font-bold">{student.matricNumber}</span> • {student.level} Computer Science
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentInstitution.name} • {currentInstitution.currentSession} ({currentInstitution.currentSemester})
              </p>
            </div>
          </div>

          {/* Current Active Access Code Card */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 min-w-[220px]">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">
              Active Stage Access Code:
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono font-black text-amber-400 text-sm tracking-wide">
                {student.currentAccessCode || "UNI-REG-4412-M2P"}
              </span>
              <button
                onClick={() => copyCode(student.currentAccessCode || "UNI-REG-4412-M2P")}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                title="Copy Access Code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[10px] text-slate-300 mt-1 block">
              {copiedCode ? "Copied to clipboard!" : "Valid for Course & Exam Clearance"}
            </span>
          </div>
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
          Progression & Overview
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "payments"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tuition & Fee Invoices ({studentInvoices.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "courses"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Course Registration
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "results"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Semester Results & GPA
        </button>
        <button
          onClick={() => setActiveTab("exams")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "exams"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Examination Timetable
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progression Engine Timeline */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-navy-950 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Academic Progression & Entitlement Status</span>
            </h3>

            <div className="space-y-3">
              {stages.map((st, idx) => (
                <div
                  key={st.key}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                    st.done
                      ? "border-emerald-200 bg-emerald-50/50 text-slate-900"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        st.done ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{st.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.done ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {st.done ? "Cleared" : "Pending"}
                  </span>
                </div>
              ))}
            </div>

            {/* CGPA Trajectory Chart */}
            <div className="pt-4 border-t border-slate-100">
              <span className="font-bold text-xs text-navy-950 block mb-1">
                Cumulative CGPA Progression Trajectory
              </span>
              <p className="text-[11px] text-slate-400 mb-3">Academic performance curve across registered semesters</p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cgpaHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
                    <YAxis domain={[3.0, 5.0]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="cgpa" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs text-slate-500 block font-semibold">Cumulative CGPA</span>
              <p className="text-3xl font-black text-navy-950">{student.cgpa.toFixed(2)}</p>
              <div className="p-2.5 bg-purple-50 text-purple-900 rounded-lg text-xs font-bold border border-purple-200">
                Classification: {student.academicStanding}
              </div>
              <p className="text-[11px] text-slate-500">
                Formula: Sum(Units × Points) / Total Units. Based on NUC 5.0 grading benchmark.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs">
              <span className="font-bold text-navy-950 block">Registered Semester Load</span>
              <p className="text-slate-600">
                {studentReg ? `${studentReg.totalCredits} Credit Units` : "19 Credit Units"}
              </p>
              <div className="text-[11px] text-slate-400">
                Status: {studentReg?.status || "Approved"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Payments */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-sm text-navy-950">Student Financial Invoices</h3>
            <span className="text-xs text-slate-500">Demo Payment Simulation</span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentInvoices.map((inv) => (
              <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-brand-700 text-xs">{inv.invoiceNumber}</span>
                    <span className="font-bold text-navy-950 text-sm">{inv.feeCategory}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{inv.description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Session: {inv.academicSession} • Due: {inv.dueDate}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-base text-navy-950 block">
                      {formatCurrency(inv.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  {inv.status === "Unpaid" && (
                    <button
                      onClick={() => simulatePayment(inv.id)}
                      className="px-3.5 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      Simulate Payment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Courses */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {regFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{regFeedback}</span>
            </div>
          )}

          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Select Semester Courses</h3>
              <p className="text-xs text-slate-500">
                Configured Limit: Minimum 12 units, Maximum 24 units.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-navy-950">
                Selected: <span className="text-brand-700 font-mono text-base">{currentCreditTotal}</span> Units
              </span>
              <button
                onClick={handleRegisterCourses}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Submit Course Registration
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Select</th>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Title</th>
                    <th className="p-3 text-center">Credit Units</th>
                    <th className="p-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => {
                    const isSelected = selectedCourses.includes(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCourse(c.id)}
                            className="w-4 h-4 text-brand-600 rounded"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-brand-700">{c.code}</td>
                        <td className="p-3 font-semibold text-navy-950">{c.title}</td>
                        <td className="p-3 text-center font-mono font-bold">{c.creditUnits}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.type === "Compulsory" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Results */}
      {activeTab === "results" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">First Semester Senate Published Results</h3>
              <p className="text-xs text-slate-500">Official grades confirmed by Senate Examination Board</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg">
              CGPA: {student.cgpa.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3 text-center">Units</th>
                  <th className="p-3 text-center">CA (30)</th>
                  <th className="p-3 text-center">Exam (70)</th>
                  <th className="p-3 text-center">Total (100)</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentScores.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">CSC 301</td>
                    <td className="p-3 text-center font-mono">3</td>
                    <td className="p-3 text-center font-mono">{sc.caScore}</td>
                    <td className="p-3 text-center font-mono">{sc.examScore}</td>
                    <td className="p-3 text-center font-mono font-black">{sc.totalScore}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{sc.grade}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">{sc.gradePoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Examination Timetable */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Senate Approved Examination Schedule</h3>
              <p className="text-xs text-slate-500">Hall seating allocations, examination dates, and reporting times</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
              Exam Clearance Confirmed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Assigned Venue</th>
                  <th className="p-3">Invigilator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examSchedules.map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">{ex.courseCode}</td>
                    <td className="p-3 font-semibold text-navy-950">{ex.courseTitle}</td>
                    <td className="p-3 font-medium text-slate-800">{ex.date}</td>
                    <td className="p-3 font-mono text-slate-600">{ex.startTime} – {ex.endTime}</td>
                    <td className="p-3 text-slate-700">{ex.venue}</td>
                    <td className="p-3 text-slate-600">{ex.invigilatorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
