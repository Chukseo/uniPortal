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
} from "lucide-react";

export function RegistrarView() {
  const { students, currentInstitution, programmes, departments } = useDemoStore();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

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
            Matriculation management, official student directories, academic standing, and Senate records.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700">
          Total Enrolled: <span className="font-bold text-navy-950">{students.length} demo records</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or matriculation number..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Academic Levels</option>
          <option value="100L">100 Level</option>
          <option value="200L">200 Level</option>
          <option value="300L">300 Level</option>
          <option value="400L">400 Level</option>
          <option value="500L">500 Level</option>
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
                <th className="p-3">Class of Degree</th>
                <th className="p-3">Registration Status</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-700">{s.matricNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-navy-950">{s.firstName} {s.lastName} {s.otherNames}</div>
                    <div className="text-[10px] text-slate-500">{s.email}</div>
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
                    {s.isCourseRegistered ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Pending Reg</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
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

      {/* Student Profile Detail Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-brand-100 text-brand-800">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-navy-950 text-sm">Student Academic Record</h3>
              </div>
              <button onClick={() => setSelectedStudent(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-sm text-navy-950">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
                <div className="font-mono text-brand-700 font-bold">{selectedStudent.matricNumber}</div>
                <div className="text-slate-500">{selectedStudent.email}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Level:</strong> {selectedStudent.level}</div>
                <div><strong>State:</strong> {selectedStudent.stateOfOrigin}</div>
                <div><strong>Cumulative GPA:</strong> {selectedStudent.cgpa}</div>
                <div><strong>Standing:</strong> {selectedStudent.academicStanding}</div>
                <div><strong>Total Credits:</strong> {selectedStudent.totalCreditsEarned}</div>
                <div><strong>Status:</strong> {selectedStudent.enrollmentStatus}</div>
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
