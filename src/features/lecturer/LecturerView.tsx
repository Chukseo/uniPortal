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
  Sliders,
  X,
  Search,
  History,
  TrendingUp,
} from "lucide-react";

export function LecturerView() {
  const {
    courses,
    scores,
    currentUser,
    gradingPolicy,
    updateScoreEntry,
    submitCourseScores,
  } = useDemoStore();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "crs-1");
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [searchCandidate, setSearchCandidate] = useState("");

  // Editable Assessment Configuration (Section 16 requirement)
  const [maxCa, setMaxCa] = useState(gradingPolicy.maxCaMarks || 30);
  const [maxExam, setMaxExam] = useState(gradingPolicy.maxExamMarks || 70);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const instCourses = courses.filter((c) => !c.institutionId || c.institutionId === currentUser.institutionId);
  const availableCourses = instCourses.length > 0 ? instCourses : courses;
  const selectedCourse = availableCourses.find((c) => c.id === selectedCourseId) || availableCourses[0];
  const courseScores = scores.filter((s) => s.courseId === (selectedCourse?.id || selectedCourseId));

  const filteredScores = courseScores.filter((sc) =>
    sc.studentName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
    sc.matricNumber.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  // Check state of course submission
  const isSubmitted = courseScores.some(
    (s) => s.state === "Submitted" || s.state === "Approved" || s.state === "Published"
  );

  const isPublished = courseScores.some((s) => s.state === "Published");

  const handleScoreChange = (scoreId: string, ca: number, exam: number) => {
    // Dynamic range validation against editable assessment configuration
    const validCa = Math.max(0, Math.min(maxCa, Number.isNaN(ca) ? 0 : ca));
    const validExam = Math.max(0, Math.min(maxExam, Number.isNaN(exam) ? 0 : exam));
    updateScoreEntry(scoreId, validCa, validExam);
  };

  const handleSubmit = () => {
    submitCourseScores(selectedCourseId);
    setSaveFeedback("Marks successfully validated and submitted to Senate Examination Board!");
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleSaveDraft = () => {
    setSaveFeedback("Grades saved as draft in lecturer grade book.");
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  // Performance metrics
  const totalStudents = courseScores.length;
  const passedStudents = courseScores.filter((s) => s.grade !== "F").length;
  const passRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 100;
  const highestScore = courseScores.reduce((max, s) => Math.max(max, s.totalScore), 0);
  const lowestScore = courseScores.reduce((min, s) => Math.min(min, s.totalScore), 100);
  const averageScore = totalStudents > 0 ? Math.round(courseScores.reduce((sum, s) => sum + s.totalScore, 0) / totalStudents) : 0;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {saveFeedback && (
        <div className="p-3.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{saveFeedback}</span>
          </div>
          <button onClick={() => setSaveFeedback(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

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
            Logged in as {currentUser.fullName} • Enter continuous assessment ({maxCa}%) and examination ({maxExam}%) marks with real-time range validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Configure Assessment Breakdown"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CA/Exam Split ({maxCa}/{maxExam})</span>
          </button>

          {isPublished ? (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Senate Results Published</span>
            </span>
          ) : isSubmitted ? (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Submitted to Exam Board</span>
            </span>
          ) : (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Senate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Performance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Registered Students</span>
          <span className="text-xl font-black text-navy-950 mt-1 block">{totalStudents}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{selectedCourse?.code} Cohort</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Pass Rate</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">{passRate}%</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">{passedStudents} Passed (≥ 40)</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Class Average</span>
          <span className="text-xl font-black text-brand-700 mt-1 block">{averageScore} / 100</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Aggregate Score</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Score Range</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{lowestScore} — {highestScore}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Min to Max Marks</span>
        </div>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {courses.map((c) => (
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

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchCandidate}
              onChange={(e) => setSearchCandidate(e.target.value)}
              placeholder="Search by student name or matriculation no..."
              className="w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-3">
            <span>Assessment Split: <strong>CA ({maxCa} max) + Exam ({maxExam} max) = 100</strong></span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded font-bold font-mono">
              {filteredScores.length} Enrolled
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3.5">Matriculation No</th>
                <th className="p-3.5">Student Full Name</th>
                <th className="p-3.5 text-center">CA Marks ({maxCa})</th>
                <th className="p-3.5 text-center">Exam Marks ({maxExam})</th>
                <th className="p-3.5 text-center">Total (100)</th>
                <th className="p-3.5 text-center">Letter Grade</th>
                <th className="p-3.5 text-center">Points (5.0)</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                  <td className="p-3.5 font-bold text-navy-950">{sc.studentName}</td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxCa}
                      disabled={isPublished}
                      value={sc.caScore}
                      onChange={(e) => handleScoreChange(sc.id, Number(e.target.value), sc.examScore)}
                      className="w-16 px-2 py-1 text-center font-mono font-bold border rounded-lg focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxExam}
                      disabled={isPublished}
                      value={sc.examScore}
                      onChange={(e) => handleScoreChange(sc.id, sc.caScore, Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center font-mono font-bold border rounded-lg focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="p-3.5 text-center font-mono font-black text-sm text-slate-900">
                    {sc.totalScore}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-black text-xs ${
                        sc.grade === "A"
                          ? "bg-purple-100 text-purple-800"
                          : sc.grade === "B"
                          ? "bg-blue-100 text-blue-800"
                          : sc.grade === "C"
                          ? "bg-cyan-100 text-cyan-800"
                          : sc.grade === "D"
                          ? "bg-amber-100 text-amber-800"
                          : sc.grade === "E"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {sc.grade}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold">{sc.gradePoints.toFixed(1)}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sc.state === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : sc.state === "Submitted"
                          ? "bg-blue-100 text-blue-800"
                          : sc.state === "Approved"
                          ? "bg-purple-100 text-purple-800"
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
      </div>

      {/* Assessment Breakdown Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Configure Assessment Weighting Split</h3>
              <button onClick={() => setShowConfigModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600 leading-relaxed">
                Nigerian universities typically split grading as <strong>30% Continuous Assessment (CA)</strong> and <strong>70% Final Semester Examination</strong>, summing to 100%.
              </p>

              <div>
                <label className="font-semibold block mb-1">Max CA Marks (%)</label>
                <input
                  type="number"
                  min={10}
                  max={50}
                  value={maxCa}
                  onChange={(e) => {
                    const ca = Number(e.target.value);
                    setMaxCa(ca);
                    setMaxExam(100 - ca);
                  }}
                  className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Max Examination Marks (%)</label>
                <input
                  type="number"
                  disabled
                  value={maxExam}
                  className="w-full px-3 py-2 border rounded-xl font-mono font-bold bg-slate-100 text-slate-600"
                />
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-[11px]">
                Total: <strong>{maxCa + maxExam}%</strong> • Validation limits update dynamically in your grade sheet.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold"
              >
                Apply Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
