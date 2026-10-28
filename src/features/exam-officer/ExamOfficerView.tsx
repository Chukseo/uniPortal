"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { StudentScore } from "@/types";
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
} from "lucide-react";

export function ExamOfficerView() {
  const {
    courses,
    scores,
    approveCourseScores,
    rejectCourseScores,
    publishCourseScores,
    amendPublishedScore,
  } = useDemoStore();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "crs-1");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [selectedScoreForAmend, setSelectedScoreForAmend] = useState<StudentScore | null>(null);
  const [amendCa, setAmendCa] = useState(0);
  const [amendExam, setAmendExam] = useState(0);
  const [amendReason, setAmendReason] = useState("");

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseScores = scores.filter((s) => s.courseId === selectedCourseId);

  const isApproved = courseScores.some((s) => s.state === "Approved");
  const isPublished = courseScores.some((s) => s.state === "Published");

  const handleApprove = () => {
    approveCourseScores(selectedCourseId);
  };

  const handleReject = () => {
    if (!rejectionReason) return;
    rejectCourseScores(selectedCourseId, rejectionReason);
    setRejectModalOpen(false);
    setRejectionReason("");
  };

  const handlePublish = () => {
    publishCourseScores(selectedCourseId);
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Senate Examination Review & Results Publishing
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Scrutinize submitted course results, approve for Senate board, publish official GPA, or audit amendments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isApproved && !isPublished && (
            <>
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition-all"
              >
                Return / Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Approve Result Sheet
              </button>
            </>
          )}

          {isApproved && !isPublished && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish to Student Portal</span>
            </button>
          )}

          {isPublished && (
            <span className="px-3.5 py-2 bg-purple-50 text-purple-800 border border-purple-200 font-bold text-xs rounded-xl flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Officially Published to Senate</span>
            </span>
          )}
        </div>
      </div>

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
            {c.code} ({c.title})
          </button>
        ))}
      </div>

      {/* Scores Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-navy-950">
              Senate Result Sheet: {selectedCourse.code} — {selectedCourse.title}
            </h3>
            <p className="text-xs text-slate-500">
              Assigned Lecturer: {selectedCourse.lecturerName || "Dr. Ayodeji Ogunleye"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3">Matriculation No</th>
                <th className="p-3">Candidate Name</th>
                <th className="p-3 text-center">CA (30)</th>
                <th className="p-3 text-center">Exam (70)</th>
                <th className="p-3 text-center">Total (100)</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3 text-center">Points</th>
                <th className="p-3">Review State</th>
                <th className="p-3 text-right">Senate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseScores.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-brand-700">{sc.matricNumber}</td>
                  <td className="p-3 font-semibold text-navy-950">{sc.studentName}</td>
                  <td className="p-3 text-center font-mono">{sc.caScore}</td>
                  <td className="p-3 text-center font-mono">{sc.examScore}</td>
                  <td className="p-3 text-center font-mono font-black text-slate-900">{sc.totalScore}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block w-6 h-6 rounded-md leading-6 font-black text-xs text-white ${
                        sc.grade === "A" ? "bg-emerald-600" : "bg-blue-600"
                      }`}
                    >
                      {sc.grade}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-600">{sc.gradePoints}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sc.state === "Published"
                          ? "bg-purple-100 text-purple-800"
                          : sc.state === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : sc.state === "Amended"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {sc.state}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => openAmendModal(sc)}
                      className="inline-flex items-center space-x-1 px-2 py-1 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded text-xs font-semibold"
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

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Return Course Scores to Lecturer</h3>
              <button onClick={() => setRejectModalOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-2">
              <label className="font-semibold block">Reason for Rejection / Senate Correction *</label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Discrepancy observed between continuous assessment test sheets and total grade distribution."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button onClick={() => setRejectModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button onClick={handleReject} className="px-4 py-1.5 text-xs font-bold bg-rose-600 text-white rounded-lg">Return to Lecturer</button>
            </div>
          </div>
        </div>
      )}

      {/* Senate Amendment Modal */}
      {amendModalOpen && selectedScoreForAmend && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleExecuteAmend} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-navy-950 text-sm">Senate Result Amendment</h3>
                <span className="text-xs text-brand-700 font-mono">{selectedScoreForAmend.matricNumber}</span>
              </div>
              <button type="button" onClick={() => setAmendModalOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Amended CA Score (Max 30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={amendCa}
                    onChange={(e) => setAmendCa(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Amended Exam Score (Max 70)</label>
                  <input
                    type="number"
                    min={0}
                    max={70}
                    value={amendExam}
                    onChange={(e) => setAmendExam(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Official Senate Reason *</label>
                <input
                  type="text"
                  required
                  value={amendReason}
                  onChange={(e) => setAmendReason(e.target.value)}
                  placeholder="e.g. Remarking approved by Senate Appeal Committee."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                Preserves version history, actor identity, and audit timestamp.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setAmendModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg">Record Amendment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
