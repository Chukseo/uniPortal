"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { Course, CourseRegistration } from "@/types";
import {
  Building,
  BookOpen,
  FileCheck,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  UserCheck,
  X,
  Plus,
  AlertCircle,
  Eye,
  Filter,
  Search,
  Award,
} from "lucide-react";

export function FacultyOfficerView() {
  const {
    currentInstitution,
    faculties,
    departments,
    courses,
    registrations,
    staffMembers,
    students,
    approveCourseRegistration,
    assignLecturerToCourse,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"courses" | "vetting" | "rosters" | "workload">("courses");
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState<Course | null>(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [vettingModalReg, setVettingModalReg] = useState<CourseRegistration | null>(null);
  const [vettingQueryInput, setVettingQueryInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rosterCourseId, setRosterCourseId] = useState(courses[0]?.id || "crs-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const faculty = faculties[0];
  const facultyDepts = departments.filter((d) => d.facultyId === faculty?.id);
  const academicStaff = staffMembers.filter((s) => s.role === "lecturer");

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForAssign || !selectedLecturerId) return;
    const stf = academicStaff.find((s) => s.id === selectedLecturerId);
    if (!stf) return;
    assignLecturerToCourse(selectedCourseForAssign.id, stf.id, stf.fullName);
    setSelectedCourseForAssign(null);
    setFeedback(`Assigned ${stf.fullName} to ${selectedCourseForAssign.code}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleApproveRegistration = (regId: string) => {
    approveCourseRegistration(regId);
    setVettingModalReg(null);
    setFeedback("Course registration approved! Student issued examination docket access code.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleQueryRegistration = (regId: string) => {
    setVettingModalReg(null);
    setFeedback(`Registration returned to student: "${vettingQueryInput || 'Credit unit imbalance'}"`);
    setVettingQueryInput("");
    setTimeout(() => setFeedback(null), 3500);
  };

  const activeRosterCourse = courses.find((c) => c.id === rosterCourseId) || courses[0];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Building className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Faculty Board & Course Allocations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {faculty?.name || "Faculty of Computing & Information Technology"} • Departmental curricula, lecturer teaching loads, and course vetting.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl font-bold">
            {facultyDepts.length} Academic Departments
          </span>
          <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl font-bold">
            {academicStaff.length} Appointed Lecturers
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "courses"
              ? "border-amber-700 text-amber-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Teaching Allocations ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("vetting")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "vetting"
              ? "border-amber-700 text-amber-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Course Registration Vetting ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab("rosters")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "rosters"
              ? "border-amber-700 text-amber-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Course Enrollment Rosters
        </button>
        <button
          onClick={() => setActiveTab("workload")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "workload"
              ? "border-amber-700 text-amber-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Academic Staff Teaching Loads
        </button>
      </div>

      {/* TAB 1: Courses & Teaching Assignments */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code or title..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700"
            >
              <option value="all">All Academic Levels</option>
              <option value="100L">100 Level</option>
              <option value="200L">200 Level</option>
              <option value="300L">300 Level</option>
              <option value="400L">400 Level</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">First Semester Teaching Assignments</h3>
                <p className="text-xs text-slate-500">Allocated course lecturers submit continuous assessment and examination grades</p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{filteredCourses.length} Courses Displayed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5 text-center">Units</th>
                    <th className="p-3.5">Level</th>
                    <th className="p-3.5">Assigned Academic Staff</th>
                    <th className="p-3.5">Classification</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-brand-700">{c.code}</td>
                      <td className="p-3.5 font-bold text-navy-950">{c.title}</td>
                      <td className="p-3.5 font-mono text-center font-bold">{c.creditUnits}</td>
                      <td className="p-3.5 font-semibold text-slate-700">{c.level}</td>
                      <td className="p-3.5 font-medium text-slate-800">
                        {c.lecturerName ? (
                          <span className="font-semibold">{c.lecturerName}</span>
                        ) : (
                          <span className="text-amber-600 font-bold italic">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.type === "Compulsory"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedCourseForAssign(c);
                            setSelectedLecturerId(academicStaff[0]?.id || "");
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-xs transition-colors"
                        >
                          Reassign Lecturer
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

      {/* TAB 2: Registration Vetting Queue */}
      {activeTab === "vetting" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">Undergraduate Course Registration Vetting Queue</h3>
                <p className="text-xs text-slate-500">Endorse student course forms to unlock examination tickets</p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1 rounded-lg border border-amber-200">
                {registrations.length} Forms in Pipeline
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {registrations.map((r) => {
                const std = students.find((s) => s.id === r.studentId) || students[0];
                return (
                  <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-brand-700 text-xs">{std.matricNumber}</span>
                        <span className="font-bold text-navy-950 text-xs">{std.firstName} {std.lastName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "Submitted"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {r.level} Computer Science • {r.totalCredits} Credit Units Registered • Submitted: {new Date(r.submittedAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {r.courses.map((ci) => (
                          <span key={ci.courseId} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono font-bold">
                            {ci.courseCode} ({ci.creditUnits}U)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setVettingModalReg(r)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        Inspect Form
                      </button>
                      {r.status !== "Approved" && (
                        <button
                          onClick={() => handleApproveRegistration(r.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          Endorse Form
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Course Rosters */}
      {activeTab === "rosters" && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Select Course Roster:</span>
              <select
                value={rosterCourseId}
                onChange={(e) => setRosterCourseId(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-xl text-xs font-bold bg-white text-navy-950 focus:ring-2 focus:ring-amber-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title} ({c.creditUnits} Units, {c.level})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Assigned Lecturer: <strong className="text-navy-950">{activeRosterCourse.lecturerName || "Unassigned"}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-navy-950">Enrolled Students Roster ({activeRosterCourse.code})</h3>
              <span className="text-xs text-slate-500">Official Class Attendance List</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Matriculation No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Academic Standing</th>
                    <th className="p-3">Enrollment Status</th>
                    <th className="p-3 text-right">Attendance Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-700">{st.matricNumber}</td>
                      <td className="p-3 font-bold text-navy-950">{st.firstName} {st.lastName}</td>
                      <td className="p-3 font-semibold text-slate-700">{st.level}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800">
                          {st.academicStanding}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Enrolled</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-mono text-slate-500 text-[11px]">Seat #{Math.floor(10 + Math.random() * 80)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Workload Summary */}
      {activeTab === "workload" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Faculty Teaching Load Matrix</h3>
              <p className="text-xs text-slate-500">Maximum recommended load per lecturer: 12 credit units</p>
            </div>
            <span className="text-xs font-bold text-brand-700">{academicStaff.length} Faculty Members</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Staff Name & Title</th>
                  <th className="p-3">Designation / Rank</th>
                  <th className="p-3">Allocated Courses</th>
                  <th className="p-3 text-center">Total Teaching Units</th>
                  <th className="p-3 text-right">Load Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicStaff.map((st) => {
                  const assigned = courses.filter((c) => c.lecturerName === st.fullName);
                  const units = assigned.reduce((sum, c) => sum + c.creditUnits, 0);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-navy-950">{st.fullName}</td>
                      <td className="p-3 text-slate-600 font-semibold">{st.rank}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {assigned.length > 0 ? (
                            assigned.map((ac) => (
                              <span key={ac.id} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-mono font-bold text-[10px]">
                                {ac.code}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">No courses assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono font-black text-sm">{units} Units</td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            units <= 12 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {units <= 12 ? "Optimal Load" : "Overload"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Lecturer Modal */}
      {selectedCourseForAssign && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAssignSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Assign Lecturer to Course</h3>
              <button type="button" onClick={() => setSelectedCourseForAssign(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold font-mono text-brand-700">{selectedCourseForAssign.code}</span>
                <p className="font-bold text-navy-950">{selectedCourseForAssign.title}</p>
                <p className="text-slate-500">{selectedCourseForAssign.creditUnits} Credit Units • {selectedCourseForAssign.level}</p>
              </div>

              <div>
                <label className="font-semibold block mb-1">Select Departmental Lecturer *</label>
                <select
                  required
                  value={selectedLecturerId}
                  onChange={(e) => setSelectedLecturerId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {academicStaff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.rank})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedCourseForAssign(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white rounded-lg shadow-sm"
              >
                Confirm Teaching Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vetting Detail Modal */}
      {vettingModalReg && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Course Registration Form Inspection</h3>
              <button onClick={() => setVettingModalReg(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy-950">Student ID: {vettingModalReg.studentId}</span>
                  <span className="font-bold text-brand-700">{vettingModalReg.totalCredits} Units</span>
                </div>
                <div className="text-slate-500">Academic Level: {vettingModalReg.level} • {vettingModalReg.semester}</div>
              </div>

              <div>
                <span className="font-bold block mb-1">Selected Courses:</span>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {vettingModalReg.courses.map((c) => (
                    <div key={c.courseId} className="p-2 border rounded flex justify-between">
                      <span className="font-mono font-bold text-brand-700">{c.courseCode}</span>
                      <span className="font-medium text-slate-800">{c.courseTitle}</span>
                      <span className="font-bold text-slate-900">{c.creditUnits} Units</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Faculty Vetting Note / Condition:</label>
                <input
                  type="text"
                  value={vettingQueryInput}
                  onChange={(e) => setVettingQueryInput(e.target.value)}
                  placeholder="e.g. Approved by Dean per Senate Regulations..."
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => handleQueryRegistration(vettingModalReg.id)}
                className="px-3 py-1.5 bg-rose-50 text-rose-800 rounded-lg font-bold"
              >
                Return with Query
              </button>
              <button
                onClick={() => handleApproveRegistration(vettingModalReg.id)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
              >
                Endorse Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
