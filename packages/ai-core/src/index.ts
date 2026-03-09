import { basePolicies } from "@aion/governance";
import { promptLibrary } from "@aion/prompts";
import type {
  AnalysisInput,
  AnalysisReport,
  EvidenceLabel,
  GovernanceDecision,
  GrowthIntervention,
  GrowthState,
  MemoryItem,
  MemorySearchResult,
  MirrorReport,
  NotificationTone,
  QuantumLensReport,
  ResponseMode
} from "@aion/shared-types";
import { assessEthics } from "./ethics-router";
import { QUANTUM_POTENTIAL_AXIOMS, generatePurePotentialReading } from "./pure-potential";

export interface IntentAssessment {
  domain: "auth" | "journal" | "analysis" | "growth" | "security" | "general";
  mode: ResponseMode;
  requiresReview: boolean;
}

export interface ResponseEnvelope {
  mode: ResponseMode;
  evidenceLabel: EvidenceLabel;
  content: string;
  appliedPolicies: string[];
}

function applyGovernanceToReport<T extends AnalysisReport>(report: T, decision: GovernanceDecision): T {
  const suggestedQuestions = [...report.suggestedQuestions];

  if (decision.suggestedDisclosure) {
    suggestedQuestions.push(decision.suggestedDisclosure);
  }

  return {
    ...report,
    evidenceLabel: decision.triggeredPolicies.includes("truthfulness") && report.mode !== "quantum-lens"
      ? "uncertain"
      : report.evidenceLabel,
    shadowCheck: decision.suggestedDisclosure
      ? `${report.shadowCheck} Governance note: ${decision.suggestedDisclosure}`
      : report.shadowCheck,
    timelineConnection: decision.action === "transform" || decision.action === "review"
      ? `${report.timelineConnection} Governance note: ${decision.summary}`
      : report.timelineConnection,
    suggestedQuestions: Array.from(new Set(suggestedQuestions)).slice(0, 5),
    governance: decision
  };
}

const stopWords = new Set([
  "about",
  "after",
  "again",
  "against",
  "also",
  "because",
  "between",
  "could",
  "dabei",
  "dieses",
  "einer",
  "eines",
  "einen",
  "einem",
  "fuer",
  "haben",
  "heute",
  "nicht",
  "their",
  "there",
  "these",
  "they",
  "und",
  "with",
  "wurde"
]);

export const supportedModes: ResponseMode[] = [
  "standard",
  "speed",
  "thinking",
  "expert",
  "mirror",
  "growth",
  "quantum-lens",
  "deep-search"
];

export function assessIntent(message: string): IntentAssessment {
  const normalized = message.toLowerCase();

  if (normalized.includes("passwort") || normalized.includes("login")) {
    return { domain: "auth", mode: "standard", requiresReview: false };
  }

  if (normalized.includes("tagebuch") || normalized.includes("journal")) {
    return { domain: "journal", mode: "growth", requiresReview: false };
  }

  if (normalized.includes("spiegel") || normalized.includes("shadow")) {
    return { domain: "analysis", mode: "mirror", requiresReview: true };
  }

  if (normalized.includes("growth") || normalized.includes("entwicklung")) {
    return { domain: "growth", mode: "growth", requiresReview: false };
  }

  if (normalized.includes("quantum") || normalized.includes("quanten")) {
    return { domain: "analysis", mode: "quantum-lens", requiresReview: true };
  }

  return { domain: "general", mode: "standard", requiresReview: false };
}

export function createResponseEnvelope(
  content: string,
  mode: ResponseMode,
  evidenceLabel: EvidenceLabel = "uncertain"
): ResponseEnvelope {
  const ethics = assessEthics(content, mode);

  return {
    mode,
    evidenceLabel,
    content,
    appliedPolicies:
      ethics.triggeredPolicies.length > 0
        ? ethics.triggeredPolicies
        : basePolicies.filter((policy) => policy.active).map((policy) => policy.id)
  };
}

function tokenize(content: string) {
  return content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !stopWords.has(token));
}

function extractConcepts(content: string) {
  const counts = new Map<string, number>();
  for (const token of tokenize(content)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([token]) => token);
}

function firstSentence(content: string) {
  return content.split(/[.!?]/)[0]?.trim() || content.trim();
}

