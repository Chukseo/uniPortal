"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo-data/store";
import { ROLE_CONFIGS, PLATFORM_INFO } from "@/config/platform";
import {
  Building2,
  Users,
  Compass,
  RotateCcw,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  ExternalLink,
  KeyRound,
} from "lucide-react";

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenInstModal: () => void;
  onOpenVerifyModal?: () => void;
  onToggleSidebar?: () => void;
}

export function Navbar({ onOpenRoleModal, onOpenInstModal, onOpenVerifyModal, onToggleSidebar }: NavbarProps) {
  const {
    currentRole,
    currentInstitution,
    currentUser,
    notifications,
    resetDemoData,
    setGuidedTourOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useDemoStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const roleMeta = ROLE_CONFIGS[currentRole];
  const unreadNotifs = notifications.filter((n) => !n.isRead);

  return (
    <>
      {/* Prominent Demo Mode Notice Banner */}
      <div className="bg-amber-500 text-navy-950 font-medium text-xs md:text-sm px-4 py-1.5 flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-4 h-4 text-navy-950 shrink-0" />
          <span className="font-bold tracking-wide">DEMO MODE:</span>
          <span className="truncate">
            Sample data only. No real payments, accounts, or official academic records are processed.
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0 ml-2">
          <button
            onClick={() => setGuidedTourOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1 bg-navy-950 text-white text-xs px-2.5 py-1 rounded font-semibold hover:bg-navy-900 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Guided Product Tour
          </button>
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center space-x-1 text-navy-950 hover:underline text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-lg bg-brand-800 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:bg-brand-900 transition-colors">
                U
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-navy-950 text-base tracking-tight flex items-center gap-1.5">
                  {PLATFORM_INFO.name}
                  <span className="text-[10px] bg-brand-100 text-brand-800 font-bold px-1.5 py-0.2 rounded">
                    SaaS MVP
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 block truncate max-w-[140px] sm:max-w-none">
                  {currentInstitution.name}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Actions: Switchers */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Institution Switcher Button */}
            <button
              onClick={onOpenInstModal}
              className="inline-flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all shadow-sm"
              title="Switch Demo Institution Context"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              <span className="font-semibold truncate max-w-[160px]">{currentInstitution.shortName}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                {currentInstitution.code}
              </span>
            </button>

            {/* Role Switcher Button */}
            <button
              onClick={onOpenRoleModal}
              className={`inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg border shadow-sm transition-all ${roleMeta.color}`}
              title="Switch Demo User Role"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{roleMeta.title}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                Switch
              </span>
            </button>

            {/* Access Code Verifier Button */}
            {onOpenVerifyModal && (
              <button
                onClick={onOpenVerifyModal}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all shadow-sm"
                title="Verify Stage Access Code"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden lg:inline">Verify Access Code</span>
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Switcher Shortcuts */}
            <div className="flex md:hidden items-center space-x-1">
              <button
                onClick={onOpenInstModal}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Switch Institution"
              >
                <Building2 className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenRoleModal}
                className="p-1.5 rounded-lg bg-brand-700 text-white hover:bg-brand-800"
                title="Switch Role"
              >
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Menu */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-navy-950">Notifications Center</h4>
                      <p className="text-xs text-slate-500">{unreadNotifs.length} unread alerts</p>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No notifications recorded.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.isRead ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-slate-900 block truncate max-w-[130px]">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {roleMeta.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Dialog for Reset Demo Data */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950">Reset Demo Data?</h3>
              <p className="text-sm text-slate-600 mt-1">
                This will clear all in-browser simulated payments, newly issued access codes, course registrations, and score submissions, restoring the pristine seed state.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Yes, Restore Seed State
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
