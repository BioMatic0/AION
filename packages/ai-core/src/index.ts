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
      ? `${report.shadowCheck} Governance-Hinweis: ${decision.suggestedDisclosure}`
      : report.shadowCheck,
    timelineConnection: decision.action === "transform" || decision.action === "review"
      ? `${report.timelineConnection} Governance-Hinweis: ${decision.summary}`
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
    return "Archetyp Bewahrer: Schutz, Verantwortung und Halt sind gerade aktiv.";
  }

  if (lower.includes("truth") || lower.includes("wahr") || lower.includes("meaning")) {
    return "Archetyp Suchender: Klaerung, Wahrheit und Ausrichtung stehen im Zentrum.";
  }

  if (lower.includes("conflict") || lower.includes("kampf") || lower.includes("control")) {
    return "Archetyp Kaempfer: Konfrontation, Kraft und Abwehrmuster sind aktiv.";
  }

  return "Archetyp Integrator: Das aktuelle Material verlangt eher nach Kohaerenz als nach Eskalation.";
}

function inferPsychology(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes("fear") || lower.includes("angst") || lower.includes("pressure")) {
    return "Der Text deutet auf eine Druckreaktion hin: Unsicherheit verengt die Optionen und foerdert reaktives Deuten.";
  }

  if (lower.includes("control") || lower.includes("kontroll")) {
    return "Kontrolle erscheint als Regulierungsstrategie. Sie kann Stabilitaet schuetzen, aber auch Offenheit verringern.";
  }

  if (lower.includes("decision") || lower.includes("choice") || lower.includes("entschei")) {
    return "Eine Entscheidungsschwelle ist sichtbar: Das System versucht, Mehrdeutigkeit in einen klaren naechsten Schritt zu ueberfuehren.";
  }

  return "Das Material liest sich wie eine Kohaerenzpruefung: Es geht weniger um rohe Emotion als um die Ordnung von Bedeutung.";
}

function inferShadow(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes("always") || lower.includes("never") || lower.includes("immer") || lower.includes("niemals")) {
    return "Achte auf verabsolutierende Sprache. Sie kann Komplexitaet verdecken und eine Deutung unnoetig absolut wirken lassen.";
  }

  if (lower.includes("they") || lower.includes("others") || lower.includes("die anderen")) {
    return "Es besteht Projektionstendenz: Teile des Konflikts werden moeglicherweise zuerst nach aussen verlagert, bevor sie innen geprueft werden.";
  }

  return "Das Schattenrisiko ist moderat: Wahrscheinlich geht es weniger um Verdraengung als um eine zu starke Bindung an eine bevorzugte Lesart.";
}

function inferDevelopmentHint(mode: ResponseMode, content: string) {
  const lower = content.toLowerCase();

  if (mode === "mirror") {
    return "Benenne die unangenehmste alternative Erklaerung und pruefe sie, bevor du dich auf deine bevorzugte Geschichte festlegst.";
  }

  if (mode === "growth") {
    return "Verkleinere den naechsten Schritt so weit, bis er in einer ehrlichen Sitzung wirklich umsetzbar ist, und pruefe dann, ob du ihn tatsaechlich gehst.";
  }

  if (mode === "quantum-lens") {
    return "Halte kurz mehr als einen plausiblen Zustand offen und waehle dann die Beobachtung, die Kohaerenz statt Drama erhoeht.";
  }

  if (lower.includes("goal") || lower.includes("ziel")) {
    return "Uebersetze die Einsicht in einen sichtbaren Meilenstein, damit das System Denken und Umsetzung unterscheiden kann.";
  }

  return "Trenne Beobachtung, Schlussfolgerung und offene Beleglage, bevor du den naechsten Schritt festlegst.";
}

function inferTimelineConnection(context: string[]) {
  if (context.length === 0) {
    return "Es wurde kein verknuepfter Verlauf mitgegeben. Dieser Bericht stuetzt sich daher nur auf das aktuelle Material.";
  }

  return `Der aktuelle Eintrag ist mit ${context.length} frueheren Kontexteintraegen verbunden. Das spricht eher fuer ein wiederkehrendes Muster als fuer ein isoliertes Ereignis.`;
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
    observation: `Beobachtetes Material: ${firstSentence(input.content)}.`,
    psychology: inferPsychology(input.content),
    archetype: inferArchetype(input.content),
    shadowCheck: inferShadow(input.content),
    developmentHint: inferDevelopmentHint(mode, input.content),
    timelineConnection: inferTimelineConnection(input.context ?? []),
    extractedConcepts: concepts,
    suggestedQuestions: [
      "Was ist hier direkt beobachtbar?",
      "Welche Deutung fuehlt sich emotional am belohnendsten an?",
      "Was waere ein wirklich realer naechster Schritt?"
    ],
    generatedAt: new Date().toISOString()
  }, ethics);
}

