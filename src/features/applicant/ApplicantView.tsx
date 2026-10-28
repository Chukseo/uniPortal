"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
import { Applicant } from "@/types";
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
  Plus,
  X,
  UploadCloud,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  UserCheck,
  Building,
} from "lucide-react";

export function ApplicantView() {
  const router = useRouter();
  const {
    currentApplicant,
    applicants,
    currentInstitution,
    invoices,
    accessCodes,
    acceptAdmissionOffer,
    updateApplicationStatus,
    simulatePayment,
    submitNewApplication,
    setCurrentRole,
    setActiveApplicantId,
    setActiveStudentId,
    convertApplicantToStudent,
  } = useDemoStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Application Wizard state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Female");
  const [stateOfOrigin, setStateOfOrigin] = useState("Lagos State");
  const [lga, setLga] = useState("Ikeja");
  const [utmeScore, setUtmeScore] = useState(278);
  const [jambReg, setJambReg] = useState("202588391024EF");
  const [selectedProgramme, setSelectedProgramme] = useState("B.Sc Computer Science");
  const [olevelText, setOlevelText] = useState("WAEC: Eng: A1, Math: A1, Phys: B2, Chem: B3, Bio: B2");
  const [selectedFileName, setSelectedFileName] = useState("waec_statement_of_result.pdf");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // Document Certificate preview modal
  const [viewingDoc, setViewingDoc] = useState<{ title: string; fileName: string } | null>(null);

  // Active applicant
  const activeApp = currentApplicant || applicants[0];

  const acceptanceInvoice = invoices.find(
    (i) => i.targetId === activeApp?.id && i.feeCategory === "Acceptance Fee"
  );

  const applicantCodes = accessCodes.filter((c) => c.targetId === activeApp?.id);
  const activeCode = applicantCodes.find((c) => c.status === "Active");

  const handleAccept = () => {
    if (!activeApp) return;
    acceptAdmissionOffer(activeApp.id);
    setFeedback("Provisional admission offer accepted! Proceed to settle the Acceptance Fee.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDecline = () => {
    if (!activeApp) return;
    updateApplicationStatus(activeApp.id, "Offer Declined", "Applicant formally declined provisional offer.");
    setFeedback("Offer declined. Registry records updated.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePayAcceptance = () => {
    if (!acceptanceInvoice) return;
    const res = simulatePayment(acceptanceInvoice.id, "Simulated Campus Pay");
    if (res.success) {
      setFeedback("Acceptance fee cleared! Official matriculation number and student portal access code issued.");
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const copyAccessCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleHandoverToStudent = () => {
    if (!activeApp) return;
    const stdId = convertApplicantToStudent(activeApp.id);
    if (stdId) {
      setActiveStudentId(stdId);
      setCurrentRole("student");
      router.push("/demo/portal?view=student");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSendOtp = () => {
    setSimulatedOtp("7392");
    setFeedback("Simulated 4-digit OTP sent to your email (Demo Code: 7392)");
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleVerifyOtp = () => {
    if (simulatedOtp === "7392" || simulatedOtp.length === 4) {
      setEmailVerified(true);
      setFeedback("Email verified successfully!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleFinalSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = submitNewApplication({
      firstName,
      lastName,
      otherNames,
      email,
      phone,
      gender,
      stateOfOrigin,
      lga,
      utmeScore,
      jambRegNumber: jambReg,
      olevelSummary: olevelText,
      uploadedDocuments: [
        {
          id: `doc-${Date.now()}-1`,
          title: "Senior School Certificate Examination (SSCE)",
          fileName: selectedFileName,
          fileSize: "1.4 MB",
          uploadedAt: new Date().toISOString(),
          verified: true,
        },
        {
          id: `doc-${Date.now()}-2`,
          title: "JAMB UTME Result Slip",
          fileName: "jamb_original_slip.pdf",
          fileSize: "840 KB",
          uploadedAt: new Date().toISOString(),
          verified: true,
        },
      ],
    });
    setActiveApplicantId(newId);
    setShowApplyModal(false);
    setWizardStep(1);
    setFeedback("New application submitted successfully! Reference placed in review queue.");
    setTimeout(() => setFeedback(null), 4000);
  };

  // Progression Stepper
  const steps = [
    { num: 1, label: "Application Submitted", done: true },
    { num: 2, label: "Admissions Screening", done: activeApp?.status !== "Submitted" && activeApp?.status !== "Under Review" && activeApp?.status !== "Awaiting Documents" },
    { num: 3, label: "Offer Issuance", done: activeApp?.status === "Offer Issued" || activeApp?.status === "Offer Accepted" },
    { num: 4, label: "Offer Acceptance", done: activeApp?.isOfferAccepted || activeApp?.status === "Offer Accepted" },
    { num: 5, label: "Acceptance Fee (₦65,000)", done: acceptanceInvoice?.status === "Paid" },
    { num: 6, label: "Student Matriculation", done: acceptanceInvoice?.status === "Paid" || !!activeApp?.matricNumber },
  ];

  if (!activeApp) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-500">
        No applicants found for this institution.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Profile Card & Candidate Switcher */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-brand-950 to-navy-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-brand-400">
              {activeApp.firstName.charAt(0)}{activeApp.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {activeApp.firstName} {activeApp.lastName} {activeApp.otherNames}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeApp.status === "Offer Accepted"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                      : activeApp.status === "Offer Issued"
                      ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                      : activeApp.status === "Approved"
                      ? "bg-purple-500/20 text-purple-300 border-purple-400/30"
                      : activeApp.status === "Rejected"
                      ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                  }`}
                >
                  {activeApp.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center space-x-2">
                <span className="font-mono text-amber-400 font-bold">{activeApp.applicationNumber}</span>
                <span>•</span>
                <span>B.Sc Computer Science ({activeApp.entryType})</span>
                <span>•</span>
                <span>UTME: {activeApp.utmeScore}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Switch Candidate & Start New Application */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-navy-900/80 border border-navy-700 rounded-xl px-2.5 py-1 flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Demo Candidate:</span>
              <select
                value={activeApp.id}
                onChange={(e) => setActiveApplicantId(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none"
              >
                {applicants.map((a) => (
                  <option key={a.id} value={a.id} className="bg-navy-950 text-white">
                    {a.firstName} {a.lastName} ({a.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setShowApplyModal(true);
                setWizardStep(1);
              }}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Application</span>
            </button>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div className="mt-6 pt-6 border-t border-navy-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((st) => (
            <div
              key={st.num}
              className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 transition-all ${
                st.done
                  ? "bg-brand-900/60 border-brand-500/50 text-white font-bold"
                  : "bg-navy-900/40 border-navy-800 text-slate-400"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  st.done ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                {st.done ? "✓" : st.num}
              </div>
              <span className="truncate">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* POST-ACCEPTANCE STUDENT HANDOVER CARD (Phase 3 Shared Data) */}
      {(activeApp.matricNumber || acceptanceInvoice?.status === "Paid") && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-navy-950 text-white shadow-xl border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Student Matriculation Confirmed & Shared Data Synchronized</span>
            </div>
            <h3 className="text-xl font-black">
              Welcome to {currentInstitution.name}!
            </h3>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Your acceptance fee has been cleared. Your applicant dossier has been converted into the official Student Registry. You have been assigned an official matriculation number and granted 100L student portal credentials.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-3 py-1.5 bg-black/40 rounded-xl border border-emerald-400/40 font-mono text-xs">
                <span className="text-emerald-400">Matric No: </span>
                <strong className="text-white font-black">{activeApp.matricNumber || "GUT/CMP/24/8421"}</strong>
              </div>
              <div className="px-3 py-1.5 bg-black/40 rounded-xl border border-emerald-400/40 font-mono text-xs">
                <span className="text-emerald-400">Access Code: </span>
                <strong className="text-white font-black">{activeCode?.code || "UNI-ACT-8842-X9K"}</strong>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleHandoverToStudent}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 group"
            >
              <UserCheck className="w-4 h-4" />
              <span>Launch Student Portal as {activeApp.firstName}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Offer & Invoices vs Candidate Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Offer Letter & Acceptance Fee Invoice */}
        <div className="lg:col-span-7 space-y-6">
          {/* Provisional Admission Offer Letter */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-sm text-navy-950">
                  Provisional Admission Offer Letter
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Session: 2024/2025
              </span>
            </div>

            {/* Rendered Nigerian University Offer Letter View */}
            <div className="p-5 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-4 text-xs font-serif text-slate-800 shadow-inner">
              <div className="text-center space-y-1 pb-3 border-b border-amber-200">
                <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500 font-sans block">
                  Office of the Registrar • Admissions Division
                </span>
                <h4 className="font-bold text-base text-navy-950 tracking-tight font-sans">
                  {currentInstitution.name.toUpperCase()}
                </h4>
                <p className="text-[11px] text-slate-500 font-sans italic">
                  "{currentInstitution.motto}"
                </p>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Application Reference: <strong className="text-slate-900 font-mono">{activeApp.applicationNumber}</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString()}</strong></span>
                </div>
                <p className="text-slate-800 leading-relaxed">
                  Dear <strong>{activeApp.firstName} {activeApp.lastName}</strong>,
                </p>
                <p className="text-slate-700 leading-relaxed">
                  I am pleased to inform you that the Admissions Board has offered you provisional admission into the <strong>Faculty of Computing & Information Technology</strong> for the undergraduate degree programme leading to the award of:
                </p>
                <div className="p-3 bg-white border border-amber-300 rounded-xl text-center">
                  <span className="text-sm font-black text-brand-900 font-sans">
                    BACHELOR OF SCIENCE (B.SC) IN COMPUTER SCIENCE
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mode of Entry: {activeApp.entryType} • Duration: 4 Academic Sessions
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  This offer is provisional and subject to formal verification of your original credentials (WAEC/NECO Senior School Certificate and JAMB Result Slip). To secure this placement, you are required to formally accept this offer and settle the statutory Acceptance Fee within fourteen (14) days.
                </p>
              </div>

              <div className="pt-3 border-t border-amber-200 flex items-center justify-between font-sans text-xs">
                <div>
                  <span className="block font-bold text-slate-900">Dr. (Mrs.) Kemi Adeleke</span>
                  <span className="text-[10px] text-slate-500">Registrar & Secretary to Senate</span>
                </div>
                <div className="px-2.5 py-1 bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-bold rounded">
                  Official Senate Watermark
                </div>
              </div>
            </div>

            {/* Offer Decision Actions */}
            {activeApp.status === "Offer Issued" && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={handleDecline}
                  className="w-full sm:w-auto px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Decline Offer
                </button>
                <button
                  onClick={handleAccept}
                  className="w-full sm:w-auto px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Accept Provisional Offer</span>
                </button>
              </div>
            )}
          </div>

          {/* Acceptance Fee Billing & Simulation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <CreditCard className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-sm text-navy-950">
                  Admissions Acceptance Fee Ledger
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-brand-700">
                {acceptanceInvoice?.invoiceNumber || "INV-2025-ACC-001"}
              </span>
            </div>

            {acceptanceInvoice ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-navy-950 block">
                      {acceptanceInvoice.description}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Due Date: {acceptanceInvoice.dueDate} • Non-refundable
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-navy-950">
                      {formatCurrency(acceptanceInvoice.amount)}
                    </span>
                    <span
                      className={`block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                        acceptanceInvoice.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {acceptanceInvoice.status === "Paid" ? "Cleared & Verified" : "Payment Pending"}
                    </span>
                  </div>
                </div>

                {acceptanceInvoice.status === "Unpaid" ? (
                  <div className="pt-2 border-t flex justify-end">
                    <button
                      onClick={handlePayAcceptance}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Simulate Acceptance Payment ({formatCurrency(acceptanceInvoice.amount)})</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-semibold">Payment cleared. Reference: {acceptanceInvoice.paymentReference || "PAY-2025-GUT-9912"}</span>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">RECEIPT READY</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center">
                Acceptance fee invoice will generate automatically once the candidate accepts the provisional offer.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidate Screening Dossier & Uploaded Certificates */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <FileCheck className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-sm text-navy-950">Candidate Bio-Data & Qualifications</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">JAMB UTME Aggregate:</span>
                  <span className="font-mono font-black text-brand-800 text-sm">{activeApp.utmeScore} / 400</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">JAMB Reg Number:</span>
                  <span className="font-mono font-bold text-slate-900">{activeApp.jambRegNumber || "202588391024EF"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">State / LGA:</span>
                  <span className="font-semibold text-slate-800">{activeApp.stateOfOrigin} ({activeApp.lga})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-semibold text-slate-800">{activeApp.dateOfBirth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-semibold text-slate-800">{activeApp.email}</span>
                </div>
              </div>

              {/* O'Level Grade Breakdown */}
              <div>
                <span className="font-bold text-navy-950 block mb-1.5">O'Level Grade Summary:</span>
                <div className="p-3 bg-slate-50 rounded-2xl border text-slate-700 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span>English Language</span><strong className="text-emerald-700">A1</strong></div>
                  <div className="flex justify-between"><span>Mathematics</span><strong className="text-emerald-700">A1</strong></div>
                  <div className="flex justify-between"><span>Physics</span><strong className="text-blue-700">B2</strong></div>
                  <div className="flex justify-between"><span>Chemistry</span><strong className="text-blue-700">B3</strong></div>
                  <div className="flex justify-between"><span>Biology</span><strong className="text-blue-700">B2</strong></div>
                </div>
              </div>

              {/* Uploaded Certificates with Modal Preview Trigger */}
              <div>
                <span className="font-bold text-navy-950 block mb-1.5">Screening Credentials:</span>
                <div className="space-y-2">
                  {activeApp.uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setViewingDoc({ title: doc.title, fileName: doc.fileName })}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-semibold text-slate-800 group-hover:text-brand-700 block">{doc.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.fileName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-700 font-bold group-hover:underline flex items-center space-x-0.5">
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW APPLICATION WIZARD MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="font-bold text-navy-950 text-base">New Undergraduate Application Wizard</h3>
                <span className="text-xs text-slate-500">Step {wizardStep} of 4 • {currentInstitution.name}</span>
              </div>
              <button onClick={() => setShowApplyModal(false)}><X className="w-4 h-4" /></button>
            </div>

            {/* Step 1: Personal Details */}
            {wizardStep === 1 && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Damilola"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Last Name (Surname) *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Alabi"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">State of Origin</label>
                    <input
                      type="text"
                      value={stateOfOrigin}
                      onChange={(e) => setStateOfOrigin(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. damilola.alabi@gmail.com"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    disabled={!firstName || !lastName || !email}
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl font-bold"
                  >
                    Next: Simulated Email OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Email Verification */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <Mail className="w-4 h-4 text-blue-700" />
                    <span>Simulated Email OTP Verification</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    In production, a one-time verification passcode is dispatched to <strong>{email}</strong> to validate candidate contact authenticity.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold"
                    >
                      Dispatch Simulated OTP
                    </button>
                    <input
                      type="text"
                      maxLength={4}
                      value={simulatedOtp}
                      onChange={(e) => setSimulatedOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP (e.g. 7392)"
                      className="flex-1 px-3 py-2 border rounded-xl font-mono text-center font-bold tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                    >
                      Verify
                    </button>
                  </div>
                  {emailVerified && (
                    <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Email successfully verified!</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!emailVerified}
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl font-bold"
                  >
                    Next: Academic Qualifications
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Qualifications */}
            {wizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">JAMB UTME Score *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={400}
                      value={utmeScore}
                      onChange={(e) => setUtmeScore(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">JAMB Registration Number</label>
                    <input
                      type="text"
                      value={jambReg}
                      onChange={(e) => setJambReg(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">O'Level Qualifications Summary</label>
                  <input
                    type="text"
                    value={olevelText}
                    onChange={(e) => setOlevelText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Upload SSCE Result Statement</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-brand-50 file:text-brand-700 file:font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Selected: {selectedFileName}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold"
                  >
                    Next: Review & Submit
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {wizardStep === 4 && (
              <form onSubmit={handleFinalSubmitApplication} className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                  <h4 className="font-bold text-navy-950">Review Application Dossier</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Name:</strong> {firstName} {lastName}</div>
                    <div><strong>Email:</strong> {email}</div>
                    <div><strong>UTME Score:</strong> {utmeScore}</div>
                    <div><strong>Programme:</strong> B.Sc Computer Science</div>
                    <div><strong>State:</strong> {stateOfOrigin}</div>
                    <div><strong>SSCE File:</strong> {selectedFileName}</div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                  By submitting this application, you attest that all supplied grades and JAMB UTME scores are authentic and subject to institutional verification.
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 text-slate-600"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-navy-950 text-sm">{viewingDoc.title}</h3>
              </div>
              <button onClick={() => setViewingDoc(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-xl space-y-3 text-xs font-serif text-slate-800 shadow-inner">
              <div className="text-center space-y-1 pb-2 border-b border-amber-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                  Official Nigerian Examination Body Statement
                </span>
                <h4 className="font-bold text-sm text-navy-950 font-sans">{viewingDoc.title.toUpperCase()}</h4>
                <p className="text-[10px] text-slate-500 font-sans">
                  Candidate: <strong>{activeApp.firstName} {activeApp.lastName}</strong>
                </p>
              </div>

              <div className="space-y-1.5 font-sans text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-amber-200">
                  <span className="text-slate-500">Center:</span>
                  <span className="font-semibold text-slate-800">Govt College Secondary Center (014)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-amber-200">
                  <span className="text-slate-500">Candidate No:</span>
                  <span className="font-mono font-bold text-slate-900">42981042GA</span>
                </div>
                <div className="pt-2">
                  <span className="font-bold block text-slate-700 mb-1">Subject Performance:</span>
                  <div className="bg-white p-2.5 rounded border border-amber-200 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between"><span>English Language</span><span className="font-bold text-emerald-700">A1 (Distinction)</span></div>
                    <div className="flex justify-between"><span>Mathematics</span><span className="font-bold text-emerald-700">A1 (Distinction)</span></div>
                    <div className="flex justify-between"><span>Physics</span><span className="font-bold text-emerald-700">B2 (Very Good)</span></div>
                    <div className="flex justify-between"><span>Chemistry</span><span className="font-bold text-emerald-700">B3 (Good)</span></div>
                    <div className="flex justify-between"><span>Biology</span><span className="font-bold text-emerald-700">B2 (Very Good)</span></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200 flex justify-between font-sans text-[10px] text-slate-500">
                <span>Verified via Electronic Council Portal</span>
                <span className="text-emerald-700 font-bold">DIGITAL EMBOSS VALID</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
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