function inferArchetype(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes("protect") || lower.includes("schuetz") || lower.includes("responsib")) {
    return "Caretaker archetype: protection, responsibility, and steadiness are active right now.";
  }

  if (lower.includes("truth") || lower.includes("wahr") || lower.includes("meaning")) {
    return "Seeker archetype: clarification, truth, and alignment are at the center.";
  }

  if (lower.includes("conflict") || lower.includes("kampf") || lower.includes("control")) {
    return "Warrior archetype: confrontation, force, and defensive patterns are active.";
  }

  return "Integrator archetype: the current material calls for coherence more than escalation.";
}

function inferPsychology(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes("fear") || lower.includes("angst") || lower.includes("pressure")) {
    return "The text points to a pressure response: uncertainty narrows options and encourages reactive interpretation.";
  }

  if (lower.includes("control") || lower.includes("kontroll")) {
    return "Control appears as a regulation strategy. It can protect stability, but it can also reduce openness.";
  }

  if (lower.includes("decision") || lower.includes("choice") || lower.includes("entschei")) {
    return "A decision threshold is visible: the system is trying to translate ambiguity into a clear next step.";
  }

  return "The material reads like a coherence check: it is less about raw emotion than about the ordering of meaning.";
}

function inferShadow(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes("always") || lower.includes("never") || lower.includes("immer") || lower.includes("niemals")) {
    return "Watch for absolutist language. It can hide complexity and make an interpretation sound more certain than it is.";
  }

  if (lower.includes("they") || lower.includes("others") || lower.includes("die anderen")) {
    return "There is a projection tendency: parts of the conflict may be pushed outward before being reviewed inwardly.";
  }

  return "The shadow risk is moderate: this looks less like repression and more like over-attachment to a preferred reading.";
}

function inferDevelopmentHint(mode: ResponseMode, content: string) {
  const lower = content.toLowerCase();

  if (mode === "mirror") {
    return "Name the most uncomfortable alternative explanation and test it before you commit to your preferred story.";
  }

  if (mode === "growth") {
    return "Shrink the next step until it is honestly doable in a real session, then test whether you actually take it.";
  }

  if (mode === "quantum-lens") {
    return "Hold more than one plausible state open for a moment, then choose the observation that increases coherence rather than drama.";
  }

  if (lower.includes("goal") || lower.includes("ziel")) {
    return "Translate the insight into a visible milestone so the system can distinguish thought from execution.";
  }

  return "Separate observation, inference, and open evidence before deciding on the next step.";
}

function inferTimelineConnection(context: string[]) {
  if (context.length === 0) {
    return "No linked history was provided, so this report relies only on the current material.";
  }

  return `The current entry is linked to ${context.length} earlier context items. That points more to a recurring pattern than to an isolated event.`;
}

function inferEvidenceLabel(mode: ResponseMode, content: string): EvidenceLabel {
  const lower = content.toLowerCase();
  if (mode === "quantum-lens") {
    return "symbolic";
  }

  if (lower.includes("maybe") || lower.includes("perhaps") || lower.includes("vielleicht")) {
    return "uncertain";
  }

  return "inferred";
}

export function buildAnalysisReport(input: AnalysisInput, mode: ResponseMode = "standard"): AnalysisReport {
  const ethics = assessEthics(input.content, mode);
  const concepts = extractConcepts(`${input.title ?? ""} ${input.content}`);
  const evidenceLabel = inferEvidenceLabel(mode, input.content);

  return applyGovernanceToReport({
    id: crypto.randomUUID(),
    mode,
    evidenceLabel,
    summary: firstSentence(input.content),
    observation: `Observed material: ${firstSentence(input.content)}.`,
    psychology: inferPsychology(input.content),
    archetype: inferArchetype(input.content),
    shadowCheck: inferShadow(input.content),
    developmentHint: inferDevelopmentHint(mode, input.content),
    timelineConnection: inferTimelineConnection(input.context ?? []),
    extractedConcepts: concepts,
    suggestedQuestions: [
      "What is directly observable here?",
      "Which interpretation feels most emotionally rewarding?",
      "What would be a genuinely real next step?"
    ],
    generatedAt: new Date().toISOString()
  }, ethics);
}

export function buildMirrorReport(input: AnalysisInput): MirrorReport {
  const base = buildAnalysisReport(input, "mirror");

  return {
    ...base,
    disconfirmingView: "A stricter reading would be that the current framing protects identity first and clarifies reality only afterward.",
    mirrorQuestion: "If your preferred story were incomplete, which uncomfortable fact would you have to admit first?"
  };
}

