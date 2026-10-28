"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  GraduationCap,
  CreditCard,
  Award,
  BookOpen,
  Calendar,
  Building,
} from "lucide-react";

export function ReportsView() {
  const {
    currentInstitution,
    students,
    applicants,
    invoices,
    courses,
    scores,
    graduationCandidates,
  } = useDemoStore();

  const [reportType, setReportType] = useState<
    "enrollment" | "admissions" | "fees" | "courses" | "results" | "graduation"
  >("enrollment");
  const [levelFilter, setLevelFilter] = useState("all");

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `unicore_report_${reportType}.csv`;

    if (reportType === "enrollment") {
      headers = ["Matric Number", "Full Name", "Level", "CGPA", "Standing", "Status"];
      rows = students.map((s) => [
        s.matricNumber,
        `"${s.firstName} ${s.lastName}"`,
        s.level,
        s.cgpa,
        s.academicStanding,
        s.enrollmentStatus,
      ]);
    } else if (reportType === "admissions") {
      headers = ["Application Number", "Candidate Name", "UTME Score", "State", "Status"];
      rows = applicants.map((a) => [
        a.applicationNumber,
        `"${a.firstName} ${a.lastName}"`,
        a.utmeScore || "N/A",
        `"${a.stateOfOrigin}"`,
        a.status,
      ]);
    } else if (reportType === "fees") {
      headers = ["Invoice Number", "Target Name", "Fee Category", "Amount", "Status", "Due Date"];
      rows = invoices.map((i) => [
        i.invoiceNumber,
        `"${i.targetName}"`,
        i.feeCategory,
        i.amount,
        i.status,
        i.dueDate,
      ]);
    } else if (reportType === "courses") {
      headers = ["Course Code", "Course Title", "Credit Units", "Type", "Lecturer"];
      rows = courses.map((c) => [
        c.code,
        `"${c.title}"`,
        c.creditUnits,
        c.type,
        `"${c.lecturerName || "Unassigned"}"`,
      ]);
    } else if (reportType === "results") {
      headers = ["Matric Number", "Student Name", "CA (30)", "Exam (70)", "Total", "Grade", "Points", "State"];
      rows = scores.map((sc) => [
        sc.matricNumber,
        `"${sc.studentName}"`,
        sc.caScore,
        sc.examScore,
        sc.totalScore,
        sc.grade,
        sc.gradePoints,
        sc.state,
      ]);
    } else if (reportType === "graduation") {
      headers = ["Matric Number", "Candidate Name", "Programme", "CGPA", "Class of Degree", "Senate Approved"];
      rows = graduationCandidates.map((g) => [
        g.matricNumber,
        `"${g.studentName}"`,
        `"${g.programmeName}"`,
        g.cgpa,
        g.classOfDegree,
        g.senateApproval ? "Yes" : "Pending",
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Institutional Reports & Senate Extracts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and export enrollment registers, admissions digests, bursary reconciliation, and examination returns.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Buttons (Hidden during print) */}
      <div className="no-print flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: "enrollment", label: "Student Enrollment Register", icon: GraduationCap },
          { id: "admissions", label: "Admissions Screening Summary", icon: Award },
          { id: "fees", label: "Bursary Fee Collection", icon: CreditCard },
          { id: "courses", label: "Curricula & Course Allocations", icon: BookOpen },
          { id: "results", label: "Senate Examination Returns", icon: Award },
          { id: "graduation", label: "Graduation & Clearance List", icon: GraduationCap },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 border ${
                isActive
                  ? "bg-navy-950 text-white border-navy-950 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none">
        {/* Institutional Letterhead for Report */}
        <div className="text-center pb-6 border-b-2 border-slate-900 mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-navy-950 text-white flex items-center justify-center font-black text-lg mb-2">
            {currentInstitution.code}
          </div>
          <h2 className="text-xl font-black uppercase text-navy-950">{currentInstitution.name}</h2>
          <p className="text-xs text-slate-500 italic mt-0.5">“{currentInstitution.motto}”</p>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-2">
            OFFICIAL REPORT: {reportType.toUpperCase()} SUMMARY • {currentInstitution.currentSession}
          </p>
          <div className="mt-2 text-[10px] text-slate-400">
            DEMO COPY — FOR INSTITUTIONAL EVALUATION ONLY
          </div>
        </div>

        {/* Content based on selected reportType */}
        {reportType === "enrollment" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Matriculation No</th>
                  <th className="p-2.5 border">Student Full Name</th>
                  <th className="p-2.5 border">Level</th>
                  <th className="p-2.5 border text-center">CGPA</th>
                  <th className="p-2.5 border">Class of Degree</th>
                  <th className="p-2.5 border">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{s.matricNumber}</td>
                    <td className="p-2.5 border font-semibold">{s.firstName} {s.lastName} {s.otherNames}</td>
                    <td className="p-2.5 border">{s.level}</td>
                    <td className="p-2.5 border text-center font-mono font-bold">{s.cgpa.toFixed(2)}</td>
                    <td className="p-2.5 border">{s.academicStanding}</td>
                    <td className="p-2.5 border">
                      <span className="font-semibold text-emerald-700">{s.enrollmentStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "admissions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Application No</th>
                  <th className="p-2.5 border">Candidate Name</th>
                  <th className="p-2.5 border text-center">UTME Score</th>
                  <th className="p-2.5 border">State of Origin</th>
                  <th className="p-2.5 border">O'Level Summary</th>
                  <th className="p-2.5 border">Admissions Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((a) => (
                  <tr key={a.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{a.applicationNumber}</td>
                    <td className="p-2.5 border font-semibold">{a.firstName} {a.lastName}</td>
                    <td className="p-2.5 border text-center font-mono font-bold">{a.utmeScore || "N/A"}</td>
                    <td className="p-2.5 border">{a.stateOfOrigin}</td>
                    <td className="p-2.5 border max-w-xs truncate">{a.olevelSummary}</td>
                    <td className="p-2.5 border font-bold text-brand-700">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "fees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Invoice Number</th>
                  <th className="p-2.5 border">Payer Name</th>
                  <th className="p-2.5 border">Fee Category</th>
                  <th className="p-2.5 border text-right">Amount (NGN)</th>
                  <th className="p-2.5 border">Due Date</th>
                  <th className="p-2.5 border">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{i.invoiceNumber}</td>
                    <td className="p-2.5 border font-semibold">{i.targetName}</td>
                    <td className="p-2.5 border">{i.feeCategory}</td>
                    <td className="p-2.5 border text-right font-mono font-bold">{i.amount.toLocaleString()}</td>
                    <td className="p-2.5 border text-slate-500">{i.dueDate}</td>
                    <td className="p-2.5 border">
                      <span className={`font-bold ${i.status === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "courses" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Course Code</th>
                  <th className="p-2.5 border">Course Title</th>
                  <th className="p-2.5 border text-center">Credit Units</th>
                  <th className="p-2.5 border">Level</th>
                  <th className="p-2.5 border">Category</th>
                  <th className="p-2.5 border">Assigned Academic Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{c.code}</td>
                    <td className="p-2.5 border font-semibold">{c.title}</td>
                    <td className="p-2.5 border text-center font-mono font-bold">{c.creditUnits}</td>
                    <td className="p-2.5 border">{c.level}</td>
                    <td className="p-2.5 border">{c.type}</td>
                    <td className="p-2.5 border">{c.lecturerName || "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "results" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Matriculation No</th>
                  <th className="p-2.5 border">Student Name</th>
                  <th className="p-2.5 border text-center">CA (30)</th>
                  <th className="p-2.5 border text-center">Exam (70)</th>
                  <th className="p-2.5 border text-center">Total</th>
                  <th className="p-2.5 border text-center">Grade</th>
                  <th className="p-2.5 border text-center">Points</th>
                  <th className="p-2.5 border">Senate State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scores.map((sc) => (
                  <tr key={sc.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                    <td className="p-2.5 border font-semibold">{sc.studentName}</td>
                    <td className="p-2.5 border text-center font-mono">{sc.caScore}</td>
                    <td className="p-2.5 border text-center font-mono">{sc.examScore}</td>
                    <td className="p-2.5 border text-center font-mono font-bold">{sc.totalScore}</td>
                    <td className="p-2.5 border text-center font-bold text-emerald-700">{sc.grade}</td>
                    <td className="p-2.5 border text-center font-mono">{sc.gradePoints}</td>
                    <td className="p-2.5 border font-bold text-purple-700">{sc.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "graduation" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b">
                <tr>
                  <th className="p-2.5 border">Matriculation No</th>
                  <th className="p-2.5 border">Candidate Name</th>
                  <th className="p-2.5 border">Programme</th>
                  <th className="p-2.5 border text-center">CGPA</th>
                  <th className="p-2.5 border">Degree Classification</th>
                  <th className="p-2.5 border text-center">Senate Confirmed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {graduationCandidates.map((g) => (
                  <tr key={g.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{g.matricNumber}</td>
                    <td className="p-2.5 border font-semibold">{g.studentName}</td>
                    <td className="p-2.5 border">{g.programmeName}</td>
                    <td className="p-2.5 border text-center font-mono font-bold">{g.cgpa.toFixed(2)}</td>
                    <td className="p-2.5 border font-bold text-purple-700">{g.classOfDegree}</td>
                    <td className="p-2.5 border text-center font-bold text-emerald-700">
                      {g.senateApproval ? "APPROVED" : "PENDING CLEARANCE"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-8 flex justify-between items-end text-xs text-slate-500 font-sans border-t border-slate-200 mt-6">
          <div>
            <span>Generated via UniCore SaaS Engine</span>
            <span className="block text-[10px]">Pristine state timestamp: {new Date().toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span>Validated by Office of University Registrar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
