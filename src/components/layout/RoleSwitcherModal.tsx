"use client";

import React from "react";
import { useDemoStore } from "@/lib/demo-data/store";
import { ROLE_CONFIGS } from "@/config/platform";
import { UserRole } from "@/types";
import {
  X,
  CheckCircle2,
  Users,
  Shield,
  Key,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSwitcherModal({ isOpen, onClose }: RoleSwitcherModalProps) {
  const { currentRole, setCurrentRole } = useDemoStore();

  if (!isOpen) return null;

  const roles = Object.values(ROLE_CONFIGS);

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-brand-100 text-brand-800">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-navy-950">Switch Demo Role</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test every perspective across the university hierarchy without logging out or needing multiple browser sessions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6 max-h-[60vh] overflow-y-auto p-1">
          {roles.map((r) => {
            const isSelected = currentRole === r.role;
            return (
              <div
                key={r.role}
                onClick={() => handleSelectRole(r.role)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-600/20"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${r.color}`}>
                      {r.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-navy-950">{r.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isSelected ? "Current Active Role" : "Click to Enter"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(r.role);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                      isSelected
                        ? "bg-brand-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-brand-600 hover:text-white"
                    } transition-colors`}
                  >
                    {isSelected ? "Active" : "Switch"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>Simulated credentials applied automatically. No actual auth server required.</span>
          </div>
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
