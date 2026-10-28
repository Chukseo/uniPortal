"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDemoStore } from "@/lib/demo-data/store";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleSwitcherModal } from "@/components/layout/RoleSwitcherModal";
import { InstitutionSwitcherModal } from "@/components/layout/InstitutionSwitcherModal";
import { GuidedTourModal } from "@/components/layout/GuidedTourModal";
import { DocumentModal } from "@/features/documents/DocumentModal";

import { SuperAdminView } from "@/features/super-admin/SuperAdminView";
import { IctAdminView } from "@/features/ict-admin/IctAdminView";
import { RegistrarView } from "@/features/registrar/RegistrarView";
import { AdmissionsView } from "@/features/admissions/AdmissionsView";
import { FinanceView } from "@/features/finance/FinanceView";
import { FacultyOfficerView } from "@/features/faculty-officer/FacultyOfficerView";
import { LecturerView } from "@/features/lecturer/LecturerView";
import { ExamOfficerView } from "@/features/exam-officer/ExamOfficerView";
import { StudentView } from "@/features/student/StudentView";
import { ApplicantView } from "@/features/applicant/ApplicantView";
import { AuditView } from "@/features/audit/AuditView";
import { UserRole } from "@/types";

export default function DemoPortalPage() {
  const { currentRole, setCurrentRole } = useDemoStore();
  const searchParams = useSearchParams();

  // Read view param if provided
  useEffect(() => {
    const view = searchParams.get("view");
    if (view && view !== currentRole) {
      setCurrentRole(view as UserRole);
    }
  }, [searchParams, currentRole, setCurrentRole]);

  const [activeTab, setActiveTab] = useState("overview");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [instModalOpen, setInstModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docType, setDocType] = useState("offer_letter");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Reset tab on role switch
  useEffect(() => {
    setActiveTab("overview");
  }, [currentRole]);

  const handleOpenDoc = (type: string) => {
    setDocType(type);
    setDocModalOpen(true);
  };

  // Render role-specific view
  const renderCurrentView = () => {
    switch (currentRole) {
      case "super_admin":
        return <SuperAdminView />;
      case "ict_admin":
        return <IctAdminView />;
      case "school_admin":
      case "registrar":
        return <RegistrarView />;
      case "admissions_officer":
        return <AdmissionsView />;
      case "bursar":
        return <FinanceView />;
      case "faculty_officer":
        return <FacultyOfficerView />;
      case "lecturer":
        return <LecturerView />;
      case "exam_officer":
        return <ExamOfficerView />;
      case "student":
        return <StudentView />;
      case "applicant":
        return <ApplicantView />;
      default:
        return <SuperAdminView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar with Switchers */}
      <Navbar
        onOpenRoleModal={() => setRoleModalOpen(true)}
        onOpenInstModal={() => setInstModalOpen(true)}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            currentTab={activeTab}
            onTabChange={setActiveTab}
            onOpenDocModal={handleOpenDoc}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-50 w-64 h-full bg-navy-950">
              <Sidebar
                currentTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false);
                }}
                onOpenDocModal={(type) => {
                  handleOpenDoc(type);
                  setMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <RoleSwitcherModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
      />

      <InstitutionSwitcherModal
        isOpen={instModalOpen}
        onClose={() => setInstModalOpen(false)}
      />

      <GuidedTourModal />

      <DocumentModal
        isOpen={docModalOpen}
        docType={docType}
        onClose={() => setDocModalOpen(false)}
      />
    </div>
  );
}
