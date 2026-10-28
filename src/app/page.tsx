"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PLATFORM_INFO, ROLE_CONFIGS } from "@/config/platform";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  CreditCard,
  KeyRound,
  FileCheck,
  Award,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Mail,
  Phone,
  Sparkles,
  ChevronDown,
  BookOpen,
  Calendar,
  Lock,
} from "lucide-react";

export default function MarketingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactInst, setContactInst] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setContactSubmitted(true);
  };

  const faqs = [
    {
      q: "Does this interactive demonstration require a database or server setup?",
      a: "No. This MVP is a 100% frontend interactive demonstration. All institutional models, applicant records, Bursary payment simulations, and Senate grading calculations run directly in your browser. You can deploy it instantly to Vercel with zero environment secrets.",
    },
    {
      q: "How does the Access-Code Lifecycle and progression engine operate?",
      a: "In UniCore, credentials, financial payments, and stage entitlements are cleanly decoupled. For instance, settling an acceptance fee grants the matriculation entitlement and issues a student access code, while preserving previously earned qualifications. Access codes can be expired, verified, or revoked without destroying student history.",
    },
    {
      q: "Can UniCore support universities, polytechnics, and colleges of education?",
      a: "Yes. The multi-tenant architecture supports degree-awarding universities (B.Sc, B.Eng), polytechnics (ND, HND), and colleges of education (NCE) with customizable semester structures, credit requirements (e.g. 12-24 units), and assessment weights (30% CA, 70% Exam).",
    },
    {
      q: "Are the payments real or connected to payment gateways?",
      a: "All financial transactions are strictly simulated within demo state. No real bank accounts, cards, or fintech APIs (e.g. Paystack, Flutterwave) are connected. It allows presenters to simulate successful settlements, failed transactions, and Bursary reversals risk-free.",
    },
    {
      q: "How does tenant isolation work across multiple institutions?",
      a: "The Super Administrator can seamlessly switch between Greenfield University, Royal Crest Polytechnic, and Excellence College of Education. In this demo, tenant isolation is simulated in memory and browser storage to show prospective clients how multi-campus systems operate.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Demo Disclaimer Ribbon */}
      <div className="bg-navy-950 text-amber-400 font-semibold text-xs py-2 px-4 text-center tracking-wide border-b border-navy-900">
        <span>DEMONSTRATION PROTOTYPE:</span> All institutional names, student profiles, and financial transactions are fictional simulations.
      </div>

      {/* Main Marketing Navigation */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              U
            </div>
            <div>
              <span className="font-extrabold text-navy-950 text-xl tracking-tight block">
                {PLATFORM_INFO.name}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Higher Education SaaS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-brand-700 transition-colors">Features</a>
            <a href="#roles" className="hover:text-brand-700 transition-colors">Role Portals</a>
            <a href="#workflow" className="hover:text-brand-700 transition-colors">Lifecycle Workflow</a>
            <a href="#institutions" className="hover:text-brand-700 transition-colors">Multi-Tenant</a>
            <a href="#faq" className="hover:text-brand-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/demo/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-navy-950 hover:bg-slate-100 rounded-xl transition-all"
            >
              Demo Login
            </Link>
            <Link
              href="/demo/portal?view=super_admin"
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
            >
              <span>Explore Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200 text-brand-800 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Built for Nigerian Universities, Polytechnics & Colleges of Education</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Unified Digital Infrastructure for Higher Education Excellence
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From online UTME candidate screening to Senate result publication, bursary reconciliation, and stage-by-stage access code progression.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo/portal?view=super_admin"
              className="w-full sm:w-auto px-8 py-4 bg-brand-700 hover:bg-brand-800 text-white rounded-2xl text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Live Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo/login"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>Select Preconfigured Role</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Backend / Instant Vercel Deploy</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>11 Preconfigured Institutional Roles</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multi-Tenant Architecture</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit Ledger & Stage Progression</span>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block">
              Core Platform Capabilities
            </span>
            <h2 className="text-3xl font-black text-navy-950 mt-2 tracking-tight">
              Purpose-Engineered for Higher Education Workflows
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Designed around the operational realities of Nigerian institutions, Senate regulations, Bursary requirements, and faculty management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Admissions & Screening</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                UTME scores, JAMB verification, O'Level credentials review, provisional admission offers, and acceptance clearance tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Access-Code Progression Engine</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Decoupled credentials, payment verification, and stage entitlements ensuring students only unlock registration when fees are cleared.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Bursary & Fee Reconciliation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Tuition, acceptance, hostel, and departmental invoices with simulated settlements, reference searches, and reversal audit trails.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Course Registration & Credit Rules</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                NUC-compliant credit limit enforcement (12-24 units), faculty course vetting, and downloadable registration slips.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Senate Results & GPA Calculations</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Lecturer CA (30%) & Exam (70%) entry, Senate Examination approval queue, publishing, and versioned result amendments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-navy-950">Audit Trails & Security</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Full chronological ledger recording actor identities, action timestamps, outcomes, and change summaries with CSV export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Portals Showcase */}
      <section id="roles" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block">
              Multi-Role Demonstrations
            </span>
            <h2 className="text-3xl font-black text-navy-950 mt-2 tracking-tight">
              11 Preconfigured Stakeholder Experiences
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Every persona in the university hierarchy has a dedicated, tailored dashboard. Switch roles instantly without logging out.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {Object.values(ROLE_CONFIGS).map((r) => (
              <Link
                key={r.role}
                href={`/demo/portal?view=${r.role}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.color}`}>
                      {r.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-navy-950 mt-3 group-hover:text-brand-700">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {r.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-brand-600">
                  Open Interactive View →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admission to Graduation Workflow Visualization */}
      <section id="workflow" className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              The UniCore Pipeline
            </span>
            <h2 className="text-3xl font-black text-white mt-2 tracking-tight">
              Admission-to-Graduation Workflow
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              How applicants transition to matriculated students, complete semester cycles, and graduate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-14">
            {[
              { step: "01", title: "Screening & Offer", desc: "UTME review, verification, and provisional admission offer." },
              { step: "02", title: "Acceptance & Code", desc: "Simulated acceptance payment issues student matriculation code." },
              { step: "03", title: "Tuition & Courses", desc: "School fees settlement unlocks course registration (12-24 units)." },
              { step: "04", title: "CA & Examination", desc: "Lecturer score entry (30/70) & Senate Examination approval." },
              { step: "05", title: "Senate Publishing", desc: "GPA/CGPA computation, degree classification, and transcripts." },
            ].map((st) => (
              <div key={st.step} className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="font-mono text-2xl font-black text-amber-400 block mb-2">{st.step}</span>
                <h4 className="font-bold text-sm text-white">{st.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-black text-navy-950 mt-2 tracking-tight">
              Platform Architecture & Demo Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-navy-950 hover:bg-slate-100 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      faqOpen === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Demo / Contact Section */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-navy-950">Request Institutional Presentation</h2>
          <p className="text-xs text-slate-600 mt-2">
            Interested in demonstrating UniCore to your Governing Council, Senate, or ICT Board?
          </p>

          {contactSubmitted ? (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
              Thank you! Your simulated presentation request has been logged in demonstration state.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="mt-6 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Full Name & Designation"
                  className="px-3.5 py-2.5 border rounded-xl bg-white"
                />
                <input
                  type="text"
                  required
                  value={contactInst}
                  onChange={(e) => setContactInst(e.target.value)}
                  placeholder="Institution Name (e.g. Federal Poly...)"
                  className="px-3.5 py-2.5 border rounded-xl bg-white"
                />
              </div>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Institutional Email Address"
                className="w-full px-3.5 py-2.5 border rounded-xl bg-white"
              />
              <button
                type="submit"
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-md transition-all"
              >
                Submit Demo Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-12 border-t border-navy-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-base">
              U
            </div>
            <div>
              <span className="font-bold text-white text-sm block">{PLATFORM_INFO.name}</span>
              <span className="text-[10px] text-slate-500">University Management Platform • Frontend MVP</span>
            </div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500 leading-relaxed max-w-md">
            Demo Copy • All institutions, student records, and matriculation identifiers are fictional. No real payments or credentials processed.
          </div>
        </div>
      </footer>
    </div>
  );
}
