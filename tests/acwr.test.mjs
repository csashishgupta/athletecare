import test from "node:test";
import assert from "node:assert/strict";

function calculateSessionLoad(durationMin, rpe) {
  if (durationMin < 0 || rpe < 1 || rpe > 10) {
    throw new Error("Invalid session parameters");
  }
  return durationMin * rpe;
}

function calculateACWR(acuteLoads, chronicLoads) {
  const acuteAverage = acuteLoads.reduce((a, b) => a + b, 0) / acuteLoads.length;
  const chronicAverage = chronicLoads.reduce((a, b) => a + b, 0) / chronicLoads.length;
  if (chronicAverage === 0) return 1.0;
  return Number((acuteAverage / chronicAverage).toFixed(2));
}

test("ACWR Calculation: Sweet Spot Zone (0.80 - 1.30)", () => {
  const acute = [400, 450, 500, 420, 480, 460, 500]; // Avg ~458.5
  const chronic = Array(28).fill(430); // Avg 430
  const ratio = calculateACWR(acute, chronic);
  assert.ok(ratio >= 0.8 && ratio <= 1.3, `Expected ratio between 0.8 and 1.3, got ${ratio}`);
});

test("ACWR Calculation: Danger Spike Zone (> 1.50)", () => {
  const acute = [700, 800, 750, 900, 850, 780, 820]; // Spike!
  const chronic = Array(28).fill(400); // Low baseline
  const ratio = calculateACWR(acute, chronic);
  assert.ok(ratio > 1.5, `Expected spike > 1.5, got ${ratio}`);
});

test("ACWR Calculation: Under-training Zone (< 0.80)", () => {
  const acute = [100, 150, 120, 80, 110, 130, 90]; // Deconditioned
  const chronic = Array(28).fill(400);
  const ratio = calculateACWR(acute, chronic);
  assert.ok(ratio < 0.8, `Expected under-training ratio < 0.8, got ${ratio}`);
});
