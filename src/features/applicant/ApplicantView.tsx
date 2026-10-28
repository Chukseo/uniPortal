"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
import {
  FileCheck,
  Award,
  CreditCard,
  KeyRound,
  CheckCircle2,
  Clock,
  FileText,
  Copy,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function ApplicantView() {
  const {
    currentApplicant,
    currentInstitution,
    invoices,
    accessCodes,
    acceptAdmissionOffer,
    simulatePayment,
  } = useDemoStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const applicant = currentApplicant || {
    id: "app-1",
    applicationNumber: "APP/2025/0014",
    firstName: "Amina",
    lastName: "Yusuf",
    otherNames: "Zainab",
    email: "amina.yusuf2025@gmail.com",
    phone: "+234 701 234 5678",
    stateOfOrigin: "Kano State",
    utmeScore: 284,
    olevelSummary: "WAEC: 5 Credits (Eng, Math, Phys, Chem, Bio)",
    status: "Offer Issued",
    isOfferAccepted: false,
    uploadedDocuments: [
      { id: "doc-1", title: "WAEC Result", fileName: "waec_result.pdf", fileSize: "1.2 MB", verified: true },
      { id: "doc-2", title: "JAMB Result Slip", fileName: "jamb_slip.pdf", fileSize: "780 KB", verified: true },
    ],
  };

  // Find applicant's acceptance invoice
  const acceptanceInvoice = invoices.find(
    (i) => i.targetId === applicant.id && i.feeCategory === "Acceptance Fee"
  );

  // Find applicant's active access codes
  const applicantCodes = accessCodes.filter((c) => c.targetId === applicant.id);
  const activeCode = applicantCodes.find((c) => c.status === "Active");

  const handleAccept = () => {
    acceptAdmissionOffer(applicant.id);
    setFeedback("Provisional admission offer accepted! Proceed to clear Acceptance Fee.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePayAcceptance = () => {
    if (!acceptanceInvoice) return;
    simulatePayment(acceptanceInvoice.id);
    setFeedback("Acceptance fee cleared! Student matriculation code generated.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const copyAccessCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-navy-950 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                Admissions Portal
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Ref: {applicant.applicationNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
              Welcome, {applicant.firstName} {applicant.lastName}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Candidate for B.Sc Computer Science • {currentInstitution.name}
            </p>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-slate-300 block text-[10px] uppercase font-bold">Application Status</span>
            <span className="text-base font-black text-amber-300 block mt-0.5">{applicant.status}</span>
            <span className="text-[11px] text-slate-300">UTME Score: {applicant.utmeScore}</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Journey Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Offer Decision */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                applicant.status === "Offer Accepted"
                  ? "bg-emerald-100 text-emerald-800"
                  : applicant.status === "Offer Issued"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {applicant.status === "Offer Accepted" ? "Accepted" : "Offer Available"}
            </span>
          </div>

          <h4 className="font-bold text-sm text-navy-950">Admission Offer Decision</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have been granted provisional admission into B.Sc Computer Science (100L).
          </p>

          {applicant.status === "Offer Issued" && (
            <button
              onClick={handleAccept}
              className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Accept Provisional Offer
            </button>
          )}

          {applicant.status === "Offer Accepted" && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Offer Accepted by Candidate</span>
            </div>
          )}
        </div>

        {/* Step 2: Acceptance Fee Settlement */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                acceptanceInvoice?.status === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {acceptanceInvoice?.status || "Unpaid"}
            </span>
          </div>

          <h4 className="font-bold text-sm text-navy-950">Acceptance Fee Invoice</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Non-refundable acceptance fee: <strong>NGN 65,000</strong>.
          </p>

          {acceptanceInvoice?.status === "Unpaid" && (
            <button
              onClick={handlePayAcceptance}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Simulate NGN 65,000 Payment
            </button>
          )}

          {acceptanceInvoice?.status === "Paid" && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Acceptance Fee Cleared</span>
            </div>
          )}
        </div>

        {/* Step 3: Access Code Issuance */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              Student Activation
            </span>
          </div>

          <h4 className="font-bold text-sm text-navy-950">Matriculation Access Code</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Issued upon acceptance payment. Used to activate full student matriculation account.
          </p>

          {activeCode ? (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-purple-900 text-sm">{activeCode.code}</span>
                <button
                  onClick={() => copyAccessCode(activeCode.code)}
                  className="p-1 hover:bg-purple-100 rounded text-purple-700"
                  title="Copy Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-purple-600 mt-1 block">
                {copiedCode ? "Copied to clipboard!" : "Matriculation code generated"}
              </span>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 text-slate-400 rounded-lg text-xs">
              Locked until Acceptance Fee is cleared.
            </div>
          )}
        </div>
      </div>

      {/* Candidate Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-navy-950">Candidate Bio-Data & Uploaded Credentials</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Candidate Name:</span>
            <span className="font-bold text-navy-950">{applicant.firstName} {applicant.lastName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">UTME Score:</span>
            <span className="font-bold text-brand-700 font-mono">{applicant.utmeScore}</span>
          </div>
          <div>
            <span className="text-slate-400 block">State of Origin:</span>
            <span className="font-semibold text-slate-800">{applicant.stateOfOrigin}</span>
          </div>
          <div>
            <span className="text-slate-400 block">O'Level Summary:</span>
            <span className="text-slate-700 truncate block">{applicant.olevelSummary}</span>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <span className="font-bold text-navy-950 text-xs block">Screening Documents:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {applicant.uploadedDocuments.map((doc) => (
              <div key={doc.id} className="p-2.5 border rounded-lg flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span className="font-medium">{doc.title}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
