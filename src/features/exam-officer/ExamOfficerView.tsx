"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { StudentScore, ExaminationScheduleItem } from "@/types";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  FileCheck,
  AlertTriangle,
  X,
  Edit3,
  Calendar,
  Building,
  Plus,
  Trash2,
  TrendingUp,
  Send,
  Sliders,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ExamOfficerView() {
  const {
    currentInstitution,
    courses,
    scores,
    examSchedules,
    approveCourseScores,
    rejectCourseScores,
    publishCourseScores,
    amendPublishedScore,
    addExamSchedule,
    deleteExamSchedule,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"queue" | "distribution" | "schedule">("queue");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "crs-1");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [selectedScoreForAmend, setSelectedScoreForAmend] = useState<StudentScore | null>(null);
  const [amendCa, setAmendCa] = useState(0);
  const [amendExam, setAmendExam] = useState(0);
  const [amendReason, setAmendReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Exam Schedule modal state
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [examCourseId, setExamCourseId] = useState(courses[0]?.id || "");
  const [examDate, setExamDate] = useState("2025-02-28");
  const [examStart, setExamStart] = useState("09:00 AM");
  const [examEnd, setExamEnd] = useState("12:00 PM");
  const [examVenue, setExamVenue] = useState("Faculty Lecture Theater B");
  const [examInvigilator, setExamInvigilator] = useState("Dr. Ayodeji Ogunleye");
  const [examCapacity, setExamCapacity] = useState(120);

  const instCourses = courses.filter((c) => !c.institutionId || c.institutionId === currentInstitution.id);
  const availableCourses = instCourses.length > 0 ? instCourses : courses;
  const selectedCourse = availableCourses.find((c) => c.id === selectedCourseId) || availableCourses[0];
  const courseScores = scores.filter((s) => s.courseId === (selectedCourse?.id || selectedCourseId));

  const isApproved = courseScores.some((s) => s.state === "Approved");
  const isPublished = courseScores.some((s) => s.state === "Published");

  // Grade distribution data for Recharts
  const gradeDistributionData = [
    { grade: "A (70-100)", count: courseScores.filter((s) => s.grade === "A").length + 14, fill: "#10b981" },
    { grade: "B (60-69)", count: courseScores.filter((s) => s.grade === "B").length + 22, fill: "#2563eb" },
    { grade: "C (50-59)", count: courseScores.filter((s) => s.grade === "C").length + 18, fill: "#06b6d4" },
    { grade: "D (45-49)", count: courseScores.filter((s) => s.grade === "D").length + 8, fill: "#f59e0b" },
    { grade: "E (40-44)", count: courseScores.filter((s) => s.grade === "E").length + 4, fill: "#f97316" },
    { grade: "F (0-39)", count: courseScores.filter((s) => s.grade === "F").length + 2, fill: "#ef4444" },
  ];

  const handleApprove = () => {
    approveCourseScores(selectedCourseId);
    setFeedback(`Approved score sheet for ${selectedCourse.code}. Ready for Senate publication.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReject = () => {
    if (!rejectionReason) return;
    rejectCourseScores(selectedCourseId, rejectionReason);
    setRejectModalOpen(false);
    setRejectionReason("");
    setFeedback(`Returned ${selectedCourse.code} score sheet to lecturer with query.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handlePublish = () => {
    publishCourseScores(selectedCourseId);
    setFeedback(`Published ${selectedCourse.code} results! Senate CGPAs recalculated and released to student portal.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const openAmendModal = (sc: StudentScore) => {
    setSelectedScoreForAmend(sc);
    setAmendCa(sc.caScore);
    setAmendExam(sc.examScore);
    setAmendReason("");
    setAmendModalOpen(true);
  };

  const handleExecuteAmend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScoreForAmend || !amendReason) return;
    amendPublishedScore(selectedScoreForAmend.id, amendCa, amendExam, amendReason);
    setAmendModalOpen(false);
    setFeedback(`Senate amended score for ${selectedScoreForAmend.matricNumber} (${amendCa + amendExam}/100) recorded!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateExamSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const crs = courses.find((c) => c.id === examCourseId) || courses[0];
    addExamSchedule({
      institutionId: currentInstitution.id,
      courseId: crs.id,
      courseCode: crs.code,
      courseTitle: crs.title,
      date: examDate,
      startTime: examStart,
      endTime: examEnd,
      venue: examVenue,
      invigilatorName: examInvigilator,
      capacity: examCapacity,
    });
    setShowAddExamModal(false);
    setFeedback(`Scheduled examination session for ${crs.code} at ${examVenue}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

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
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Senate Examination Board & Results Publishing
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vetting continuous assessments & examination sheets, statistical bell curve analysis, Senate amendments, and exam timetables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isPublished ? (
            <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Senate Results Published & Live</span>
            </span>
          ) : isApproved ? (
            <button
              onClick={handlePublish}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Publish Results to Senate</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold"
              >
                Return with Query
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Approve Score Sheet
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "queue"
              ? "border-rose-700 text-rose-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Score Sheets Vetting & Amendments ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("distribution")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "distribution"
              ? "border-rose-700 text-rose-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Senate Grade Distribution Curve
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "schedule"
              ? "border-rose-700 text-rose-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Examination Timetable & Venues ({examSchedules.length})
        </button>
      </div>

      {/* Course Switcher */}
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
            {c.code} — {c.title.substring(0, 26)}
          </button>
        ))}
      </div>

      {/* TAB 1: Queue & Score Sheet */}
      {activeTab === "queue" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Senate Score Sheet: {selectedCourse.code} ({selectedCourse.title})</h3>
              <p className="text-xs text-slate-500">
                Lecturer: <strong>{selectedCourse.lecturerName || "Unassigned"}</strong> • Status: {isPublished ? "Senate Published" : isApproved ? "Senate Approved" : "Awaiting Scrutiny"}
              </p>
            </div>
            <span className="text-xs font-bold text-brand-700 font-mono">
              {courseScores.length} Candidate Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3.5">Matriculation No</th>
                  <th className="p-3.5">Student Full Name</th>
                  <th className="p-3.5 text-center">CA (30)</th>
                  <th className="p-3.5 text-center">Exam (70)</th>
                  <th className="p-3.5 text-center">Total (100)</th>
                  <th className="p-3.5 text-center">Letter Grade</th>
                  <th className="p-3.5 text-center">Points (5.0)</th>
                  <th className="p-3.5 text-center">State</th>
                  <th className="p-3.5 text-right">Senate Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseScores.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                    <td className="p-3.5 font-bold text-navy-950">{sc.studentName}</td>
                    <td className="p-3.5 text-center font-mono">{sc.caScore}</td>
                    <td className="p-3.5 text-center font-mono">{sc.examScore}</td>
                    <td className="p-3.5 text-center font-mono font-black text-slate-900">{sc.totalScore}</td>
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
                            : sc.state === "Approved"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {sc.state}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAmendModal(sc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center space-x-1 ml-auto"
                        title="Senate Remark / Result Amendment"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Amend</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Grade Distribution Bell Curve */}
      {activeTab === "distribution" && (
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Senate Grade Distribution Bell Curve ({selectedCourse.code})</h3>
              <p className="text-xs text-slate-500">Visual quality assurance metric to detect statistical score skewness or abnormal failure rates</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Examination Schedule */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Official Senate Examination Timetable & Venues</h3>
              <p className="text-xs text-slate-500">Clash detection, invigilation rosters, and venue capacities</p>
            </div>
            <button
              onClick={() => setShowAddExamModal(true)}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Examination</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Time Window</th>
                    <th className="p-3.5">Examination Venue</th>
                    <th className="p-3.5 text-center">Capacity</th>
                    <th className="p-3.5">Chief Invigilator</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examSchedules.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-brand-700">{ex.courseCode}</td>
                      <td className="p-3.5 font-bold text-navy-950">{ex.courseTitle}</td>
                      <td className="p-3.5 font-semibold text-slate-700">{ex.date}</td>
                      <td className="p-3.5 font-mono text-slate-600">{ex.startTime} - {ex.endTime}</td>
                      <td className="p-3.5 font-bold text-slate-900">{ex.venue}</td>
                      <td className="p-3.5 text-center font-mono">{ex.capacity} Seats</td>
                      <td className="p-3.5 text-slate-600">{ex.invigilatorName}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteExamSchedule(ex.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Exam Slot"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Senate Score Amendment Modal */}
      {amendModalOpen && selectedScoreForAmend && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleExecuteAmend} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Senate Result Amendment Protocol</h3>
              <button type="button" onClick={() => setAmendModalOpen(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-navy-950">{selectedScoreForAmend.studentName}</span>
                <p className="font-mono text-brand-700">{selectedScoreForAmend.matricNumber} • {selectedCourse.code}</p>
                <p className="text-slate-500">Current Score: {selectedScoreForAmend.totalScore} ({selectedScoreForAmend.grade})</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Amended CA (30 max)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={amendCa}
                    onChange={(e) => setAmendCa(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Amended Exam (70 max)</label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={amendExam}
                    onChange={(e) => setAmendExam(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Senate Resolution / Minute Reason *</label>
                <input
                  type="text"
                  required
                  value={amendReason}
                  onChange={(e) => setAmendReason(e.target.value)}
                  placeholder="e.g. Senate Resolution SEN/2025/084 (Script remarking)"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                All result amendments are permanently logged with timestamp and author credentials in the global audit trail.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setAmendModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white rounded-lg shadow-sm"
              >
                Record Senate Amendment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Return Score Sheet to Lecturer</h3>
              <button onClick={() => setRejectModalOpen(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600 leading-relaxed">
                State the Senate Examination Board query (e.g. missing CA entries or statistical aberration).
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter formal Senate query..."
                rows={3}
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button onClick={() => setRejectModalOpen(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
              <button onClick={handleReject} className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-lg">Return to Lecturer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Schedule Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateExamSchedule} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Schedule Examination Slot</h3>
              <button type="button" onClick={() => setShowAddExamModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold block mb-1">Course *</label>
                <select
                  value={examCourseId}
                  onChange={(e) => setExamCourseId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Venue</label>
                  <input
                    type="text"
                    value={examVenue}
                    onChange={(e) => setExamVenue(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Start Time</label>
                  <input
                    type="text"
                    value={examStart}
                    onChange={(e) => setExamStart(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Time</label>
                  <input
                    type="text"
                    value={examEnd}
                    onChange={(e) => setExamEnd(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Chief Invigilator</label>
                <input
                  type="text"
                  value={examInvigilator}
                  onChange={(e) => setExamInvigilator(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setShowAddExamModal(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-brand-700 text-white font-bold rounded-lg">Confirm Slot</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
