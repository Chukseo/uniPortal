"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Invoice, PaymentTransaction, FeeCategory } from "@/types";
import {
  CreditCard,
  Banknote,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  History,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Plus,
  X,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export function FinanceView() {
  const {
    invoices,
    payments,
    students,
    simulatePayment,
    simulateFailedPayment,
    simulateRefundReversal,
    createCustomInvoice,
    currentInstitution,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"invoices" | "transactions" | "trends" | "statement">("invoices");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [reversalReason, setReversalReason] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice form state
  const [invTargetStudentId, setInvTargetStudentId] = useState(students[0]?.id || "");
  const [invCategory, setInvCategory] = useState<FeeCategory>("School Fees");
  const [invDescription, setInvDescription] = useState("Second Semester Statutory Tuition Levy");
  const [invAmount, setInvAmount] = useState(180000);
  const [invDueDate, setInvDueDate] = useState("2025-04-30");

  const [statementStudentId, setStatementStudentId] = useState(students[0]?.id || "");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesInst = !inv.institutionId || inv.institutionId === currentInstitution.id;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.targetName.toLowerCase().includes(search.toLowerCase()) ||
      inv.feeCategory.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesInst && matchesSearch && matchesStatus;
  });

  const totalCollected = invoices
    .filter((i) => (!i.institutionId || i.institutionId === currentInstitution.id) && i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalOutstanding = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  // Simulated Monthly Revenue data for Recharts
  const monthlyRevenueData = [
    { month: "Oct 2024", collections: 420000000, target: 400000000 },
    { month: "Nov 2024", collections: 380000000, target: 350000000 },
    { month: "Dec 2024", collections: 290000000, target: 300000000 },
    { month: "Jan 2025", collections: 460000000, target: 420000000 },
    { month: "Feb 2025", collections: 295000000, target: 310000000 },
  ];

  const handleSimulateSuccess = (invId: string) => {
    simulatePayment(invId);
    setSelectedInvoice(null);
  };

  const handleSimulateFailed = (invId: string) => {
    simulateFailedPayment(invId);
    setSelectedInvoice(null);
  };

  const handleReversal = (invId: string) => {
    if (!reversalReason) return;
    simulateRefundReversal(invId, reversalReason);
    setReversalReason("");
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === invTargetStudentId) || students[0];
    createCustomInvoice({
      targetId: st.id,
      targetName: `${st.firstName} ${st.lastName}`,
      targetEmail: st.email,
      targetType: "student",
      feeCategory: invCategory,
      description: invDescription,
      amount: invAmount,
      dueDate: invDueDate,
    });
    setShowCreateModal(false);
  };

  const selectedStudentForStatement = students.find((s) => s.id === statementStudentId) || students[0];
  const statementInvoices = invoices.filter((i) => i.targetId === selectedStudentForStatement?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Banknote className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Bursary & Simulated Financial Operations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate tuition settlements, acceptance fees, stage unlocks, transaction reconciliation & reversals.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Custom Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Simulated Collections</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{formatCurrency(totalCollected)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Paid in demo state</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Outstanding Receivables</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{formatCurrency(totalOutstanding)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Unpaid invoices</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Invoices Issued</span>
          <p className="text-2xl font-black text-navy-950 mt-1">{invoices.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{payments.length} Transactions logged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "invoices"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Institutional Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "transactions"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab("trends")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "trends"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Collection Analytics & Trends
        </button>
        <button
          onClick={() => setActiveTab("statement")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "statement"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Student Account Statement
        </button>
      </div>

      {/* Tab: Invoices */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by invoice number, payer name, or fee category..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-700"
            >
              <option value="all">All Invoices</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Reversed">Reversed</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Invoice Number</th>
                    <th className="p-3">Target Payer</th>
                    <th className="p-3">Fee Category</th>
                    <th className="p-3">Session</th>
                    <th className="p-3 text-right">Amount (NGN)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Simulation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-brand-700">{inv.invoiceNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-navy-950">{inv.targetName}</div>
                        <div className="text-[10px] text-slate-400">{inv.targetEmail}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{inv.feeCategory}</td>
                      <td className="p-3 text-slate-500">{inv.academicSession}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {inv.amount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.status === "Reversed"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {inv.status === "Unpaid" && (
                          <button
                            onClick={() => handleSimulateSuccess(inv.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                          >
                            Simulate Pay
                          </button>
                        )}
                        {inv.status === "Paid" && (
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold"
                          >
                            Reversal
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Transactions */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-sm text-navy-950">Recorded Payment Transactions</h3>
            <span className="text-xs text-slate-500">{payments.length} Settlements</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                <tr>
                  <th className="p-3">Payment Reference</th>
                  <th className="p-3">Payer Name</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-700">{p.reference}</td>
                    <td className="p-3 font-semibold text-navy-950">{p.payerName}</td>
                    <td className="p-3 text-slate-600">{p.channel}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{formatCurrency(p.amount)}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "Successful"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Trends */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-navy-950 mb-1">Monthly Tuition Collection Trajectory</h3>
            <p className="text-xs text-slate-500 mb-4">Actual collections vs Projected Bursary targets (in NGN)</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `₦${(val / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                  <Area type="monotone" dataKey="collections" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Statement */}
      {activeTab === "statement" && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-navy-950">Select Student Account</h3>
              <p className="text-xs text-slate-500">Generate real-time student ledger statement</p>
            </div>
            <select
              value={statementStudentId}
              onChange={(e) => setStatementStudentId(e.target.value)}
              className="px-3 py-2 border rounded-xl text-xs bg-white text-slate-800"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.matricNumber} — {st.firstName} {st.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h4 className="font-bold text-base text-navy-950">
                  {selectedStudentForStatement.firstName} {selectedStudentForStatement.lastName}
                </h4>
                <p className="font-mono text-xs text-brand-700 font-bold">{selectedStudentForStatement.matricNumber}</p>
                <p className="text-xs text-slate-500">{selectedStudentForStatement.email}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Ledger Obligations</span>
                <span className="font-mono text-xl font-black text-navy-950">
                  {formatCurrency(statementInvoices.reduce((sum, i) => sum + i.amount, 0))}
                </span>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-2.5 border">Invoice #</th>
                  <th className="p-2.5 border">Fee Item</th>
                  <th className="p-2.5 border text-right">Amount (NGN)</th>
                  <th className="p-2.5 border">Status</th>
                  <th className="p-2.5 border">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statementInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-2.5 border font-mono font-bold text-brand-700">{inv.invoiceNumber}</td>
                    <td className="p-2.5 border">{inv.feeCategory} - {inv.description}</td>
                    <td className="p-2.5 border text-right font-mono font-bold">{inv.amount.toLocaleString()}</td>
                    <td className="p-2.5 border font-semibold text-emerald-700">{inv.status}</td>
                    <td className="p-2.5 border font-mono text-[11px] text-slate-500">{inv.paymentReference || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Custom Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoice} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Issue Custom Student Fee Invoice</h3>
              <button type="button" onClick={() => setShowCreateModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold block mb-1">Target Student *</label>
                <select
                  value={invTargetStudentId}
                  onChange={(e) => setInvTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.matricNumber} — {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Fee Category *</label>
                <select
                  value={invCategory}
                  onChange={(e) => setInvCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="School Fees">School Fees / Tuition</option>
                  <option value="Departmental Charges">Departmental Laboratory Levy</option>
                  <option value="Examination Fee">Examination & CBT Center Levy</option>
                  <option value="Hostel Accommodation">Hostel Accommodation</option>
                  <option value="Transcript Fee">Transcript Request Charge</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Invoice Narrative *</label>
                <input
                  type="text"
                  required
                  value={invDescription}
                  onChange={(e) => setInvDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Amount (NGN) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={invAmount}
                    onChange={(e) => setInvAmount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Issue Invoice</button>
            </div>
          </form>
        </div>
      )}

      {/* Reversal Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Simulate Payment Reversal / Refund</h3>
              <button onClick={() => setSelectedInvoice(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-2">
              <p className="text-slate-600">
                Reversing this invoice ({selectedInvoice.invoiceNumber}) will mark transaction as reversed and update student fee clearance status.
              </p>
              <div>
                <label className="font-semibold block mb-1">Reason for Reversal *</label>
                <input
                  type="text"
                  required
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  placeholder="e.g. Duplicate debit charge, Senate fee waiver granted"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReversal(selectedInvoice.id)}
                className="px-4 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
              >
                Execute Reversal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
