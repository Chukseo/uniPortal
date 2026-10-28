"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { STAGE_REQUIREMENTS } from "@/lib/demo-engine/access-code";
import { AccessCodeCredential } from "@/types";
import {
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface AccessCodeVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessCodeVerifierModal({ isOpen, onClose }: AccessCodeVerifierModalProps) {
  const { accessCodes, verifyAccessCode, students, applicants } = useDemoStore();

  const [inputCode, setInputCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    credential?: AccessCodeCredential;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (codeToVerify?: string) => {
    const target = codeToVerify || inputCode;
    if (!target.trim()) return;
    const res = verifyAccessCode(target.trim());
    setVerificationResult(res);
  };

  const sampleCodes = [
    { label: "Acceptance Pass", code: "UNI-ADM-1042-X8K" },
    { label: "Matriculation Activated", code: "UNI-ACT-8842-X9K" },
    { label: "Course Registration", code: "UNI-REG-4412-M2P" },
    { label: "Exam Docket Pass", code: "UNI-EXM-3312-K7L" },
  ];

  const cred = verificationResult?.credential;
  const stageInfo = cred ? STAGE_REQUIREMENTS[cred.stage] : null;

  // Lookup target holder name
  const holderName = cred
    ? cred.targetType === "student"
      ? students.find((s) => s.id === cred.targetId)?.firstName + " " + students.find((s) => s.id === cred.targetId)?.lastName
      : applicants.find((a) => a.id === cred.targetId)?.firstName + " " + applicants.find((a) => a.id === cred.targetId)?.lastName
    : null;

  return (
    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <KeyRound className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-navy-950 text-base">Stage Access Code Verifier</h3>
              <p className="text-xs text-slate-500">Decoupled credential validation and stage entitlement checker</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-navy-950" /></button>
        </div>

        {/* Quick Sample Buttons */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Test Quick Demonstration Codes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleCodes.map((sc) => (
              <button
                key={sc.code}
                type="button"
                onClick={() => {
                  setInputCode(sc.code);
                  handleVerify(sc.code);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 rounded-lg text-xs font-mono font-bold transition-colors"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Input Form */}
        <div className="flex space-x-2 pt-1">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="e.g. UNI-REG-4412-M2P"
            className="flex-1 px-3.5 py-2.5 border rounded-xl font-mono text-xs font-bold tracking-wider uppercase focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={() => handleVerify()}
            className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Verify Credential
          </button>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className="pt-2 animate-fade-in">
            {verificationResult.valid && cred ? (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Valid Stage Credential</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-mono font-bold text-[10px]">
                    STATUS: {cred.status}
                  </span>
                </div>

                <div className="space-y-1.5 font-sans">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Access Code:</span>
                    <strong className="font-mono text-brand-900">{cred.code}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assigned Holder:</span>
                    <strong className="text-slate-900">{holderName || "Enrolled Candidate"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Target Role:</span>
                    <span className="capitalize font-semibold text-slate-800">{cred.targetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stage Entitlement:</span>
                    <strong className="text-emerald-800">{stageInfo?.title || cred.stage}</strong>
                  </div>
                  <div className="pt-1.5 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-emerald-100">
                    <strong className="text-slate-900 block mb-0.5">Unlocked Capability:</strong>
                    {stageInfo?.description || cred.purpose}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                  <span>Issued: {new Date(cred.issuedAt).toLocaleDateString()}</span>
                  <span>Expires: {new Date(cred.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center space-x-2 text-rose-800 font-bold">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Credential Verification Failed</span>
                </div>
                <p className="text-rose-700 text-[11px]">
                  {verificationResult.error || "The supplied access code could not be verified in the institutional stage registry."}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