export function buildMirrorReport(input: AnalysisInput): MirrorReport {
  const base = buildAnalysisReport(input, "mirror");

  return {
    ...base,
    disconfirmingView: "Eine strengere Lesart waere, dass die aktuelle Rahmung zuerst Identitaet schuetzt und erst danach Wirklichkeit klaert.",
    mirrorQuestion: "Wenn deine bevorzugte Geschichte unvollstaendig waere: Welche unbequeme Tatsache muesstest du zuerst zugeben?"
  };
}

export function buildQuantumLensReport(input: AnalysisInput): QuantumLensReport {
  const base = buildAnalysisReport(input, "quantum-lens");
  const concepts = base.extractedConcepts;

  return {
    ...base,
    stateDescription: `Der aktuelle Zustandsraum ist um ${concepts[0] ?? "Kohaerenz"}, ${concepts[1] ?? "Wahl"} und ${concepts[2] ?? "Druck"} organisiert.`,
    collapsePattern: "Das System scheint frueh in die vertrauteste Deutung zu kollabieren, statt mehrere tragfaehige Moeglichkeiten offen zu halten.",
    hiddenOption: "Es koennte eine weniger dramatische, aber kohaerentere Option geben, wenn das Problem eher als Kalibrierung denn als Rettung gelesen wird.",
    fieldQuestion: "Welche Beobachtung wuerde Kohaerenz erhoehen, ohne zu frueh Gewissheit zu erzwingen?"
  };
}

export function buildGrowthState(reflections: string[], completionRate: number): GrowthState {
  const joined = reflections.join(" ");
  const concepts = extractConcepts(joined);
  const momentumScore = Math.max(25, Math.min(95, 40 + reflections.length * 8 + Math.round(completionRate / 4)));
  const coherenceScore = Math.max(20, Math.min(95, 35 + concepts.length * 6));

  return {
    id: crypto.randomUUID(),
    currentStage: reflections.length >= 4 ? "Integration" : "Orientierung",
    focusArea: concepts[0] ?? "Klarheit",
    momentumScore,
    coherenceScore,
    strengths: [
      reflections.length >= 3 ? "Eine tragfaehige Reflexionspraxis ist erkennbar." : "Das System beginnt, brauchbares Material zu sammeln.",
      completionRate >= 50 ? "Zielumsetzung ist bereits sichtbar." : "Es gibt noch Spielraum, Reflexion in Umsetzung zu uebersetzen."
    ],
    risks: [
      "Einsicht kann der Umsetzung davonlaufen, wenn kein konkreter Meilenstein folgt.",
      "Hohe symbolische Dichte kann einfache operative naechste Schritte verdecken."
    ],
    nextStep: completionRate >= 50 ? "Fuehre das staerkste Muster in eine wiederholbare Gewohnheit ueber." : "Waehle ein offenes Thema und uebersetze es in eine sichtbare, nachvollziehbare Handlung.",
    updatedAt: new Date().toISOString()
  };
}

export function buildGrowthIntervention(state: GrowthState, tone: NotificationTone = "mixed"): GrowthIntervention {
  return {
    id: crypto.randomUUID(),
    title: `Wachstumsimpuls fuer ${state.focusArea}`,
    rationale: `Momentum ${state.momentumScore}/100 und Kohaerenz ${state.coherenceScore}/100 zeigen, dass der naechste Gewinn eher aus Umsetzungsdisziplin als aus weiterer Abstraktion kommt.`,
    action:
      tone === "motivational"
        ? "Waehle eine konkrete Handlung und schliesse sie ab, bevor du eine neue Reflexionslinie oeffnest."
        : tone === "reflective"
          ? "Beobachte, wo du Handlung noch aufschiebst, indem du die Geschichte weiter verfeinerst statt sie zu pruefen."
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
