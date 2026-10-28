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

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseScores = scores.filter((s) => s.courseId === selectedCourseId);

  const filteredScores = courseScores.filter((sc) =>
    sc.studentName.toLowerCase().includes(searchCandidate.toLowerCase()) ||
    sc.matricNumber.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  // Check state of course submission
  const isSubmitted = courseScores.some(
    (s) => s.state === "Submitted" || s.state === "Approved" || s.state === "Published"
  );

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
            Logged in as {currentUser.fullName} • Enter continuous assessment ({maxCa}%) and examination ({maxExam}%) marks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
            title="Configure Assessment Breakdown"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CA/Exam Split ({maxCa}/{maxExam})</span>
          </button>

          {isSubmitted ? (
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Awaiting Senate Review</span>
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
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-navy-950">
              {selectedCourse.code}: {selectedCourse.title}
            </h3>
            <p className="text-xs text-slate-500">
              Credit Units: {selectedCourse.creditUnits} • Assessment Policy: CA max {maxCa} marks, Exam max {maxExam} marks. Total = 100%.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchCandidate}
              onChange={(e) => setSearchCandidate(e.target.value)}
              placeholder="Search enrolled candidate..."
              className="pl-8 pr-3 py-1.5 border rounded-lg text-xs w-56 focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3">Matric Number</th>
                <th className="p-3">Candidate Full Name</th>
                <th className="p-3 text-center">CA Score (Max {maxCa})</th>
                <th className="p-3 text-center">Exam Score (Max {maxExam})</th>
                <th className="p-3 text-center">Total (100)</th>
                <th className="p-3 text-center">Letter Grade</th>
                <th className="p-3 text-center">Points</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                  <td className="p-3 font-semibold text-navy-950">{sc.studentName}</td>
                  <td className="p-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={maxCa}
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
                      max={maxExam}
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

        <div className="p-4 border-t bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Configured range enforced: CA max {maxCa}, Exam max {maxExam}. Scores are queued for Senate Examination review.
            </span>
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold"
            >
              Submit Score Sheet
            </button>
          )}
        </div>
      </div>

      {/* Assessment Component Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Configure Assessment Components</h3>
              <button onClick={() => setShowConfigModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <p className="text-slate-600">
                Adjust continuous assessment vs main examination weightings. Total must equal 100%.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Continuous Assessment (Max)</label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={maxCa}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setMaxCa(v);
                      setMaxExam(100 - v);
                    }}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Examination Marks (Max)</label>
                  <input
                    type="number"
                    min={50}
                    max={90}
                    value={maxExam}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setMaxExam(v);
                      setMaxCa(100 - v);
                    }}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
                Total: <strong>{maxCa + maxExam} Marks (100%)</strong>. Configured limits will dynamically validate all input cells.
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 bg-brand-700 text-white rounded-lg text-xs font-bold"
              >
                Apply Assessment Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
