import { Prisma } from "@prisma/client";
import type { Analysis as AnalysisModel } from "@prisma/client";
import type {
  AnalysisReport,
  GovernanceDecision,
  MirrorReport,
  QuantumLensReport
} from "@aion/shared-types";

export type StoredAnalysisReport = AnalysisReport | MirrorReport | QuantumLensReport;
export type AnalysisRecordType = "analysis" | "mirror" | "quantum";

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asGovernanceDecision(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return value as GovernanceDecision;
}

export function serializeAnalysisRecord(report: StoredAnalysisReport, userId: string, reportType: AnalysisRecordType) {
  return {
    id: report.id,
    userId,
    reportType,
    mode: report.mode,
    evidenceLabel: report.evidenceLabel,
    summary: report.summary,
    observation: report.observation,
    psychology: report.psychology,
    archetype: report.archetype,
    shadowCheck: report.shadowCheck,
    developmentHint: report.developmentHint,
    timelineConnection: report.timelineConnection,
    extractedConcepts: report.extractedConcepts as Prisma.InputJsonValue,
    suggestedQuestions: report.suggestedQuestions as Prisma.InputJsonValue,
    governance: report.governance
      ? (JSON.parse(JSON.stringify(report.governance)) as Prisma.InputJsonValue)
      : undefined,
    disconfirmingView: "disconfirmingView" in report ? report.disconfirmingView : null,
    mirrorQuestion: "mirrorQuestion" in report ? report.mirrorQuestion : null,
    stateDescription: "stateDescription" in report ? report.stateDescription : null,
    collapsePattern: "collapsePattern" in report ? report.collapsePattern : null,
    hiddenOption: "hiddenOption" in report ? report.hiddenOption : null,
    fieldQuestion: "fieldQuestion" in report ? report.fieldQuestion : null,
    generatedAt: new Date(report.generatedAt)
  };
}

export function hydrateAnalysisRecord(record: AnalysisModel): StoredAnalysisReport {
  const base: AnalysisReport = {
    id: record.id,
    mode: record.mode as AnalysisReport["mode"],
    evidenceLabel: record.evidenceLabel as AnalysisReport["evidenceLabel"],
    governance: asGovernanceDecision(record.governance),
    summary: record.summary,
    observation: record.observation,
    psychology: record.psychology,
    archetype: record.archetype,
    shadowCheck: record.shadowCheck,
    developmentHint: record.developmentHint,
    timelineConnection: record.timelineConnection,
    extractedConcepts: asStringArray(record.extractedConcepts),
    suggestedQuestions: asStringArray(record.suggestedQuestions),
    generatedAt: record.generatedAt.toISOString()
  };

  if (record.reportType === "mirror") {
    return {
      ...base,
      mode: "mirror",
      disconfirmingView: record.disconfirmingView ?? "",
      mirrorQuestion: record.mirrorQuestion ?? ""
    } satisfies MirrorReport;
  }

  if (record.reportType === "quantum") {
    return {
      ...base,
      mode: "quantum-lens",
      stateDescription: record.stateDescription ?? "",
      collapsePattern: record.collapsePattern ?? "",
      hiddenOption: record.hiddenOption ?? "",
      fieldQuestion: record.fieldQuestion ?? ""
    } satisfies QuantumLensReport;
  }

  return base;
}
