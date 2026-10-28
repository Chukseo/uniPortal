export interface GradeResult {
  grade: "A" | "B" | "C" | "D" | "E" | "F";
  points: number;
  remark: string;
}

export function calculateGrade(score: number): GradeResult {
  if (score >= 70) return { grade: "A", points: 5, remark: "Distinction / Excellent" };
  if (score >= 60) return { grade: "B", points: 4, remark: "Very Good" };
  if (score >= 50) return { grade: "C", points: 3, remark: "Good" };
  if (score >= 45) return { grade: "D", points: 2, remark: "Fair" };
  if (score >= 40) return { grade: "E", points: 1, remark: "Pass" };
  return { grade: "F", points: 0, remark: "Fail" };
}

export function calculateGPA(
  coursesWithScores: { creditUnits: number; score: number }[]
): { gpa: number; totalCredits: number; totalPoints: number } {
  if (coursesWithScores.length === 0) {
    return { gpa: 0, totalCredits: 0, totalPoints: 0 };
  }

  let totalCredits = 0;
  let totalPoints = 0;

  for (const item of coursesWithScores) {
    const { points } = calculateGrade(item.score);
    totalCredits += item.creditUnits;
    totalPoints += item.creditUnits * points;
  }

  const gpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  return { gpa, totalCredits, totalPoints };
}

export function getDegreeClassification(cgpa: number): "First Class" | "Second Class Upper" | "Second Class Lower" | "Third Class" | "Probation" {
  if (cgpa >= 4.5) return "First Class";
  if (cgpa >= 3.5) return "Second Class Upper";
  if (cgpa >= 2.4) return "Second Class Lower";
  if (cgpa >= 1.5) return "Third Class";
  return "Probation";
}
