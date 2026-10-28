"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { Applicant, ApplicationStatus } from "@/types";
import {
  FileCheck,
  Search,
  Filter,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  X,
  CreditCard,
  AlertCircle,
  ShieldCheck,
  Send,
  Download,
  Users,
  GraduationCap,
} from "lucide-react";

export function AdmissionsView() {
  const {
    applicants,
    updateApplicationStatus,
    issueAdmissionOffer,
    currentInstitution,
    setCurrentRole,
    setActiveStudentId,
  } = useDemoStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entryTypeFilter, setEntryTypeFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [viewingDoc, setViewingDoc] = useState<{ title: string; fileName: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredApplicants = applicants.filter((a) => {
    const matchesInst = !a.institutionId || a.institutionId === currentInstitution.id;
    const matchesSearch =
      a.firstName.toLowerCase().includes(search.toLowerCase()) ||
      a.lastName.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesEntry = entryTypeFilter === "all" || a.entryType === entryTypeFilter;
    return matchesInst && matchesSearch && matchesStatus && matchesEntry;
  });

  const handleIssueOffer = (appId: string) => {
    issueAdmissionOffer(appId);
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Offer Issued" } : null));
    }
    setFeedback("Provisional admission offer letter and acceptance invoice generated!");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleBatchIssueOffers = () => {
    const approvedCandidates = applicants.filter((a) => a.status === "Approved");
    if (approvedCandidates.length === 0) {
      setFeedback("No candidates currently in 'Approved' status to issue offers to.");
      setTimeout(() => setFeedback(null), 3500);
      return;
    }
    approvedCandidates.forEach((a) => issueAdmissionOffer(a.id));
    setFeedback(`Batch issued provisional offers to ${approvedCandidates.length} approved candidates!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleReject = (appId: string) => {
    updateApplicationStatus(appId, "Rejected", noteInput || "Failed departmental cutoff criteria.");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
    setNoteInput("");
    setFeedback("Application marked as Rejected.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleApprove = (appId: string) => {
    updateApplicationStatus(appId, "Approved", noteInput || "Verified credentials and approved for admission quota.");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Approved" } : null));
    }
    setNoteInput("");
    setFeedback("Candidate credentials cleared and approved for provisional offer!");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleRequestDocs = (appId: string) => {
    const msg = noteInput || "Screening committee requested clearer O'Level Scratch Card pin / original birth certificate.";
    updateApplicationStatus(appId, "Under Review", msg);
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Under Review" } : null));
    }
    setNoteInput("");
    setFeedback("Flagged applicant for document resubmission.");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleViewConvertedStudent = (studentId: string) => {
    setActiveStudentId(studentId);
    setCurrentRole("student");
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
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
            <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
              <FileCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Admissions Screening & Offer Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Screen JAMB UTME candidates, review secondary school credentials, issue provisional offers, and track conversion to matriculated students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBatchIssueOffers}
            className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Batch Issue Offers to Approved</span>
          </button>
          <span className="px-3 py-2 bg-blue-50 text-blue-800 rounded-xl text-xs font-bold border border-blue-200">
            {applicants.length} Total Applicants
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Under Screening</span>
          <span className="text-xl font-black text-navy-950 mt-1 block">
            {applicants.filter((a) => a.status === "Under Review" || a.status === "Submitted").length}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Awaiting Decision</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Provisional Offers</span>
          <span className="text-xl font-black text-brand-700 mt-1 block">
            {applicants.filter((a) => a.status === "Offer Issued" || a.status === "Offer Accepted").length}
          </span>
          <span className="text-[10px] text-brand-600 font-semibold mt-1 block">Letters Generated</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Acceptance Cleared</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {applicants.filter((a) => a.status === "Offer Accepted").length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Matriculation Numbers Issued</span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl shadow-sm">
          <span className="text-slate-500 block font-semibold">Rejected Candidates</span>
          <span className="text-xl font-black text-rose-700 mt-1 block">
            {applicants.filter((a) => a.status === "Rejected").length}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">Below Cut-Off</span>
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
            placeholder="Search candidate by name or application reference..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <select
          value={entryTypeFilter}
          onChange={(e) => setEntryTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Entry Modes</option>
          <option value="UTME">UTME (100L)</option>
          <option value="Direct Entry">Direct Entry (200L)</option>
          <option value="Transfer">Inter-University Transfer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Application Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Offer Issued">Offer Issued</option>
          <option value="Offer Accepted">Offer Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-navy-950">Candidate Review Queue</h3>
          <span className="text-xs text-slate-500">{filteredApplicants.length} Candidates Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3">App Reference</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Entry Mode</th>
                <th className="p-3">UTME Score</th>
                <th className="p-3">State / LGA</th>
                <th className="p-3">Status</th>
                <th className="p-3">Matric Number (Shared Data)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-700">{a.applicationNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-navy-950">{a.firstName} {a.lastName}</div>
                    <div className="text-[10px] text-slate-400">{a.email}</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{a.entryType}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{a.utmeScore || "N/A"}</td>
                  <td className="p-3 text-slate-600">{a.stateOfOrigin}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        a.status === "Offer Accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : a.status === "Offer Issued"
                          ? "bg-blue-100 text-blue-800"
                          : a.status === "Approved"
                          ? "bg-purple-100 text-purple-800"
                          : a.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {a.matricNumber ? (
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                        {a.matricNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Pending Matriculation</span>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg font-bold transition-colors"
                    >
                      Screen Dossier
                    </button>
                    {a.status === "Approved" && (
                      <button
                        onClick={() => handleIssueOffer(a.id)}
                        className="px-2.5 py-1 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold shadow-sm"
                      >
                        Issue Offer
                      </button>
                    )}
                    {a.convertedStudentId && (
                      <button
                        onClick={() => handleViewConvertedStudent(a.convertedStudentId!)}
                        className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg font-bold text-[10px]"
                        title="Open Matriculated Student Profile"
                      >
                        Open Student
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screen Candidate Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-navy-950 text-base">Candidate Screening Dossier</h3>
                <span className="font-mono text-xs text-brand-700 font-bold">{selectedApp.applicationNumber}</span>
              </div>
              <button onClick={() => setSelectedApp(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy-950 text-sm">
                    {selectedApp.firstName} {selectedApp.lastName} {selectedApp.otherNames}
                  </span>
                  <span className="font-bold text-brand-700 px-2 py-0.5 bg-brand-50 rounded border border-brand-200">
                    JAMB UTME: {selectedApp.utmeScore}
                  </span>
                </div>
                <div className="text-slate-600">Email: {selectedApp.email} • Phone: {selectedApp.phone}</div>
                <div className="text-slate-600">State: {selectedApp.stateOfOrigin} • LGA: {selectedApp.lga}</div>
                <div className="text-slate-600">O'Level Summary: <span className="font-semibold text-slate-800">{selectedApp.olevelSummary}</span></div>
                <div className="text-slate-600">Admissions Programme: <span className="font-semibold text-navy-950">B.Sc Computer Science ({selectedApp.entryType})</span></div>
                {selectedApp.matricNumber && (
                  <div className="text-emerald-700 font-bold pt-1 border-t">
                    Assigned Matriculation Number: <span className="font-mono">{selectedApp.matricNumber}</span>
                  </div>
                )}
              </div>

              {/* Uploaded Files with Preview Trigger */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-navy-950">Uploaded Screening Certificates:</span>
                  <span className="text-[10px] text-slate-400">Click to preview document</span>
                </div>
                <div className="space-y-1.5">
                  {selectedApp.uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setViewingDoc({ title: doc.title, fileName: doc.fileName })}
                      className="p-2.5 bg-white border border-slate-200 hover:border-brand-500 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-semibold block text-slate-800 group-hover:text-brand-700">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.fileName} ({doc.fileSize})</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review History */}
              <div>
                <span className="font-bold text-navy-950 block mb-1">Admissions Audit Trail:</span>
                <div className="p-2.5 bg-slate-50 rounded-xl border text-slate-600 text-[11px] max-h-24 overflow-y-auto space-y-1">
                  {selectedApp.reviewNotes.map((n, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5">
                      <span className="text-brand-600 font-bold">•</span>
                      <span>{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Decision Controls */}
              <div className="pt-3 border-t space-y-2">
                <label className="font-semibold text-slate-700 block">Admissions Screening Note / Condition:</label>
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="e.g. Cleared for merit quota / Request re-upload of Birth Certificate..."
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-brand-500"
                />

                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleRequestDocs(selectedApp.id)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Request Documents</span>
                  </button>

                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                  >
                    Mark Approved
                  </button>

                  <button
                    onClick={() => handleIssueOffer(selectedApp.id)}
                    className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold shadow-sm"
                  >
                    Issue Provisional Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Document Preview Modal */}
      {viewingDoc && selectedApp && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-navy-950 text-sm">{viewingDoc.title} — Verified Copy</h3>
              </div>
              <button onClick={() => setViewingDoc(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 bg-amber-50/40 border border-amber-200 rounded-xl space-y-4 text-xs font-serif text-slate-800 shadow-inner">
              <div className="text-center space-y-1 border-b border-amber-200 pb-3">
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 font-sans block">
                  Official Examination Credential
                </span>
                <h4 className="font-bold text-sm text-navy-950 tracking-tight font-sans">
                  {viewingDoc.title.toUpperCase()}
                </h4>
                <p className="text-[10px] text-slate-500 font-sans">
                  Issued to: <strong className="text-slate-800">{selectedApp.firstName} {selectedApp.lastName}</strong>
                </p>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-amber-200">
                  <span className="text-slate-500">Candidate Number:</span>
                  <span className="font-mono font-bold text-slate-900">42981042GA</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-amber-200">
                  <span className="text-slate-500">Examination Center:</span>
                  <span className="font-semibold text-slate-800">Lagos Island Exam Center (028)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-amber-200">
                  <span className="text-slate-500">State of Origin:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.stateOfOrigin}</span>
                </div>

                <div className="pt-2">
                  <span className="font-bold block text-slate-700 mb-1">Subject Performance / Grades:</span>
                  <div className="bg-white p-2.5 rounded border border-amber-200 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between"><span>English Language</span><span className="font-bold text-emerald-700">A1 (Distinction)</span></div>
                    <div className="flex justify-between"><span>Mathematics</span><span className="font-bold text-emerald-700">A1 (Distinction)</span></div>
                    <div className="flex justify-between"><span>Physics</span><span className="font-bold text-emerald-700">B2 (Very Good)</span></div>
                    <div className="flex justify-between"><span>Chemistry</span><span className="font-bold text-emerald-700">B2 (Very Good)</span></div>
                    <div className="flex justify-between"><span>Biology / Further Maths</span><span className="font-bold text-emerald-700">A1 (Distinction)</span></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200 flex items-center justify-between font-sans text-[10px] text-slate-500">
                <span>Verified via Electronic Council Portal</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Digital Seal Valid</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
