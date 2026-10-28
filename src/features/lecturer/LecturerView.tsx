"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Save,
  Send,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export function LecturerView() {
  const {
    courses,
    scores,
    currentUser,
    updateScoreEntry,
    submitCourseScores,
  } = useDemoStore();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "crs-1");
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseScores = scores.filter((s) => s.courseId === selectedCourseId);

  // Check state of course submission
  const isSubmitted = courseScores.some(
    (s) => s.state === "Submitted" || s.state === "Approved" || s.state === "Published"
  );

  const handleScoreChange = (scoreId: string, ca: number, exam: number) => {
    // Range validation
    const validCa = Math.max(0, Math.min(30, Number.isNaN(ca) ? 0 : ca));
    const validExam = Math.max(0, Math.min(70, Number.isNaN(exam) ? 0 : exam));
    updateScoreEntry(scoreId, validCa, validExam);
  };

  const handleSubmit = () => {
    submitCourseScores(selectedCourseId);
    setSaveFeedback("Marks successfully validated and submitted to Senate Examination Board!");
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Lecturer Assessment & Score Entry Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as {currentUser.fullName} • Enter continuous assessment (30%) and examination (70%) marks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isSubmitted ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Submitted for Review</span>
            </span>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Senate Exams</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert */}
      {saveFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Course Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {courses.slice(0, 4).map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCourseId === c.id
                ? "bg-navy-950 text-white border-navy-950 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {c.code} — {c.title.substring(0, 24)}...
          </button>
        ))}
      </div>

      {/* Scoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-navy-950">
              {selectedCourse.code}: {selectedCourse.title}
            </h3>
            <p className="text-xs text-slate-500">
              Credit Units: {selectedCourse.creditUnits} • Assessment Policy: CA max 30 marks, Exam max 70 marks. Total = 100%.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">
            {courseScores.length} Enrolled Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3">Matric Number</th>
                <th className="p-3">Candidate Full Name</th>
                <th className="p-3 text-center">CA Score (Max 30)</th>
                <th className="p-3 text-center">Exam Score (Max 70)</th>
                <th className="p-3 text-center">Total (100)</th>
                <th className="p-3 text-center">Letter Grade</th>
                <th className="p-3 text-center">Points</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseScores.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                  <td className="p-3 font-semibold text-navy-950">{sc.studentName}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      disabled={isSubmitted}
                      value={sc.caScore}
                      onChange={(e) =>
                        handleScoreChange(sc.id, parseInt(e.target.value), sc.examScore)
                      }
                      className="w-16 px-2 py-1 border rounded text-center font-mono font-bold focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={70}
                      disabled={isSubmitted}
                      value={sc.examScore}
                      onChange={(e) =>
                        handleScoreChange(sc.id, sc.caScore, parseInt(e.target.value))
                      }
                      className="w-16 px-2 py-1 border rounded text-center font-mono font-bold focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="p-3 text-center font-mono font-black text-slate-900 text-sm">
                    {sc.totalScore}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block w-7 h-7 rounded-lg leading-7 font-black text-xs text-white ${
                        sc.grade === "A"
                          ? "bg-emerald-600"
                          : sc.grade === "B"
                          ? "bg-blue-600"
                          : sc.grade === "C"
                          ? "bg-cyan-600"
                          : sc.grade === "D"
                          ? "bg-amber-600"
                          : "bg-rose-600"
                      }`}
                    >
                      {sc.grade}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-600">
                    {sc.gradePoints}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sc.state === "Published"
                          ? "bg-purple-100 text-purple-800"
                          : sc.state === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : sc.state === "Submitted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {sc.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Range validation enforced: CA max 30, Exam max 70. Grade points: A=5, B=4, C=3, D=2, E=1, F=0.</span>
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold"
            >
              Save & Submit Marks
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
