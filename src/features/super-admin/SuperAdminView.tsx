"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Institution } from "@/types";
import {
  Building2,
  Users,
  GraduationCap,
  Banknote,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  History,
  FileSpreadsheet,
  Edit2,
  X,
  Sliders,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function SuperAdminView() {
  const {
    institutions,
    currentInstitutionId,
    setCurrentInstitutionId,
    toggleInstitutionStatus,
    updateInstitution,
    auditEvents,
    resetDemoData,
    setGuidedTourOpen,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"overview" | "tenants" | "analytics" | "audit" | "config">("overview");
  const [selectedInstForEdit, setSelectedInstForEdit] = useState<Institution | null>(null);
  const [editName, setEditName] = useState("");
  const [editMotto, setEditMotto] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Maintenance" | "Registration Closed">("Active");

  // Multi-institution aggregate statistics
  const totalInstitutions = institutions.length;
  const activeTenants = institutions.filter((i) => i.portalStatus === "Active").length;
  const totalStudents = institutions.reduce((sum, i) => sum + i.stats.totalStudents, 0);
  const totalApplicants = institutions.reduce((sum, i) => sum + i.stats.totalApplicants, 0);
  const totalStaff = institutions.reduce((sum, i) => sum + i.stats.totalStaff, 0);
  const totalSimulatedRevenue = institutions.reduce((sum, i) => sum + i.stats.simulatedRevenue, 0);

  // Recharts data
  const tenantRevenueData = institutions.map((inst) => ({
    name: inst.shortName,
    revenue: inst.stats.simulatedRevenue,
    students: inst.stats.totalStudents,
  }));

  const tenantStudentRatio = institutions.map((inst, idx) => ({
    name: inst.shortName,
    value: inst.stats.totalStudents,
    color: idx === 0 ? "#1e40af" : idx === 1 ? "#0f766e" : "#7c2d12",
  }));

  const handleEditClick = (inst: Institution) => {
    setSelectedInstForEdit(inst);
    setEditName(inst.name);
    setEditMotto(inst.motto);
    setEditCity(inst.city);
    setEditStatus(inst.portalStatus);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstForEdit) return;
    updateInstitution(selectedInstForEdit.id, {
      name: editName,
      motto: editMotto,
      city: editCity,
      portalStatus: editStatus,
    });
    setSelectedInstForEdit(null);
  };

  const exportAuditCSV = () => {
    const headers = ["Event ID", "Timestamp", "Actor", "Role", "Institution", "Action", "Outcome", "Reason"];
    const rows = auditEvents.map((e) => [
      e.id,
      e.timestamp,
      `"${e.actor}"`,
      e.actorRole,
      `"${e.institutionName}"`,
      `"${e.action}"`,
      e.outcome,
      `"${e.reason.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `unicore_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Platform Super Administrator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multi-tenant governance, aggregate institutional health, tenant onboarding & global security audit.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setGuidedTourOpen(true)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
          >
            <span>Launch Product Tour</span>
          </button>
          <button
            onClick={resetDemoData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Tenants</span>
            <Building2 className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-black text-navy-950 mt-2">{totalInstitutions}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            {activeTenants} Active Portals
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-navy-950 mt-2">{totalStudents.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 3 seed institutions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Applicants</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-black text-navy-950 mt-2">{totalApplicants.toLocaleString()}</p>
          <span className="text-[11px] text-brand-600 font-semibold mt-1 block">2024/2025 Admissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Academic Staff</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-navy-950 mt-2">{totalStaff.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Lecturers & Officers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Simulated Tuition Revenue</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {formatCurrency(totalSimulatedRevenue)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Aggregated demonstration collections
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Institutional Overview
        </button>
        <button
          onClick={() => setActiveTab("tenants")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "tenants"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tenant Configuration ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "analytics"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Multi-Tenant Revenue Analytics
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "audit"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Global Audit Log ({auditEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "config"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Platform Configuration
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Institutional Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {institutions.map((inst) => {
              const isCurrent = inst.id === currentInstitutionId;
              return (
                <div
                  key={inst.id}
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    isCurrent
                      ? "border-brand-600 shadow-md ring-2 ring-brand-600/10"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm"
                      style={{ backgroundColor: inst.accentColor }}
                    >
                      {inst.code}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inst.portalStatus === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inst.portalStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-navy-950 mt-3">{inst.name}</h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">“{inst.motto}”</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Type:</span>
                      <span className="font-semibold text-slate-900">{inst.type}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Location:</span>
                      <span className="font-semibold text-slate-900">{inst.city}, {inst.state}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Students:</span>
                      <span className="font-semibold text-slate-900">
                        {inst.stats.totalStudents.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Simulated Revenue:</span>
                      <span className="font-semibold text-emerald-700">
                        {formatCurrency(inst.stats.simulatedRevenue)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleEditClick(inst)}
                      className="text-xs text-slate-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Tenant</span>
                    </button>
                    <button
                      onClick={() => setCurrentInstitutionId(inst.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        isCurrent
                          ? "bg-brand-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-brand-600 hover:text-white"
                      }`}
                    >
                      {isCurrent ? "Active Context" : "Switch Context"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Platform Security & Tenancy Info Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 to-brand-950 text-white shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] bg-brand-500 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Multi-Tenant SaaS Architecture
                </span>
                <h3 className="text-base font-bold mt-2">
                  Logical Tenant Isolation & Scalable Academic Operations
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  UniCore segregates candidate pools, bursary ledgers, senate result records, and staff permissions per institution while enabling centralized updates and regulatory compliance across Nigeria.
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0 hidden sm:block" />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Tenants */}
      {activeTab === "tenants" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-950">Managed Higher Education Institutions</h3>
            <span className="text-xs text-slate-500">3 Fictional Seed Tenants Configured</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Institution Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Current Session</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {institutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-brand-700">{inst.code}</td>
                    <td className="p-3">
                      <div className="font-bold text-navy-950">{inst.name}</div>
                      <div className="text-[10px] text-slate-500 italic">{inst.motto}</div>
                    </td>
                    <td className="p-3">{inst.type}</td>
                    <td className="p-3">{inst.city}, {inst.state}</td>
                    <td className="p-3 font-semibold text-slate-700">{inst.currentSession}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.portalStatus === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inst.portalStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(inst)}
                        className="text-xs text-slate-600 hover:text-navy-950 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleInstitutionStatus(inst.id)}
                        className="text-xs text-slate-600 hover:text-navy-950 font-semibold"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => setCurrentInstitutionId(inst.id)}
                        className="text-xs text-brand-600 hover:text-brand-800 font-bold"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Analytics (Recharts Multi-Tenant Comparison) */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-navy-950 mb-1">Simulated Tuition Revenue Comparison</h3>
              <p className="text-xs text-slate-500 mb-4">Total collections across universities, polytechnics, and colleges</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tenantRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-navy-950 mb-1">Enrolled Population Share</h3>
              <p className="text-xs text-slate-500 mb-4">Student headcounts across tenants</p>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tenantStudentRatio}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      label
                    >
                      {tenantStudentRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Global Multi-Tenant Audit Events</h3>
              <p className="text-xs text-slate-500">Chronological trail of mock administrative and academic operations</p>
            </div>
            <button
              onClick={exportAuditCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b sticky top-0">
                <tr>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Actor & Role</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Outcome</th>
                  <th className="p-3">Reason / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{evt.actor}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{evt.actorRole.replace("_", " ")}</div>
                    </td>
                    <td className="p-3 text-slate-700 truncate max-w-[140px]">{evt.institutionName}</td>
                    <td className="p-3 font-semibold text-navy-950">{evt.action}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          evt.outcome === "Success"
                            ? "bg-emerald-100 text-emerald-800"
                            : evt.outcome === "Warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {evt.outcome}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-md">{evt.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Platform Configuration */}
      {activeTab === "config" && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-base text-navy-950">Multi-Tenant Platform Operational Parameters</h3>
          <p className="text-slate-600 leading-relaxed">
            Centralized platform settings enforced across all higher institutions connected to UniCore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border rounded-xl bg-slate-50 space-y-1.5">
              <span className="font-bold text-navy-950 block">Tenant Data Isolation Policy</span>
              <p className="text-slate-600">Row-level isolation tag applied to all queries with institutional ID partitioning.</p>
            </div>
            <div className="p-4 border rounded-xl bg-slate-50 space-y-1.5">
              <span className="font-bold text-navy-950 block">Access-Code Rotation & TTL</span>
              <p className="text-slate-600">30-day default expiry on stage codes. Single-use invalidation upon course submission.</p>
            </div>
            <div className="p-4 border rounded-xl bg-slate-50 space-y-1.5">
              <span className="font-bold text-navy-950 block">NUC CCMAS Compliance Mode</span>
              <p className="text-slate-600">5.0 Maximum Grade Point Average grading engine with mandatory 70/30 weighting.</p>
            </div>
            <div className="p-4 border rounded-xl bg-slate-50 space-y-1.5">
              <span className="font-bold text-navy-950 block">Audit Ledger Append-Only Guarantee</span>
              <p className="text-slate-600">Simulated immutable compliance logging with correlation IDs for all bursary and senate events.</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Institution Modal */}
      {selectedInstForEdit && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Edit Institution Parameters</h3>
              <button type="button" onClick={() => setSelectedInstForEdit(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold block mb-1">Institution Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">City / Campus</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Portal Operational Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Active">Active & Open</option>
                  <option value="Maintenance">Maintenance Mode</option>
                  <option value="Registration Closed">Registration Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setSelectedInstForEdit(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
