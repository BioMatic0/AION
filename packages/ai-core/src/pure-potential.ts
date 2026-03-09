import type { AnalysisInput } from "@aion/shared-types";

export const QUANTUM_POTENTIAL_AXIOMS: Record<string, string> = {
  being: "A state is never only what is currently visible.",
  potential: "Multiple valid possibilities may coexist before manifestation.",
  measurement: "Observation does not create essence, but selects expression.",
  truth: "Truth is not only binary correctness, but appearing-as-it-is.",
  relation: "No state stands alone; all states may be modified by relation.",
  uncertainty: "Complete determination of all aspects at once is not available.",
  emergence: "Form arises from potential through context-sensitive selection.",
  vacuum: "Even apparent emptiness may contain latent possibility.",
  symmetry_breaking: "When many options are equally valid, one may still emerge."
};

type RandomSource = () => number;

function hashSeed(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash || 42;
}

function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function tokenize(content: string) {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4);
}

function includesAny(content: string, keywords: string[]) {
  return keywords.some((keyword) => content.includes(keyword));
}

function pickWeighted<T>(items: T[], weights: number[], random: RandomSource) {
  const total = weights.reduce((sum, item) => sum + item, 0);
  if (total <= 0) {
    return items[0];
  }

  const threshold = random() * total;
  let cumulative = 0;

  for (let index = 0; index < items.length; index += 1) {
    cumulative += weights[index] ?? 0;
    if (threshold <= cumulative) {
      return items[index];
    }
  }

  return items[items.length - 1];
}

export class PotentialState {
  name: string;
  amplitude: number;
  phase: number;
  coherence: number;
  barrier: number;
  observables: Record<string, number>;
  metadata: Record<string, unknown>;

  constructor({
    name,
    amplitude,
    phase = 0,
    coherence = 1,
    barrier = 0,
    observables = {},
    metadata = {}
  }: {
    name: string;
    amplitude: number;
    phase?: number;
    coherence?: number;
    barrier?: number;
    observables?: Record<string, number>;
    metadata?: Record<string, unknown>;
  }) {
    if (!name.trim()) {
      throw new Error("State name must not be empty.");
    }
    if (amplitude < 0) {
      throw new Error("Amplitude must be >= 0.");
    }
    if (coherence < 0 || coherence > 1) {
      throw new Error("Coherence must be between 0 and 1.");
    }
    if (barrier < 0) {
      throw new Error("Barrier must be >= 0.");
    }

    this.name = name;
    this.amplitude = amplitude;
    this.phase = phase;
    this.coherence = coherence;
    this.barrier = barrier;
    this.observables = { ...observables };
    this.metadata = { ...metadata };
  }

  get probabilityWeight() {
    return this.amplitude ** 2 * this.coherence;
  }

  copy() {
    return new PotentialState({
      name: this.name,
      amplitude: this.amplitude,
      phase: this.phase,
      coherence: this.coherence,
      barrier: this.barrier,
      observables: { ...this.observables },
      metadata: { ...this.metadata }
    });
  }
}

export class ObservationContext {
  observer: string;
  intent: string;
  environment: string;
  resonance: Record<string, number>;
  focus: Record<string, number>;
  environmentalNoise: number;

  constructor({
    observer,
    intent,
    environment,
    resonance = {},
    focus = {},
    environmentalNoise = 0
  }: {
    observer: string;
    intent: string;
    environment: string;
    resonance?: Record<string, number>;
    focus?: Record<string, number>;
    environmentalNoise?: number;
  }) {
    if (environmentalNoise < 0) {
      throw new Error("environmentalNoise must be >= 0.");
    }

    this.observer = observer;
    this.intent = intent;
    this.environment = environment;
    this.resonance = { ...resonance };
    this.focus = { ...focus };
    this.environmentalNoise = environmentalNoise;
  }

  resonanceFor(stateName: string) {
    return Math.max(this.resonance[stateName] ?? 1, 0);
  }

  focusFor(stateName: string) {
    return Math.max(this.focus[stateName] ?? 1, 0);
  }
}

export interface EntanglementLink {
  stateA: string;
  stateB: string;
  strength: number;
  mode: "correlated" | "anti-correlated" | string;
}

