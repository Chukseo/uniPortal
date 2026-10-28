"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { AuditEvent } from "@/types";
import {
  History,
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  X,
  Shield,
} from "lucide-react";

export function AuditView() {
  const { auditEvents, institutions } = useDemoStore();

  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const filteredEvents = auditEvents.filter((e) => {
    const matchesSearch =
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase()) ||
      e.correlationId.toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = outcomeFilter === "all" || e.outcome === outcomeFilter;
    const matchesInstitution = institutionFilter === "all" || e.institutionId === institutionFilter;
    return matchesSearch && matchesOutcome && matchesInstitution;
  });

  const warningOrFailureCount = auditEvents.filter((e) => e.outcome !== "Success").length;

  const exportAuditCSV = () => {
    const headers = ["Event ID", "Timestamp", "Actor", "Role", "Institution", "Action", "Outcome", "Reason", "Correlation ID"];
    const rows = filteredEvents.map((e) => [
      e.id,
      e.timestamp,
      `"${e.actor}"`,
      e.actorRole,
      `"${e.institutionName}"`,
      `"${e.action}"`,
      e.outcome,
      `"${e.reason.replace(/"/g, '""')}"`,
      e.correlationId,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
              <History className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Audit Trail & Compliance Ledger
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulated immutable log recording payments, offers, access codes, score amendments, and administrative actions.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Security Integrity Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Tenant Isolation Integrity</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-navy-950 mt-1">100% Compliant</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Logical row-level partitioning intact
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Logged Events</span>
            <History className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-black text-navy-950 mt-1">{auditEvents.length} Entries</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Append-only demonstration store
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Flagged Security Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black text-amber-600 mt-1">{warningOrFailureCount} Anomalies</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Payment retries, score amendments
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
            placeholder="Search by action, actor, reason, or correlation ID..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        <select
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Institutions</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.shortName} ({inst.code})
            </option>
          ))}
        </select>

        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Outcomes</option>
          <option value="Success">Success</option>
          <option value="Warning">Warning</option>
          <option value="Failure">Failure</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-sm text-navy-950">Recorded Events</h3>
          <span className="text-xs text-slate-500">{filteredEvents.length} Audit Entries</span>
        </div>

        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b sticky top-0">
              <tr>
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Institution</th>
                <th className="p-3">Outcome</th>
                <th className="p-3">Details</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-navy-950">{e.actor}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{e.actorRole.replace("_", " ")}</div>
                  </td>
                  <td className="p-3 font-semibold text-brand-700">{e.action}</td>
                  <td className="p-3 text-slate-600 truncate max-w-[140px]">{e.institutionName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.outcome === "Success"
                          ? "bg-emerald-100 text-emerald-800"
                          : e.outcome === "Warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {e.outcome}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-sm truncate">{e.reason}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedEvent(e)}
                      className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-slate-100 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-navy-950 text-sm">Audit Record Details</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)}><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-mono text-slate-400 text-[10px] block">Event ID: {selectedEvent.id}</span>
                <span className="font-mono text-slate-400 text-[10px] block">Correlation ID: {selectedEvent.correlationId}</span>
                <span className="font-mono text-slate-400 text-[10px] block">UTC Timestamp: {selectedEvent.timestamp}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Actor:</strong> {selectedEvent.actor}</div>
                <div><strong>Role:</strong> {selectedEvent.actorRole}</div>
                <div><strong>Action:</strong> {selectedEvent.action}</div>
                <div><strong>Resource Type:</strong> {selectedEvent.resourceType}</div>
                <div><strong>Resource ID:</strong> {selectedEvent.resourceId}</div>
                <div><strong>Outcome:</strong> {selectedEvent.outcome}</div>
              </div>

              <div className="p-3 bg-slate-50 border rounded-lg">
                <strong className="block text-navy-950 mb-1">Reason / Change Narrative:</strong>
                <p className="text-slate-600 leading-relaxed">{selectedEvent.reason}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
