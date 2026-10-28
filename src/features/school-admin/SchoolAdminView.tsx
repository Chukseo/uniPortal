"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { formatCurrency } from "@/lib/utils";
import { UserRole } from "@/types";
import {
  Building2,
  Users,
  GraduationCap,
  Banknote,
  FileCheck,
  CheckCircle2,
  Clock,
  UserX,
  Search,
  Filter,
  Shield,
  X,
  ChevronRight,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function SchoolAdminView() {
  const {
    currentInstitution,
    students,
    applicants,
    invoices,
    staffMembers,
    defermentRequests,
    graduationCandidates,
    approveDeferment,
    rejectDeferment,
    toggleGraduationClearance,
    updateStaffRole,
    addStaffMember,
    updateStudentStatus,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<"overview" | "staff" | "deferments" | "graduation" | "students">("overview");
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [newStaffRole, setNewStaffRole] = useState<UserRole>("lecturer");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // New staff form state
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRank, setNewStaffRank] = useState("Lecturer II");
  const [newStaffRoleSelect, setNewStaffRoleSelect] = useState<UserRole>("lecturer");

  const filteredStaff = staffMembers.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchStaff.toLowerCase()) ||
      s.rank.toLowerCase().includes(searchStaff.toLowerCase()) ||
      s.role.toLowerCase().includes(searchStaff.toLowerCase())
  );

  // Recharts data
  const enrollmentByLevel = [
    { level: "100L", students: students.filter((s) => s.level === "100L").length + 18 },
    { level: "200L", students: students.filter((s) => s.level === "200L").length + 22 },
    { level: "300L", students: students.filter((s) => s.level === "300L").length + 26 },
    { level: "400L", students: students.filter((s) => s.level === "400L").length + 19 },
    { level: "500L", students: 14 },
  ];

  const genderRatio = [
    { name: "Male Students", value: students.filter((s) => s.gender === "Male").length + 55, color: "#2563eb" },
    { name: "Female Students", value: students.filter((s) => s.gender === "Female").length + 48, color: "#ec4899" },
  ];

  const feeClearanceSummary = [
    { name: "Fully Cleared", value: invoices.filter((i) => i.status === "Paid").length, color: "#10b981" },
    { name: "Outstanding", value: invoices.filter((i) => i.status === "Unpaid").length, color: "#f59e0b" },
    { name: "Reversed/Under Query", value: invoices.filter((i) => i.status === "Reversed").length + 1, color: "#ef4444" },
  ];

  const handleUpdateRole = () => {
    if (!selectedStaff) return;
    updateStaffRole(selectedStaff.id, newStaffRole);
    setSelectedStaff(null);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    addStaffMember({
      institutionId: currentInstitution.id,
      staffId: `GUT/ACAD/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone || "+234 800 000 0000",
      role: newStaffRoleSelect,
      rank: newStaffRank,
      status: "Active",
      appointmentDate: new Date().toISOString().split("T")[0],
    });
    setShowAddStaffModal(false);
    setNewStaffName("");
    setNewStaffEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              School Administrator & Executive Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Executive governance of {currentInstitution.name}: Academic operations, staff deployment, deferments, and graduation clearance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1"
          >
            <span>Appoint Staff Member</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs font-semibold block">Total Student Body</span>
          <p className="text-2xl font-black text-navy-950 mt-1">{currentInstitution.stats.totalStudents.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Enrolled & Active</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs font-semibold block">Staff Strength</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{staffMembers.length} Appointed</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Academic & Administrative</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs font-semibold block">Pending Deferments</span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {defermentRequests.filter((d) => d.status === "Pending").length} Requests
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires Senate action</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <span className="text-slate-500 text-xs font-semibold block">Graduating Class</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{graduationCandidates.length} Vetted</p>
          <span className="text-[11px] text-purple-600 font-semibold block mt-1">Senate Convocation</span>
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
          Executive Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab("staff")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "staff"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Staff Directory & Role Assignments ({staffMembers.length})
        </button>
        <button
          onClick={() => setActiveTab("deferments")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "deferments"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Academic Deferments ({defermentRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("graduation")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "graduation"
              ? "border-brand-700 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Graduation Eligibility & Senate Approval ({graduationCandidates.length})
        </button>
      </div>

      {/* Tab: Overview & Analytics */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment by Level Bar Chart */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-navy-950 mb-1">Undergraduate Population by Level</h3>
              <p className="text-xs text-slate-500 mb-4">Sample distribution across academic tiers</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentByLevel}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Distribution Donut */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="font-bold text-sm text-navy-950 mb-1">Student Gender Ratio</h3>
              <p className="text-xs text-slate-500 mb-4">Institutional diversity breakdown</p>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderRatio}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      label
                    >
                      {genderRatio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Institutional Highlights Card */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-lg space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Executive Senate Briefing</span>
            </div>
            <h3 className="text-base font-bold">2024/2025 First Semester Operating Parameters</h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Senate examination regulations are actively enforced. All faculties have completed course allocations, bursary tuition collection has reached 82% clearance, and provisional admission offers for UTME candidates are 76% accepted.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Staff Directory */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
                placeholder="Search staff by name, rank, or functional role..."
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Staff ID</th>
                    <th className="p-3">Staff Full Name</th>
                    <th className="p-3">Designation / Rank</th>
                    <th className="p-3">Functional Role</th>
                    <th className="p-3">Appointed Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-700">{st.staffId}</td>
                      <td className="p-3">
                        <div className="font-bold text-navy-950">{st.fullName}</div>
                        <div className="text-[10px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">{st.rank}</td>
                      <td className="p-3">
                        <span className="capitalize font-semibold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded text-[11px]">
                          {st.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{st.appointmentDate}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {st.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedStaff(st);
                            setNewStaffRole(st.role);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg text-xs font-bold"
                        >
                          Reassign Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Deferments */}
      {activeTab === "deferments" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-sm text-navy-950">Academic Session Deferment Applications</h3>
              <span className="text-xs text-slate-500">{defermentRequests.length} Applications</span>
            </div>

            <div className="divide-y divide-slate-100">
              {defermentRequests.map((d) => (
                <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-brand-700 text-xs">{d.matricNumber}</span>
                      <span className="font-bold text-navy-950 text-xs">{d.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.status === "Declined"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Reason:</strong> {d.reason}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Session: {d.academicSession} ({d.semester}) • Submitted: {new Date(d.submittedAt).toLocaleDateString()}
                    </p>
                    {d.decisionNote && (
                      <p className="text-[11px] text-brand-700 italic">Senate Note: {d.decisionNote}</p>
                    )}
                  </div>

                  {d.status === "Pending" && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => rejectDeferment(d.id, "Medical evidence insufficient")}
                        className="px-3 py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => approveDeferment(d.id, "Approved by Senate Board")}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                      >
                        Approve Deferment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Graduation & Senate Approval */}
      {activeTab === "graduation" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-navy-950">Senate Final Clearance & Degree Classification List</h3>
                <p className="text-xs text-slate-500">All four clearances (Library, Bursary, Department, Senate) required for convocation</p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-800 font-bold px-3 py-1 rounded-lg border border-purple-200">
                2024/2025 Convocation
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b">
                  <tr>
                    <th className="p-3">Matric No</th>
                    <th className="p-3">Graduating Candidate</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">CGPA</th>
                    <th className="p-3">Award Category</th>
                    <th className="p-3 text-center">Library</th>
                    <th className="p-3 text-center">Bursary</th>
                    <th className="p-3 text-center">Department</th>
                    <th className="p-3 text-center">Senate Confirmed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {graduationCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-brand-700">{c.matricNumber}</td>
                      <td className="p-3 font-bold text-navy-950">{c.studentName}</td>
                      <td className="p-3 text-slate-600">{c.programmeName}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{c.cgpa.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                          {c.classOfDegree}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "libraryClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.libraryClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.libraryClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "bursaryClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.bursaryClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.bursaryClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "departmentClearance")}
                          className={`w-6 h-6 rounded-md font-bold text-xs inline-flex items-center justify-center ${
                            c.departmentClearance ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.departmentClearance ? "✓" : "✗"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleGraduationClearance(c.id, "senateApproval")}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${
                            c.senateApproval
                              ? "bg-purple-700 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-purple-50"
                          }`}
                        >
                          {c.senateApproval ? "Senate Confirmed" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Staff Role Reassignment Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Reassign Functional Staff Role</h3>
              <button onClick={() => setSelectedStaff(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-bold text-navy-950">{selectedStaff.fullName}</span>
                <div className="text-slate-500 font-mono">{selectedStaff.staffId} • {selectedStaff.rank}</div>
              </div>

              <div>
                <label className="font-semibold block mb-1">New System Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                >
                  <option value="lecturer">Lecturer / Academic Staff</option>
                  <option value="faculty_officer">Faculty Officer</option>
                  <option value="exam_officer">Examination Officer</option>
                  <option value="admissions_officer">Admissions Officer</option>
                  <option value="bursar">Bursar / Finance Officer</option>
                  <option value="registrar">University Registrar</option>
                  <option value="ict_admin">School ICT Administrator</option>
                </select>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Reassigning this role updates mock system access permissions and will be logged in the global audit ledger.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button onClick={() => setSelectedStaff(null)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button onClick={handleUpdateRole} className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Update Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateStaff} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-navy-950 text-sm">Appoint New Institutional Staff</h3>
              <button type="button" onClick={() => setShowAddStaffModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-3">
              <div>
                <label className="font-semibold block mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Dr. Ngozi Chidi"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="e.g. n.chidi@greenfield.edu.ng"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Academic / Administrative Rank</label>
                <input
                  type="text"
                  value={newStaffRank}
                  onChange={(e) => setNewStaffRank(e.target.value)}
                  placeholder="e.g. Lecturer I, Assistant Registrar"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Functional Portal Role</label>
                <select
                  value={newStaffRoleSelect}
                  onChange={(e) => setNewStaffRoleSelect(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="lecturer">Lecturer / Academic Staff</option>
                  <option value="faculty_officer">Faculty Officer</option>
                  <option value="exam_officer">Examination Officer</option>
                  <option value="admissions_officer">Admissions Officer</option>
                  <option value="bursar">Bursar / Finance Officer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg">Appoint Staff</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