export interface PotentialPath {
  states: string[];
  action: number;
  metadata?: Record<string, unknown>;
}

export interface MeasurementResult {
  selectedState: PotentialState;
  probabilities: Record<string, number>;
  context: {
    observer: string;
    intent: string;
    environment: string;
    environmentalNoise: number;
  };
  notes: string[];
}

export interface PurePotentialReading {
  selectedState: string;
  selectedMeaning: string;
  probabilities: Record<string, number>;
  topStates: string[];
  pathWeights: Record<string, number>;
  eigenstateCandidates: string[];
  uncertaintyProfile: Record<string, { localization: number; openness: number; uncertaintyProduct: number }>;
  notes: string[];
  stateDescription: string;
  collapsePattern: string;
  hiddenOption: string;
  fieldQuestion: string;
}

export class UniversalQuantumPotentialEngine {
  readonly states = new Map<string, PotentialState>();
  readonly entanglements: EntanglementLink[];
  readonly paths: PotentialPath[] = [];
  readonly vacuumFluctuationRate: number;
  private readonly random: RandomSource;
  manifestedState: string | null = null;

  constructor({
    states,
    entanglements = [],
    vacuumFluctuationRate = 0.05,
    seed
  }: {
    states: PotentialState[];
    entanglements?: EntanglementLink[];
    vacuumFluctuationRate?: number;
    seed?: number;
  }) {
    if (states.length === 0) {
      throw new Error("At least one PotentialState is required.");
    }

    for (const state of states) {
      if (this.states.has(state.name)) {
        throw new Error(`State '${state.name}' already exists.`);
      }
      this.states.set(state.name, state);
    }

    this.entanglements = entanglements.map((link) => ({
      stateA: link.stateA,
      stateB: link.stateB,
      strength: clamp(link.strength, 0, 1),
      mode: link.mode
    }));
    this.vacuumFluctuationRate = Math.max(vacuumFluctuationRate, 0);
    this.random = createSeededRandom(seed ?? 42);
  }

  addPath(path: PotentialPath) {
    if (path.states.length === 0) {
      throw new Error("A potential path must contain at least one state.");
    }
    if (path.action < 0) {
      throw new Error("Path action must be >= 0.");
    }

    this.paths.push({
      states: [...path.states],
      action: path.action,
      metadata: { ...(path.metadata ?? {}) }
    });
  }

  superposition() {
    return Object.fromEntries(
      Array.from(this.states.values()).map((state) => [
        state.name,
        {
          amplitude: state.amplitude,
          phase: state.phase,
          coherence: state.coherence,
          probabilityWeight: state.probabilityWeight
        }
      ])
    );
  }

  interferenceMatrix() {
    const names = Array.from(this.states.keys());
    const matrix: Record<string, number> = {};

    for (let index = 0; index < names.length; index += 1) {
      for (let inner = index + 1; inner < names.length; inner += 1) {
        const left = this.states.get(names[index]);
        const right = this.states.get(names[inner]);
        if (!left || !right) {
          continue;
        }

        const phaseDelta = left.phase - right.phase;
        const strength = Math.cos(phaseDelta) * Math.sqrt(left.amplitude * right.amplitude);
        matrix[`${left.name}<->${right.name}`] = strength;
      }
    }

    return matrix;
  }

  applyEntanglement() {
    for (const link of this.entanglements) {
      const left = this.states.get(link.stateA);
      const right = this.states.get(link.stateB);
      if (!left || !right) {
        continue;
      }

      if (link.mode === "correlated") {
        const averageCoherence = (left.coherence + right.coherence) / 2;
        left.coherence = Math.min(1, left.coherence * (1 - link.strength) + averageCoherence * link.strength);
        right.coherence = Math.min(1, right.coherence * (1 - link.strength) + averageCoherence * link.strength);
        continue;
      }

      if (link.mode === "anti-correlated") {
        const transferred = link.strength * 0.1;
        if (left.amplitude > right.amplitude) {
          left.amplitude = Math.max(0, left.amplitude - transferred);
          right.amplitude += transferred;
        } else {
          right.amplitude = Math.max(0, right.amplitude - transferred);
          left.amplitude += transferred;
        }
      }
    }
  }

