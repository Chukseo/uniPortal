"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency, formatDate } from "@/lib/utils";
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
} from "lucide-react";

export function SuperAdminView() {
  const {
    institutions,
    currentInstitutionId,
    setCurrentInstitutionId,
    toggleInstitutionStatus,
    auditEvents,
    resetDemoData,
    setGuidedTourOpen,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"overview" | "tenants" | "audit">("overview");

  // Multi-institution aggregate statistics
  const totalInstitutions = institutions.length;
  const activeTenants = institutions.filter((i) => i.portalStatus === "Active").length;
  const totalStudents = institutions.reduce((sum, i) => sum + i.stats.totalStudents, 0);
  const totalApplicants = institutions.reduce((sum, i) => sum + i.stats.totalApplicants, 0);
  const totalStaff = institutions.reduce((sum, i) => sum + i.stats.totalStaff, 0);
  const totalSimulatedRevenue = institutions.reduce((sum, i) => sum + i.stats.simulatedRevenue, 0);

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
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "overview"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Institutional Breakdown
        </button>
        <button
          onClick={() => setActiveTab("tenants")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "tenants"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Tenant Configuration ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "audit"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Platform Audit Log ({auditEvents.length})
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
                      onClick={() => toggleInstitutionStatus(inst.id)}
                      className="text-xs text-slate-500 hover:text-navy-950 font-medium"
                    >
                      Toggle Status
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
    </div>
  );
}
