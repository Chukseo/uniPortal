"use client";

import React, { useState } from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import {
  X,
  Building2,
  CheckCircle2,
  Plus,
  MapPin,
  Users,
  GraduationCap,
  Banknote,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InstitutionSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstitutionSwitcherModal({
  isOpen,
  onClose,
}: InstitutionSwitcherModalProps) {
  const {
    institutions,
    currentInstitutionId,
    setCurrentInstitutionId,
    createInstitution,
  } = useDemoStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"University" | "Polytechnic" | "College of Education">("University");
  const [newState, setNewState] = useState("Ogun State");
  const [newCity, setNewCity] = useState("Abeokuta");
  const [newMotto, setNewMotto] = useState("Wisdom, Character & Service");

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setCurrentInstitutionId(id);
    onClose();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    createInstitution({
      name: newName,
      shortName: newShortName || newName.split(" ")[0],
      code: newCode.toUpperCase(),
      type: newType,
      state: newState,
      city: newCity,
      motto: newMotto,
      accentColor: "#1e3a8a",
      currentSession: "2024/2025",
      currentSemester: "First Semester",
      portalStatus: "Active",
    });

    setShowAddModal(false);
    setNewName("");
    setNewCode("");
  };

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-brand-100 text-brand-800">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-navy-950">Multi-Institution Switcher</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrates multi-tenant architecture and tenant data isolation across universities, polytechnics, and colleges.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institutions List */}
        {!showAddModal ? (
          <div className="mt-6 space-y-3.5">
            {institutions.map((inst) => {
              const isSelected = inst.id === currentInstitutionId;
              return (
                <div
                  key={inst.id}
                  onClick={() => handleSelect(inst.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-600/20"
                      : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                      style={{ backgroundColor: inst.accentColor || "#1e40af" }}
                    >
                      {inst.code}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-navy-950">{inst.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          {inst.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-0.5">“{inst.motto}”</p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-2">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{inst.city}, {inst.state}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span>{inst.stats.totalStudents.toLocaleString()} Students</span>
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                          <Banknote className="w-3 h-3" />
                          <span>{formatCurrency(inst.stats.simulatedRevenue)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    {isSelected && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-brand-700 bg-brand-100/70 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(inst.id);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        isSelected
                          ? "bg-brand-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-brand-600 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Switch Context"}
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl text-slate-600 hover:text-brand-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Institution (Demo Tenant)</span>
            </button>
          </div>
        ) : (
          /* Add Institution Form */
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <h4 className="font-bold text-sm text-navy-950 pb-2 border-b">
              Onboard New Higher Institution
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Institution Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anchor University"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Institutional Code *
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. AUL"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Institution Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="University">University</option>
                  <option value="Polytechnic">Polytechnic</option>
                  <option value="College of Education">College of Education</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  State of Location
                </label>
                <input
                  type="text"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Motto / Vision
                </label>
                <input
                  type="text"
                  value={newMotto}
                  onChange={(e) => setNewMotto(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-brand-700 hover:bg-brand-800 text-white rounded-lg shadow-sm"
              >
                Save & Onboard
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tenant data isolation simulated in frontend state.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
