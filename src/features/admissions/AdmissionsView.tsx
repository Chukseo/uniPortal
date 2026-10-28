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
} from "lucide-react";

export function AdmissionsView() {
  const { applicants, updateApplicationStatus, issueAdmissionOffer } = useDemoStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Applicant | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.firstName.toLowerCase().includes(search.toLowerCase()) ||
      a.lastName.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueOffer = (appId: string) => {
    issueAdmissionOffer(appId);
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Offer Issued" } : null));
    }
  };

  const handleReject = (appId: string) => {
    updateApplicationStatus(appId, "Rejected", noteInput || "Failed departmental criteria.");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
    setNoteInput("");
  };

  const handleApprove = (appId: string) => {
    updateApplicationStatus(appId, "Approved", noteInput || "Approved for merit list.");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, status: "Approved" } : null));
    }
    setNoteInput("");
  };

  return (
    <div className="space-y-6">
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
            Validate candidate UTME scores, O'Level credentials, issue provisional offers and track acceptance fees.
          </p>
        </div>

        <div className="flex space-x-2 text-xs">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg font-bold border border-blue-200">
            {applicants.length} Total Candidates
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white border rounded-xl">
          <span className="text-slate-500 block">Under Review</span>
          <span className="text-xl font-black text-navy-950 mt-1 block">
            {applicants.filter((a) => a.status === "Under Review" || a.status === "Submitted").length}
          </span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl">
          <span className="text-slate-500 block">Offers Issued</span>
          <span className="text-xl font-black text-brand-700 mt-1 block">
            {applicants.filter((a) => a.status === "Offer Issued" || a.status === "Offer Accepted").length}
          </span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl">
          <span className="text-slate-500 block">Offers Accepted</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {applicants.filter((a) => a.status === "Offer Accepted").length}
          </span>
        </div>
        <div className="p-3.5 bg-white border rounded-xl">
          <span className="text-slate-500 block">Rejected</span>
          <span className="text-xl font-black text-rose-700 mt-1 block">
            {applicants.filter((a) => a.status === "Rejected").length}
          </span>
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
            placeholder="Search by candidate name or application ref..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

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
          <span className="text-xs text-slate-500">{filteredApplicants.length} Candidates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b">
              <tr>
                <th className="p-3">App Reference</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Entry Type</th>
                <th className="p-3">UTME Score</th>
                <th className="p-3">O'Level Qualifications</th>
                <th className="p-3">State / LGA</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-brand-700">{a.applicationNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-navy-950">{a.firstName} {a.lastName}</div>
                    <div className="text-[10px] text-slate-500">{a.email}</div>
                  </td>
                  <td className="p-3 font-semibold">{a.entryType}</td>
                  <td className="p-3 font-mono font-bold text-slate-900">{a.utmeScore || "N/A"}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{a.olevelSummary}</td>
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
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg font-bold transition-colors"
                    >
                      Screen
                    </button>
                    {a.status === "Approved" && (
                      <button
                        onClick={() => handleIssueOffer(a.id)}
                        className="px-2.5 py-1 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold"
                      >
                        Issue Offer
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
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-bold text-navy-950 text-base">Screen Candidate Dossier</h3>
                <span className="font-mono text-xs text-brand-700">{selectedApp.applicationNumber}</span>
              </div>
              <button onClick={() => setSelectedApp(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-navy-950 text-sm">
                    {selectedApp.firstName} {selectedApp.lastName} {selectedApp.otherNames}
                  </span>
                  <span className="font-bold text-brand-700">UTME: {selectedApp.utmeScore}</span>
                </div>
                <div className="text-slate-600">Email: {selectedApp.email} • Phone: {selectedApp.phone}</div>
                <div className="text-slate-600">State: {selectedApp.stateOfOrigin} • LGA: {selectedApp.lga}</div>
                <div className="text-slate-600">O'Level: {selectedApp.olevelSummary}</div>
              </div>

              {/* Uploaded Files */}
              <div>
                <span className="font-bold text-navy-950 block mb-2">Uploaded Screening Documents:</span>
                <div className="space-y-1.5">
                  {selectedApp.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-white border rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-600" />
                        <div>
                          <span className="font-semibold block">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.fileName} ({doc.fileSize})</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review History */}
              <div>
                <span className="font-bold text-navy-950 block mb-1">Admissions Audit Notes:</span>
                <div className="p-2 bg-slate-50 rounded border text-slate-600 text-[11px] max-h-24 overflow-y-auto space-y-1">
                  {selectedApp.reviewNotes.map((n, idx) => (
                    <div key={idx}>• {n}</div>
                  ))}
                </div>
              </div>

              {/* Committee Decision Controls */}
              <div className="pt-3 border-t space-y-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Enter decision rationale or conditions..."
                  className="w-full px-3 py-1.5 border rounded-lg text-xs"
                />

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                  >
                    Mark Approved
                  </button>
                  <button
                    onClick={() => handleIssueOffer(selectedApp.id)}
                    className="px-4 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg font-bold"
                  >
                    Issue Provisional Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