  decohere(context: ObservationContext) {
    for (const state of this.states.values()) {
      const loss = Math.min(context.environmentalNoise * 0.1, 1);
      state.coherence = Math.max(0, state.coherence - loss);
    }
  }

  vacuumFluctuation() {
    if (this.random() < this.vacuumFluctuationRate) {
      const state = new PotentialState({
        name: `vacuum_emergence_${this.states.size + 1}`,
        amplitude: 0.05 + this.random() * 0.15,
        phase: this.random() * 2 * Math.PI,
        coherence: 0.4 + this.random() * 0.5,
        barrier: this.random() * 0.5,
        metadata: {
          origin: "vacuum_fluctuation",
          meaning: "Transient emergence from latent field"
        }
      });
      this.states.set(state.name, state);
      return state;
    }

    return null;
  }

  uncertaintyProfile() {
    return Object.fromEntries(
      Array.from(this.states.values()).map((state) => {
        const localization = Math.min(state.amplitude * state.coherence, 1);
        const openness = Math.max(0, 1 - localization);
        return [
          state.name,
          {
            localization,
            openness,
            uncertaintyProduct: localization * openness
          }
        ];
      })
    );
  }

  tunnelingCandidates() {
    return Object.fromEntries(
      Array.from(this.states.values()).map((state) => [
        state.name,
        Math.max(state.amplitude * Math.exp(-state.barrier) * state.coherence, 0)
      ])
    );
  }

  pathIntegralWeights() {
    if (this.paths.length === 0) {
      return {};
    }

    const entries = this.paths.map((path, index) => {
      const key = `path_${index + 1}:${path.states.join("->")}`;
      const weight = Math.exp(-path.action);
      return [key, weight] as const;
    });

    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    return Object.fromEntries(entries.map(([key, weight]) => [key, total > 0 ? weight / total : 0]));
  }

  spontaneousSymmetryBreak() {
    const states = Array.from(this.states.values());
    if (states.length < 2) {
      return null;
    }

    const weights = states.map((state) => Number(state.probabilityWeight.toFixed(3)));
    const allEqual = weights.every((value) => value === weights[0]);
    if (!allEqual) {
      return null;
    }

    const chosen = pickWeighted(states, states.map(() => 1), this.random);
    chosen.amplitude *= 1.15;
    return chosen.name;
  }

  eigenstateCandidates() {
    return Array.from(this.states.values())
      .filter((state) => state.coherence >= 0.85 && state.amplitude >= 0.4)
      .map((state) => state.name);
  }

  private contextualProbabilities(context: ObservationContext) {
    const interferenceBonus = Object.fromEntries(Array.from(this.states.keys()).map((name) => [name, 0])) as Record<
      string,
      number
    >;
    const interference = this.interferenceMatrix();
    for (const [key, strength] of Object.entries(interference)) {
      const [left, right] = key.split("<->");
      interferenceBonus[left] = (interferenceBonus[left] ?? 0) + strength * 0.1;
      interferenceBonus[right] = (interferenceBonus[right] ?? 0) + strength * 0.1;
    }

    const tunneling = this.tunnelingCandidates();
    const raw = Object.fromEntries(
      Array.from(this.states.entries()).map(([name, state]) => {
        const base = state.probabilityWeight;
        const resonance = context.resonanceFor(name);
        const focus = context.focusFor(name);
        const interferenceFactor = Math.max(0, 1 + (interferenceBonus[name] ?? 0));
        const tunnel = Math.max(tunneling[name] ?? 0, 0);
        return [name, Math.max((base + tunnel) * resonance * focus * interferenceFactor, 0)];
      })
    ) as Record<string, number>;

    const total = Object.values(raw).reduce((sum, value) => sum + value, 0);
    if (total <= 0) {
      const uniform = 1 / Object.keys(raw).length;
      return Object.fromEntries(Object.keys(raw).map((name) => [name, uniform]));
    }

    return Object.fromEntries(Object.entries(raw).map(([name, value]) => [name, value / total]));
  }

