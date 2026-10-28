import { AccessCodeCredential, StageEntitlementKey } from "@/types";

export const STAGE_REQUIREMENTS: Record<
  StageEntitlementKey,
  {
    title: string;
    description: string;
    codePrefix: string;
    requiredPriorStage?: StageEntitlementKey;
    feeRequired?: string;
  }
> = {
  application_submitted: {
    title: "Application Submitted",
    description: "Applicant has submitted their bio-data, qualifications, and programme selection.",
    codePrefix: "APP",
  },
  admission_accepted: {
    title: "Admission Offer Accepted",
    description: "Applicant accepted formal provisional offer of admission.",
    codePrefix: "ADM",
    requiredPriorStage: "application_submitted",
  },
  acceptance_fee_cleared: {
    title: "Acceptance Fee Cleared",
    description: "Institutional acceptance fee simulated payment recorded.",
    codePrefix: "ACC",
    requiredPriorStage: "admission_accepted",
    feeRequired: "Acceptance Fee",
  },
  student_activated: {
    title: "Student Matriculation Activated",
    description: "Applicant transitioned to matriculated student status with assigned matric number.",
    codePrefix: "ACT",
    requiredPriorStage: "acceptance_fee_cleared",
  },
  school_fees_cleared: {
    title: "School Fees Cleared",
    description: "Full or first semester tuition and charges settled.",
    codePrefix: "TUT",
    requiredPriorStage: "student_activated",
    feeRequired: "School Fees",
  },
  course_registration_unlocked: {
    title: "Course Registration Unlocked",
    description: "Access code issued authorizing student to register semester courses.",
    codePrefix: "REG",
    requiredPriorStage: "school_fees_cleared",
  },
  course_registration_completed: {
    title: "Course Registration Completed",
    description: "Student selected courses within allowed credits and submitted for department vetting.",
    codePrefix: "CRS",
    requiredPriorStage: "course_registration_unlocked",
  },
  exam_eligible: {
    title: "Examination Eligibility Confirmed",
    description: "Senate clearance verified; student approved to sit examinations.",
    codePrefix: "EXM",
    requiredPriorStage: "course_registration_completed",
  },
  results_viewable: {
    title: "Semester Results Published",
    description: "Senate examination board published approved course grades and semester GPA.",
    codePrefix: "RES",
    requiredPriorStage: "exam_eligible",
  },
};

export function generateAccessCode(stage: StageEntitlementKey): string {
  const prefix = STAGE_REQUIREMENTS[stage]?.codePrefix || "CODE";
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `UNI-${prefix}-${num}-${suffix}`;
}

export function createAccessCodeCredential(params: {
  institutionId: string;
  targetId: string;
  targetType: "applicant" | "student";
  stage: StageEntitlementKey;
  purpose: string;
}): AccessCodeCredential {
  const code = generateAccessCode(params.stage);
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  return {
    id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    institutionId: params.institutionId,
    targetId: params.targetId,
    targetType: params.targetType,
    code,
    stage: params.stage,
    status: "Active",
    issuedAt: now.toISOString(),
    expiresAt: expiry.toISOString(),
    purpose: params.purpose,
  };
}
