"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { Course } from "@/types";
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
} from "lucide-react";

export function FacultyOfficerView() {
  const {
    currentInstitution,
    faculties,
    departments,
    courses,
    registrations,
    staffMembers,
    approveCourseRegistration,
    assignLecturerToCourse,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"courses" | "vetting">("courses");
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState<Course | null>(null);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");

  const faculty = faculties[0];
  const facultyDepts = departments.filter((d) => d.facultyId === faculty?.id);
  const academicStaff = staffMembers.filter((s) => s.role === "lecturer");

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForAssign || !selectedLecturerId) return;
    const stf = academicStaff.find((s) => s.id === selectedLecturerId);
    if (!stf) return;
    assignLecturerToCourse(selectedCourseForAssign.id, stf.id, stf.fullName);
    setSelectedCourseForAssign(null);
  };

  return (
    <div className="space-y-6">
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
            {faculty?.name} • Departmental curricula, lecturer teaching loads, and semester registration vetting.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg font-bold">
            {facultyDepts.length} Academic Departments
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "courses"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Course Allocations & Lecturers ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("vetting")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "vetting"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Registration Vetting Queue ({registrations.length})
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">First Semester Teaching Assignments</h3>
              <p className="text-xs text-slate-500">Allocated course lecturers submit grades for Senate scrutiny</p>
            </div>
            <span className="text-xs text-slate-500 font-semibold">{courses.length} Active Courses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3 text-center">Units</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Assigned Academic Staff</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">{c.code}</td>
                    <td className="p-3 font-bold text-navy-950">{c.title}</td>
                    <td className="p-3 font-mono text-center">{c.creditUnits}</td>
                    <td className="p-3 font-semibold">{c.level}</td>
                    <td className="p-3 font-medium text-slate-700">
                      {c.lecturerName || <span className="text-amber-600 italic">Unassigned</span>}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.type === "Compulsory"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedCourseForAssign(c);
                          setSelectedLecturerId(academicStaff[0]?.id || "");
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Assign Lecturer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vetting Queue */}
      {activeTab === "vetting" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-navy-950">Student Course Registration Forms Awaiting Endorsement</h3>
              <span className="text-xs text-slate-500">{registrations.length} Forms</span>
            </div>

            <div className="divide-y divide-slate-100">
              {registrations.map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-brand-700 text-xs">GUT/CMP/22/0452</span>
                      <span className="text-xs font-bold text-navy-950">Chinonso Emeka Okonkwo</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {r.level} • {r.totalCredits} Units
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Registered Courses: {r.courses.map((c) => c.courseCode).join(", ")}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Submitted on: {new Date(r.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {r.status === "Approved" ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Endorsed by Faculty Officer</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => approveCourseRegistration(r.id)}
                        className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Endorse & Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Lecturer Modal */}
      {selectedCourseForAssign && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAssignSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-navy-950 text-sm">Assign Course Lecturer</h3>
                <span className="text-xs text-brand-700 font-mono font-bold">
                  {selectedCourseForAssign.code}: {selectedCourseForAssign.title}
                </span>
              </div>
              <button type="button" onClick={() => setSelectedCourseForAssign(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold block mb-1">Select Departmental Academic Staff *</label>
                <select
                  value={selectedLecturerId}
                  onChange={(e) => setSelectedLecturerId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                >
                  {academicStaff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.rank})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                The assigned lecturer will gain grade entry access for continuous assessment and examination scores in their dedicated dashboard.
              </p>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setSelectedCourseForAssign(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Confirm Allocation</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