  measure(context: ObservationContext): MeasurementResult {
    this.applyEntanglement();
    this.decohere(context);
    this.vacuumFluctuation();

    const probabilities = this.contextualProbabilities(context);
    const names = Object.keys(probabilities);
    const selectedName = pickWeighted(
      names,
      names.map((name) => probabilities[name] ?? 0),
      this.random
    );
    const selectedState = this.states.get(selectedName);
    if (!selectedState) {
      throw new Error("Selected state is not available.");
    }

    this.manifestedState = selectedName;
    const notes: string[] = [];
    const tunneling = this.tunnelingCandidates();

    if (this.eigenstateCandidates().includes(selectedName)) {
      notes.push("Selected state tends toward stable expression.");
    }
    if ((selectedState.barrier > 0) && (tunneling[selectedName] ?? 0) > selectedState.probabilityWeight) {
      notes.push("Manifestation was significantly supported by tunneling-like transition.");
    }
    if (selectedState.metadata.origin === "vacuum_fluctuation") {
      notes.push("Manifestation emerged from a vacuum fluctuation.");
    }

    return {
      selectedState: selectedState.copy(),
      probabilities,
      context: {
        observer: context.observer,
        intent: context.intent,
        environment: context.environment,
        environmentalNoise: context.environmentalNoise
      },
      notes
    };
  }

  evolve(context: ObservationContext, steps = 1) {
    if (steps < 1) {
      throw new Error("steps must be >= 1");
    }

    const results: MeasurementResult[] = [];
    for (let index = 0; index < steps; index += 1) {
      const broken = this.spontaneousSymmetryBreak();
      if (broken) {
        const state = this.states.get(broken);
        if (state) {
          state.phase += -0.2 + this.random() * 0.4;
        }
      }

      const result = this.measure(context);
      results.push(result);

      for (const state of this.states.values()) {
        state.phase += -0.05 + this.random() * 0.1;
      }
    }

    return results;
  }
}

export function buildPurePotentialEngine(seedInput: string) {
  const engine = new UniversalQuantumPotentialEngine({
    states: [
      new PotentialState({
        name: "latent",
        amplitude: 0.7,
        phase: 0,
        coherence: 0.95,
        barrier: 0.2,
        metadata: { meaning: "Present, but not yet expressed", principle: "superposition" }
      }),
      new PotentialState({
        name: "emerging",
        amplitude: 0.55,
        phase: 1.2,
        coherence: 0.8,
        barrier: 0.35,
        metadata: { meaning: "Transition from hidden potential into expression", principle: "manifestation" }
      }),
      new PotentialState({
        name: "manifest",
        amplitude: 0.4,
        phase: 2.4,
        coherence: 0.9,
        barrier: 0.1,
        metadata: { meaning: "Currently visible form", principle: "measurement" }
      }),
      new PotentialState({
        name: "void_seed",
        amplitude: 0.2,
        phase: 0.7,
        coherence: 0.7,
        barrier: 0.6,
        metadata: { meaning: "Potential hidden in apparent emptiness", principle: "vacuum" }
      })
    ],
    entanglements: [
      { stateA: "latent", stateB: "emerging", strength: 0.8, mode: "correlated" },
      { stateA: "emerging", stateB: "manifest", strength: 0.6, mode: "correlated" },
      { stateA: "latent", stateB: "void_seed", strength: 0.4, mode: "anti-correlated" }
    ],
    vacuumFluctuationRate: 0.15,
    seed: hashSeed(seedInput)
  });

  engine.addPath({ states: ["latent", "emerging", "manifest"], action: 0.4, metadata: { meaning: "direct emergence arc" } });
  engine.addPath({
    states: ["void_seed", "latent", "emerging", "manifest"],
    action: 0.7,
    metadata: { meaning: "emergence through hidden void potential" }
  });
  engine.addPath({ states: ["latent", "manifest"], action: 1.1, metadata: { meaning: "nonlinear leap" } });

  return engine;
}

