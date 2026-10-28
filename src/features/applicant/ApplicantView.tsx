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
  Plus,
  X,
  UploadCloud,
  Mail,
  ShieldCheck,
} from "lucide-react";

export function ApplicantView() {
  const {
    currentApplicant,
    currentInstitution,
    invoices,
    accessCodes,
    acceptAdmissionOffer,
    updateApplicationStatus,
    simulatePayment,
    submitNewApplication,
  } = useDemoStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Application Wizard state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("Lagos State");
  const [utmeScore, setUtmeScore] = useState(260);
  const [jambReg, setJambReg] = useState("202588391024EF");
  const [olevelText, setOlevelText] = useState("WAEC: Eng: A1, Math: A1, Phys: B2, Chem: B3, Bio: B2");
  const [selectedFileName, setSelectedFileName] = useState("waec_statement_of_result.pdf");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

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

  const acceptanceInvoice = invoices.find(
    (i) => i.targetId === applicant.id && i.feeCategory === "Acceptance Fee"
  );

  const applicantCodes = accessCodes.filter((c) => c.targetId === applicant.id);
  const activeCode = applicantCodes.find((c) => c.status === "Active");

  const handleAccept = () => {
    acceptAdmissionOffer(applicant.id);
    setFeedback("Provisional admission offer accepted! Proceed to clear Acceptance Fee.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDecline = () => {
    updateApplicationStatus(applicant.id, "Offer Declined", "Applicant formally declined provisional offer.");
    setFeedback("Offer declined. Records updated.");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleFinalSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = submitNewApplication({
      firstName,
      lastName,
      email,
      phone,
      stateOfOrigin,
      utmeScore,
      jambRegNumber: jambReg,
      olevelSummary: olevelText,
      uploadedDocuments: [
        {
          id: `doc-${Date.now()}`,
          title: "Senior School Certificate Examination (SSCE)",
          fileName: selectedFileName,
          fileSize: "1.4 MB",
          uploadedAt: new Date().toISOString(),
          verified: true,
        },
      ],
    });
    setShowApplyModal(false);
    setWizardStep(1);
    setFeedback("New application submitted successfully! Placed in Admissions screening queue.");
    setTimeout(() => setFeedback(null), 4000);
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

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setWizardStep(1);
                setShowApplyModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Application</span>
            </button>
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-xs">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Status</span>
              <span className="text-base font-black text-amber-300 block mt-0.5">{applicant.status}</span>
            </div>
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
                  : applicant.status === "Offer Declined"
                  ? "bg-rose-100 text-rose-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {applicant.status === "Offer Accepted"
                ? "Accepted"
                : applicant.status === "Offer Declined"
                ? "Declined"
                : "Offer Available"}
            </span>
          </div>

          <h4 className="font-bold text-sm text-navy-950">Admission Offer Decision</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have been granted provisional admission into B.Sc Computer Science (100L).
          </p>

          {applicant.status === "Offer Issued" && (
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAccept}
                className="w-full py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Accept Provisional Offer
              </button>
              <button
                onClick={handleDecline}
                className="w-full py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-semibold transition-all"
              >
                Decline Offer
              </button>
            </div>
          )}

          {applicant.status === "Offer Accepted" && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Offer Formally Accepted by Candidate</span>
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

      {/* Interactive 4-Step Application Wizard Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-700 tracking-wider">
                  Interactive Application Form
                </span>
                <h3 className="font-extrabold text-navy-950 text-base">
                  Step {wizardStep} of 4:{" "}
                  {wizardStep === 1
                    ? "Bio-Data & Contact"
                    : wizardStep === 2
                    ? "UTME & Academic Scores"
                    : wizardStep === 3
                    ? "Upload Credentials"
                    : "Simulated Email Verification"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Bio-Data */}
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
                      placeholder="e.g. Babatunde"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Surname *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Adeleke"
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
                    placeholder="e.g. b.adeleke@gmail.com"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">State of Origin</label>
                    <input
                      type="text"
                      value={stateOfOrigin}
                      onChange={(e) => setStateOfOrigin(e.target.value)}
                      placeholder="e.g. Oyo State"
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!firstName || !lastName || !email) return;
                      setWizardStep(2);
                    }}
                    className="px-5 py-2 bg-brand-700 text-white rounded-xl font-bold"
                  >
                    Next: Academic Scores →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Academic Scores */}
            {wizardStep === 2 && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">UTME Score *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={400}
                      value={utmeScore}
                      onChange={(e) => setUtmeScore(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">JAMB Registration No *</label>
                    <input
                      type="text"
                      required
                      value={jambReg}
                      onChange={(e) => setJambReg(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">O'Level Statement of Results *</label>
                  <textarea
                    rows={3}
                    value={olevelText}
                    onChange={(e) => setOlevelText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 bg-brand-700 text-white rounded-xl font-bold"
                  >
                    Next: Upload Documents →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {wizardStep === 3 && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Select your scanned O'Level WAEC/NECO certificate or JAMB result slip. File metadata is safely previewed in your browser.
                </p>

                <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-brand-600 mx-auto" />
                  <span className="font-bold text-navy-950 block">Choose local credential file</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="text-xs text-slate-500 mx-auto"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Selected file: <strong className="text-brand-700">{selectedFileName}</strong>
                  </span>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2 bg-brand-700 text-white rounded-xl font-bold"
                  >
                    Next: Verify Email →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Simulated Email Verification & Final Submit */}
            {wizardStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold">
                    <Mail className="w-4 h-4 text-blue-700" />
                    <span>Simulated Email Verification</span>
                  </div>
                  <p className="text-blue-800 text-[11px] leading-relaxed">
                    A mock 6-digit confirmation PIN (<strong>884210</strong>) has been simulated for {email}. Click Auto-Verify to simulate instantaneous token clearance.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={simulatedOtp}
                    onChange={(e) => setSimulatedOtp(e.target.value)}
                    placeholder="Enter 6-digit PIN..."
                    className="flex-1 px-3 py-2 border rounded-xl font-mono text-center tracking-widest text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSimulatedOtp("884210");
                      setEmailVerified(true);
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl"
                  >
                    Auto-Verify
                  </button>
                </div>

                {emailVerified && (
                  <div className="text-emerald-700 font-bold flex items-center space-x-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Email address verified for candidate dossier!</span>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 text-slate-600 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmitApplication}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
