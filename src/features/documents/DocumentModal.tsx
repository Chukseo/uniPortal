"use client";

import React from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Printer, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  docType: string; // 'offer_letter' | 'receipt' | 'registration_slip' | 'transcript'
  onClose: () => void;
}

export function DocumentModal({ isOpen, docType, onClose }: DocumentModalProps) {
  const { currentInstitution, currentStudent, currentApplicant, scores, courses, registrations } = useDemoStore();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const student = currentStudent || {
    matricNumber: "GUT/CMP/22/0452",
    firstName: "Chinonso",
    lastName: "Okonkwo",
    otherNames: "Emeka",
    level: "300L",
    cgpa: 4.62,
    academicStanding: "First Class",
  };

  const applicant = currentApplicant || {
    applicationNumber: "APP/2025/0014",
    firstName: "Amina",
    lastName: "Yusuf",
    programmeId: "prog-1",
  };

  return (
    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 my-8 relative">
        {/* Top Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b mb-6">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-navy-950">Document Slip Generator</h3>
              <p className="text-xs text-slate-500">Live preview generated from active demo state</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="border-4 border-double border-slate-300 p-8 sm:p-10 bg-white relative text-slate-900 font-serif">
          {/* Watermark Notice */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none rotate-[-30deg]">
            <span className="text-6xl sm:text-7xl font-black uppercase text-slate-900 tracking-widest text-center">
              DEMO COPY<br />NOT OFFICIAL
            </span>
          </div>

          {/* Institutional Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-800 relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-navy-950 text-white flex items-center justify-center font-black text-2xl mb-2 shadow-sm font-sans">
              {currentInstitution.code}
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-sans text-navy-950">
              {currentInstitution.name}
            </h1>
            <p className="text-xs italic text-slate-600 mt-0.5">
              “{currentInstitution.motto}”
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              P.M.B. 1002, {currentInstitution.city}, {currentInstitution.state}, Nigeria • portal.{currentInstitution.code.toLowerCase()}.edu.ng
            </p>

            <div className="mt-3 inline-block bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded font-sans">
              DEMO COPY — NOT AN OFFICIAL LEGAL DOCUMENT
            </div>
          </div>

          {/* Document Content Switcher */}
          {docType === "offer_letter" && (
            <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="flex justify-between text-xs font-sans text-slate-600">
                <span>Date: {formatDate(new Date().toISOString())}</span>
                <span>Ref: GUT/ADM/2024/PROV-0014</span>
              </div>

              <div className="mt-4 font-sans">
                <p className="font-bold">{applicant.firstName} {applicant.lastName}</p>
                <p>Application Ref: {applicant.applicationNumber}</p>
                <p>Candidate Email: amina.yusuf2025@gmail.com</p>
              </div>

              <h2 className="text-center font-bold text-base uppercase underline py-2 font-sans">
                PROVISIONAL OFFER OF ADMISSION (2024/2025 ACADEMIC SESSION)
              </h2>

              <p>
                I am pleased to inform you that following your performance in the Unified Tertiary Matriculation Examination (UTME) and subsequent screening exercise, you have been offered provisional admission into the <strong>Faculty of Computing & Information Technology</strong> to pursue a degree programme leading to the award of:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded font-sans font-bold text-center text-sm my-3">
                BACHELOR OF SCIENCE (B.SC) IN COMPUTER SCIENCE — 100 LEVEL
              </div>

              <p>
                This offer is subject to the verification of your qualifications and documents uploaded during application. To confirm acceptance of this offer, you are required to log in to the candidate portal, pay the designated Acceptance Fee of <strong>NGN 65,000</strong> within two (2) weeks, and retrieve your Student Activation Code.
              </p>

              <div className="pt-8 flex justify-between items-end font-sans text-xs">
                <div>
                  <div className="h-8 border-b border-slate-400 w-44"></div>
                  <p className="font-bold mt-1">Barrister Usman Danladi</p>
                  <p className="text-slate-500">Registrar & Secretary to Senate</p>
                </div>
                <div className="text-right">
                  <div className="p-2 border border-slate-300 rounded text-[10px] text-slate-500">
                    Validated via UniCore SaaS Engine<br />
                    Ref: SEC-VERIFY-99841
                  </div>
                </div>
              </div>
            </div>
          )}

          {docType === "receipt" && (
            <div className="mt-6 space-y-4 text-xs sm:text-sm font-sans">
              <h2 className="text-center font-bold text-base uppercase underline py-1">
                OFFICIAL BURSERY PAYMENT RECEIPT
              </h2>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border rounded text-xs">
                <div>
                  <span className="text-slate-500 block">Student Name:</span>
                  <span className="font-bold">{student.firstName} {student.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Matriculation No:</span>
                  <span className="font-mono font-bold">{student.matricNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Transaction Reference:</span>
                  <span className="font-mono font-bold text-brand-700">PAY-2024-GUT-998821</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Date:</span>
                  <span>12th October 2024, 11:20 AM</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200 mt-4">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Session</th>
                    <th className="p-2 border text-right">Amount (NGN)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">Tuition Fee (300L First Semester)</td>
                    <td className="p-2 border">2024/2025</td>
                    <td className="p-2 border text-right font-mono">180,000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Laboratory & Workshop Consumables</td>
                    <td className="p-2 border">2024/2025</td>
                    <td className="p-2 border text-right font-mono">35,000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">Health Services & ICT Infrastructure</td>
                    <td className="p-2 border">2024/2025</td>
                    <td className="p-2 border text-right font-mono">30,000</td>
                  </tr>
                  <tr className="font-bold bg-slate-50">
                    <td colSpan={2} className="p-2 border text-right">TOTAL SETTLED:</td>
                    <td className="p-2 border text-right font-mono text-emerald-700">NGN 245,000</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Simulated Transaction Cleared. Course Registration Entitlement Granted.</span>
              </div>
            </div>
          )}

          {docType === "registration_slip" && (
            <div className="mt-6 space-y-4 text-xs font-sans">
              <h2 className="text-center font-bold text-base uppercase underline py-1">
                SEMESTER COURSE REGISTRATION FORM (2024/2025)
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border rounded text-xs">
                <div><strong>Matric:</strong> {student.matricNumber}</div>
                <div><strong>Name:</strong> {student.firstName} {student.lastName}</div>
                <div><strong>Level:</strong> {student.level}</div>
                <div><strong>Department:</strong> Computer Science</div>
                <div><strong>Semester:</strong> First Semester</div>
                <div><strong>Total Credits:</strong> 19 Units</div>
              </div>

              <table className="w-full text-left border border-slate-200 mt-4">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Course Title</th>
                    <th className="p-2 border text-center">Units</th>
                    <th className="p-2 border">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td className="p-2 border font-mono font-bold">{c.code}</td>
                      <td className="p-2 border">{c.title}</td>
                      <td className="p-2 border text-center font-mono">{c.creditUnits}</td>
                      <td className="p-2 border">{c.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-8 flex justify-between items-end text-xs">
                <div>
                  <div className="h-6 border-b border-slate-400 w-36"></div>
                  <p className="mt-1 font-semibold">Student Signature</p>
                </div>
                <div>
                  <div className="h-6 border-b border-slate-400 w-36"></div>
                  <p className="mt-1 font-semibold">HOD Endorsement</p>
                </div>
                <div>
                  <div className="h-6 border-b border-slate-400 w-36"></div>
                  <p className="mt-1 font-semibold">Faculty Officer</p>
                </div>
              </div>
            </div>
          )}

          {docType === "transcript" && (
            <div className="mt-6 space-y-4 text-xs font-sans">
              <h2 className="text-center font-bold text-base uppercase underline py-1">
                UNOFFICIAL STUDENT ACADEMIC TRANSCRIPT
              </h2>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border rounded text-xs">
                <div><strong>Student:</strong> {student.firstName} {student.lastName}</div>
                <div><strong>Matriculation:</strong> {student.matricNumber}</div>
                <div><strong>Degree:</strong> B.Sc Computer Science</div>
                <div><strong>Current CGPA:</strong> {student.cgpa} ({student.academicStanding})</div>
              </div>

              <table className="w-full text-left border border-slate-200 mt-3 text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">Course</th>
                    <th className="p-2 border text-center">Units</th>
                    <th className="p-2 border text-center">Score</th>
                    <th className="p-2 border text-center">Grade</th>
                    <th className="p-2 border text-center">Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border">CSC 301 — Database Management Systems</td>
                    <td className="p-2 border text-center">3</td>
                    <td className="p-2 border text-center">89</td>
                    <td className="p-2 border text-center font-bold text-emerald-700">A</td>
                    <td className="p-2 border text-center font-mono">15</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">CSC 303 — Operating Systems & Concurrency</td>
                    <td className="p-2 border text-center">3</td>
                    <td className="p-2 border text-center">82</td>
                    <td className="p-2 border text-center font-bold text-emerald-700">A</td>
                    <td className="p-2 border text-center font-mono">15</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">CSC 305 — Data Structures & Algorithms</td>
                    <td className="p-2 border text-center">3</td>
                    <td className="p-2 border text-center">86</td>
                    <td className="p-2 border text-center font-bold text-emerald-700">A</td>
                    <td className="p-2 border text-center font-mono">15</td>
                  </tr>
                  <tr>
                    <td className="p-2 border">CSC 307 — Web Engineering & Cloud</td>
                    <td className="p-2 border text-center">2</td>
                    <td className="p-2 border text-center">78</td>
                    <td className="p-2 border text-center font-bold text-emerald-700">A</td>
                    <td className="p-2 border text-center font-mono">10</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 text-xs">
                <strong>Senate Classification Rule:</strong> GPA calculated as Sum(Units × Points) / Total Units. First Class threshold: ≥ 4.50 CGPA.
              </div>
            </div>
          )}
        </div>

        {/* Footer info (Hidden during print) */}
        <div className="no-print mt-6 pt-4 border-t flex items-center justify-between text-xs text-slate-500">
          <span>Printed on: {new Date().toLocaleString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