export function createObservationContext(input: AnalysisInput) {
  const lower = `${input.title ?? ""} ${input.content} ${(input.context ?? []).join(" ")}`.toLowerCase();
  const tokens = tokenize(lower);
  const focus: Record<string, number> = {};
  const resonance: Record<string, number> = { latent: 1, emerging: 1, manifest: 1, void_seed: 1 };

  if (includesAny(lower, ["decision", "action", "execute", "implementation", "manifest", "visible"])) {
    focus.manifest = 1.15;
  }
  if (includesAny(lower, ["transition", "change", "growth", "becoming", "emerging"])) {
    focus.emerging = 1.2;
  }
  if (includesAny(lower, ["uncertain", "open", "potential", "not yet", "latent"])) {
    focus.latent = 1.15;
  }
  if (includesAny(lower, ["void", "absence", "emptiness", "hidden", "unknown"])) {
    focus.void_seed = 1.15;
  }

  if (includesAny(lower, ["coherence", "alignment", "clarity"])) {
    resonance.emerging += 0.15;
    resonance.manifest += 0.05;
  }
  if (includesAny(lower, ["pressure", "conflict", "fear", "noise"])) {
    resonance.latent += 0.05;
  }

  const environmentalNoise = clamp(
    0.05 +
      (includesAny(lower, ["noise", "pressure", "chaos", "overload", "conflict"]) ? 0.08 : 0) +
      Math.min(tokens.length / 200, 0.08),
    0,
    0.25
  );

  return new ObservationContext({
    observer: "aion_quantum_lens",
    intent: input.title?.trim() || "read potential without premature collapse",
    environment: "symbolic_field_of_pure_potential",
    resonance,
    focus,
    environmentalNoise
  });
}

export function generatePurePotentialReading(input: AnalysisInput): PurePotentialReading {
  const seedInput = `${input.title ?? ""}::${input.content}::${(input.context ?? []).join("|")}`;
  const engine = buildPurePotentialEngine(seedInput);
  const context = createObservationContext(input);
  const measurement = engine.evolve(context, 1)[0];
  const pathWeights = engine.pathIntegralWeights();
  const uncertaintyProfile = engine.uncertaintyProfile();
  const eigenstateCandidates = engine.eigenstateCandidates();
  const rankedStates = Object.entries(measurement.probabilities)
    .sort((left, right) => right[1] - left[1])
    .map(([name]) => name);
  const selectedName = measurement.selectedState.name;
  const selectedMeaning =
    typeof measurement.selectedState.metadata.meaning === "string"
      ? measurement.selectedState.metadata.meaning
      : "A currently favored expression inside the potential field.";
  const nextCandidate = rankedStates.find((name) => name !== selectedName) ?? selectedName;
  const nextProbability = measurement.probabilities[nextCandidate] ?? 0;
  const selectedProbability = measurement.probabilities[selectedName] ?? 0;
  const uncertainty = uncertaintyProfile[selectedName] ?? { localization: 0, openness: 0, uncertaintyProduct: 0 };
  const strongestPath = Object.entries(pathWeights).sort((left, right) => right[1] - left[1])[0]?.[0];

  return {
    selectedState: selectedName,
    selectedMeaning,
    probabilities: measurement.probabilities,
    topStates: rankedStates.slice(0, 3),
    pathWeights,
    eigenstateCandidates,
    uncertaintyProfile,
    notes: measurement.notes,
    stateDescription:
      `The current potential field favors "${selectedName}" as the leading expression. ` +
      `${selectedMeaning} The strongest nearby states are ${rankedStates.slice(0, 3).join(", ")}.`,
    collapsePattern:
      selectedProbability - nextProbability > 0.15
        ? `The field collapses relatively early into "${selectedName}", which suggests a strong interpretive bias toward one expression over competing possibilities.`
        : `The field remains comparatively open: "${selectedName}" leads, but nearby states still retain enough weight to justify restraint before a hard conclusion.`,
    hiddenOption:
      `A quieter option remains in "${nextCandidate}". ` +
      `Its weight (${nextProbability.toFixed(2)}) suggests that the current situation may still support another reading, especially along ${strongestPath ?? "the available paths"}.`,
    fieldQuestion:
      uncertainty.openness >= uncertainty.localization
        ? "Which observation would let the open field stay honest a little longer before you force it into one fixed form?"
        : "Which observation would help you manifest the current direction without mistaking temporary clarity for total certainty?"
  };
}
