import assert from "node:assert/strict";
import test from "node:test";
import { QUANTUM_POTENTIAL_AXIOMS, buildPurePotentialEngine, generatePurePotentialReading } from "../src/pure-potential";

test("pure potential engine exposes the baseline axioms and seeded state field", () => {
  const engine = buildPurePotentialEngine("seeded-demo");
  const superposition = engine.superposition();

  assert.equal(QUANTUM_POTENTIAL_AXIOMS.potential, "Multiple valid possibilities may coexist before manifestation.");
  assert.ok(superposition.latent);
  assert.ok(superposition.emerging);
  assert.ok(superposition.manifest);
  assert.ok(superposition.void_seed);
});

test("pure potential reading derives a stable quantum-lens interpretation", () => {
  const reading = generatePurePotentialReading({
    title: "Potentiality check",
    content: "The system is moving from a latent architectural possibility into a visible implementation path.",
    context: ["coherence", "manifestation"]
  });

  assert.ok(reading.selectedState.length > 0);
  assert.ok(reading.stateDescription.includes(reading.selectedState));
  assert.ok(reading.topStates.length >= 2);
  assert.ok(Object.keys(reading.pathWeights).length >= 1);
  assert.ok(reading.fieldQuestion.length > 0);
  assert.ok(reading.potentialTruth.hasBeen >= 0 && reading.potentialTruth.hasBeen <= 1);
  assert.ok(reading.potentialTruth.canBe >= 0 && reading.potentialTruth.canBe <= 1);
  assert.ok(reading.potentialTruth.tendsToBe >= 0 && reading.potentialTruth.tendsToBe <= 1);
});
