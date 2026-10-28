"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { UserRole } from "@/types";
import {
  Settings,
  Calendar,
  Building,
  GraduationCap,
  KeyRound,
  Megaphone,
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Users,
  Award,
  Shield,
  Edit2,
} from "lucide-react";

export function IctAdminView() {
  const {
    currentInstitution,
    sessions,
    faculties,
    departments,
    programmes,
    announcements,
    staffMembers,
    gradingPolicy,
    auditEvents,
    addFaculty,
    addDepartment,
    addProgramme,
    addSession,
    addAnnouncement,
    updateStaffRole,
    updateGradingPolicy,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<
    "sessions" | "faculties" | "programmes" | "policy" | "grading" | "staff" | "announcements"
  >("sessions");

  // Modal states
  const [modalType, setModalType] = useState<"faculty" | "dept" | "prog" | "session" | "announcement" | "grading" | null>(null);

  // Form states
  const [facName, setFacName] = useState("");
  const [facCode, setFacCode] = useState("");
  const [facDean, setFacDean] = useState("");

  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptFacId, setDeptFacId] = useState(faculties[0]?.id || "");
  const [deptHod, setDeptHod] = useState("");

  const [progName, setProgName] = useState("");
  const [progCode, setProgCode] = useState("");
  const [progDeptId, setProgDeptId] = useState(departments[0]?.id || "");
  const [progDegree, setProgDegree] = useState<"B.Sc" | "B.Eng" | "B.A">("B.Sc");
  const [progDuration, setProgDuration] = useState(4);

  const [sessName, setSessName] = useState("2025/2026");
  const [sessStart, setSessStart] = useState("2025-10-01");
  const [sessEnd, setSessEnd] = useState("2026-07-31");

  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annAudience, setAnnAudience] = useState<"All" | "Students" | "Lecturers">("All");

  // Grading Policy Form State
  const [policyMaxCa, setPolicyMaxCa] = useState(gradingPolicy.maxCaMarks || 30);
  const [policyMaxExam, setPolicyMaxExam] = useState(gradingPolicy.maxExamMarks || 70);
  const [policyMinPass, setPolicyMinPass] = useState(gradingPolicy.minPassScore || 40);

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName || !facCode) return;
    addFaculty({
      institutionId: currentInstitution.id,
      name: facName,
      code: facCode.toUpperCase(),
      deanName: facDean || "Dr. Assigned Dean",
      description: "Newly established faculty unit.",
    });
    setModalType(null);
    setFacName("");
    setFacCode("");
    setFacDean("");
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode) return;
    addDepartment({
      institutionId: currentInstitution.id,
      facultyId: deptFacId || faculties[0]?.id,
      name: deptName,
      code: deptCode.toUpperCase(),
      hodName: deptHod || "Assigned Ag. HOD",
    });
    setModalType(null);
    setDeptName("");
    setDeptCode("");
  };

  const handleAddProg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName || !progCode) return;
    addProgramme({
      institutionId: currentInstitution.id,
      departmentId: progDeptId || departments[0]?.id,
      name: progName,
      code: progCode.toUpperCase(),
      degreeType: progDegree,
      durationYears: progDuration,
      entryRequirements: "5 O'Level credits including Mathematics and English.",
    });
    setModalType(null);
    setProgName("");
    setProgCode("");
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessName) return;
    addSession(sessName, sessStart, sessEnd);
    setModalType(null);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    addAnnouncement(annTitle, annContent, annAudience);
    setModalType(null);
    setAnnTitle("");
    setAnnContent("");
  };

  const handleSaveGradingPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateGradingPolicy({
      maxCaMarks: policyMaxCa,
      maxExamMarks: policyMaxExam,
      minPassScore: policyMinPass,
    });
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              School ICT Administrator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Academic structure, session timelines, curricula, grading rules, and access-code policy for {currentInstitution.name}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModalType("announcement")}
            className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("sessions")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "sessions"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Sessions & Semesters
        </button>
        <button
          onClick={() => setActiveTab("faculties")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "faculties"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Faculties & Departments
        </button>
        <button
          onClick={() => setActiveTab("programmes")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "programmes"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Degree Programmes
        </button>
        <button
          onClick={() => setActiveTab("grading")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "grading"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Grading Scale Configuration
        </button>
        <button
          onClick={() => setActiveTab("policy")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "policy"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Access-Code Policy Engine
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "staff"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Staff Account Roles ({staffMembers.length})
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "announcements"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Campus Announcements
        </button>
      </div>

      {/* Tab: Sessions */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Academic Sessions</h3>
            <button
              onClick={() => setModalType("session")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Configure New Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-5 rounded-2xl bg-white border ${
                  sess.isCurrent
                    ? "border-brand-600 shadow-md ring-2 ring-brand-600/10"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-black text-navy-950">{sess.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sess.isCurrent ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {sess.isCurrent ? "Active Session" : sess.status}
                  </span>
                </div>
                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>Commenced: {sess.startDate}</div>
                  <div>Scheduled Conclusion: {sess.endDate}</div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    First Semester course registration window is currently open.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Faculties */}
      {activeTab === "faculties" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Faculties ({faculties.length})</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setModalType("faculty")}
                className="px-3 py-1.5 bg-brand-700 text-white hover:bg-brand-800 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Faculty</span>
              </button>
              <button
                onClick={() => setModalType("dept")}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faculties.map((fac) => {
              const depts = departments.filter((d) => d.facultyId === fac.id);
              return (
                <div key={fac.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                      {fac.code}
                    </span>
                    <span className="text-xs text-slate-400">{depts.length} Departments</span>
                  </div>
                  <h4 className="font-bold text-sm text-navy-950 mt-2">{fac.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Dean: {fac.deanName}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Academic Departments:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {depts.map((d) => (
                        <span
                          key={d.id}
                          className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {d.name} ({d.code})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Programmes */}
      {activeTab === "programmes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Accredited Degree Programmes</h3>
            <button
              onClick={() => setModalType("prog")}
              className="px-3 py-1.5 bg-brand-700 text-white hover:bg-brand-800 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree Programme</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Curriculum Code</th>
                  <th className="p-3">Programme Title</th>
                  <th className="p-3">Degree Award</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Admission Entry Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programmes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">{p.code}</td>
                    <td className="p-3 font-bold text-navy-950">{p.name}</td>
                    <td className="p-3">{p.degreeType}</td>
                    <td className="p-3">{p.durationYears} Years</td>
                    <td className="p-3 text-slate-500 max-w-sm">{p.entryRequirements}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Grading Scale Configuration */}
      {activeTab === "grading" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Senate Grading Scale & Score Cutoff Policy</h3>
              <p className="text-xs text-slate-500">Configures maximum assessment marks and letter grade boundary benchmarks</p>
            </div>
            <button
              onClick={() => setModalType("grading")}
              className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Senate Weightings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">Continuous Assessment (CA) Max</span>
              <p className="text-2xl font-black text-navy-950 mt-1">{gradingPolicy.maxCaMarks} Marks</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Tests, quizzes, laboratory practicals</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">Examination Marks Max</span>
              <p className="text-2xl font-black text-navy-950 mt-1">{gradingPolicy.maxExamMarks} Marks</p>
              <span className="text-[11px] text-slate-400 mt-1 block">End of semester written exam</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-xs font-semibold block">Minimum Pass Score</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{gradingPolicy.minPassScore}%</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Minimum benchmark for Grade E</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b">
              <h4 className="font-bold text-sm text-navy-950">Active NUC 5-Point Grade Mapping</h4>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Letter Grade</th>
                  <th className="p-3">Score Range</th>
                  <th className="p-3 text-center">Grade Points</th>
                  <th className="p-3">Academic Classification Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradingPolicy.scales.map((s) => (
                  <tr key={s.grade} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-navy-950 text-sm">{s.grade}</td>
                    <td className="p-3 font-mono">{s.minScore}% – {s.maxScore}%</td>
                    <td className="p-3 text-center font-mono font-bold text-brand-700">{s.points}</td>
                    <td className="p-3 font-medium text-slate-700">{s.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Policy */}
      {activeTab === "policy" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-navy-950 font-bold text-sm">
              <KeyRound className="w-5 h-5 text-brand-600" />
              <span>Central Access-Code Lifecycle & Entitlement Policy Rules</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In UniCore, credentials, payment records, and stage entitlements are managed separately. Issuing a new registration access code revokes previously active single-use codes while permanently preserving previously achieved entitlements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-bold text-navy-950 block">Stage 1: Admission Offer</span>
                <p className="text-slate-600 mt-1">Requires screening approval. Generates code prefix: <code>UNI-ADM-...</code></p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-bold text-navy-950 block">Stage 2: Acceptance Fee Settlement</span>
                <p className="text-slate-600 mt-1">Simulated clearance of Acceptance invoice. Unlocks matriculation activation.</p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-bold text-navy-950 block">Stage 3: School Fees Settlement</span>
                <p className="text-slate-600 mt-1">Simulated clearance of School Fees. Issues course registration code: <code>UNI-REG-...</code></p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="font-bold text-navy-950 block">Stage 4: Examination Clearance</span>
                <p className="text-slate-600 mt-1">Requires approved course registration between 12-24 credit units. Generates: <code>UNI-EXM-...</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Staff Roles */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-sm text-navy-950">Staff Accounts & System Role Mapping</h3>
            <span className="text-xs text-slate-500">{staffMembers.length} Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Rank / Title</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Appointed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffMembers.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">{st.staffId}</td>
                    <td className="p-3 font-bold text-navy-950">{st.fullName}</td>
                    <td className="p-3 text-slate-600">{st.rank}</td>
                    <td className="p-3">
                      <span className="capitalize font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                        {st.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{st.appointmentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Active Institutional Bulletins</h3>
            <button
              onClick={() => setModalType("announcement")}
              className="px-3 py-1.5 bg-brand-700 text-white hover:bg-brand-800 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                    Target: {a.targetAudience}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(a.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-navy-950 mt-1.5">{a.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.content}</p>
                <div className="text-[11px] text-slate-400 mt-2">
                  Published by: {a.authorName} ({a.authorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Grading Policy Modal */}
      {modalType === "grading" && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveGradingPolicy} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Configure Senate Grading Policy</h3>
              <button type="button" onClick={() => setModalType(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Max CA Marks</label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={policyMaxCa}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setPolicyMaxCa(v);
                      setPolicyMaxExam(100 - v);
                    }}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Max Exam Marks</label>
                  <input
                    type="number"
                    min={50}
                    max={90}
                    value={policyMaxExam}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setPolicyMaxExam(v);
                      setPolicyMaxCa(100 - v);
                    }}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Minimum Pass Score (Grade E Cutoff %)</label>
                <input
                  type="number"
                  min={30}
                  max={50}
                  value={policyMinPass}
                  onChange={(e) => setPolicyMinPass(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
                Total: <strong>{policyMaxCa + policyMaxExam} Marks (100%)</strong>. Changes immediately update lecturer grading limits and Senate pass/fail calculations.
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Apply Policy</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Faculty Modal */}
      {modalType === "faculty" && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddFaculty} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Add New Faculty</h3>
              <button type="button" onClick={() => setModalType(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="e.g. Faculty of Law"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Faculty Code *</label>
                <input
                  type="text"
                  required
                  value={facCode}
                  onChange={(e) => setFacCode(e.target.value)}
                  placeholder="e.g. FLAW"
                  className="w-full px-3 py-2 border rounded-lg uppercase"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Dean's Name</label>
                <input
                  type="text"
                  value={facDean}
                  onChange={(e) => setFacDean(e.target.value)}
                  placeholder="e.g. Prof. O. Adebayo"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Save Faculty</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Announcement Modal */}
      {modalType === "announcement" && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddAnnouncement} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Broadcast Campus Bulletin</h3>
              <button type="button" onClick={() => setModalType(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Senate Resumption Date"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Target Audience</label>
                <select
                  value={annAudience}
                  onChange={(e) => setAnnAudience(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="All">All University Community</option>
                  <option value="Students">Undergraduate Students</option>
                  <option value="Lecturers">Academic Staff & Lecturers</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Enter official announcement statement..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setModalType(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Publish Notice</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