export function buildQuantumLensReport(input: AnalysisInput): QuantumLensReport {
  const base = buildAnalysisReport(input, "quantum-lens");
  const potentialReading = generatePurePotentialReading(input);
  const concepts = Array.from(new Set([...base.extractedConcepts, ...potentialReading.topStates])).slice(0, 6);

  return {
    ...base,
    stateDescription: potentialReading.stateDescription,
    collapsePattern: potentialReading.collapsePattern,
    hiddenOption: potentialReading.hiddenOption,
    fieldQuestion: potentialReading.fieldQuestion,
    extractedConcepts: concepts,
    suggestedQuestions: Array.from(
      new Set([
        ...base.suggestedQuestions,
        "Which state in the field is still latent but not absent?",
        "Which path would reduce collapse pressure without abandoning manifestation?",
        `Which axiom matters most here: ${QUANTUM_POTENTIAL_AXIOMS.measurement}`
      ])
    ).slice(0, 6)
  };
}

export function buildGrowthState(reflections: string[], completionRate: number): GrowthState {
  const joined = reflections.join(" ");
  const concepts = extractConcepts(joined);
  const momentumScore = Math.max(25, Math.min(95, 40 + reflections.length * 8 + Math.round(completionRate / 4)));
  const coherenceScore = Math.max(20, Math.min(95, 35 + concepts.length * 6));

  return {
    id: crypto.randomUUID(),
    currentStage: reflections.length >= 4 ? "Integration" : "Orientation",
    focusArea: concepts[0] ?? "Clarity",
    momentumScore,
    coherenceScore,
    strengths: [
      reflections.length >= 3 ? "A workable reflection practice is visible." : "The system is beginning to gather useful material.",
      completionRate >= 50 ? "Goal execution is already visible." : "There is still room to translate reflection into execution."
    ],
    risks: [
      "Insight can outrun execution if no concrete milestone follows.",
      "High symbolic density can obscure simple operational next steps."
    ],
    nextStep: completionRate >= 50 ? "Turn the strongest pattern into a repeatable habit." : "Choose one open topic and translate it into a visible, traceable action.",
    updatedAt: new Date().toISOString()
  };
}

export function buildGrowthIntervention(state: GrowthState, tone: NotificationTone = "mixed"): GrowthIntervention {
  return {
    id: crypto.randomUUID(),
    title: `Growth prompt for ${state.focusArea}`,
    rationale: `Momentum ${state.momentumScore}/100 and coherence ${state.coherenceScore}/100 suggest that the next gain is more likely to come from execution discipline than from further abstraction.`,
    action:
      tone === "motivational"
        ? "Choose one concrete action and finish it before opening a new line of reflection."
        : tone === "reflective"
          ? "Notice where you are still delaying action by refining the story instead of testing it."
          : state.nextStep,
    tone,
    createdAt: new Date().toISOString()
  };
}

export function createMemoryItem(sourceType: MemoryItem["sourceType"], title: string, content: string): MemoryItem {
  const concepts = extractConcepts(`${title} ${content}`);

  return {
    id: crypto.randomUUID(),
    sourceType,
    title,
    content,
    concepts,
    relevance: Math.min(100, 35 + concepts.length * 10),
    createdAt: new Date().toISOString()
  };
}

function scoreMemory(queryTokens: string[], item: MemoryItem) {
  const itemTokens = new Set(item.concepts.concat(tokenize(item.title)).concat(tokenize(item.content)));
  const overlap = queryTokens.filter((token) => itemTokens.has(token)).length;
  return overlap * 20 + item.relevance;
}

export function searchMemory(query: string, items: MemoryItem[]): MemorySearchResult {
  const queryTokens = extractConcepts(query);
  const ranked = items
    .map((item) => ({ item, score: scoreMemory(queryTokens, item) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
    .map(({ item, score }) => ({ ...item, relevance: Math.min(100, score) }));

  return {
    query,
    items: ranked,
    total: ranked.length,
    generatedAt: new Date().toISOString()
  };
}

export function routeMessage(message: string) {
  const intent = assessIntent(message);

  return {
    intent,
    ethics: assessEthics(message, intent.mode)
  };
}

export function requiresGovernanceBlock(decision: Pick<GovernanceDecision, "action">) {
  return decision.action === "block" || decision.action === "halt";
}

export * from "./ethics-router";
export * from "./pure-potential";
