import test from "node:test";
import assert from "node:assert/strict";

// Re-implement or test pure functions
function calculateGrade(score) {
  if (score >= 70) return { grade: "A", points: 5, remark: "Distinction / Excellent" };
  if (score >= 60) return { grade: "B", points: 4, remark: "Very Good" };
  if (score >= 50) return { grade: "C", points: 3, remark: "Good" };
  if (score >= 45) return { grade: "D", points: 2, remark: "Fair" };
  if (score >= 40) return { grade: "E", points: 1, remark: "Pass" };
  return { grade: "F", points: 0, remark: "Fail" };
}

function calculateGPA(coursesWithScores) {
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

function getDegreeClassification(cgpa) {
  if (cgpa >= 4.5) return "First Class";
  if (cgpa >= 3.5) return "Second Class Upper";
  if (cgpa >= 2.4) return "Second Class Lower";
  if (cgpa >= 1.5) return "Third Class";
  return "Probation";
}

function generateAccessCode(prefix) {
  const num = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `UNI-${prefix}-${num}-${suffix}`;
}

test("Grading scale maps scores correctly to letter grades and points", () => {
  assert.deepEqual(calculateGrade(85), { grade: "A", points: 5, remark: "Distinction / Excellent" });
  assert.deepEqual(calculateGrade(70), { grade: "A", points: 5, remark: "Distinction / Excellent" });
  assert.deepEqual(calculateGrade(65), { grade: "B", points: 4, remark: "Very Good" });
  assert.deepEqual(calculateGrade(55), { grade: "C", points: 3, remark: "Good" });
  assert.deepEqual(calculateGrade(48), { grade: "D", points: 2, remark: "Fair" });
  assert.deepEqual(calculateGrade(42), { grade: "E", points: 1, remark: "Pass" });
  assert.deepEqual(calculateGrade(35), { grade: "F", points: 0, remark: "Fail" });
});

test("GPA engine calculates weighted semester points and handles edge cases", () => {
  const sampleSemester = [
    { creditUnits: 3, score: 85 }, // A = 3 * 5 = 15
    { creditUnits: 3, score: 72 }, // A = 3 * 5 = 15
    { creditUnits: 3, score: 65 }, // B = 3 * 4 = 12
    { creditUnits: 2, score: 55 }, // C = 2 * 3 = 6
  ];
  // Total units: 11
  // Total points: 15 + 15 + 12 + 6 = 48
  // GPA: 48 / 11 = 4.36
  const result = calculateGPA(sampleSemester);
  assert.equal(result.totalCredits, 11);
  assert.equal(result.totalPoints, 48);
  assert.equal(result.gpa, 4.36);

  const empty = calculateGPA([]);
  assert.equal(empty.gpa, 0);
  assert.equal(empty.totalCredits, 0);
});

test("Degree classification adheres to Nigerian university grading standard", () => {
  assert.equal(getDegreeClassification(4.8), "First Class");
  assert.equal(getDegreeClassification(4.5), "First Class");
  assert.equal(getDegreeClassification(4.1), "Second Class Upper");
  assert.equal(getDegreeClassification(3.5), "Second Class Upper");
  assert.equal(getDegreeClassification(3.2), "Second Class Lower");
  assert.equal(getDegreeClassification(2.4), "Second Class Lower");
  assert.equal(getDegreeClassification(2.1), "Third Class");
  assert.equal(getDegreeClassification(1.2), "Probation");
});

test("Access code format conforms to institutional specification", () => {
  const code = generateAccessCode("REG");
  assert.match(code, /^UNI-REG-\d{4}-[A-Z0-9]{3}$/);
});
