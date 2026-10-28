"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { Student } from "@/types";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserX,
  Award,
  FileText,
  KeyRound,
  Eye,
  X,
  Edit2,
  FileCheck,
  ShieldCheck,
  Building,
  UserCheck,
} from "lucide-react";

export function RegistrarView() {
  const {
    students,
    currentInstitution,
    programmes,
    departments,
    updateStudentStatus,
    assignMatriculationNumber,
    defermentRequests,
    approveDeferment,
    rejectDeferment,
    graduationCandidates,
    toggleGraduationClearance,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"students" | "matriculation" | "deferments" | "graduation">("students");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Matriculation Assignment Modal State
  const [showMatricModal, setShowMatricModal] = useState(false);
  const [targetStudentForMatric, setTargetStudentForMatric] = useState<Student | null>(null);
  const [customMatricInput, setCustomMatricInput] = useState("");
  const [matricSuccessMsg, setMatricSuccessMsg] = useState("");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    const matchesStatus = statusFilter === "all" || s.enrollmentStatus === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleOpenMatricModal = (student: Student) => {
    setTargetStudentForMatric(student);
    const year = new Date().getFullYear();
    const instCode = currentInstitution.code;
    const progCode = "CSC";
    const randNum = String(Math.floor(100 + Math.random() * 900)).padStart(3, "0");
    setCustomMatricInput(`${instCode}/${year}/${progCode}/${randNum}`);
    setShowMatricModal(true);
    setMatricSuccessMsg("");
  };

  const handleSaveMatric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentForMatric || !customMatricInput) return;
    assignMatriculationNumber(targetStudentForMatric.id, customMatricInput.trim().toUpperCase());
    setMatricSuccessMsg(`Assigned ${customMatricInput.trim().toUpperCase()} to ${targetStudentForMatric.firstName} ${targetStudentForMatric.lastName}!`);
    setTimeout(() => {
      setShowMatricModal(false);
      setTargetStudentForMatric(null);
      setMatricSuccessMsg("");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              University Registry & Student Records
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Matriculation management, official student directories, academic standing, deferments, and Senate graduation clearance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700">
            Total Enrolled: <span className="font-bold text-navy-950">{students.length} demo records</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("students")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "students"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Official Student Directory ({filteredStudents.length})
        </button>
        <button
          onClick={() => setActiveTab("matriculation")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "matriculation"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Matriculation Number Assignment
        </button>
        <button
          onClick={() => setActiveTab("deferments")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "deferments"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Deferments & Withdrawals ({defermentRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("graduation")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "graduation"
              ? "border-teal-700 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Senate Graduation Clearance ({graduationCandidates.length})
        </button>
      </div>

      {/* TAB 1: Student Directory */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or matriculation number..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Academic Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
              <option value="500L">500 Level</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Deferred">Deferred</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {/* Students Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-navy-950">Official Student Directory</h3>
              <span className="text-xs text-slate-500">{filteredStudents.length} Students Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Matric Number</th>
                    <th className="p-3">Full Student Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Degree Programme</th>
                    <th className="p-3">CGPA</th>
                    <th className="p-3">Academic Standing</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Course Registration</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-teal-800">{s.matricNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-navy-950">{s.firstName} {s.lastName} {s.otherNames}</div>
                        <div className="text-[10px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="p-3 font-semibold">{s.level}</td>
                      <td className="p-3 text-slate-700">B.Sc Computer Science</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{s.cgpa.toFixed(2)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.academicStanding === "First Class"
                              ? "bg-purple-100 text-purple-800"
                              : s.academicStanding === "Second Class Upper"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {s.academicStanding}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.enrollmentStatus === "Enrolled"
                              ? "bg-emerald-100 text-emerald-800"
                              : s.enrollmentStatus === "Deferred"
                              ? "bg-amber-100 text-amber-800"
                              : s.enrollmentStatus === "Graduated"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {s.enrollmentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {s.isCourseRegistered ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Registered</span>
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold">Pending Reg</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenMatricModal(s)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Assign / Edit Matric Number"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inspect Student Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Matriculation Number Assignment */}
      {activeTab === "matriculation" && (
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
              <KeyRound className="w-4 h-4" />
              <span>Matriculation Number Generator & Assignment Engine</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              In Nigerian tertiary education institutions, students are issued an official matriculation number following acceptance fee clearance and physical credentials verification. The format adheres to: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-900">[INST_CODE]/[YEAR]/[PROG]/[SERIAL]</code>.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-navy-950">Active Students Matriculation Registry</h3>
              <span className="text-xs text-slate-500">{students.length} Student Profiles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Current Matriculation No.</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Stage Credential</th>
                    <th className="p-3">Enrollment Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-bold text-navy-950">{st.firstName} {st.lastName}</div>
                        <div className="text-[10px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-teal-800">{st.matricNumber}</td>
                      <td className="p-3 font-semibold">{st.level}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{st.currentAccessCode || "N/A"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {st.enrollmentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenMatricModal(st)}
                          className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          Modify Matric Number
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Deferments & Withdrawals */}
      {activeTab === "deferments" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">Academic Deferment & Suspension Registry</h3>
                <p className="text-xs text-slate-500">Student deferment applications vetted according to Senate academic regulations</p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-lg border border-amber-200">
                {defermentRequests.length} Applications
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {defermentRequests.map((d) => (
                <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-teal-800 text-xs">{d.matricNumber}</span>
                      <span className="font-bold text-navy-950 text-xs">{d.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.status === "Declined"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Submitted Reason:</strong> {d.reason}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Academic Session: {d.academicSession} ({d.semester}) • Submitted: {new Date(d.submittedAt).toLocaleDateString()}
                    </p>
                    {d.decisionNote && (
                      <p className="text-[11px] text-teal-800 font-semibold italic">Registrar Minute: {d.decisionNote}</p>
                    )}
                  </div>

                  {d.status === "Pending" && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => rejectDeferment(d.id, "Senate medical committee rejected request")}
                        className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approveDeferment(d.id, "Approved per Senate Rule Sec 4.2")}
                        className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        Endorse Deferment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Senate Graduation Clearance */}
      {activeTab === "graduation" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">Senate Final Clearance & Degree Classification Register</h3>
                <p className="text-xs text-slate-500">
                  Four-step clearance: Library, Bursary, Department, and Senate Confirmation.
                </p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-800 font-bold px-3 py-1 rounded-lg border border-purple-200">
                Convocation Roll: {graduationCandidates.length} Candidates
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Matric No</th>
                    <th className="p-3">Graduating Candidate</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">CGPA</th>
                    <th className="p-3">Degree Classification</th>
                    <th className="p-3 text-center">Library</th>
                    <th className="p-3 text-center">Bursary</th>
                    <th className="p-3 text-center">Department</th>
                    <th className="p-3 text-center">Senate Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {graduationCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-teal-800">{c.matricNumber}</td>
                      <td className="p-3 font-bold text-navy-950">{c.studentName}</td>
                      <td className="p-3 text-slate-600">{c.programmeName}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{c.cgpa.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                          {c.classOfDegree}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "libraryClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.libraryClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.libraryClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "bursaryClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.bursaryClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.bursaryClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "departmentClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.departmentClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.departmentClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "senateApproval")}
                          className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                            c.senateApproval
                              ? "bg-purple-700 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-purple-50"
                          }`}
                        >
                          {c.senateApproval ? "Senate Confirmed" : "Endorse"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Matriculation Number Assignment Modal */}
      {showMatricModal && targetStudentForMatric && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveMatric} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                  <KeyRound className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-navy-950 text-sm">Assign / Edit Matriculation Number</h3>
              </div>
              <button type="button" onClick={() => setShowMatricModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-navy-950">{targetStudentForMatric.firstName} {targetStudentForMatric.lastName}</div>
                <div className="text-slate-500 font-mono">Current: {targetStudentForMatric.matricNumber}</div>
                <div className="text-slate-400">{targetStudentForMatric.level} • B.Sc Computer Science</div>
              </div>

              <div>
                <label className="font-semibold block mb-1">New Official Matriculation Number *</label>
                <input
                  type="text"
                  required
                  value={customMatricInput}
                  onChange={(e) => setCustomMatricInput(e.target.value)}
                  placeholder="e.g. GUT/2024/CSC/042"
                  className="w-full px-3 py-2 border rounded-xl font-mono text-xs font-bold text-teal-900 bg-teal-50/50"
                />
              </div>

              {matricSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{matricSuccessMsg}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowMatricModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-sm"
              >
                Confirm Matriculation Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Profile Detail Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-navy-950 text-sm">Official Academic Transcript Record</h3>
              </div>
              <button onClick={() => setSelectedStudent(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-sm text-navy-950">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
                <div className="font-mono text-teal-800 font-bold">{selectedStudent.matricNumber}</div>
                <div className="text-slate-500">{selectedStudent.email} • {selectedStudent.phone}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Level:</strong> {selectedStudent.level}</div>
                <div><strong>State of Origin:</strong> {selectedStudent.stateOfOrigin}</div>
                <div><strong>Cumulative GPA:</strong> {selectedStudent.cgpa.toFixed(2)}</div>
                <div><strong>Standing:</strong> {selectedStudent.academicStanding}</div>
                <div><strong>Total Credits:</strong> {selectedStudent.totalCreditsEarned}</div>
                <div><strong>Status:</strong> {selectedStudent.enrollmentStatus}</div>
              </div>

              <div className="pt-2 border-t">
                <label className="font-semibold block mb-1 text-slate-700">Change Enrollment Standing</label>
                <div className="flex items-center space-x-2">
                  {(["Enrolled", "Deferred", "Withdrawn", "Graduated"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStudentStatus(selectedStudent.id, status);
                        setSelectedStudent((prev) => (prev ? { ...prev, enrollmentStatus: status } : null));
                      }}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        selectedStudent.enrollmentStatus === status
                          ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t text-[11px] text-slate-500">
                Current Access Code: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-900">{selectedStudent.currentAccessCode || "None Active"}</code>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
