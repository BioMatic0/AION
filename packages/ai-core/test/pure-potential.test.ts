import assert from "node:assert/strict";
import test from "node:test";
import {
  PotentialState,
  PotentialTruth,
  QUANTUM_POTENTIAL_AXIOMS,
  buildPurePotentialEngine,
  generatePurePotentialReading
} from "../src/pure-potential";

test("pure potential engine exposes the baseline axioms and seeded state field", () => {
  const engine = buildPurePotentialEngine("seeded-demo");
  const superposition = engine.superposition();

  assert.equal(QUANTUM_POTENTIAL_AXIOMS.potential, "Multiple valid possibilities may coexist before manifestation.");
  assert.ok(superposition.latent);
  assert.ok(superposition.emerging);
  assert.ok(superposition.manifest);
  assert.ok(superposition.void_seed);
  assert.ok(superposition.latent.truth);
  assert.ok(superposition.latent.dominantTruthMode);
  assert.ok(superposition.latent.truthWeight > 0);
});

test("potential truth normalizes across all three modes", () => {
  const truth = new PotentialTruth({ hasBeen: 0.72, canBe: 0.4, tendsToBe: 0.22 });
  const normalized = truth.normalized();

  assert.equal(Number((normalized.hasBeen + normalized.canBe + normalized.tendsToBe).toFixed(4)), 1);
  assert.ok(normalized.hasBeen > normalized.canBe);
  assert.ok(normalized.canBe > normalized.tendsToBe);
});

test("potential state exposes dominant truth mode and truth weight", () => {
  const state = new PotentialState({
    name: "manifest",
    amplitude: 0.4,
    coherence: 0.9,
    truth: new PotentialTruth({ hasBeen: 0.72, canBe: 0.4, tendsToBe: 0.22 })
  });

  assert.equal(state.dominantTruthMode, "hasBeen");
  assert.ok(state.truthWeight > 0);
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

test("evolveTruth shifts the selected state's truth profile and relaxes the others", () => {
  const engine = buildPurePotentialEngine("truth-evolution");
  const latent = engine.states.get("latent");
  const manifest = engine.states.get("manifest");

  assert.ok(latent);
  assert.ok(manifest);

  const beforeLatent = { ...latent!.truth };
  const beforeManifest = { ...manifest!.truth };

  engine.evolveTruth("latent");

  assert.equal(latent!.truth.hasBeen, Number((beforeLatent.hasBeen + 0.35).toFixed(2)));
  assert.equal(latent!.truth.canBe, Number(Math.max(0, beforeLatent.canBe - 0.1).toFixed(2)));
  assert.equal(latent!.truth.tendsToBe, Number(Math.max(0, beforeLatent.tendsToBe - 0.15).toFixed(2)));
  assert.equal(manifest!.truth.canBe, Number((beforeManifest.canBe + 0.03).toFixed(2)));
  assert.equal(manifest!.truth.tendsToBe, Number(Math.max(0, beforeManifest.tendsToBe - 0.02).toFixed(2)));
});

test("engine exports truth metadata through describe()", () => {
  const engine = buildPurePotentialEngine("describe-export");
  const description = engine.describe();
  const latent = description.states.find((state) => state.name === "latent");

  assert.ok(latent);
  assert.ok(latent?.truth);
  assert.equal(typeof latent?.dominantTruthMode, "string");
  assert.equal(typeof latent?.truthWeight, "number");
});
